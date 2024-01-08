const { bot } = require('../bot')
const User = require('../../model/user')
const Answer = require('../../model/answer')
const Result = require('../../model/result')
const {Menu,certificatMenu} = require('../utils/menu')
const {tumanCategorys} = require('../helper/category')


const adminKeyboard = [
  [
      {
          text: "✏️ Admin qo'shish"
      },
      {
          text:"✍️ Test javobini qo'shish"
      }
  ],
  [
      {
          text:"📝 O'quvchilar ro'yxati"
      },
      {
        text:"✅ Natijalar"
      }
  ],
  [
      {
          text:"⬅️ Menyuga qaytish"
      },
      {
          text:"🕔 Test vaqti"
      }
  ]
]

const userKeyboard = [
  [
    {
        text: 'Telefon raqamini yuboring',
        request_contact: true
    }
  ]
]

const start = async(msg) => {
  try {
    const chatId = msg.from.id
    bot.sendMessage(chatId,`✍️ Ismingizni kiriting`)
  } catch (error) {
    console.log(error);
  }
}

const requestFullName = async(msg) => {
  try {
    let chatId = msg.from.id
    let text = msg.text 

    if(text && /^(?=.{3,50}$)[a-zA-Z ]+$/.test(text)){
        let user = await User.findOne({chatId}).lean()
        user.surName = text
        user.action = 'request_lastname'
        

        if(!user.superAdmin){
          let newResult = new Result({
            user:user._id,
            createdAt: new Date(),
        })
        await newResult.save()
        }

        bot.sendMessage(chatId,`✍️ ${user.surName} familyangizni kiriting`)
        await User.findByIdAndUpdate(user._id,user,{new: true})
    }
    else {
      bot.sendMessage(chatId," ❌ Bunday ism kiritish mumkin emas\n\n🙏 Iltimos qaytadan kiriting")
    }
  } catch (error) {
    console.log(error);
  }
}

const requestSurname = async(msg) => {
  try {
    let chatId = msg.from.id
    let text = msg.text 

    if(text && /^(?=.{3,50}$)[a-zA-Z ]+$/.test(text)){
        let user = await User.findOne({chatId}).lean()
        user.lastName = text
  
        if(chatId == 899036228 || chatId == 5279091476 ){
          user.superAdmin = true
          user.action = 'menu'
        }
        else {
          user.action = 'request_contact'
        }

        if(!user.superAdmin){
          let newResult = new Result({
            user:user._id,
            createdAt: new Date(),
        })
        await newResult.save()
        }

        bot.sendMessage(chatId,`${user.superAdmin ? "Menyuni tanlang SuperAdmin" : `${user.surName} telefon nomeringizni kiriting\nNamuna: '+998-- --- -- --' ` } `,{
          reply_markup:{
              keyboard: user.superAdmin ? adminKeyboard : userKeyboard,
              resize_keyboard: true
            }
          })
        await User.findByIdAndUpdate(user._id,user,{new: true})
    }
    else {
      bot.sendMessage(chatId," ❌ Bunday familya kiritish mumkin emas\n\n🙏 Iltimos qaytadan kiriting")
    }
  } catch (error) {
    console.log(error);
  }
}



const requestContact = async(msg) => {
  try {
    const chatId = msg.from.id
    let user = await User.findOne({chatId}).lean()
    let contact = msg.contact ? msg.contact.phone_number : null
      if(contact || (/^998(9[012345789]|3[3]|7[1]|8[8])[0-9]{7}$/g).test(+msg.text)){
          user.phone =(!contact) ? msg.text : (msg.contact.phone_number[0] == "+") ? msg.contact.phone_number :"+" + msg.contact.phone_number 
          user.action = 'request_country'
          tumanCategorys(chatId)
          await User.findByIdAndUpdate(user._id,user,{new: true})
      }
      else {
        bot.sendMessage(chatId," ❌ Bunday telefon nomer mavjud emas\n\n🙏 Iltimos qaytadan kiriting yoki menyudan foydalaning\n👇👇👇")
      }
  } catch (error) {
    console.log(error);
  }
}

const checkTest = async(msg) => {
  try {
    let chatId = msg.from.id
    let text = msg.text
    let user = await User.findOne({chatId}).lean()
    if(text){
        let code_id = text.split('-')[0]
        let test_answer = text.split('-')[1]
        let t = text.split('')
        if(!t.includes('-')){
          bot.sendMessage(chatId,`❌ Test javobini bunday kiritish mumkin emas\n\n🙏 Iltimos qaytadan kiriting!!!!`)
          return
        }
        let answer1 = await Answer.findOne({code_id}).lean()
        if(!answer1){
          bot.sendMessage(chatId,`${code_id} - testID li test topilmadi`)
          return 
        }
        let result = await Result.findOne({user:user._id}).lean()
          let { correct, incorrect, str } = compareAnswers(test_answer, answer1.answer)
         
          if (result.data.length == 0) {
            const newData = {
              answer: answer1._id,
              correct: correct,
              incorrect: incorrect
            };
            result.data = [newData];
            await Result.findByIdAndUpdate(result._id, result, { new: true });
          }else {
              const newData = {
                answer: answer1._id,
                correct: correct,
                incorrect: incorrect
              };
              result.data.push(newData);
              await Result.findByIdAndUpdate(result._id, result, { new: true });
            }
        const text1 = `🎊 Testda qatnashganingizdan minnatdormiz!\n\nSizning bu testdagi natijangiz:\n${str}\n\n✅ To'g'ri javoblar: ${result.data[result.data.length-1].correct} ta\n❌ Xato javoblar: ${result.data[result.data.length-1].incorrect} ta `;
        
        await User.findByIdAndUpdate(user._id,{...user,action:"request_certificate"},{new:true})
        await bot.sendMessage(chatId,text1)
        certificatMenu(chatId)

        function compareAnswers(input, actual) {
            let correct = 0;
            let incorrect = 0;
            let str = "" 
            let i = 1
            for (let index in actual) {
              if ((input[index] ? input[index].toLowerCase() : undefined) === (actual[index]? actual[index].toLowerCase() : undefined)) {
                correct++;
                str += i + ".✅"
              } else {
                incorrect++;
                str += i + ".❌"
              }
              i += 1
            }
            return {
              correct,
              incorrect,
              str
            };
          }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    start,
    requestFullName,
    requestSurname,
    checkTest,
    requestContact
}