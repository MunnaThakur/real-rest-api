const mongoose = require("mongoose");

const admin = mongoose.Schema({
    title: {
        type : String
    },
    description : {
        type : String
    },
    photo:{
        type : String
    },
    facilities :{
        type : [String]
    },
    price : {
        type : Number
    }
})

module.exports = mongoose.model("admin", admin);
