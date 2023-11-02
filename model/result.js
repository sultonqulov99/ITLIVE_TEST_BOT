const {Schema,model} = require('mongoose')

const Result = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    data:[
        {
            answer:{
                type:Schema.Types.ObjectId,
                ref:'Answer'
            },
            correct:{type: Number, required: true},
            incorrect:{type: Number, required: true},
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = model('Result',Result)