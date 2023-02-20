const { removeUserRoomService,updateUserRoomServices,getAllRoomChatService, createChatRoomServices, deleteChatRoomService } = require('../services/roomChatServices')

const getAllRoomChatController = async (req, res) => {

    const data = await getAllRoomChatService(req.user._id.toString())
    // console.log(">>> data:", data);

    res.status(data.status).json(data)
}

const postRoomChatController = async (req, res) => {
    
    const data = await createChatRoomServices(req.user._id.toString(), req.body)
    res.json(data)
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
    console.log(">>> req.user:", req.user);
    const data = await deleteChatRoomService(req.user._id)
    res.json('đã kết nối thành công !')
}


module.exports = { removeUserRoomController ,updateUserRoomChatController,getAllRoomChatController, postRoomChatController, deleteRoomChatController }
