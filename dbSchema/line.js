const mongoose = require("mongoose");

const lineSchema = new mongoose.Schema({
    name:{
        type : String,
        unique: true,
        require: true
    }, 
    
    description:{
        type: String
    },
},
{timeStamp : true}
);

const alpha = mongoose.model("line",lineSchema);

model.export = alpha;