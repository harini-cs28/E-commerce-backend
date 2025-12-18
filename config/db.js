const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Atlas connected ✅");
    }catch(err){
        console.error("Mongo Atlas connection error ❌",err.message);
        process.exit(1);//Exit app if db fails
    }
}
module.exports = connectDB;