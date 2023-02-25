const RoomChatModel = require('../models/roomchatModel')
const UserModel = require('../models/userModel')


const createError = require('http-errors')

let success = {
    status: 200,
    resole: null
}

const single = 1
const mutil = 2


const createChatRoomServices = async (idUser, body) => {
    let idUserFriend = await UserModel.findById(body.friend)


    //kiểm tra người dừng có hợp lệ ko (kiểm tra id người dùng có đúng hay ko ? )
    if (!idUserFriend) {
        return createError(400, 'đây ko phải là bạn của bạn!')
    }

    //kiểm tra phòng đã được tạo hay chưa  
    let checkRoom = await RoomChatModel.findOne({
        $and: [
            { "listUser.id": idUser },
            { "listUser.id": body.friend }
        ]
    })

    if (checkRoom) {
        let date = checkRoom.listUser[0].date
        let idRoom  = checkRoom._id.toString()
        let idUser = checkRoom.listUser[0].id
        if (date === null) {
            let newRoom = await RoomChatModel.update(
                {_id: idRoom, "listUser.id": idUser},
                {
                $set: {
                    'listUser.$.date': Date.now()
                }
            })
            return {
                msg: 'bạn đã quay về phòng chát',
                newRoom
            }
        }
        throw createError(400, 'Phòng chát đã được tạo ! ')
    }

    let roomChat = await RoomChatModel.create({
        addMin: idUser,
        nameRoom: body.nameRoom,
        listUser: [
            {
                id: idUser
            },
            {
                id: body.friend
            }
        ]
    })

    return roomChat

}

const removeUserRoomService = async (query, idUser) => {
    let findRoom = await RoomChatModel.findById(query.idRoom)
    if (!findRoom) { throw (400, 'ko có phòng chát này! ') }
 
    let checkRoom = await RoomChatModel.update(
        { _id: query.idRoom, "listUser.id": idUser },
        {
            $set: {
                'listUser.$.date': null
            }
        }
    )

    return 'Bạn đã xoá được đoạn chát của bạn !'

}

const updateUserRoomServices = async (body, params) => {

    try {
        const myRoom = await RoomChatModel.findById(params.idRoomchat)

        // kiểm tra có người dùng có nhập User 
        if (body.userID.length === 0) {
            faill.status = 400
            faill.mess = "mời bạn chon người !"
            const newFaill = JSON.stringify(faill)
            throw newFaill
        }

        //kiểm tra người dùng có bị trùng tên ko ?
        for (let i = 0; i < body.userID.length; i++) {
            if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                myRoom.listUser.push(body.userID[i])
            }
        }

        myRoom.type = mutil

        success.resole = await myRoom.save()
        return success

    } catch (error) {
        faill.resole = error

        return faill
    }
}

const getAllRoomChatService = async (cookies) => {
    const data = await RoomChatModel.find({ addMin: cookies }).populate('addMin', 'userName').populate('listUser.id', 'userName')

    if (data.length === 0) {
        success.resole = 'bạn chưa nhắn tin với ai !'
        return success
    }
    success.resole = data
    return success

}

const deleteChatRoomService = async (cookies) => {
    try {
        success.resole = await RoomChatModel.deleteOne({ _id: cookies })
        return success
    } catch (error) {
        faill.resole = error
        return faill
    }
}

module.exports = { removeUserRoomService, updateUserRoomServices, createChatRoomServices, getAllRoomChatService, deleteChatRoomService }
