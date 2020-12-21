mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient;
const getObjs = require("../objectFunctions/GetObjectFunctions")
const {setObjectVisible} = require("../objectFunctions/setObjectFunctions")

async function takeObject(roomName, objName) {
    // Search all documents in all collections for a match. Create an array of matching objects
    let objs = await getObjs.getAllObjectsInRoom(roomName)
    let foundObjs = []
    for (let i=0; i<objs.length; i++) {
        if (objs[i].names.includes(objName)) {
            foundObjs.push(objs[i])
        }
    }

    // Logic depending on how many objects are found
    if (foundObjs.length === 0) {
        return "No such thing exists."
    } else if (foundObjs.length > 1) {
        return 'There are more than one thing by the name ' + '"' + objName + '." Please be more specific as to which one you mean.'
    } else if (foundObjs.length === 1) {
        // If only one object is found, use the custom describe() functions from ../describeFunctions
        obj = foundObjs[0]
        console.log(obj._id)
        let out = await setObjectVisible(obj._id, roomName, false)
        console.log(out)
        return
    }
}

module.exports = {
    takeObject
}