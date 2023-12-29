const { bot } = require('./bot')
const { show_category } = require('./helper/category')
const { checkUser } = require('./checkUser')
const {study} = require("./helper/study")

bot.on('callback_query', query => {
    try {
        const chatId = query.message.chat.id
        const userId = query.from.id
        const {data} = query
        if(data.includes('user_result')){
            let id = data.split('_')[2]
            show_category(chatId,id)
        }
        else if (data.includes('azo')){
            checkUser(chatId,userId)
        }
        else if(data.includes("tumans")){
            let countryName = data.split('_')[1]
            study(chatId,countryName);
        }
    } catch (error) {
        console.log(error);
    }
    
})