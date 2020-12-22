mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const {moveObjectToAnotherDb} = require("../objectFunctions/moveObjectFunctions")
const {setObjectVisible} = require("../objectFunctions/setObjectFunctions")

async function takeObject(roomName, userId, objName ) {
    // Search all documents in all collections for a match. Create an array of matching objects
    let foundObjs = await getObjs.getAllObjsByNameInRoom(objName, roomName)
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
