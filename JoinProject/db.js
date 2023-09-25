
require("dotenv").config();
const mongoose = require('mongoose')

function connectDb() {
    mongoose.set('strictQuery', true)
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database connect successfully")
    }catch(err) {
        console.log(err)
    }

}



module.exports = connectDb