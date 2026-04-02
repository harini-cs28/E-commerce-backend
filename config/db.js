const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected ✅");
    }catch(err){
        console.error("Mongodb connection error ❌",err.message);
    }
}
module.exports = connectDB;