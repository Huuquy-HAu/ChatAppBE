const mongoose = require('../config/mongooCN')

const UserSchema = new mongoose.Schema({
    id: {type: String , ref: 'User'},
    date:{type: Date , default: Date.now }
})

const RoomChatSchema = new mongoose.Schema({
    addMin: {type: String, ref: 'User'},
    nameRoom: {
        type:String
    },
    listUser:[ UserSchema ],
    type:{type:Number, default:1}   // 1 là single room

},{collection:'RoomChat'})

const RoomChatModel = mongoose.model('RoomChat', RoomChatSchema)

module.exports = RoomChatModel