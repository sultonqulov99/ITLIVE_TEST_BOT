const {Schema,model} = require('mongoose')

const User = new Schema({
    fullName:String,
    chatId: Number,
    phone:String,
    admin: {
        type : Boolean,
        default : false
    },
    superAdmin:{
        type : Boolean,
        default : false
    },
    action: String,
    status: {
        type: Boolean,
        default: true
    },
    createdAt: Date
})

module.exports = model('User',User)