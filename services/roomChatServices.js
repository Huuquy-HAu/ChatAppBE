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

const createChatRoomServices = async (body) => {
    try {

        // Tạo nhóm chát không có thành viên 
        if (body.type === 'EMPTY-USER') {
            success.resole = await RoomChatModel.create(body)
            // console.log('>>> resole:', success);

            return success
        }

        // Add thành viên nhóm
        if (body.type === 'ADD-USER') {
            // console.log('>>> check data:',body);

            let myRoom = await RoomChatModel.findById(body.roomChatID)
            // console.log('>>> myRoom: ',myRoom );

            for (let i = 0; i < body.userID.length; i++) {
                if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                    myRoom.listUser.push(body.userID[i])
                }
            }
            // console.log(">>> myRoom:", myRoom);

            success.resole = await myRoom.save()
            return success
        }

        // Xoá thành viên trong nhóm
        if (body.type === 'REMOVE-USER') {
            // console.log('>>> check data:', body);

            let myRoom = await RoomChatModel.findById(body.roomChatID)
            // console.log('>>> myRoom: ',myRoom );

            for (let i = 0; i < body.userID.length; i++) {
                if (myRoom.listUser.indexOf(body.userID[i]) === -1) {
                    success.status = 400;
                    success.resole = 'id bạn nhập ko có trong nhóm chát!';
                    return success 
                }
                myRoom.listUser.remove(body.userID[i])
            }
            // console.log(">>> myRoom:", myRoom);
            // console.log('>>> success:',success);
            
            success.resole = await myRoom.save()
            return success

        }


    } catch (error) {
        faill.resole = error
        console.log(">>> faill:", faill);

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

module.exports = { createChatRoomServices, getAllRoomChatService, deleteChatRoomService }
