const router = require('express').Router()
const { getAllRoomChatController,postRoomChatController,deleteRoomChatController} = require('../controller/roomChatController')

// GET chatROOM page (get all chatRoom)
router.get('/roomChat',getAllRoomChatController)

//Post create chatRoom
router.post('/roomChat',postRoomChatController)

//Delete chatRoom
router.delete('/roomChat/:id',deleteRoomChatController)


module.exports = router;
