const { bot } = require('../bot')
const User = require('../../model/user')
const {actionMenu} = require('../utils/menu')

const study = async(chatId,countryName)=> {
    try {
        let user = await User.findOne({chatId}).lean()
        user.country = countryName
        user.action = 'request_school'

        bot.sendMessage(chatId,"Maktabingizni kiriting\n\nMisol uchun : 12-maktab")

        await User.findByIdAndUpdate(user._id,user,{new: true})
    } catch (error) {
        console.log(error);
    }
}

const requestSchool = async(msg) => {
    try {
        let chatId = msg.from.id
        let user = await User.findOne({chatId}).lean()
        user.school = msg.text
        user.action = 'request_class'
    
        bot.sendMessage(chatId,"Sinfingizni kiriting\n\nMisol uchun : 6-sinf")
    
        await User.findByIdAndUpdate(user._id,user,{new: true})
    } catch (error) {
        console.log(error);
    }
}

const requestClass = async(msg) => {
    try {
        let chatId = msg.from.id
        let user = await User.findOne({chatId}).lean()
        user.class = msg.text
        user.action = 'menu'
        await actionMenu(msg)
        await User.findByIdAndUpdate(user._id,user,{new: true})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    study,
    requestSchool,
    requestClass
}