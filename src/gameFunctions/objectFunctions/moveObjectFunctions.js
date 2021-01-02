const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")
const getObjs = require("./getObjectFunctions")
const setObjs = require("./setObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")

async function moveObjectToAnotherDb(client, objId, fromDb, toDb) {
    /**
     * Moves an object from on db to another
     * @param {String} objId - DB id of the object to move
     * @param {String} fromDb - Name of the db to move from
     * @param {String} toDb - Name of the db to move to  (does not need to exist yet)
     * @return {String} Name of the collection that the obj is now in (should be the same as from db)
     */
    const [obj, collName] = await getObjs.getObjByDbIdAndRoom(client, objId, fromDb)
    const fromDatabase = client.db(fromDb)
    const toDatabase= client.db(toDb)
    console.log("Moving " + obj.names[0] + " from " + fromDb + " to " + toDb)
    await fromDatabase.collection(collName).deleteOne(obj)
    await toDatabase.collection(collName).insertOne(obj)

    return collName
}

async function moveUserIdToAnotherRoom(client, userId, toRoomName) {
    /**
     * Moves a user from one room db to another. Also updates the user map with the new room
     * @param {String} userId - userID of the user to move
     * @param {String} toRoomName - room to move the user to
     */
    // Delete the user from the current rooms
    let fromRoomName = await getUsers.getUserRoomByUserId(client, userId)
    console.log("Moving " + userId + " from " + fromRoomName + " to " + toRoomName)
    
    let userDbId = await getUsers.getUserDbIdByUserId(client, userId)
    let [userObj, collName] = await getObjs.getObjByDbIdAndRoom(client, userDbId, fromRoomName)
    const fromDatabase = client.db(fromRoomName)
    await fromDatabase.collection(collName).deleteOne(userObj)

    // Add user into new room
    const toDatabase = client.db(toRoomName)
    await toDatabase.collection(collName).insertOne(userObj)
    
    // update the user map db
    await setObjs.setUserRoomByUserId(client, userId, toRoomName)
}

module.exports = {
    moveObjectToAnotherDb,
    moveUserIdToAnotherRoom
}