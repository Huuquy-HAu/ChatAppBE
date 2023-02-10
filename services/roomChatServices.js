const RoomChatModel = require('../models/roomchatModel')

let success = {
    status: 200,
    resole: null
}

let faill = {
    status: 500,
    mess: 'er server',
    resole: null
}
const single = "Single Room"
const mutil = 'Multil Room'

const createChatRoomServices = async (body) => {
    try {
        // console.log(">>> body user:",body.userId);

        let roomChat = await RoomChatModel.create(body)
        // console.log(">>> roomChat:", roomChat);

        if (roomChat.listUser.length < 2) {
            roomChat.remove()
            success.status = 400
            success.resole = 'room chat ko hợp lệ'
            return success
        }

        if (roomChat.listUser.length === 2) {
            roomChat.type = single
            roomChat.save()
        }


        success.resole = roomChat
        return success


    } catch (error) {
        faill.resole = error
        console.log(">>> faill:", faill);

        return faill
    }
}


const updateUserRoomServices = async (body) => {
    // console.log(">>> body:", body);
    try {
        const myRoom = await RoomChatModel.findById(body.roomID)

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
        console.log(">>> faill:", faill);

        return faill
    }
}

const removeUserRoomService = async (body) => {
    try {
        // console.log(">>> roomChatID: ", body.roomChatID);
        let myRoom = await RoomChatModel.findById(body.roomChatID).exec()
        // console.log(">>> myRoom:", myRoom)  ;

        for (let i = 0; i < body.userID.length; i++) {
            if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                success.status = 400;
                success.resole = 'id bạn nhập ko có trong nhóm chát!';
                return success
            }
            myRoom.listUser.remove(body.userID[i])
        }

        success.resole = await myRoom.save()
        return success

    } catch (error) {
        console.log(error);
        faill.resole = error
        return faill
    }

}

const getAllRoomChatService = async () => {
    try {
        success.resole = await RoomChatModel.find()
        return success

    } catch (error) {
        faill.resole = error
        return faill
    }
}


const deleteChatRoomService = async (params) => {
    try {
        success.resole = await RoomChatModel.deleteById(params.id)
        return success
    } catch (error) {
        faill.resole = error
        return faill
    }
}


module.exports = { removeUserRoomService, updateUserRoomServices, createChatRoomServices, getAllRoomChatService, deleteChatRoomService }
