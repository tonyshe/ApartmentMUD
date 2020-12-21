ObjectID = require('mongodb').ObjectID
const { getObjByDbIdAndRoom } = require("./getObjectFunctions")
const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

async function setObjectVisible(objDbId, roomName, visible) {
    /**
     * @param {String} objDbId - db id of the object to modify
     * @param {String} roomName - name (db) of the room that the object is in
     * @param {Boolean} visible - true if setting object visible, else false for not visible
     * @return {Object} - Object that matches the DB id supplied
     */
    let [obj,collectionName] = await getObjByDbIdAndRoom(objDbId, roomName)
    const [database,client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    
    database.collection(collectionName).updateOne(obj, {$set: {...obj, visible: visible}})
    client.close()
    return obj
}

module.exports = {
    setObjectVisible
}