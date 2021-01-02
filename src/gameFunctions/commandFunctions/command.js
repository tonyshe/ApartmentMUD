const { examineObject } = require('../actions/examineObject')
const { takeObject } = require('../actions/takeObject')
const { putObject } = require('../actions/putObject')
const { goDoor } = require('../actions/goDoor')
const textHelpers = require("../helperFunctions/textHelpers")
const getObjs = require("../objectFunctions/getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const { lookRoom } = require('../actions/lookRoom')
const { inventory } = require('../actions/inventory')
const { openContainer, closeContainer } = require('../actions/openCloseObject')
const {showHelp} = require("../actions/showHelp")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")


async function command(userCom, userId) {
    // processes the user command
    if (userCom.trim() === "") {
        return false
    } else {
        const client = await mongoDbClient()
        let userRoom = await getUsers.getUserRoomByUserId(client, userId)
        await client.close()
        const commandArray = await splitCommands(userCom, userId, userRoom)
        return commandArray
    }
}

async function splitCommands(userCom, userId, roomName) {
    // splits a user input into an array of strings
    userCom = userCom.toLowerCase(); //to lower case
    userCom = userCom.replace(/ +(?= )/g, '').trim(); //convert multiple space to one. trim whitespace
    userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");   //remove punctuation
    userCom = userCom.replace(" the ", " ").replace(" an ", " ").replace(" a ", " ");  //remove articles
    const splitCommands = userCom.split(/\s+/); //split command to word array
    let response = await executeCommandArray(splitCommands, userCom, userId, roomName)
    return response
}

async function executeCommandArray(comArr, userCom, userId, roomName) {
    /**
     * Huge messy thing than handles user commands. will need to modularize this soon
     * @param {[String]} comArr - Array of command strings 
     * @param {String} userCom - Full text of user command
     * @param {String} userId - user id (not user db id)
     * @param {String} roomName - name of the room that the user is in
     */
    const action = comArr[0]

    /**
     * META COMMANDS
     */
    const helpActions = ['h', 'help']
    if (helpActions.includes(action)) { return await showHelp(userId) }

    /**
     * OBSERVATION COMMANDS
     */
    // examine command
    const examineActions = ['examine', 'x']
    if (examineActions.includes(action)) { return await examineObject(roomName, userId, comArr) }

    // look command
    const lookActions = ["look", "l"]
    if (lookActions.includes(action)) {return await lookRoom(roomName, userId) }

    // inventory command
    const inventoryActions = ["inventory", "i", "inv"]
    if (inventoryActions.includes(action)) { return await inventory(userId) }

    /**
     * OBJECT MANUPULATION COMMANDS
     */
    // take command
    const takeActions = ["take"]
    if (takeActions.includes(action)) { return await takeObject(roomName, userId, comArr) }

    // put command
    const putActions = ["put", "set", "place"]
    if (putActions.includes(action)) { return await putObject(roomName, userId, comArr) }

    const openAction = ["open"]
    if (openAction.includes(action)) { return await openContainer(roomName, userId, comArr) }

    const closeAction = ["close", "shut"]
    if (closeAction.includes(action)) { return await closeContainer(roomName, userId, comArr) }

    /**
     * MOVEMENT COMMANDS
     */
    // go command
    const goActions = ["go"]
    if (goActions.includes(action)) { return await goDoor(roomName, userId, comArr) }

    return { [textHelpers.capitalizeFirstLetter(comArr[0] + " is not a relevant command right now.")]: [userId] }
}

module.exports = {
    command
}