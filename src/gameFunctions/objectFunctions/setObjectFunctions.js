ObjectID = require('mongodb').ObjectID
const getObjs = require("./getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

async function setObjectPropertyByDbIdAndRoomName(client, objDbId, roomName, property, value) {
    /**
     * @param {String} objDbId - db id of the object to modify
     * @param {String} roomName - name (db) of the room that the object is in
     * @param {String} property - value to modify
     * @param {Any} - value toi set
     * @return {Object} - Object that matches the DB id supplied
     */
    let [obj,collectionName] = await getObjs.getObjByDbIdAndRoom(client, objDbId, roomName)
    const database = client.db(roomName)
    await database.collection(collectionName).updateOne(obj, {$set: {...obj, [property]: value}})

    return obj
}

async function setUserRoomByUserId(client, userId, newRoom) {
    const userObj = await getUsers.getUserMapObjByUserId(client, userId)
    const database = client.db("userIdMap")
    await database.collection("usermapids").updateOne(userObj, {$set: {...userObj, "userRoom": newRoom}})

}

module.exports = {
    setObjectPropertyByDbIdAndRoomName,
    setUserRoomByUserId
}