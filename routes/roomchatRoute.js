const router = require('express').Router()
const { checkLogin } = require("../middleware/auth");
const { removeUserRoomController,updateUserRoomChatController,getAllRoomChatController,postRoomChatController,deleteRoomChatController} = require('../controller/roomChatController')

// GET chatROOM page (get all chatRoom)
router.get('/roomChat',checkLogin,getAllRoomChatController)

//Post create chatRoom
router.post('/roomChat', checkLogin, postRoomChatController)

//Pacth updateUser in chatRoom
router.patch('/roomChat/updateUser/:idRoomchat',updateUserRoomChatController)

//Remove use in chatRoom 
router.patch('/roomChat/removeUser/:idRoomChat',removeUserRoomController)

//Delete chatRoom
router.delete('/roomChat',checkLogin,deleteRoomChatController)

module.exports = router;
