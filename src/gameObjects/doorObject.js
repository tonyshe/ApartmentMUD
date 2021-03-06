mongoose = require("mongoose")
const { setObjectPropertyByDbIdAndRoomName } = require("../gameFunctions/objectFunctions/setObjectFunctions")
const { baseObjectSchemaStructure } = require("./baseObject")
const {mongoDbClient} = require("../backendFunctions/mongoHelpers")

// Additional door object schema to add onto base object schema 
let doorObjectSchemaAddons = {
    toRoom: { type: String },
    open: { type: Boolean },
    locked: { type: Boolean },
    linkedDoor: { type: String },
    preposition: { type: String }
}

const doorObjectSchema = new mongoose.Schema({
    ...baseObjectSchemaStructure,
    ...doorObjectSchemaAddons
});

collectionName = "door"
const doorObj = mongoose.model(collectionName, doorObjectSchema);

async function createDoorObjectPair(doorA, doorB) {
    /**
     * Creates a pair of doors and links them together via linkedDoor ID and toRoom values
     */
    const client = await mongoDbClient()
    let doorAObj = await createDoorObject(doorA)
    let doorBObj = await createDoorObject({
        ...doorB,
        "linkedDoor": doorA._id,
        "toRoom": doorA.roomName
    })

    await setObjectPropertyByDbIdAndRoomName(
        client,
        objDbId = doorAObj._id,
        roomName = doorAObj.roomName,
        property = "linkedDoor",
        value = String(doorBObj._id)
    )
    await setObjectPropertyByDbIdAndRoomName(
        client,
        objDbId = doorAObj._id,
        roomName = doorAObj.roomName,
        property = "toRoom",
        value = String(doorBObj.roomName)
    )
    await client.close()
    return [String(doorAObj._id), String(doorBObj._id)]
}

async function createDoorObject(objInfo) {
    /**
     * Door object. Important data points:
     * @param room - name of the room that door is in 
     * @param toRoom - name of the room that the door goes to
     * @param linkedDoor - DbId of the corresponding door in the door pair. Set automatically, don't worry
     */
    const {
        names = ['noname'],
        roomName = "",
        toRoom = "",
        open = true,
        locked = false,
        linkedDoor = "",
        important = false,
        takeable = false,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe',
        visible = true,
        preposition = 'through'
    } = objInfo

    objProps = {
        names: names,
        roomName: roomName,
        toRoom: toRoom,
        open: open,
        locked: locked,
        linkedDoor: linkedDoor,
        important: important,
        takeable: takeable,
        description: description,
        describe: describe,
        visible: visible,
        preposition: preposition
    }

    const url = "mongodb://" + global.mongoDbAddress + ":27017/" + roomName
    console.log("  -Making door: " + names)
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    let obj = await doorObj.create({ ...objProps })
    await mongoose.connection.close()
    return obj
}

module.exports = {
    createDoorObjectPair
}