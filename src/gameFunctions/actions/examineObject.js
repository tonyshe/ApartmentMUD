mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const {describeFunctions} = require("../describeFunctions/describeFunctions")

async function examineObject(roomName, userId, objName) {
    // Search all documents in all collections for a match. Create an array of matching objects
    let foundObjs = await getObjs.getAllVisibleObjsInRoomByName(objName, roomName)
    foundObjs = foundObjs.concat(await getObjs.getAllObjsByNameInInventory(objName, userId))

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
