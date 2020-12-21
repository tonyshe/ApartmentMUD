const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

const {getObjByDbIdAndRoom} = require("./getObjectFunctions")

async function moveObjectToAnotherDb(objId, fromDb, toDb) {
    /**
     * Moves an object from on db to another
     * @param {String} objId - DB id of the object to move
     * @param {String} fromDb - Name of the db to move from
     * @param {String} toDb - Name of the db to move to  (does not need to exist yet)
     * @return {String} Name of the collection that the obj is now in (should be the same as from db)
     */
    const [obj, collName] = await getObjByDbIdAndRoom(objId, fromDb)
    const [fromDatabase,fromClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", fromDb)
    const [toDatabase,toClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", toDb)
    console.log("Moving " + obj.names[0] + " from " + fromDb + " to " + toDb)
    await fromDatabase.collection(collName).deleteOne(obj)
    await toDatabase.collection(collName).insertOne(obj)

    await fromClient.close()
    await toClient.close()
    return collName
}

module.exports = {
    moveObjectToAnotherDb
}