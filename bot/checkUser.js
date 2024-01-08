const { bot } = require('./bot')
const User = require('../model/user')

const subscribtion = async (msg) =>{
try {
    let chatId = msg.from.id
    let chackUser = await User.findOne({chatId}).lean()

    if(!chackUser){
        let newUser = new User({
            chatId,
            admin:false,
            status:true,
            createdAt: new Date(),
            action:'check_chanel'
        })

        await newUser.save()
    }
    bot.sendMessage(chatId,"Bu bot dan foydalanish uchun quyidagi kanalga a'zo bo'ling",{
        reply_markup: {
            remove_keyboard: true,
            inline_keyboard: [
                [
                    {
                        text: 'IT LIVE',
                        callback_data: 'It_Live_Guliston',
                        url: "https://t.me/It_Live_Guliston"
                    },
                ],
                [
                    {
                        text:"✅ A'zo bo'ldim",
                        callback_data:'azo'
                    }
                ]
            ]
        }
    })
} catch (error) {
    console.log(error);
}}

const checkUser = async (chatId,userId) => {
    let user = await User.findOne({chatId}).lean()

        await bot.getChatMember('@It_Live_Guliston', userId)
        .then(async (result) => {
          if (result.status === 'member' || result.status === 'administrator') {
            
            bot.sendMessage(chatId,`✍️ Ismingizni kiriting`)
    
            await User.findByIdAndUpdate(user._id,{...user,action:"request_surName"},{new:true})
          } else {
            bot.sendMessage(chatId, `Siz @It_Live_Guliston kanalga a'zo bo\'lmagansiz, iltimos, avval kanalga a'zo bo\'ling: `);
          }
        })
        .catch((error) => {
          console.error(error);
          bot.sendMessage(chatId, 'Tekshirish jarayonida xato yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
        });

}

module.exports = {
    checkUser,
    subscribtion
}