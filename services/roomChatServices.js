// const { logger } = require('../config/winston')
const RoomChatModel = require('../models/roomchatModel')
const UserModel = require('../models/userModel')

let success = {
    status: 200,
    resole: null
}

let faill = {
    status: 500,
    mess: 'er server',
    resole: null
}
const single = 1
const mutil = 2


const createChatRoomServices = async (idUser, body) => {
    try {
        console.log(21,idUser, body.friend)
        let idUsserFriend = await UserModel.findById(body.friend)
        let idUsser = idUser

        //kiểm tra có ai tahy đổi id user thành id bất kỳ !
        if (!idUsser) {
            faill.status = 400;
            faill.mess = '404 not found! ';
            const newFaill = JSON.stringify(faill);
            return newFaill
        }

        //kiểm tra người dừng có hợp lệ ko (kiểm tra id người dùng có đúng hay ko ?)
        if (!idUsserFriend) {
            faill.status = 400;
            faill.mess = 'đây ko phải là bạn của bạn !'
            const newFaill = JSON.stringify(faill)
            throw newFaill
        }

        //kiểm tra xem roomChat đã được tạo hay chưa (chat đôi) !
        let findRoomChat = await RoomChatModel.findOne({ 
            $and: [
                {type: 1},
                { listUser: idUsser },
                { listUser: body.friend }
            ]
        })

        if (findRoomChat) {
            faill.status = 400;
            faill.mess = 'phòng chát này đã được tạo ! '
            const newFaill = JSON.stringify(faill)
            throw newFaill
        }

        let roomChat = await RoomChatModel.create({
            nameRoom: body.nameRoom,
            listUser: [idUsser, body.friend]
        })

        success.resole = roomChat
        return success


    } catch (error) {
        faill.resole = error
        console.log(">>> faill:", faill);

        return faill
    }
}

const updateUserRoomServices = async (body, params) => {
    // console.log(">>> body:", body);
    // console.log(">>> params:", params);
    try {
        const myRoom = await RoomChatModel.findById(params.idRoomchat)
        // console.log('>>> myRoom: ', myRoom);

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
        console.log(">>> error: ", error);
        faill.resole = error
        console.log(">>> faill:", faill);

        return faill
    }
}

const removeUserRoomService = async (body, params) => {
    // console.log(body);
    // console.log(params);

    try {
        if (body.userID.length === 0) {
            faill.status = 400
            faill.mess = 'bạn chưa chọn người dùng !'
            const newfaill = JSON.stringify(faill)
            throw newfaill
        }

        let myRoom = await RoomChatModel.findById(params.idRoomChat)
        // console.log(">>> myRoom:", myRoom)  ;

        for (let i = 0; i < body.userID.length; i++) {
            if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                faill.status = 400;
                faill.mess = 'người dùng bạn nhập ko có trong nhóm chát!';
                const newFaill = JSON.stringify(faill)
                throw newFaill
            }
            myRoom.listUser.remove(body.userID[i])
        }

        if (myRoom.listUser.length < 2) {
            console.log(">>> myRoom:", myRoom);
            myRoom.remove()
            success.resole = 'bạn đã xoá phòng chát của bạn !';
            return success
        }

        if (myRoom.listUser.length === 2) {
            myRoom.type = single
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
    console.log(">>> params:", params);
    try {
        if (params.idUsser === ':idUser') {
            faill.status = 500;
            faill.mess = 'ko vào được trang này'
            const newFaill = JSON.stringify(faill)
            throw newFaill
        }
        const data = await RoomChatModel.find({ nameUser: params.idUsser })
        console.log(data);
        if (data.length === 0) {
            faill.status = 400;
            faill.mess = 'ko tìm được tên này!'
            const newFaill = JSON.stringify(faill)
            throw newFaill
        }
        success.resole = data
        return success

    } catch (error) {
        console.log(error);
        faill.resole = error
        return faill
    }
}

const deleteChatRoomService = async (params) => {
    try {
        success.resole = await RoomChatModel.deleteOne({_id: params.id})
        return success
    } catch (error) {
        faill.resole = error
        return faill
    }
}


module.exports = { removeUserRoomService, updateUserRoomServices, createChatRoomServices, getAllRoomChatService, deleteChatRoomService }
