mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient;
const {makeUserId} = require("../helperFunctions/gameHelpers")
const {getUserDbIdByUserId, getUserRoomByUserId} = require("../objectFunctions/getObjectFunctions")
const {deleteUserInRoomById} = require("../objectFunctions/deleteObjectFunctions")

const personSchema = new mongoose.Schema({
    userId: {type: String},
    names: {type: [String]},
    important: {type: Boolean},
    inventory: {type: [String]},
    takeable: {type: Boolean},
    visible: {type: Boolean},
    description: {type: String},
    describe: {type: String}
});

const userIdMapSchema = new mongoose.Schema({
    userId: {type: String},
    userDbId: {type: String},
    userRoom: {type: String}
})

collectionName = "person"
const person = mongoose.model(collectionName, personSchema)
const userIdEntry = mongoose.model('userMapId', userIdMapSchema)
  
async function createPerson(objInfo) {
    // Setting default values
    // returns user DB ID
    const {
        roomName = 'orphanedPersons',
        names = ['nobody'],
        inventory = [],
        important = true,
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
        important: important,
        takeable: takeable,
        visible: visible,
        description: description,
        describe: describe
    }

    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

    await person.findOne({names: names}).then((result) => {
        if (result != null) {
            console.log("Cannot make object with name " + names + ": already exists")
            mongoose.connection.close()
            return
        }
    })

    console.log("Making DB person: " + names)
    let obj = await person.create({...objProps})
    await mongoose.connection.close()

    const personDbUrl = "mongodb://127.0.0.1:27017/userIdMap";
    await mongoose.connect(personDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    await userIdEntry.findOne({userId: userId}).then((result) => {
        if (result != null) {
            console.log("Cannot make object with userId " + userId + ": already exists")
            mongoose.connection.close()
            return
        }
    })

    userIdProps = {
        userId: userId,
        userDbId: obj._id,
        userRoom: roomName
    }

    await userIdEntry.create({...userIdProps})
    await mongoose.connection.close()

    return obj._id
}

async function deletePerson(userId) {
    // Takes in a user id (not Db id!!!!) and deletes user
    console.log("deleting " + userId)
    const userDbId = await getUserDbIdByUserId(userId)
    const userRoom = await getUserRoomByUserId(userId)
    console.log("DELETING: " + userDbId+ " " + userRoom)
    await deleteUserInRoomById(userDbId, userRoom)
    return userDbId
}

module.exports = {
    createPerson,
    deletePerson
}