mongoose = require("mongoose")
const getObjs = require("../objectFunctions/getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const { describeFunctions } = require("../describeFunctions/describeFunctions")
const { response } = require("express")
const textHelpers = require("../helperFunctions/textHelpers")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")

async function examineObject(roomName, userId, comArr) {
    /**
     * Returns the description of an obj in the room or user inventory that matches the obj name.
     * @param {String} roomName - room db name. the container obj must be in this room
     * @param {String} userId - user id of the user
     * @param {[String]} comArr - Array of text commands from the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */
    const client = await mongoDbClient()

    if (comArr.length === 1) {
        return { ["Please specify something to examine."]: [userId] }
    }
    
    const objName = comArr.slice(1).join(" ")

    const selfWords = ["me", "myself", "self", "yourself", "you", "i"]

    if (selfWords.includes(objName)) {
        const userName = await getUsers.getUserNameByUserId(client, userId)
        return { ["Hey look it's you, " + textHelpers.capitalizeFirstLetter(userName) + "."]: [userId] }
    }

    // Search all documents in all collections for a match. Create an array of matching objects
    
    let foundObjs = await getObjs.getAllVisibleObjsInRoomByName(client, objName, roomName)
    foundObjs = foundObjs.concat(await getObjs.getAllObjsByNameInInventory(client, objName, userId))

    await client.close()
    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        return { ["You don't see that."]: [userId] }
    } else if (foundObjs.length > 1) {
        const response = 'There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.'
        return { [response]: [userId] }
    } else if (foundObjs.length === 1) {
        // If only one object is found, use the custom describe() functions from ../describeFunctions
        obj = foundObjs[0]
        const response = describeFunctions[obj.describe](obj)
        return { [response]: [userId] }
    }
}

module.exports = {
    examineObject
}
