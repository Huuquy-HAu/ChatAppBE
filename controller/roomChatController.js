const { removeUserRoomService,updateUserRoomServices,getAllRoomChatService, createChatRoomServices, deleteChatRoomService } = require('../services/roomChatServices')

const getAllRoomChatController = async (req, res) => {

    const data = await getAllRoomChatService(req.params)
    // console.log(">>> data:", data);

    res.status(data.status).json(data)
}

const postRoomChatController = async (req, res) => {
    const data = await createChatRoomServices(req.body)
    res.status(data.status).json(data)
}

const updateUserRoomChatController = async (req,res)=>{
    // console.log(">>> req.params: ",req.params);
    const data = await updateUserRoomServices(req.body,req.params) 
    res.status(data.status).json(data)
}

const removeUserRoomController = async (req,res) =>{
    // console.log(">>> req.params: ",req.params);
    const data = await removeUserRoomService(req.body,req.params)
    res.json(data)
}

const deleteRoomChatController = async (req, res) => {
    const data = await deleteChatRoomService(req.params)
    res.status(data.status).json(data)
}


module.exports = { removeUserRoomController ,updateUserRoomChatController,getAllRoomChatController, postRoomChatController, deleteRoomChatController }
