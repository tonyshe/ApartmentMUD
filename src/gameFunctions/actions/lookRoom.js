const getObjs = require("../objectFunctions/GetObjectFunctions")
const {lookFunctions} = require("../describeFunctions/describeFunctions")

async function lookRoom(userId, roomName) {
    const roomObj = await getObjs.getRoomObjByRoomName(roomName)
    return lookFunctions[roomObj.look](userId, roomObj)
}

module.exports = {
    lookRoom
}