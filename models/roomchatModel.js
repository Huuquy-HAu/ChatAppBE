const mongoose = require('../config/mongooCN')
const mongoose_delete = require('mongoose-delete');

const RoomChatSchema = new mongoose.Schema({
    nameRoom: {
        type:String
    },
    listUser: [{
        type:String,
        ref:'User'
    }],
    type:{type:Number, default:1}   // 1 là single room , 2 là mutil room

},{collection:'RoomChat'})

RoomChatSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });

const RoomChatModel = mongoose.model('RoomChat', RoomChatSchema)

module.exports = RoomChatModel