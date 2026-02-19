const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    lineId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "line",
        required : true,
        index: true
    },
    name:{
        type: String,
        required: true
    },
    standardTime:{
        type: Number,
        required: true
    },
    order:{
        type: Number,
        required: true
    },

},
{timestamps: true});

module.exports = mongoose.model("Table", tableSchema);
