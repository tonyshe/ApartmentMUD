const getObjs = require("../objectFunctions/getObjectFunctions")
const {lookFunctions} = require("../describeFunctions/describeFunctions")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")

async function lookRoom(roomName, userId) {
    /**
     * Returns the output of the room's look function
     * @param {String} roomName - room db name
     * @param {String} userId - user id of the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */
    const client = await mongoDbClient()
    const roomObj = await getObjs.getRoomObjByRoomName(client, roomName)
    await client.close()
    return {[await lookFunctions[roomObj.look](userId, roomObj)]: [userId]}
}

module.exports = {
    lookRoom
}