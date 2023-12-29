const { bot } = require('../bot')
const User = require('../../model/user')

function Menu(chatId){
    bot.sendMessage(chatId,`🫵Siz allaqachon ro'yhatdan o'tgansiz\n\n👇👇👇Menyuni tanlang`,{
        reply_markup:{
            keyboard: [
              [
                {
                  text:"📋 Test javobini tekshirish"
                }
              ],
              [
                {
                  text:"📋 Bot haqida"
                },
                {
                  text:"📋 Foydalanuvchi ma'lumotlari"
                }
              ],
              [
                {
                  text:"⬅️ Orqaga"
                }
              ]
          ],
            resize_keyboard: true
        }
    })
}

async function actionMenu(msg){
    let chatId = msg.from.id
    let user = await User.findOne({chatId}).lean()
    user.action = 'menu'
    await User.findByIdAndUpdate(user._id,user,{new: true})

    bot.sendMessage(chatId,`👇👇👇 Menyuni tanlang`,{
    reply_markup:{
        keyboard: [
          [
            {
              text:"📋 Test javobini tekshirish"
            }
          ],
          [
            {
              text:"📋 Bot haqida"
            },
            {
              text:"📋 Foydalanuvchi ma'lumotlari"
            }
          ],
          [
            {
              text:"⬅️ Orqaga"
            }
          ]
        ], 
        resize_keyboard: true
    }
  })
}

function certificatMenu(chatId){
  bot.sendMessage(chatId,`🎗 Sertifikatingizni olishingiz mumkin`,{
    reply_markup:{
        keyboard: [
          [
            {
              text:"🎗 Sertifikat olish"
            }
          ]
      ],
        resize_keyboard: true
    }
})
}
module.exports = {
    Menu,
    actionMenu,
    certificatMenu
}