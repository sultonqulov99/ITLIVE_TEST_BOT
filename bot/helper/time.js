const { bot } = require('../bot')
const User = require('../../model/user')
const Answer = require('../../model/answer')
const Result = require('../../model/result')
const { DateTime } = require('luxon');

const addTime = async(msg) => {
    try {
        let chatId = msg.from.id 
        let user = await User.findOne({chatId}).lean()
    
        bot.sendMessage(chatId,'🕔 Test boshlanish va tugash vaqtini kiriting\n\nMisol uchun:\n➡️ testID-boshlash | tugash\n➡️ Namuna: 7a7a7a7a-12:30 | 13:00')
    
        await User.findByIdAndUpdate(user._id,{...user,action:"add_time"},{new:true})
    } catch (error) {
        console.log(error);
    }
}

const time = async(msg) => {
    try {
        let chatId = msg.from.id 
        let user = await User.findOne({chatId}).lean()
        let text = msg.text
        let t = text.split('')
        if(!t.includes('-')){
          bot.sendMessage(chatId,`❌ Test vaqtini bunday kiritish mumkin emas\n\n🙏 Iltimos qaytadan kiriting!!!!`)
          return
        }
        let code_id = text.split('-')[0]
        let fullTime = text.split('-')[1]
        let startBot_time = fullTime.split("|")[0]
        let stopBot_time = fullTime.split("|")[1]
    
        let answer = await Answer.findOne({code_id}).lean()
        if(!answer){
            bot.sendMessage(chatId,'❌ Bunday testID topilmadi')
            return
        }
        await Answer.findByIdAndUpdate(answer._id,{...answer,startBot_time,stopBot_time},{new:true})
    
        await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
    
        bot.sendMessage(chatId,"✅ Bot ishlash vaqti qo'shildi")
    } catch (error) {
        console.log(error);
    }
}

const startTime = async(msg) => {
    try {
        const uzbekistanTimezone = 'Asia/Tashkent';
        const nowInUzbekistan = DateTime.now().setZone(uzbekistanTimezone);
        let chatId = msg.from.id 
        let text = msg.text
        let t = text.split('')
            if(!t.includes('-')){
              bot.sendMessage(chatId,`❌ Test javobini bunday kiritish mumkin emas\n\n🙏 Iltimos qaytadan kiriting!!!!`)
              return
            }
        let code_id = text.split('-')[0]
    
        let now_hour2 = nowInUzbekistan.hour
        let now_minut2 = nowInUzbekistan.minute
        
        let date = now_hour2 * 60 + now_minut2
    
        let answer = await Answer.findOne({code_id}).lean()
    
        if(!answer){
            bot.sendMessage(chatId,'❌ Bunday testID mavjud emas\n\nIltimos qaytadan kiriting!!!!')
            return
        }
        let start_hour = answer.startBot_time.split(":")[0]
        let start_minut = answer.startBot_time.split(":")[1]
        let stop_hour = answer.stopBot_time.split(":")[0]
        let stop_minut = answer.stopBot_time.split(":")[1]
    
        let start = +start_hour * 60 + +start_minut
        let stop = +stop_hour * 60 + +stop_minut
    
        let user = await User.findOne({chatId}).lean()
    
        user_id = user._id
        let res = await Result.findOne({user:user_id}).lean()
        let ans = await Answer.findOne({code_id}).lean()
        let a
        if(res.data){
            a = res.data.filter(el => el.answer.toString() === ans._id.toString())
        }
    
        if( a.length != 0 && start <= date && stop > date){
            bot.sendMessage(chatId,"❌ Bu testdan faqat 1 martta foydalanish mumkin")
            await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
            return false
        }
        if(start <= date && stop > date){
            await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
            return true
        }
        else if(stop <= date){
            bot.sendMessage(chatId,"❌ test jarayoni tugadi")
            await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
            return false
        }
        else {
            bot.sendMessage(chatId,"🕔 test jarayoni hali boshlanmadi")
            await User.findByIdAndUpdate(user._id,{...user,action:"menu"},{new:true})
            return false
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addTime,
    time,
    startTime
}