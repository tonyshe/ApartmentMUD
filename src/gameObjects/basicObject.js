mongoose = require("mongoose")

const basicObjectSchema = new mongoose.Schema({
    names: {type: [String]},
    important: {type: Boolean},
    takeable: {type: Boolean},
    visible: {type: Boolean},
    description: {type: String},
    describe: {type: String}
});
collectionName = "baseobject"
const basicObj = mongoose.model(collectionName, basicObjectSchema);
  
async function createBaseObject(objInfo) {
    // Setting default values
    const {
        roomName = 'orphanedObjs',
        names = ['noname'],
        important = false,
        takeable = false,
        visible = true,
        description = "It's either indescribable or I forgot to write a description for this...",
        describe = 'baseDescribe'
    } = objInfo;

    // Obj payload for mongodb
    objProps = {
        names: names,
        important: important,
        takeable: takeable,
        visible: visible,
        description: description,
        describe: describe
    }

    const url = "mongodb://127.0.0.1:27017/"  + roomName;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    
    await basicObj.findOne({names: names}).then((result) => {
        if (result != null) {
            console.log("Cannot make object with name " + names + ": already exists")
            mongoose.connection.close()
            return
        }
    })

    console.log("  -Making DB object: " + names)
    let obj = await basicObj.create({...objProps})
    await mongoose.connection.close()
    return obj._id
}

// Export the Obj
module.exports = {
    createBaseObject,
    basicObj
}
