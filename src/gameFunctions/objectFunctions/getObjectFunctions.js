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

async function getAllDoorsInRoom(roomName) {
    /**
     * Gets all the doors in a room
     * @param {String} roomName - Name of the room
     * @return {[Object]} - returns a list of door objects
     */
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let doors = await database.collection("doors").find().toArray()
    await client.close()
    return doors
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
    await client.close()
    return objs
}

async function getAllObjsByNameInRoom(objName, roomName) {
    const objs = await getAllObjectsInRoom(roomName)
    const foundObjs = objs.filter((obj) => {return obj.names.includes(objName)})
    return foundObjs
}

async function getAllVisibleObjsInRoom(roomName) {
    const objs = await getAllObjectsInRoom(roomName)
    const visibleObjs = objs.filter((obj) => {return obj.visible})
    return visibleObjs
}

async function getAllVisibleObjsInRoomByName(objName, roomName) {
    const objs = await getAllObjsByNameInRoom(objName, roomName)
    const visibleObjs = objs.filter((obj) => {return obj.visible})
    return visibleObjs
}

async function getAllObjsByNameInInventory(objName, userId) {
    const objs = await getAllObjectsInInventory(userId)
    const foundObjs = objs.filter((obj) => {return obj.names.includes(objName)})
    return foundObjs
}

async function getAllObjectsInRoomAndInventory(roomName, userId) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     * @param {[String]} Array of objects in room and invetory
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

async function getAllPeopleInRoom(roomName) {
    console.log(roomName)
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    const people = await database.collection('people').find().toArray()
    await client.close()
    return people
}

async function getAllImportantObjectsInRoom(roomName) {
    // returns a list of all important objects in a room
    let visibleObjs = await getAllVisibleObjsInRoom(roomName)
    const importObjs = visibleObjs.filter((obj) => {return obj.important})
    return importObjs
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
            await client.close()
            return [out, objCollections[i]]
        }
    }
    await client.close()
    return [null, null]
}

async function getRoomObjByRoomName(roomName) {
    const [database, client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    let roomObj = await database.collection('room').findOne()
    await client.close()
    return roomObj
}


module.exports = {
    getAllCollectionsInRoom,
    getAllDoorsInRoom,
    getAllImportantObjectsInRoom,
    getAllObjsByNameInRoom,
    getAllVisibleObjsInRoom,
    getAllVisibleObjsInRoomByName,
    getAllObjectsInInventory,
    getAllObjsByNameInInventory,
    getAllObjectsInRoom,
    getAllObjectsInRoomAndInventory,
    getAllPeopleInRoom,
    getObjByDbIdAndRoom,
    getRoomObjByRoomName,
}
