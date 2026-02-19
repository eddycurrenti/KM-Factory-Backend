const mongoose = require("mongoose");

const connectDB = async (req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_DB);
        console.log("DataBase connected");
    }catch(e){
        console.log(e);
    }
};

module.exports = connectDB;