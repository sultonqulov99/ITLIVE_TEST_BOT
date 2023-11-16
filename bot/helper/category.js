const { bot } = require('../bot')
const User = require('../../model/user')
const Answer = require('../../model/answer')
const Result = require('../../model/result')

const resultUsers = async(msg) => {
    chatId = msg.from.id 
    
    let user = await User.find({chatId}).lean()
    let answers = await Answer.find().lean()

    let list = await answers.map(answer =>
        [
            {
                text:(answer.chatId == chatId || user[0].superAdmin) ? answer.code_id : "",
                callback_data: `user_result_${answer._id}`
            }
        ]
    )
    bot.sendMessage(chatId,"TestIDlar ro'yxati ",{
        reply_markup: {
            remove_keyboard: true,
            inline_keyboard: [
                ...list,
                [
                    {
                        text: '<<<',
                        callback_data: 'back_category'
                    },
                    {
                        text: '1',
                        callback_data: '0'
                    },
                    {
                        text: '>>>',
                        callback_data:'next_category' 
                    }
                ]
            ]
        }
    })

    await User.findByIdAndUpdate(user._id,{...user,action:"show_category"},{new:true})
    
}

const show_category = async(chatId,id)=> {
    let user1 = await User.find({chatId}).lean()
    let users = await User.find().lean()
    let res = await Result.find().lean()

    let ans = await Answer.findOne({_id:id}).lean()

    let user = res.filter(r => {
        let u = r.data.filter(el => {
            if(el.answer.toString() == ans._id.toString()){
                return el
            }
        })
        if(u.length != 0){
            r.correct = u[0] ? u[0].correct : ''
            r.incorrect = u[0] ? u[0].incorrect : ''
            return  r
        }
    })

    if(user.length == 0) {
        bot.sendMessage(chatId,"❌ Hech qanday o'quvchi topilmadi")
        return
    }
    
    let data = users.filter(u => {
        let use = user.filter(f => f.user.toString() == u._id.toString())

        if(use.length != 0) {
            u.correct = use[0].correct
            u.incorrect = use[0].incorrect
            return u
        }
    })
    for(let i = 0; i < data.length; i++){
        for(let j = i + 1; j < data.length; j++){
            if(data[i].correct < data[j].correct){
                let a = data[i]
                data[i] = data[j]
                data[j] = a
            }
        }
    }

    let list = ''
    let i = 0
    data.forEach(user => {
        i +=1
            list += `${i}. ${user.fullName.padEnd(25,"_")} ${user.correct} ✅ | ${user.incorrect} ❌\n\n`
    });

    bot.sendMessage(chatId,`${ans.code_id} - testID O'quvchilar natijasi:
${list}`)

await User.findByIdAndUpdate(user1._id,{...user1,action:"menu"},{new:true})
    
    
}

module.exports = {
    resultUsers,
    show_category
}