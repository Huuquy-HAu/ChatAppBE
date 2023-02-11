const router = require('express').Router()
const { removeUserRoomController,updateUserRoomChatController,getAllRoomChatController,postRoomChatController,deleteRoomChatController} = require('../controller/roomChatController')

// GET chatROOM page (get all chatRoom)
router.get('/roomChat&:idUsser',getAllRoomChatController)

//Post create chatRoom
router.post('/roomChat',postRoomChatController)

//Pacth updateUser in chatRoom
router.patch('/roomChat/updateUser&:idRoomchat',updateUserRoomChatController)

//Remove use in chatRoom 
router.patch('/roomChat/removeUser&:idRoomChat',removeUserRoomController)

//Delete chatRoom
router.delete('/roomChat/:id',deleteRoomChatController)


module.exports = router;
