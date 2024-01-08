const Jimp = require('jimp');
const path = require("path")
const User = require('../model/user')

async function addTextToExistingImage(msg) {
    try {
        if(msg == undefined) return
        const chatId = msg.from.id 
        const user = await User.findOne({chatId}).lean()
        const image = await Jimp.read(path.join(process.cwd(),'templates',"IT_LIVE.jpeg"));
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        const fullName = user.surName + " " + user.lastName
        const text = fullName || "Nomalum foydalanuvchi";
        const textWidth = Jimp.measureText(font, text);

        const centerX = (300 + 1000 - textWidth) / 2;
        const centerY = 370;

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
