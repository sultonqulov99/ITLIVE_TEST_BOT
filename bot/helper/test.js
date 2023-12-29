const { bot } = require('../bot')
const User = require('../../model/user')
const Answer = require('../../model/answer')

const add_test = async(msg) => {
    try {
        let chatId = msg.from.id 
        let user = await User.findOne({chatId}).lean()
        await User.findByIdAndUpdate(user._id,{...user,action:"add_test"},{new: true})
    
        bot.sendMessage(chatId,`📋Test javoblarini qo'shishingiz mumkin!\n\nNamuna: TestID-test_Javoblari\n\nMisol:7a7a7a-ababdbdaccbbddaabadc`)
    } catch (error) {
        console.log(error);
    }
}

const test = async(msg) => {
    try {
        let chatId = msg.from.id 
        let user = await User.findOne({chatId}).lean()
    
        let code_id = msg.text.split('-')[0]
        let answer = msg.text.split('-')[1]
     
        let ans = await Answer.findOne({code_id}).lean()
        if(ans){
            bot.sendMessage(chatId,'❌ Bunday testID mavjud\n\nIltimos qaytadan kiriting!!!!')
            return
        }
        if(code_id == undefined || answer == undefined){
            bot.sendMessage(chatId,"❌ Bunday test qo'shish mumkin emas\n\n🙏 Iltimos qaytadan kiriting!!!!")
            return
        }
    
        let newAnswer = new Answer({
            chatId,
            code_id,
            answer,
            createdAt: new Date(),
        })
    
        await newAnswer.save()
        await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new: true})
        bot.sendMessage(chatId,`✅ Test javoblari qo'shildi`)
    } catch (error) {
        console.log(error);
    }
}

const  testAnswer = async(msg) => {
    try {
        let chatId = msg.from.id 
        let user = await User.findOne({chatId}).lean()
        await User.findByIdAndUpdate(user._id,{...user,action:'check_test'},{new:true})
        
        bot.sendMessage(chatId,` 📋 Test javobini kiritish tartibi!\n\nMisol uchun:\n➡️ testID-javoblari\n➡️ 7a7a7a7a-abcdbbddscadacbbadad`)
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    add_test,
    test,
    testAnswer
}