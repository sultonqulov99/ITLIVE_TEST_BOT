const { bot } = require('./bot')
const { show_category } = require('./helper/category')
const { checkUser } = require('./checkUser')

bot.on('callback_query', async query => {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const {data} = query
    
    if(data.includes('user_result')){
        let id = data.split('_')[2]
        show_category(chatId,id)
        return
    }
    if(data.includes('azo')){
        checkUser(chatId,userId)
        return
    }
    
})