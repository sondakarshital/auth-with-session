const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email :{
        required:true,
        type : String
    },
    password : {
        required : true,
        type : String
    }
});

const User = mongoose.model("user",UserSchema);

module.exports = User;