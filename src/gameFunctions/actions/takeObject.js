mongoose = require("mongoose")
const getObjs = require("../objectFunctions/getObjectFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")

async function takeObject(roomName, userId, comArr) {
    /**
     * Takes an object from room (or container in a room) and puts it in the user inventory
     * @param {String} roomName - room db name. the container obj must be in this room
     * @param {String} userId - user id of the user
     * @param {[String]} comArr - Array of text commands from the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */

    if (comArr.length === 1) {
        return { ["Please specify something to take."]: [userId] }
    }

    const objName = comArr.slice(1).join(" ")

    // Search all documents in all collections for a match. Create an array of matching objects
    const client = await mongoDbClient()
    let foundObjs = await getObjs.getAllVisibleObjsInRoomByName(client, objName, roomName)
    
    let foundInvObjs = await getObjs.getAllObjsByNameInInventory(client, objName, userId)

    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        if (foundInvObjs.length >= 1) {
            await client.close()
            return{["You already have that!"]: [userId]}
        } else {
            await client.close()
            return {["You don't see that."]: [userId]}
        }
    } else if (foundObjs.length > 1) {
        await client.close()
        return {['There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.']: [userId]}
    } else if (foundObjs.length === 1) {
        // If only one object is found, run through the take functions
        obj = foundObjs[0]
        //let out = await setObjectVisible(obj._id, roomName, false)

        if (obj.takeable) {
            // set the object as not visible
            await setObjs.setObjectPropertyByDbIdAndRoomName(client, objDbId = obj._id, roomName = roomName, property = 'visible', value = false)

            // set obj.inside property to the id of the container that it will be in
            await setObjs.setObjectPropertyByDbIdAndRoomName(client, objDbId = obj._id, roomName = roomName, property = 'inside', value = '')

            // if it was inside something, remove it from that container's .contains array and also set obj.inside to ''
            if (obj.inside != "") {
                let [containerObj, collName] = await getObjs.getObjByDbIdAndRoom(client, obj.inside, roomName)
                let newContains = containerObj.contains.filter((insideObj) => { return String(insideObj._id) != String(obj._id) })
                await setObjs.setObjectPropertyByDbIdAndRoomName(client, objDbId = containerObj._id, roomName = roomName, property = 'contains', value = newContains)
            }

            // move the obj from the room db to the user inventory db
            await moveObjectToAnotherDb(client, obj._id, roomName, "userInventory_" + userId)
            
            // get list of userids of everyone else in the room
            let userIdList =  await getUsers.getAllUserIdsInRoom(client, roomName)
            userIdList = userIdList.filter((id) => {return id != userId})
            const userName = await  getUsers.getUserNameByUserId(client, userId)
            await client.close()
            return {
                ['You take the ' + obj.names[0] + '.']: [userId],
                [userName + " takes the " + obj.names[0] + '.']: userIdList
            }
        } else {
            return {['You cannot take that.']: [userId]}
        }
    }
}

module.exports = {
    takeObject
}
