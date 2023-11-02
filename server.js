const express = require('express')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()

app.use(express.json())

require('./bot/bot')

async function dev(){
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,useUnifiedTopology: true
        }).then(()=>{console.log('Mogodb Start')})
        .catch((error)=>{console.log(error)})

        app.listen(process.env.PORT,()=>{console.log('Server is runnning')})
    } catch (error) {
        console.log(error);   
    }
}

dev()