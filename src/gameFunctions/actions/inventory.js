const getObjs = require("../objectFunctions/GetObjectFunctions")
const textHelpers = require("../helperFunctions/textHelpers")

async function inventory(userId) {
    /**
     * Gets a list of all objs in user inventory and creates a message object 
     * @param {String} userId - user id of the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */
    const invObjList = await getObjs.getAllObjectsInInventory(userId)
    const invObjNameList = invObjList.map((obj) => {return obj.names[0]})
    const invStringArray = textHelpers.objLister(invObjNameList)
    if (invObjNameList.length > 0) {
        return {[ "You have " + invStringArray[0] + "."]: [userId]}
    } else {
        return {[ "You have nothing."]: [userId]}
    }
}

module.exports = {
    inventory
}