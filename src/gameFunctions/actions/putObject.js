mongoose = require("mongoose")
const getObjs = require("../objectFunctions/GetObjectFunctions")
const {moveObjectToAnotherDb} = require("../objectFunctions/moveObjectFunctions")
const {setObjectVisible} = require("../objectFunctions/setObjectFunctions")

async function putObject(roomName, userId, putObj, containerObj ) {
    const invObj = await getObjs.getAllObjsByNameInInventory(putObj)
    const roomObjs = await getObjs.getAllObjsByNameInRoom(putObj, roomName)
    if (invObj.length + roomObjs.length > 1) {
        return 'There are more than one thing by the name ' + '"' + putObj + '." Please be more specific as to which one you mean.'
    }
    
    console.log(invObj)
    console.log(roomObjs)
    return
}

module.exports = {
    putObject
}