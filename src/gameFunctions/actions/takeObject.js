mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")

async function takeObject(roomName, userId, objName) {
    /**
     * Takes an object from room (or container in a room) and puts it in the user inventory
     * @param {String} roomName - room db name. the container obj must be in this room
     * @param {String} userId - user id of the user
     * @param {String} objName - name of the object to take. must be visible or in inventory of user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */
    // Search all documents in all collections for a match. Create an array of matching objects
    let foundObjs = await getObjs.getAllVisibleObjsInRoomByName(objName, roomName)
    let foundInvObjs = await getObjs.getAllObjsByNameInInventory(objName, userId)

    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        if (foundInvObjs.length >= 1) {
            return{["You already have that!"]: [userId]}
        } else {
            return {["You don't see that."]: [userId]}
        }
    } else if (foundObjs.length > 1) {
        return {['There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.']: [userId]}
    } else if (foundObjs.length === 1) {
        // If only one object is found, run through the take functions
        obj = foundObjs[0]
        //let out = await setObjectVisible(obj._id, roomName, false)

        if (obj.takeable) {
            // set the object as not visible
            await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = obj._id, roomName = roomName, property = 'visible', value = false)

            // set obj.inside property to the id of the container that it will be in
            await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = obj._id, roomName = roomName, property = 'inside', value = '')

            // if it was inside something, remove it from that container's .contains array and also set obj.inside to ''
            if (obj.inside != "") {
                let [containerObj, collName] = await getObjs.getObjByDbIdAndRoom(obj.inside, roomName)
                let newContains = containerObj.contains.filter((insideObj) => { return String(insideObj._id) != String(obj._id) })
                await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = containerObj._id, roomName = roomName, property = 'contains', value = newContains)
            }

            // move the obj from the room db to the user inventory db
            await moveObjectToAnotherDb(obj._id, roomName, "userInventory_" + userId)
            
            // get list of userids of everyone else in the room
            let userIdList =  await getUsers.getAllUserIdsInRoom(roomName)
            userIdList = userIdList.filter((id) => {return id != userId})
            const userName = await  getUsers.getUserNameByUserId(userId)

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
