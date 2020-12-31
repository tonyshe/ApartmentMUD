ObjectID = require('mongodb').ObjectID
const getObjs = require("./getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

async function setObjectPropertyByDbIdAndRoomName(objDbId, roomName, property, value) {
    /**
     * @param {String} objDbId - db id of the object to modify
     * @param {String} roomName - name (db) of the room that the object is in
     * @param {String} property - value to modify
     * @param {Any} - value toi set
     * @return {Object} - Object that matches the DB id supplied
     */
    console.log("setObjectPropertyByDbIdAndRoomName ARGS:")
    console.log(objDbId)
    console.log(roomName)
    console.log(property)
    console.log(value)
    console.log("---")
    
    let [obj,collectionName] = await getObjs.getObjByDbIdAndRoom(objDbId, roomName)
    const [database,client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", roomName)
    console.log(collectionName)
    await database.collection(collectionName).updateOne(obj, {$set: {...obj, [property]: value}})
    await client.close()
    return obj
}

async function setUserRoomByUserId(userId, newRoom) {
    const userObj = await getUsers.getUserMapObjByUserId(userId)
    const [database,client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    await database.collection("usermapids").updateOne(userObj, {$set: {...userObj, "userRoom": newRoom}})
    await client.close()
}

module.exports = {
    setObjectPropertyByDbIdAndRoomName,
    setUserRoomByUserId
}