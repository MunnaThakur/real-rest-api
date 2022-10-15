const mongoose = require('mongoose');

const userAPI = mongoose.Schema({
    name: {
        type : String,
        // require : true
    },
    email : {
        type : String
    },
    password : {
        type : String
    }
})

module.exports = mongoose.model("UserApi", userAPI);
