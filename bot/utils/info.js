const {bot} = require('../bot')
const User = require('../../model/user')
const { getCurrentTimeStamp } = require("./data");
async function userInfo(msg){
    try {
        let chatId = msg.from.id
        let user = await User.findOne({chatId}).lean()
        const timestamp = getCurrentTimeStamp();
        const text = `<b>Sizning ma'lumotlaringiz</b>\nRol: <i>O'quvchi</i>\n\n👤 Ism: <i>${user.surname}</i>\n🏘 Tuman: <i>${user.country}</i>\n🏫 Maktab: <i>${user.school}</i>\n🈴 Sinf: <i>${user.class}</i>\n\nMa'lumot aktualligi: <code>${timestamp}</code>`;

        bot.sendMessage(chatId,text,{parse_mode: 'HTML'})
    } catch (error) {
        console.log(error);
    }
}

async function botInfo(msg){
try {
    let chatId = msg.from.id

    let text = ` 
✅ <b>Botni yaratishdan maqsad:</b>\nSirdaryo viloyatidagi barcha maktab o'quvchilarini bilm darajasini aniqlash va yanada bilimlarini oshirish.
✅ <b>Botni vazifasi:</b>\nO'quvchilar ishlagan test natijasini aniqlash, sertifikat taqdim etish va o'rinlar darajasini aniqlashdan iborat.
✅ <b>Bot kim tomonidan dasturlandi:</b>\n<b>IT LIVE</b> akademiyasi hodimi va ustozi <b>Sultonqulov Abduxoshim</b> tomonidan bot uchun dasturiy ta'minot ishlab chiqildi.
✅ <b>Biz haqimizda:</b>\n<b>IT LIVE AKADEMY</b> o'quv markazi yaratilganiga sal kam <b>1</b> yil bo'ldi, shunday bo'lsada <b>300</b> dan ziyod o'quvchilarga va <b>10</b> dan ziyod xodimlarga ega. shunday ekan bu markazni kampaniya deb atasak ham bo'ladi. Siz ham dasturlashni o'rganmoqchi bo'lsangiz, unda <b>IT LIVE</b> bilan birga o'rganing.
✅ <b>Aloqa:</b>\nTel: +9989 97 866 50 50\nTelegram: @ITLIVE_ACADEMY\nRasmiy kanal: @IT_LIVE_GULISTON
`
    bot.sendMessage(chatId,text,{parse_mode: 'HTML'})
} catch (error) {
    console.log(error);
}}

module.exports = {
    userInfo,
    botInfo
}