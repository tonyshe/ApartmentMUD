mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")

async function takeObject(roomName, userId, objName) {
    // Search all documents in all collections for a match. Create an array of matching objects
    let foundObjs = await getObjs.getAllVisibleObjsInRoomByName(objName, roomName)
    let foundInvObjs = await getObjs.getAllObjsByNameInInventory(objName, userId)

    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        if (foundInvObjs.length >= 1) {
            return "You already have that!"
        } else {
            return "No such thing exists."
        }
    } else if (foundObjs.length > 1) {
        return 'There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.'
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

            return 'You take the ' + obj.names[0] + '.'
        } else {
            return 'You cannot take that.'
        }
    }
}

module.exports = {
    takeObject
}
