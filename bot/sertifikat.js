const Jimp = require('jimp');
const path = require("path")
const User = require('../model/user')

async function addTextToExistingImage(msg) {
    try {
        if(msg == undefined) return
        const chatId = msg.from.id 
        const user = await User.findOne({chatId}).lean()
        const image = await Jimp.read(path.join(process.cwd(),'templates',"IT_LIVE.jpeg"));
        const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
        const text = user.fullName || "Nomalum foydalanuvchi"; 

        const centerX = 950;
        const centerY = 1030 ;

        image.print(font, centerX, centerY, text);

        await image.writeAsync(path.join(__dirname, 'certificates', 'aa.jpeg'));
        
        return true;
    } catch (error) {
        console.error('Rasmni saqlashda xatolik yuz berdi:', error);
        return false;
    }

}

addTextToExistingImage().catch(console.error);

module.exports = {
    addTextToExistingImage
}
