mongoose = require("mongoose")
ObjectID = require('mongodb').ObjectID
const {mongoDbClientConnect} = require("../../backendFunctions/mongoHelpers")

async function deleteUserInRoomById(client, userDbId, roomName) {
    const database = client.db(roomName)
    console.log("Deleting user with database ID: " + userDbId)
    // Make sure to create an ObjectID object when searching by _id on mongo
    await database.collection("people").deleteOne({_id: ObjectID(userDbId)})
    return
}

module.exports = {
    deleteUserInRoomById
}