mongoose = require("mongoose")
const {setObjectPropertyByDbIdAndRoomName} = require("../gameFunctions/objectFunctions/setObjectFunctions")

const doorObjectSchema = new mongoose.Schema({
    names: {type: [String]},
    room: {type: String},
    open: {type: Boolean},
    locked: {type: Boolean},
    linkedDoor: {type: String},
    important: {type: Boolean},
    takeable: {type: Boolean},
    description: {type: String},
    describe: {type: String}
    }
);

collectionName = "door"

const doorObj = mongoose.model(collectionName, doorObjectSchema);

async function createDoorObjectPair(doorA, doorB) {
    let doorAObj = await createDoorObject(doorA)
    let doorBObj = await createDoorObject({...doorB, "linkedDoor": String(doorA._id)})
    console.log(doorAObj.room)
    await setObjectPropertyByDbIdAndRoomName(
        doorAObj._id, 
        doorAObj.room,
        "linkedDoor", 
        String(doorBObj._id)
    )
}

async function createDoorObject(objInfo) {
    const {
        names = ['noname'],
        room = "",
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
        room: room,
        open: open,
        locked: locked,
        linkedDoor: linkedDoor,
        important: important,
        takeable: takeable,
        description: description,
        describe: describe
    }
    
    const url = "mongodb://127.0.0.1:27017/"  + room
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    let obj = await doorObj.create({...objProps})
    await mongoose.connection.close()
    return obj
}

module.exports = {
    createDoorObjectPair
}