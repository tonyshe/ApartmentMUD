const getObjs = require("../objectFunctions/getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const { moveObjectToAnotherDb } = require("../objectFunctions/moveObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")

async function putObject(roomName, userId, comArr) {
    /**
     * Puts an object from the user inventory in/on a container object. must be in user inventory first!
     * @param {String} roomName - room db name. the container obj must be in this room
     * @param {String} userId - user id of the user
     * @param {String} putObjName - name of the object from the user inventory to put
     * @param {String} containerObjName - name of the container object to put the item into
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */

    let putObj = []
    let userCom = ""

    if (comArr.length === 1) {
        return { ["Please specify something to " + comArr[0] + "."]: [userId] }
    } else {
        userCom = comArr.join(" ")
        putObj = userCom.match(/(?:put|set|place) (.*?) (?:on|in|inside|atop)/);
        if (putObj == null) {
            return { ['Please specify where to ' + comArr[0] + ' that.']: [userId] }
        }
    }
   
    const putObjName = putObj[1]
    const newContainerString = userCom.match(/(?:put|set|place) (.*?) (?:on|in|inside|atop) (.*)/); //the object that will contain putObj
    const splitPuts = userCom.split(/\s+/);
    const allowedPrepositions = ['in', 'on', 'inside', 'atop']
    const preposition = splitPuts[splitPuts.length - 1]
    if (newContainerString == null && allowedPrepositions.includes(preposition)) {
        return { ['Please specify where to ' + action + ' that ' + preposition + '.']: [userId] };
    } else if (newContainerString == null && !allowedPrepositions.includes(preposition)) {
        return { ['Please specify where to ' + action + ' that.']: [userId] }
    }

    let containerObjName = newContainerString[2]
    const client = await mongoDbClient()
    // Multiple or no item checking for put Object
    const invObjList = await getObjs.getAllObjsByNameInInventory(client, putObjName, userId)
    if (invObjList.length < 1) {
        await client.close()
        return { ["You don't have that."]: [userId] }
    } else if (invObjList.length > 1) {
        await client.close()
        return { ['There are more than one thing by the name ' + '"' + putObjName + '." Please be more specific as to which one you mean.']: [userId] }
    }

    
    // Multiple or no item checking for container object
    const containerObjList = await getObjs.getAllObjsByNameInRoom(client, containerObjName, roomName)
    if (containerObjList.length < 1) {
        await client.close()
        return { ["You don't see that."]: [userId] }
    } else if (containerObjList.length > 1) {
        await client.close()
        return { ['There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.']: [userId] }
    }


    let containerObj = containerObjList[0]
    let invObj = invObjList[0]

    // Check if object is allowed in/on the container
    if (containerObj.objsAllowed.length > 0) {
        const allowedUnionList = containerObj.contains.filter((objName) => { return invObj.names.includes(objName) })
        if (allowedUnionList.length === 0) {
            await client.close()
            return { ["That can't go there!"]: [userId] }
        }
    }

    // check if container is closed
    if (!containerObj.open && containerObj.hidesContents) {
        await client.close()
        return { ["You can't do that. The " + containerObj.names[0] + " is closed."]: [userId] }
    }

    // Add item to container. TODO: logic if the container rejects it.
    await containerObj.contains.push(invObj)
    await setObjs.setObjectPropertyByDbIdAndRoomName(client, objDbId = containerObj._id, roomName = roomName, property = 'contains', value = containerObj.contains)

    // set item as visible
    await setObjs.setObjectPropertyByDbIdAndRoomName(client, invObj._id, "userInventory_" + userId, 'visible', true)

    // move item from user inventory to room 
    await moveObjectToAnotherDb(client, invObj._id, "userInventory_" + userId, roomName)

    // add container obj id to putobj's "inside" property
    await setObjs.setObjectPropertyByDbIdAndRoomName(client, objDbId = invObj._id, roomName = roomName, property = 'inside', value = String(containerObj._id))

    // get list of userids of everyone else in the room
    let userIdList = await getUsers.getAllUserIdsInRoom(client, roomName)
    userIdList = userIdList.filter((id) => { return id != userId })
    const userName = await getUsers.getUserNameByUserId(client, userId)
    await client.close()
    return {
        ["You put the " + invObj.names[0] + " " + containerObj.preposition + " the " + containerObj.names[0] + "."]: [userId],
        [userName + " puts the " + invObj.names[0] + " " + containerObj.preposition + " the " + containerObj.names[0] + "."]: userIdList
    }
}

async function putObjectAdmin(putObjId, containerObjId, roomName) {
    /**
     * Puts an object inside a container, regardless of closed/locked state. both objs must be in the same room db first.
     * Used during the scenario setup stage. shouldn't be called via a user submitted command
     * @param {String} putObjId - id of the object to put
     * @param {String} containerObjId - id of the container object to put in/on
     * @param {String} roomName - name of the room that both objs are in
     */

    const client = await mongoDbClient()
    client.db(roomName)
    let putObj = await getObjs.getObjByDbIdAndRoom(client, putObjId, roomName)
    let containerObj = await getObjs.getObjByDbIdAndRoom(client, containerObjId, roomName)
    putObj = putObj[0]
    containerObj = containerObj[0]

    // Add item to container
    await containerObj.contains.push(putObj)
    await setObjs.setObjectPropertyByDbIdAndRoomName(client, containerObjId, roomName, 'contains', value = containerObj.contains)

    // Set putObj as not visible if the container is closed
    if (!containerObj.open) {
        await setObjs.setObjectPropertyByDbIdAndRoomName(client, putObjId, roomName, 'visible', false)
    }

    // add container obj id to putobj's "inside" property
    await setObjs.setObjectPropertyByDbIdAndRoomName(client, putObjId, roomName, 'inside', containerObjId)
    await client.close()
}

module.exports = {
    putObject,
    putObjectAdmin
}