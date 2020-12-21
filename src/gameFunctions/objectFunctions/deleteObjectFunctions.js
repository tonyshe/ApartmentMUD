mongoose = require("mongoose")
ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

async function deleteUserInRoomById(userDbId, roomName) {
    const [database,client] = await mongoDbClientConnect("mongodb://127.0.0.1:27017/", roomName)
    console.log("Deleting user with database ID: " + userDbId)
    // Make sure to create an ObjectID object when searching by _id on mongo
    await database.collection("people").deleteOne({_id: ObjectID(userDbId)})
    client.close()
    return
}

module.exports = {
    deleteUserInRoomById
}