mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient;
const {makeUserId} = require("../gameFunctions/helperFunctions/gameHelpers")
const getUsers = require("../gameFunctions/userFunctions/getUserFunctions")
const {deleteUserInRoomById} = require("../gameFunctions/objectFunctions/deleteObjectFunctions")

const personSchema = new mongoose.Schema({
    userId: {type: String},
    names: {type: [String]},
    inventory: {type: [String]},
    takeable: {type: Boolean},
    visible: {type: Boolean},
    description: {type: String},
    describe: {type: String}
});

const userIdMapSchema = new mongoose.Schema({
    userId: {type: String},
    userDbId: {type: String},
    userName: {type: String},
    userRoom: {type: String}
})


const collectionName = "person"
const person = mongoose.model(collectionName, personSchema)
const userIdEntry = mongoose.model('userMapId', userIdMapSchema)
  
async function createPerson(objInfo, personSchema, userIdMapSchema) {
    // Setting default values
    // returns user DB ID
    const {
        roomName = 'orphanedPersons',
        names = ['nobody'],
        userName = 'nobody',
        inventory = [],
        takeable = false,
        visible = true,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe',
        userId = makeUserId()
    } = objInfo;

    objProps = {
        names: names,
        userId: userId,
        inventory: inventory,
        takeable: takeable,
        visible: visible,
        description: description,
        describe: describe
    }

    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

    console.log("Making person: " + names)
    let obj = await person.create({...objProps})
    await mongoose.connection.close()

    const personDbUrl = "mongodb://127.0.0.1:27017/userIdMap";
    await mongoose.connect(personDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

    userIdProps = {
        userId: userId,
        userDbId: obj._id,
        userName: userName,
        userRoom: roomName
    }

    await userIdEntry.create({...userIdProps})
    await mongoose.connection.close()

    return String(obj._id)
}

async function deletePerson(userId) {
    // Takes in a user id (not Db id!!!!) and deletes user
    const userDbId = await getUsers.getUserDbIdByUserId(userId)
    const userRoom = await getUsers.getUserRoomByUserId(userId)
    console.log("DELETING: Userid: " + userId + " DB ID: " + userDbId)
    await deleteUserInRoomById(userDbId, userRoom)
    return userDbId
}

module.exports = {
    createPerson,
    deletePerson
}