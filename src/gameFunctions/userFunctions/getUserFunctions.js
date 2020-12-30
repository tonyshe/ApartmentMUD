const { mongoDbClientConnect } = require("../../backendFunctions/mongoHelpers")

async function getAllUserIdsInRoom(roomName) {
    /**
     * Gets an array of all userIds in a room db
     * @param {String} roomName - Name of the room db
     * @returns Array of userIds
     */
    const [database, client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", roomName)
    const usersObjList = await database.collection('people').find().toArray()
    const userNamesList = usersObjList.map((user) => {return String(user.userId)})
    await client.close()
    return userNamesList
}

async function getUserDbIdByUserId(userId) {
    /**
     * Takes a user ID string and return the userDbID associated with in in the userIdMap db
     * @param {String} userId - String of the userid (generated by browser)
     * @return {String} String of the user DB Id. NOT an ObjectId object
     */
    const [database, client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    await client.close()
    // maybe add a retry here in the future
    return x.userDbId
}

async function getUserIdByUserDbId(userDbId) {
    /**
     * Takes a user DB ID string and return the user ID associated with in in the userIdMap db
     * @param {String} userDbId - String of the userid (generated by browser)
     * @return {String} String of the user DB Id. NOT an ObjectId object
     */
    const [database,client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userDbId: userDbId })
    await client.close()
    return x.userId
}

async function getUserMapObjByUserId(userId) {
    /**
     * Gets the user map object when provided a userId
     * @param {String} userId - user id of the user. Makes sense
     * @return - user map obj. this one is pretty straightforward 
     */
    const [database,client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    await client.close()
    return x
}

async function getUserRoomByUserId(userId) {
    /**
     * Takes a user ID string and return the roomName associated with
     * @param {String} userId: String of the userid (generated by browser)
     * @return {String} String of the user room. This should be a database name
     */
    const [database, client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    await client.close()
    return x.userRoom
}

async function getUserNameByUserId (userId) {
    /**
     * Gets the username (first entry in .names) of a user by userId
     * @param {String} userId - userid of the user
     * @return {String} user name of the matching user
     */
    const [database, client] = await mongoDbClientConnect("mongodb://" + global.mongoDbAddress + ":27017/", "userIdMap")
    const collection = database.collection('usermapids')
    let x = await collection.findOne({ userId: userId })
    await client.close()
    return x.userName
}

module.exports = {
    getAllUserIdsInRoom,
    getUserDbIdByUserId,
    getUserIdByUserDbId,
    getUserMapObjByUserId,
    getUserNameByUserId,
    getUserRoomByUserId
}
