mongoose = require("mongoose")
const { setObjectPropertyByDbIdAndRoomName } = require("../gameFunctions/objectFunctions/setObjectFunctions")
const { baseObjectSchemaStructure } = require("./baseObject")

// Additional container object schema to add onto base object schema 
let containerObjectSchemaAddons = {
    preposition: { type: String },
    contains: { type: [Object] },
    objsAllowed: { type: [String] },
    open: { type: Boolean },
    locked: { type: Boolean },
    closeable: { type: Boolean }
}

const containerObjectSchema = new mongoose.Schema({
    ...baseObjectSchemaStructure,
    ...containerObjectSchemaAddons
}, { minimize: false });

collectionName = "container"
const containerObj = mongoose.model(collectionName, containerObjectSchema);

async function createContainerObject(objInfo) {
    const {
        roomName = 'orphanedObjs',
        names = ['noname'],
        important = false,
        takeable = false, // keep this as false, or else weird things can happen.
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'containerDescribe',
        visible = true,
        preposition = "on", // preferred preposition. Try to be consistent with the command parsing.
        contains = [], // Collection of objects inside container. You can't set this manually
        objsAllowed = [], // Allows any object if not set. Otherwise, only accepts objects in this list.
        open = true,
        locked = false,
        closeable = false
    } = objInfo;

    objProps = {
        roomName: roomName,
        names: names,
        important: important,
        takeable: false,
        description: description,
        describe: describe,
        visible: visible,
        preposition: preposition,
        contains: [],
        objsAllowed: objsAllowed,
        open: open,
        locked: locked,
        closeable: closeable
    }

    console.log("  -Making container: " + names)
    const url = "mongodb://127.0.0.1:27017/" + roomName;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    let obj = await containerObj.create({ ...objProps })
    await mongoose.connection.close()
    return String(obj._id)
}

module.exports = {
    createContainerObject
}