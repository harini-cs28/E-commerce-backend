const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log("MongoDB connected ✅");
    }catch(err){
        console.error("MongoDB connection error ❌",err.message);
        process.exit(1);//Exit app if db fails
    }
}
module.exports = connectDB;