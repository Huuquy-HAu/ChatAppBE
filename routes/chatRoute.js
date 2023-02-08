var express = require('express');
var router = express.Router();
const {getAllChat , deleteOneChat , createOneChat} = require('../controller/chatController')

router.get('/:idRoom', getAllChat )

router.post('/' , createOneChat)

router.delete('/:idChat', deleteOneChat)



module.exports = router