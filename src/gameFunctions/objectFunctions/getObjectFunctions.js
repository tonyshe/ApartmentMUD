const { mongoDbClientConnect } = require("../../backendFunctions/mongoHelpers")

async function getAllCollectionsInRoom(roomName) {
    /**
     * Takes a room and returns a list of all collections in it
     * @param {String} roomName - name of the room
     * @param {[String]} Array of strings representing the collections inside the room
     */
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let collectionObjList = await database.listCollections().toArray()
    let collectionNameList = []
    for (let i = 0; i < collectionObjList.length; i++) {
        collectionNameList.push(collectionObjList[i].name)
    }
    await client.close()
    return collectionNameList
}

async function getAllObjectsInRoom(roomName) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     */
    // Returns a list of all objects in a room
    let objCollections = await getAllCollectionsInRoom(roomName)
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let objs = []
    for (let i = 0; i < objCollections.length; i++) {
        let collection = database.collection(objCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    client.close()
    return objs
}

async function getAllObjectsInRoomAndInventory(roomName, userId) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     */
    // Returns a list of all objects in a room
    let objCollections = await getAllCollectionsInRoom(roomName)
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let objs = []
    for (let i = 0; i < objCollections.length; i++) {
        let collection = database.collection(objCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    await client.close()

    const inventoryName = "userInventory_" + userId
    let invObjCollections = await getAllCollectionsInRoom(inventoryName)
    const [invDatabase, invClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", inventoryName)
    for (let i = 0; i < invObjCollections.length; i++) {
        let collection = invDatabase.collection(invObjCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    await invClient.close()
    return objs
}

async function getAllObjectsInInventory(userId) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     */
    // Returns a list of all objects in a room
    let objs = []
    const inventoryName = "userInventory_" + userId
    let invObjCollections = await getAllCollectionsInRoom(inventoryName)
    const [invDatabase, invClient] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", inventoryName)
    for (let i = 0; i < invObjCollections.length; i++) {
        let collection = invDatabase.collection(invObjCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    await invClient.close()
    return objs
}

async function getObjByDbIdAndRoom(objDbId, roomName) {
    /**
     * Returns a mongo db Object and the name of the collection it's in, given a object id and room name. Just like magic
     * @param {String} objDbId - mongo db id of the object
     * @param {String} roomName - room that the object is in
     * @return {[Object, String]} mongodb obj and collection name otherwise [null, null]
     */

    let objCollections = await getAllCollectionsInRoom(roomName)
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)

    for (i = 0; i < objCollections.length; i++) {
        out = await database.collection(objCollections[i]).findOne({ _id: ObjectID(objDbId) })
        if (out) {
            client.close()
            return [out, objCollections[i]]
        }
    }
    client.close()
    return [null, null]
}

async function getAllImportantObjectsInRoom(roomName) {
    // returns a list of all important objects in a room
    // TODO!!!! NOT FINISHED
    let objCollections = await getAllCollectionsInRoom(roomName)
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let importantObjs = []
    for (let i = 0; i < objCollections.length; i++) {
        let collection = database.collection(objCollections[i])
        let x = await collection.find({ important: true }).toArray()
        objs = objs.concat(x)
    }
    client.close()
    return objs
}

async function getUserDbIdByUserId(userId) {
    /**
     * Takes a user ID string and return the userDbID associated with in in the userIdMap db
     * @param {String} userId - String of the userid (generated by browser)
     * @return {String} String of the user DB Id. NOT an ObjectId object
     */
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    client.close()
    return x.userDbId
}

async function getUserIdByUserDbId(userDbId) {
    /**
     * Takes a user DB ID string and return the user ID associated with in in the userIdMap db
     * @param {String} userDbId - String of the userid (generated by browser)
     * @return {String} String of the user DB Id. NOT an ObjectId object
     */
    const [database,client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userDbId: userDbId })
    client.close()
    return x.userId
}

async function getUserRoomByUserId(userId) {
    /**
     * Takes a user ID string and return the roomName associated with
     * @param {String} userId: String of the userid (generated by browser)
     * @return {String} String of the user room. This should be a database name
     */
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    client.close()
    return x.userRoom
}

module.exports = {
    getAllCollectionsInRoom,
    getAllImportantObjectsInRoom,
    getAllObjectsInInventory,
    getAllObjectsInRoom,
    getAllObjectsInRoomAndInventory,
    getObjByDbIdAndRoom,
    getUserDbIdByUserId,
    getUserIdByUserDbId,
    getUserRoomByUserId
}
