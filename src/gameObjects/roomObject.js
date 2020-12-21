mongoose = require("mongoose")

const roomObjectSchema = new mongoose.Schema({
    names: {type: [String]},
    roomName: {type: String},
    important: {type: Boolean},
    takeable: {type: Boolean},
    description: {type: String},
    describe: {type: String},
    look: {type: String}
    },
    {collection: "room"}
);
collectionName = "room"

const roomObj = mongoose.model(collectionName, roomObjectSchema);

async function createRoomObject(objInfo) {
    const {
        roomName = 'unnamedRooms',
        names = ['noname'],
        important = false,
        takeable = false,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe',
        look = 'baseRoomLook'
    } = objInfo;

    // Obj payload for mongodb
    objProps = {
        names: names,
        roomName: roomName,
        important: important,
        takeable: takeable,
        description: description,
        describe: describe,
        look: look
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
    return obj._id
}

module.exports = {
    createRoomObject
}