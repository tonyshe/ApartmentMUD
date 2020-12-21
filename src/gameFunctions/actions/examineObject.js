mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const {describeFunctions} = require("../describeFunctions/describeFunctions")

async function examineObject(roomName, userDbId, objName) {
    // Search all documents in all collections for a match. Create an array of matching objects
    const userId = await getObjs.getUserIdByUserDbId(userDbId)
    let objs = await getObjs.getAllObjectsInRoomAndInventory(roomName, userId)
    let foundObjs = []
    for (let i=0; i<objs.length; i++) {
        if (objs[i].names.includes(objName)) {
            foundObjs.push(objs[i])
        }
    }

    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        return "No such thing exists."
    } else if (foundObjs.length > 1) {
        return 'There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.'
    } else if (foundObjs.length === 1) {
        // If only one object is found, use the custom describe() functions from ../describeFunctions
        obj = foundObjs[0]
        return describeFunctions[obj.describe](obj)
    }
}

module.exports = {
    examineObject
}
