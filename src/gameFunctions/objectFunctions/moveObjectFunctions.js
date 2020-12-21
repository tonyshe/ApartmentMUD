const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")
const getObjs = require("./getObjectFunctions")
const setObjs = require("./setObjectFunctions")

async function moveObjectToAnotherDb(objId, fromDb, toDb) {
    /**
     * Moves an object from on db to another
     * @param {String} objId - DB id of the object to move
     * @param {String} fromDb - Name of the db to move from
     * @param {String} toDb - Name of the db to move to  (does not need to exist yet)
     * @return {String} Name of the collection that the obj is now in (should be the same as from db)
     */
    const [obj, collName] = await getObjs.getObjByDbIdAndRoom(objId, fromDb)
    const [fromDatabase,fromClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", fromDb)
    const [toDatabase,toClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", toDb)
    console.log("Moving " + obj.names[0] + " from " + fromDb + " to " + toDb)
    await fromDatabase.collection(collName).deleteOne(obj)
    await toDatabase.collection(collName).insertOne(obj)

    await fromClient.close()
    await toClient.close()
    return collName
}

async function moveUserIdToAnotherRoom(userId, toRoomName) {
    /**
     * Moves a user from one room db to another. Also updates the user map with the new room
     * @param {String} userId - userID of the user to move
     * @param {String} toRoomName - room to move the user to
     */
    // Delete the user from the current room
    let fromRoomName = await getObjs.getUserRoomByUserId(userId)
    console.log("Moving " + userId + " from " + fromRoomName + " to " + toRoomName)
    
    let userDbId = await getObjs.getUserDbIdByUserId(userId)
    let [userObj, collName] = await getObjs.getObjByDbIdAndRoom(userDbId, fromRoomName)
    const [fromDatabase,fromClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", fromRoomName)
    await fromDatabase.collection(collName).deleteOne(userObj)
    await fromClient.close()

    // Add user into new room
    const [toDatabase,toClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", toRoomName)
    await toDatabase.collection(collName).insertOne(userObj)
    await toClient.close()
    
    // update the user map db
    await setObjs.setUserRoomByUserId(userId, toRoomName)
}

module.exports = {
    moveObjectToAnotherDb,
    moveUserIdToAnotherRoom
}