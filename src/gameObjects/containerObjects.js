mongoose = require("mongoose")
const { setObjectPropertyByDbIdAndRoomName } = require("../gameFunctions/objectFunctions/setObjectFunctions")
const { baseObjectSchemaStructure } = require("./baseObject")

// Additional container object schema to add onto base object schema 
let containerObjectSchemaAddons = {
    proposition: { type: String },
    contains: { type: [String] },
    objsAllowed: { type: [String] },
    open: { type: Boolean },
    locked: { type: Boolean }
}

const containerObjectSchema = new mongoose.Schema({
    ...baseObjectSchemaStructure,
    ...containerObjectSchemaAddons
});

collectionName = "container"
const containerObj = mongoose.model(collectionName, containerObjectSchema);

async function createContainerObject(objInfo) {
    const {
        roomName = 'orphanedObjs',
        names = ['noname'],
        important = false,
        takeable = false,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'containerDescribe',
        visible = true,
        proposition = "on",
        contains = [], // Contains obj ids
        objsAllowed = [], // Allows any object if not set. Otherwise, only accepts objects in this list.
        open = true,
        locked = false
    } = objInfo;

    objProps = {
        roomName: roomName,
        names: names,
        important: important,
        takeable: takeable,
        description: description,
        describe: describe,
        visible: visible,
        proposition: proposition,
        contains: contains,
        objsAllowed: objsAllowed,
        open: open,
        locked: locked
    }

    console.log("  -Making DB container: " + names)
    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    let obj = await baseObj.create({...objProps})
    await mongoose.connection.close()
    return obj._id
}