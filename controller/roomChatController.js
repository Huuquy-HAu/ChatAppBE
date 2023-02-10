const { getAllRoomChatService, createChatRoomServices, deleteChatRoomService } = require('../services/roomChatServices')

const getAllRoomChatController = async (req, res) => {
    const data = await getAllRoomChatService()
    // console.log(">>> data:", data);

    res.status(data.status).json(data)
}

const postRoomChatController = async (req, res) => {
    const data = await createChatRoomServices(req.body)

    res.status(data.status).json(data)
}

const deleteRoomChatController = async (req, res) => {
    const data = await deleteChatRoomService(req.params)
    
    res.status(data.status).json(data)
}


module.exports = { getAllRoomChatController, postRoomChatController, deleteRoomChatController }
