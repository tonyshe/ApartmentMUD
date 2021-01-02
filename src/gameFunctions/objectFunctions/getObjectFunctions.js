const { mongoDbClientConnect } = require("../../backendFunctions/mongoHelpers")

async function getAllCollectionsInRoom(client, roomName) {
    /**
     * Takes a room and returns a list of all collections in it
     * @param {String} roomName - name of the room
     * @param {[String]} Array of strings representing the collections inside the room
     */
    const database = client.db(roomName)
    let collectionObjList = await database.listCollections().toArray()
    let collectionNameList = []
    for (let i = 0; i < collectionObjList.length; i++) {
        collectionNameList.push(collectionObjList[i].name)
    }
    return collectionNameList
}

async function getAllDoorsInRoom(client, roomName) {
    /**
     * Gets all the doors in a room
     * @param {String} roomName - Name of the room
     * @return {[Object]} - returns a list of door objects
     */
    const database = client.db(roomName)
    let doors = await database.collection("doors").find().toArray()
    return doors
}

async function getAllObjectsInRoom(client, roomName) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     */
    // Returns a list of all objects in a room
    let objCollections = await getAllCollectionsInRoom(client, roomName)
    const database = client.db(roomName)
    let objs = []
    for (let i = 0; i < objCollections.length; i++) {
        let collection = database.collection(objCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    return objs
}

async function getAllObjsByNameInRoom(client, objName, roomName) {
    const objs = await getAllObjectsInRoom(client, roomName)
    const foundObjs = objs.filter((obj) => {
        const lowercaseNames = obj.names.map((objname) => { return objname.toLowerCase() })
        return lowercaseNames.includes(objName.toLowerCase())
    })
    return foundObjs
}

async function getAllVisibleObjsInRoom(client, roomName) {
    const objs = await getAllObjectsInRoom(client, roomName)
    const visibleObjs = objs.filter((obj) => { return obj.visible })
    return visibleObjs
}

async function getAllVisibleObjsInRoomByName(client, objName, roomName) {
    const objs = await getAllObjsByNameInRoom(client, objName, roomName)
    const visibleObjs = objs.filter((obj) => { return obj.visible })
    return visibleObjs
}

async function getAllObjsByNameInInventory(client, objName, userId) {
    const objs = await getAllObjectsInInventory(client, userId)
    const foundObjs = objs.filter((obj) => {
        const lowercaseNames = obj.names.map((objname) => { return objname.toLowerCase() })
        return lowercaseNames.includes(objName.toLowerCase())
    })
    return foundObjs
}

async function getAllObjectsInInventory(client, userId) {
    /**
     * Takes a room and returns an array of all objects in the room
     * @param {String} roomName - name of the room
     * @param {[Object]} Array of objects inside of the room
     */
    // Returns a list of all objects in a room
    let objs = []
    const inventoryName = "userInventory_" + userId
    let invObjCollections = await getAllCollectionsInRoom(client, inventoryName)
    const invDatabase = client.db(inventoryName)
    for (let i = 0; i < invObjCollections.length; i++) {
        let collection = invDatabase.collection(invObjCollections[i])
        let x = await collection.find().toArray()
        objs = objs.concat(x)
    }
    return objs
}

async function getAllPeopleInRoom(client, roomName) {
    /**
     * Return a list of user objs for all the people in a room
     * @param {String} roomName - name of room to query
     * @return {[Object]} Array of user objs inside of the room
     */
    const database = client.db(roomName)
    const people = await database.collection('people').find().toArray()
    return people
}

async function getAllImportantObjectsInRoom(client, roomName) {
    // returns a list of all important objects in a room
    let visibleObjs = await getAllVisibleObjsInRoom(client, roomName)
    const importObjs = visibleObjs.filter((obj) => { return obj.important })
    return importObjs
}

async function getObjByDbIdAndRoom(client, objDbId, roomName) {
    /**
     * Returns a mongo db Object and the name of the collection it's in, given a object id and room name. Just like magic
     * @param {String} objDbId - mongo db id of the object
     * @param {String} roomName - room that the object is in
     * @return {[Object, String]} mongodb obj and collection name otherwise [null, null]
     */
    let objCollections = await getAllCollectionsInRoom(client, roomName)
    const database = client.db(roomName)
    

    for (i = 0; i < objCollections.length; i++) {
        out = await database.collection(objCollections[i]).findOne({ _id: ObjectID(objDbId) })
        if (out) {
            return [out, objCollections[i]]
        }
    }
    return [null, null]
}

async function getRoomObjByRoomName(client, roomName) {
    const database = client.db(roomName)
    let roomObj = await database.collection('room').findOne()
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
    getAllPeopleInRoom,
    getObjByDbIdAndRoom,
    getRoomObjByRoomName,
}
