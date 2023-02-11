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

const updateUserRoomServices = async (body,params) => {
    // console.log(">>> body:", body);
    // console.log(">>> params:", params);
    try {
        const myRoom = await RoomChatModel.findById(params.idRoomchat)
        console.log('>>> myRoom: ', myRoom);

        // kiểm tra có người dùng có nhập User 
        if(body.userID.length === 0) {
            faill.status = 400
            faill.mess = "mời bạn chon người !"
            const newFaill =  JSON.stringify(faill)
            throw newFaill
        }

        //kiểm tra lọc trùng !
        for (let i = 0; i < body.userID.length; i++) {
            if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                myRoom.listUser.push(body.userID[i])
            }
        }

        myRoom.type = mutil

        success.resole = await myRoom.save()
        return success
        
    } catch (error) {
        console.log(">>> error: ", error);
        faill.resole = error
        console.log(">>> faill:", faill);

        return faill
    }
}

const removeUserRoomService = async (body,params) => {
    // console.log(body);
    // console.log(params);

    try {
        let myRoom = await RoomChatModel.findById(params.idRoomChat)
        console.log(">>> myRoom:", myRoom)  ;

        for (let i = 0; i < body.userID.length; i++) {
            if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                faill.status = 400;
                faill.mess = 'người dùng bạn nhập ko có trong nhóm chát!';
                const newFaill =  JSON.stringify(faill)
                throw newFaill
            }
            myRoom.listUser.remove(body.userID[i])
        }

        success.resole = await myRoom.save()
        // success.resole = 'kết nối thành công !'
        return success


    } catch (error) {
        console.log(error);
        faill.resole = error
        return faill
    }

}

const getAllRoomChatService = async (params) => {
    console.log(">>> params:",params);
    try {
        success.resole = await RoomChatModel.findById(params.idUsser)
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
