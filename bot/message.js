const { bot } = require('./bot')
const path = require("path")
const { start, requestFullName,requestSurname, checkTest, requestContact } = require('./helper/start')
const { add_admin, admin} = require('./helper/keyboard')
const { add_test,test,testAnswer} = require('./helper/test')
const { userAdmin,allUser,goBack} = require('./helper/user')
const {addTime,time,startTime} = require('./helper/time')
const { resultUsers } = require('./helper/category')
const { checkUser, subscribtion } = require('./checkUser')
const { addTextToExistingImage } = require('./sertifikat')
const {requestSchool,requestClass} = require("./helper/study")
const { Menu, certificatMenu,actionMenu} = require("./utils/menu")
const User = require('../model/user')
const {userInfo,botInfo} = require('./utils/info')

bot.on('message',async msg=>{
try {
    const chatId = msg.from.id 
    const text = msg.text
    const user = await User.findOne({chatId}).lean()

    if(text == '/start' && !user){ 
        subscribtion(msg)
    }
    else if(user){
        if(user.action == "check_chanel"){
            checkUser()
        }
        else if(user.action == "request_surName"){
            if(text == '/start'){
                bot.sendMessage(chatId,"✍️ Ismingizni kiriting")
            }
            else{
                requestFullName(msg)
            }
        }
        else if(user.action == "request_lastname"){
            if(text == '/start'){
                bot.sendMessage(chatId,"✍️ Familiyangizni kiriting")
            }
            else{
                requestSurname(msg)
            }
        }
        else if(user.action === 'request_contact'){
            if(text == '/start'){
                bot.sendMessage(chatId,`📋${text.split(' ')[0]} telefon nomeringizni kiriting\nNamuna: '+998-- --- -- --' `)
            }
            else {
                requestContact(msg)
            }
        }
        else if(user.action === 'request_school'){
            if(text == '/start'){
                bot.sendMessage(chatId,"Maktabingizni kiriting\n\nMisol uchun : 12-maktab")
            }
            else {
                requestSchool(msg)
            }
        }
        else if(user.action === 'request_class'){
            if(text == '/start'){
                bot.sendMessage(chatId,"Sinfingizni kiriting\n\nMisol uchun : 6-sinf")
            }
            else {
                requestClass(msg)
            }
        }
        else if(text == "⬅️ Orqaga"){
            goBack(msg)
        }
        else if(text == "📋 Test javobini tekshirish"){
            testAnswer(msg)
        }
        else if(user.action == "check_test"){
            if(text == '/start'){
                testAnswer(msg)
            }
            else{
                let status = await startTime(msg)
                if(status){
                    checkTest(msg)
                }
            }
        }
        else if(text == "📋 Foydalanuvchi ma'lumotlari" && user.action == "menu"){
            userInfo(msg)
        }
        else if(text == '📋 Bot haqida' && user.action == "menu"){
            botInfo(msg)
        }
        else if(text === "✏️ Admin qo'shish"){
            add_admin(msg)
        }
        else if(user.action === "add_admin"){
            admin(msg)
        }
        else if(text === "✍️ Test javobini qo'shish"){
            add_test(msg)
        }
        else if(user.admin && text === "✍️ Test javobini qo'shish"){
            add_test(msg)
        }
        else if(user.action === "add_test"){
            test(msg)
        }
        else if(user.action === "add_test" && user.admin){
            test(msg)
        }
        else if(text == "📝 O'quvchilar ro'yxati" && user.superAdmin){
            allUser(msg)
        }
        else if(text == "✅ Natijalar" && user.superAdmin){
            resultUsers(msg)
        }
        else if(text == "🕔 Test vaqti" && user.superAdmin){
            addTime(msg)
        }
        else if(user.action == "add_time" && user.superAdmin){
            time(msg)
        }
        else if(user.admin){
            userAdmin(msg)
        }
        else if(text == "🎗 Sertifikat olish" && user.action == "request_certificate"){
            let res = await addTextToExistingImage(msg);
            if(res){
                await bot.sendPhoto(chatId, path.join(__dirname,'certificates',"aa.jpeg"), { caption: msg.chat.username});
                actionMenu(msg)
            }
            else {
                bot.sendMessage(chatId,"❌ Sertifikat olishda xatolik sodir bo'ldi\n\nIltimos keyinroq urinib ko'ring")
            }
        }
        else if(user.action == "request_certificate"){
            if(text == '/start'){
                certificatMenu(chatId)
            }
        }
        else if(user.action == "menu" && text == '/start'){
            Menu(chatId)
        }
        else if(user.action == "menu"){
            bot.sendMessage(chatId,"Menyuni tanlang")
        }
    }
} catch (error) {
    console.log(error);
}})