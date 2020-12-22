mongoose = require("mongoose")
const { setObjectPropertyByDbIdAndRoomName } = require("../gameFunctions/objectFunctions/setObjectFunctions")
const { baseObjectSchemaStructure } = require("./baseObject")

let doorObjectSchemaAddons = {
    toRoom: { type: String },
    open: { type: Boolean },
    locked: { type: Boolean },
    linkedDoor: { type: String }
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
    let doorAObj = await createDoorObject(doorA)
    let doorBObj = await createDoorObject({
        ...doorB,
        "linkedDoor": doorA._id,
        "toRoom": doorA.roomName
    })

    await setObjectPropertyByDbIdAndRoomName(
        doorAObj._id,
        doorAObj.roomName,
        "linkedDoor",
        String(doorBObj._id)
    )
    await setObjectPropertyByDbIdAndRoomName(
        doorAObj._id,
        doorAObj.roomName,
        "toRoom",
        String(doorBObj.roomName)
    )
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
        describe = 'baseDescribe'
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
        describe: describe
    }

    const url = "mongodb://127.0.0.1:27017/" + roomName
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    let obj = await doorObj.create({ ...objProps })
    await mongoose.connection.close()
    return obj
}

module.exports = {
    createDoorObjectPair
}