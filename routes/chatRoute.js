var express = require('express');
var router = express.Router();
const {getAllChatForRoom , deleteOneChat , createOneChat, hiddenUser} = require('../controller/chatController')

router.get('/:idRoom', getAllChatForRoom )

router.post('/' , createOneChat)

router.delete('/:idChat', deleteOneChat)

router.patch('/:idRoomChat/:idUser', hiddenUser)

module.exports = router