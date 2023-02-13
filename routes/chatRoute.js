var express = require('express');
var router = express.Router();
const {getAllChatForRoom , deleteOneChat , createOneChat} = require('../controller/chatController')

router.get('/:idRoom', getAllChatForRoom )

router.post('/' , createOneChat)

router.delete('/:idChat', deleteOneChat)

module.exports = router