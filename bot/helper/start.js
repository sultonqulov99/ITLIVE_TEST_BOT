const { bot } = require('../bot')
const User = require('../../model/user')
const Answer = require('../../model/answer')
const Result = require('../../model/result')

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
    const chatId = msg.from.id
    bot.sendMessage(chatId,`✍️ Ism-familiyangizni yozing`)
}

const requestFullName = async(msg) => {
    let chatId = msg.from.id
    let text = msg.text 

    if(text){
        let user = await User.findOne({chatId}).lean()
        user.fullName = text
  
        let adminIsm = text.split(' ')[0]
        let adminFam = text.split(' ')[1]
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

        bot.sendMessage(chatId,`${user.superAdmin ? "Menyuni tanlang SuperAdmin" : `📋${text.split(' ')[0]} menyudan tanlang` } `,{
          reply_markup:{
              keyboard: user.superAdmin ? adminKeyboard : userKeyboard,
              resize_keyboard: true
            }
          })
        await User.findByIdAndUpdate(user._id,user,{new: true})
    }
}
const requestContact = async(msg) => {
  const chatId = msg.from.id

    if(msg.contact.phone_number){
        let user = await User.findOne({chatId}).lean()
        user.phone = msg.contact.phone_number[0] == "+" ? msg.contact.phone_number :"+" + msg.contact.phone_number 
        console.log(user.phone);
        user.action = 'menu'

        bot.sendMessage(chatId,`Menyuni tanlang`,{
            reply_markup:{
                keyboard: [
                  [
                    {
                      text:"📋 Test javobini tekshirish"
                    }
                  ],
                  [
                    {
                        text:"⬅️ Menyuga qaytish"
                    }
                ]
              ],
                resize_keyboard: true
            }
        })

        await User.findByIdAndUpdate(user._id,user,{new: true})
    }
}

const checkTest = async(msg) => {
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
        
        await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
        bot.sendMessage(chatId,text1)

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
}

module.exports = {
    start,
    requestFullName,
    checkTest,
    requestContact
}