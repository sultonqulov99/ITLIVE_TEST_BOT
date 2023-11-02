const { bot } = require('./bot')
const { start, requestFullName, checkTest, requestContact } = require('./helper/start')
const { add_admin, admin} = require('./helper/keyboard')
const { add_test,test,testAnswer} = require('./helper/test')
const { userAdmin,allUser,goBack} = require('./helper/user')
const {addTime,time,startTime} = require('./helper/time')
const { resultUsers } = require('./helper/category')
const { checkUser, subscribtion } = require('./checkUser')
const User = require('../model/user')

bot.on('message',async msg=>{
    
    const chatId = msg.from.id 
    const text = msg.text

    const user = await User.findOne({chatId}).lean()

    if(text == '/start'){
        subscribtion(msg)
        return
    }
    
    if(user){
        if(user.action == "check_chanel"){
            checkUser()
            return
        }
        if(user.action == "request_fullName"){
            requestFullName(msg)
            return
        }
        if(user.action === 'request_contact'){
            requestContact(msg)
            return
        }
        if(text == "⬅️ Menyuga qaytish"){
            goBack(msg)
            return
        }
        if(text == "📋 Test javobini tekshirish"){
            testAnswer(msg)
            return
        }
        if(user.action == "check_test"){
                let status = await startTime(msg)
                if(status){
                    checkTest(msg)
                }
            return
        }
        if(text === "✏️ Admin qo'shish"){
            add_admin(msg)
            return
        }
        if(user.action === "add_admin"){
            admin(msg)
            return
        }
        if(text === "✍️ Test javobini qo'shish"){
            add_test(msg)
            return
        }
        if(user.admin && text === "✍️ Test javobini qo'shish"){
            add_test(msg)
            return
        }
        if(user.action === "add_test"){
            test(msg)
            return
        }
        if(user.action === "add_test" && user.admin){
            test(msg)
            return
        }
        if(text == "📝 O'quvchilar ro'yxati"){
            allUser(msg)
            return
        }
        if(text == "✅ Natijalar"){
            resultUsers(msg)
            return
        }
        if(text == "🕔 Test vaqti"){
            addTime(msg)
            return
        }
        if(user.action == "add_time"){
            time(msg)
            return
        }
        if(user.admin){
            userAdmin(msg)
            return
        }
        else if(user.action == "menu" && text){
            bot.sendMessage(chatId,"Menyu ni tanlang")
            return
        }

    }
})