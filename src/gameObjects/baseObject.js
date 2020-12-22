mongoose = require("mongoose")

const baseObjectSchemaStructure = {
    names: {type: [String]},
    roomName: {type: String},
    important: {type: Boolean},
    takeable: {type: Boolean},
    description: {type: String},
    describe: {type: String}
}

const baseObjectSchema = new mongoose.Schema(baseObjectSchemaStructure);
collectionName = "baseobject"
const baseObj = mongoose.model(collectionName, baseObjectSchema);
  
async function createBaseObject(objInfo) {
    // Setting default values
    const {
        roomName = 'orphanedObjs',
        names = ['noname'],
        important = false,
        takeable = false,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe'
    } = objInfo;

    // Obj payload for mongodb
    objProps = {
        names: names,
        important: important,
        takeable: takeable,
        description: description,
        describe: describe
    }

    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    
    await baseObj.findOne({names: names}).then((result) => {
        if (result != null) {
            console.log("Cannot make object with name " + names + ": already exists")
            mongoose.connection.close()
            return
        }
    })

    console.log("  -Making DB object: " + names)
    let obj = await baseObj.create({...objProps})
    await mongoose.connection.close()
    return obj._id
}

// Export the Obj
module.exports = {
    createBaseObject,
    baseObj,
    baseObjectSchemaStructure
}
