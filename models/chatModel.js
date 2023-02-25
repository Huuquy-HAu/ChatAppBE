const mongoose = require('../config/mongooCN')

const ChatSchema = new mongoose.Schema({
    idRoomChat:{
        type:String,
        ref:'RoomChat'
    },
    content:{
        type:String
    },
    time:{
        type:Date,
        default: Date.now
    },
    sender:{
        type:String,
        ref:'User'
    },
    hidden: [{
        type:String,
        ref:'User'
    }]
    
    
}, {collection:'Chat'})

const ChatModel = mongoose.model('Chat', ChatSchema)

module.exports = ChatModel