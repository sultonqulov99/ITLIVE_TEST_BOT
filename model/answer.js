const {Schema,model} = require('mongoose')

const Answer = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    chatId:String,
    code_id:String,
    answer:String,
    startBot_time:String,
    stopBot_time:String
})

module.exports = model('Answer',Answer)