const mongoose = require('../config/mongooCN')

const RoomChatSchema = new mongoose.Schema({
    nameRoom: {
        type:String
    },
    listUser: [{
        type:String,
        ref:'User'
    }]
},{collection:'RoomChat'})

const RoomChatModel = mongoose.model('RoomChat', RoomChatSchema)

module.exports = RoomChatModel