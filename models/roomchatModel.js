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
    type:{type:String, default:'Multil Room'}

},{collection:'RoomChat'})

RoomChatSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });

const RoomChatModel = mongoose.model('RoomChat', RoomChatSchema)

module.exports = RoomChatModel