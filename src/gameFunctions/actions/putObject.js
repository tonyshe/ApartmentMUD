mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")

async function putObject(roomName, userId, putObjName, containerObjName) {

    // Multiple or no item checking for put Object
    const invObj = await getObjs.getAllObjsByNameInInventory(putObjName, userId)
    if (invObj.length < 1) {
        return "You don't have that."
    } else if (invObj.length > 1) {
        return 'There are more than one thing by the name ' + '"' + putObjName + '." Please be more specific as to which one you mean.'
    }

    // Multiple or no item checking for container object
    let containerObj = await getObjs.getAllObjsByNameInRoom(containerObjName, roomName)
    if (containerObj.length < 1) {
        return "You don't see that."
    } else if (containerObj.length > 1) {
        return 'There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.'
    }

    // Add item to container. TODO: logic if the container rejects it. TODO: remove from container inventory when taken from this
    await containerObj[0].contains.push(invObj[0])
    await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = containerObj[0]._id, roomName = roomName, property = 'contains', value = containerObj[0].contains)

    // set item as visible
    await setObjs.setObjectPropertyByDbIdAndRoomName(invObj[0]._id, "userInventory_" + userId, 'visible', true)

    // move item from user inventory to room 
    await moveObjectToAnotherDb(invObj[0]._id, "userInventory_" + userId, roomName)

    // add container obj id to putobj's "inside" property
    await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = invObj[0]._id, roomName = roomName, property = 'inside', value = String(containerObj[0]._id))

    return "You put the " + invObj[0].names[0] + " " + containerObj[0].preposition + " the " + containerObj[0].names[0] + "."
}

module.exports = {
    putObject
}