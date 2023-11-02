const { bot } = require('../bot')
const User = require('../../model/user')

const userAdmin = async(msg) => {
    let chatId = msg.from.id 

    bot.sendMessage(chatId,`Menyu ni tanlang Admin`,{
        reply_markup:{
            keyboard: [
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
                        text:"✍️ Test javobini qo'shish"
                    },
                    {
                        text:"🕔 Test vaqti"
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
}

const allUser = async(msg) => {
    let chatId = msg.from.id
    let admin = false
    let superAdmin = false
    let users = await User.find({admin,superAdmin}).lean()
    if(users.length == 0){
        bot.sendMessage(chatId,"Hali o'quvchi qo'shilmadi")
        return
    }
    let list = ''
    let i = 0
    users.forEach(user => {
        i +=1
        list += `${i}. ${user.fullName}\n`
    });

    bot.sendMessage(chatId,`O'quvchilar ro'yxati:
${list}`)
}

const goBack = async(msg) => {
    let chatId = msg.from.id 
    let user = await User.findOne({chatId}).lean()

    await User.findByIdAndUpdate(user._id,{...user,action:'menu'},{new:true})

    bot.sendMessage(chatId,"Menyu ni tanlang")
}


module.exports = {
    userAdmin,
    allUser,
    goBack,
}