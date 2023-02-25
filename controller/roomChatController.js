const { removeUserRoomService, updateUserRoomServices, getAllRoomChatService, createChatRoomServices, deleteChatRoomService } = require('../services/roomChatServices')
const createError = require('http-errors')
const Joi = require('joi')

const getAllRoomChatController = async (req, res, next) => {
    try {
        const data = await getAllRoomChatService(req.user._id.toString())
        res.status(data.status).json(data)

    } catch (error) {
        next(createError(error))
    }

}

const postRoomChatController = async (req, res, next) => {
    try {
        const Schema = Joi.object({
            nameRoom: Joi.string().required(),
            friend: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,60}$')),
            type: Joi.string().pattern(new RegExp('^[1-2]'))
        })

        let { error } = Schema.validate(req.body, abortEarly=false)
        if( error ){throw createError(400, error)}

        const data = await createChatRoomServices(req.user._id.toString(), req.body)
        res.json(data)
    } catch (error) {
        next(createError(error))
    }

}

const removeUserRoomController = async (req, res, next) => {
    try {
        // validate dữ liệu đầu vào 
        const Schema = Joi.object({
            idRoom: Joi.string().required()
        })
        let {error} = Schema.validate(req.query,abortEarly=false)

        if(error){throw createError(400, error) }
        
        
        const data = await removeUserRoomService(req.query,req.user._id.toString())
        return res.json(data)

    } catch (error) {
        next(createError(error))
    }
    
}

const updateUserRoomChatController = async (req, res) => {
    const data = await updateUserRoomServices(req.body, req.params)
    res.status(data.status).json(data)
}



const deleteRoomChatController = async (req, res) => {
    const data = await deleteChatRoomService(req.user._id)
    res.json('đã kết nối thành công !')
}


module.exports = { removeUserRoomController, updateUserRoomChatController, getAllRoomChatController, postRoomChatController, deleteRoomChatController }
