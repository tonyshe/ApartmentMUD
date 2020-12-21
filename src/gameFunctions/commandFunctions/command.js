const { examineObject } = require('../actions/examineObject')
const { takeObject } = require('../actions/takeObject')
const textHelpers = require("../helperFunctions/textHelpers")
const getObjs = require("../objectFunctions/getObjectFunctions")

async function command(userCom, userId) {
    // processes the user command
    if (userCom.trim() === "") {
        return false
    } else {
        let userRoom = await getObjs.getUserRoomByUserId(userId)
        const commandArray = await splitCommands(userCom, userId, userRoom)
        return commandArray
    }
}

async function splitCommands(userCom, userId, roomName) {
    // splits a user input into an array of strings
    userCom = userCom.toLowerCase(); //to lower case
    userCom = userCom.replace(/ +(?= )/g,'').trim(); //convert multiple space to one. trim whitespace
    userCom = userCom.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");   //remove punctuation
    userCom = userCom.replace(" the "," ").replace(" an ", " ").replace(" a ", " ");  //remove articles
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
    const userDbId = await getObjs.getUserDbIdByUserId(userId)
    // examine commands
    if (action === "x" | action === "examine" && comArr[1]) {
        const objString = userCom.substr(userCom.indexOf(" ") + 1) // Need to do this to convert multi-word descriptions
        let output = await examineObject(roomName, userDbId, objString)
        return output
    } else if (action === "x" | action === "examine" && comArr.length === 1) {
        return "Please specify something to examine."
    } 

    // take commands
    if (action === "take" && comArr[1]) {
        let output = await takeObject(roomName, userId, comArr[1])
        return output
    } else if (action === "take" && comArr.length === 1) {
        return "Please specify something to take."
    } 
        
    return textHelpers.capitalizeFirstLetter(comArr[0] + " is not a relevant command right now.")
}

module.exports = {
    command
}