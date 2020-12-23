const getObjs = require("../objectFunctions/GetObjectFunctions")
const {lookFunctions} = require("../describeFunctions/describeFunctions")

async function lookRoom(userId, roomName) {
    /**
     * Returns the output of the room's look function
     * @param {String} roomName - room db name
     * @param {String} userId - user id of the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */
    const roomObj = await getObjs.getRoomObjByRoomName(roomName)
    return {[await lookFunctions[roomObj.look](userId, roomObj)]: [userId]}
}

module.exports = {
    lookRoom
}