mongoose = require("mongoose")

const roomObjectSchema = new mongoose.Schema({
    names: {type: [String]},
    roomName: {type: String},
    important: {type: Boolean},
    takeable: {type: Boolean},
    visible: {type: Boolean},
    description: {type: String},
    describe: {type: String},
    look: {type: String},
    roomVars: { type: Object }
    },
    {collection: "room",
     minimize: false}
);
collectionName = "room"

const roomObj = mongoose.model(collectionName, roomObjectSchema);

async function createRoomObject(objInfo) {
    const {
        roomName = 'unnamedRooms',
        names = ['noname'],
        important = false,
        takeable = false,
        visible = true,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe',
        look = 'defaultRoomLook',
        roomVars = {}
    } = objInfo;

    // Obj payload for mongodb
    objProps = {
        names: names,
        roomName: roomName,
        important: important,
        takeable: takeable,
        visible: visible,
        description: description,
        describe: describe,
        look: look,
        roomVars: roomVars
    }
    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    
    await roomObj.findOne({roomName: roomName}).then((result) => {
        if (result != null) {
            console.log("Cannot make room with name " + names + ": already exists")
            mongoose.connection.close()
            return
        }
    })

    console.log("  -Making room: " + names)
    let obj = await roomObj.create({...objProps})
    await mongoose.connection.close()
    return String(obj._id)
}

module.exports = {
    createRoomObject
}