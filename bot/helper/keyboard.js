const { bot } = require('../bot')
const User = require('../../model/user')

const add_admin = async (msg) => {
   try {
    let chatId = msg.from.id 
    let text = msg.text
    let user = await User.findOne({chatId}).lean()
    
    await User.findByIdAndUpdate(user._id,{...user,action:"add_admin"},{new: true})

    bot.sendMessage(chatId,`Admin qo'shishingiz mumkin\n\nAdmin qo'shish uchun!!!\n\nFoydalanuvchining telefon nomerini kiriting\nMisol uchun: +998975661099`)
   } catch (error) {
    console.log(error);
   }
}

const admin = async ( msg ) =>{
    try {
        let chatId = msg.from.id 
        let contact = msg.text
    
        let user = await User.findOne({phone:contact}).lean()
        let userSuperAdmin = await User.findOne({chatId}).lean()
        if(user) {
            user.admin = true
    
            await  User.findByIdAndUpdate(user._id,user,{new:true})
            await  User.findByIdAndUpdate(userSuperAdmin._id,{ ...userSuperAdmin,action:"menu"},{new:true})
    
            bot.sendMessage(user.chatId,"Admin bo'lish uchun 'Admin' deb botga jo'nating")
    
            bot.sendMessage(chatId,`Admin qo'shildi`)
        }
        else {
            bot.sendMessage(chatId,`Bunday foydalanuvchi topilmadi`)
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    add_admin,
    admin
}