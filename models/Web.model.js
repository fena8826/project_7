const mongoose = require("mongoose");

const webmodel = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    cpassword: {
        type: String
    },
    role:{
        type:String,
        enum: ['Admin', 'User']
    }
});

module.exports = mongoose.model("webmodel", webmodel);