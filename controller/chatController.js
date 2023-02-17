const ChatModel = require('../models/chatModel')

exports.getAllChatForRoom = async (req,res) => {
    try {
        const data = await ChatModel.find({
            idRoomChat: req.params.idRoom
        }).sort({time : 1})
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

exports.hiddenUser = async (req,res) => {
    try {
        const data = await ChatModel.find({
            idRoomChat: req.params.idRoomChat
        })

        if(!data) {
            res.status(400).json('Khong tim thay RoomChat')
        }

        // data.hidden.push(req.params.idUser)

        // const data2 = await data.save()
        const data2 = await ChatModel.findOneAndUpdate(
            { idRoomChat: req.params.idRoomChat }, // Tìm tài liệu cần cập nhật
            { $addToSet: { hidden: req.params.idUser } }, // Thêm mới ID vào mảng nếu chưa tồn tại
            { upsert: true, new: true } // Lựa chọn upsert sẽ tạo một tài liệu mới nếu không tìm thấy, new sẽ trả về tài liệu mới sau khi cập nhật
        )
        
        if(!data2) {
            res.status(400).json('Khong thanh cong')
        }
        res.status(200).json('Thanh Cong')
    } catch (error) {
        res.status(500).json(error)
    }
}



