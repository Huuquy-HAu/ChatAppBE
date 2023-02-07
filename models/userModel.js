const mongoose = require('../config/mongooCN')

const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        unique:true,
        required:true
    },
    gmail:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        default:'2'
        // 0 = banner , 1 = Chưa xác nhận , 2 = User , 3 =  subAdmin, 4 = Admin
    },
    listFriend:[{
        type:String,
    }]
}, {collection:'User'})


const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel