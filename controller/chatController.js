const ChatModel = require('../models/chatModel')

exports.getAllChatForRoom = async (req,res) => {
    try {
        const data = await ChatModel.find({
            idRoomChat: req.params.idRoom
        })
        if(!data){
            return res.status(400).json('error')
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json('error', error)
    }
}

exports.createOneChat = async (req,res) => {
    try {
        const data = await ChatModel.create({
            idRoomChat: req.body.idRoomChat,
            content: req.body.content,
            time : req.body.time,
            sender: req.body.sender
        })

        if(!data) {
            return res.status(400).json('error')
        }
        res.status(200).json(data)
        // console.log(req.body.idRoomChat);
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteOneChat = async (req, res) => {
    try {
        const data = await ChatModel.deleteOne({
            _id:req.params.idChat
        })

        if(!data) {
            return res.status(400).json('error')
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}




