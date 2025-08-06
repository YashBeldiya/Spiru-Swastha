const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true,"Name is required"]
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : [true,"Email is required"],
        unique : true
    },
    password : {
        type : String,
        required : [true,"Password is required"]
    },
    role : {
        type : String,
        enum : ['Admin','User'],
        default : 'User'
    },
    isVerify : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

const User = mongoose.model('User',UserSchema)
module.exports = User