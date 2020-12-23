const { examineObject } = require('../actions/examineObject')
const { takeObject } = require('../actions/takeObject')
const { putObject } = require('../actions/putObject')
const { goDoor } = require('../actions/goDoor')
const textHelpers = require("../helperFunctions/textHelpers")
const getObjs = require("../objectFunctions/getObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const { lookRoom } = require('../actions/lookRoom')
const { inventory } = require('../actions/inventory')

async function command(userCom, userId) {
    // processes the user command
    if (userCom.trim() === "") {
        return false
    } else {
        let userRoom = await getUsers.getUserRoomByUserId(userId)
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
     * OBSERVATION COMMANDS
     */

    // examine command
    if (action === "x" | action === "examine" && comArr[1]) {
        const objString = userCom.substr(userCom.indexOf(" ") + 1) // Need to do this to convert multi-word descriptions
        const output = await examineObject(roomName, userId, objString)
        return output
    } else if (action === "x" | action === "examine" && comArr.length === 1) {
        return { ["Please specify something to examine."]: [userId] }
    }

    // look command
    const lookActions = ["look", "l"]
    if (lookActions.includes(action)) {
        const output = await lookRoom(userId, roomName)
        return output
    }

    // inventory command
    const inventoryActions = ["inventory", "i", "inv"]
    if (inventoryActions.includes(action)) {
        const output = await inventory(userId)
        return output
    }


    /**
     * OBJECT MANUPULATION COMMANDS
     */

    // take command
    if (action === "take" && comArr[1]) {
        const objString = userCom.substr(userCom.indexOf(" ") + 1) // Need to do this to convert multi-word descriptions
        let output = await takeObject(roomName, userId, objString)
        return output
    } else if (action === "take" && comArr.length === 1) {
        return { ["Please specify something to take."]: [userId] }
    }

    // put command
    const putActions = ["put", "set", "place"]
    if (putActions.includes(action) && comArr[1]) {
        let putObj = userCom.match(/(?:put|set|place) (.*?) (?:on|in|inside|atop)/); //the object being moved
        if (putObj == null) {
            return { ['Please specify where to ' + action + ' that.']: [userId] }
        }
        else {
            putObj = putObj[1]
            const newContainerString = userCom.match(/(?:put|set|place) (.*?) (?:on|in|inside|atop) (.*)/); //the object that will contain putObj
            const splitPuts = userCom.split(/\s+/);
            const allowedPrepositions = ['in', 'on', 'inside', 'atop']
            const preposition = splitPuts[splitPuts.length - 1]
            if (newContainerString == null && allowedPrepositions.includes(preposition)) {
                return { ['Please specify where to ' + action + ' that ' + preposition + '.']: [userId] };
            } else if (newContainerString == null && !allowedPrepositions.includes(preposition)) {
                return { ['Please specify where to ' + action + ' that.']: [userId] }
            } else {
                const containerObj = newContainerString[2]
                const output = await putObject(roomName, userId, putObj, containerObj)
                return output
            }
        }
    } else if (putActions.includes(action) && comArr.length === 1) {
        return { ["Please specify something to " + action + "."]: [userId] }
    }

    /**
     * MOVEMENT COMMANDS
     */

    // go command
    if (action === "go" && comArr[1]) {
        const objString = userCom.substr(userCom.indexOf(" ") + 1) // Need to do this to convert multi-word descriptions
        const output = await goDoor(roomName, userId, objString)
        return output
    } else if (action === "go" && comArr.length === 1) {
        return { ["Please specify where to go."]: [userId] }
    }



    return { [textHelpers.capitalizeFirstLetter(comArr[0] + " is not a relevant command right now.")]: [userId] }
}

module.exports = {
    command
}