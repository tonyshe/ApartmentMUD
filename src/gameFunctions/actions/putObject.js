mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")

async function putObject(roomName, userId, putObjName, containerObjName) {

    // Multiple or no item checking for put Object
    const invObjList = await getObjs.getAllObjsByNameInInventory(putObjName, userId)
    if (invObjList.length < 1) {
        return "You don't have that."
    } else if (invObjList.length > 1) {
        return 'There are more than one thing by the name ' + '"' + putObjName + '." Please be more specific as to which one you mean.'
    }

    // Multiple or no item checking for container object
    const containerObjList = await getObjs.getAllObjsByNameInRoom(containerObjName, roomName)
    if (containerObjList.length < 1) {
        return "You don't see that."
    } else if (containerObjList.length > 1) {
        return 'There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.'
    }

    let containerObj = containerObjList[0]
    let invObj = invObjList[0]

    // check if container is closed
    if (!containerObj.open) {
        return "The " + containerObj.names[0] + " is closed."
    }

    // Check if object is allowed in/on the container
    if (containerObj.objsAllowed.length > 0) {
        const allowedUnionList = containerObj.contains.filter((objName) => {return invObj.names.includes(objName)})
        console.log(allowedUnionList)
        if (allowedUnionList.length === 0) {
            return "That can't go there!"
        }
    }

    // Add item to container. TODO: logic if the container rejects it.
    await containerObj.contains.push(invObj)
    await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = containerObj._id, roomName = roomName, property = 'contains', value = containerObj.contains)

    // set item as visible
    await setObjs.setObjectPropertyByDbIdAndRoomName(invObj._id, "userInventory_" + userId, 'visible', true)

    // move item from user inventory to room 
    await moveObjectToAnotherDb(invObj._id, "userInventory_" + userId, roomName)

    // add container obj id to putobj's "inside" property
    await setObjs.setObjectPropertyByDbIdAndRoomName(objDbId = invObj._id, roomName = roomName, property = 'inside', value = String(containerObj._id))

    return "You put the " + invObj.names[0] + " " + containerObj.preposition + " the " + containerObj.names[0] + "."
}

async function putObjectAdmin(putObjId, containerObjId, roomName) {
    let putObj = await getObjs.getObjByDbIdAndRoom(putObjId, roomName)
    let containerObj = await getObjs.getObjByDbIdAndRoom(containerObjId, roomName)
    putObj = putObj[0]
    containerObj = containerObj[0]

    // Add item to container
    await containerObj.contains.push(putObj)
    await setObjs.setObjectPropertyByDbIdAndRoomName(containerObjId, roomName, 'contains', value = containerObj.contains)

    // Set putObj as not visible if the container is closed
    if (!containerObj.open) {
        await setObjs.setObjectPropertyByDbIdAndRoomName(putObjId, roomName, 'visible', false)
    }

    // add container obj id to putobj's "inside" property
    await setObjs.setObjectPropertyByDbIdAndRoomName(putObjId, roomName, 'inside', containerObjId)
}

module.exports = {
    putObject,
    putObjectAdmin
}