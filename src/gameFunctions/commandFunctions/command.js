const { examineObject } = require('../actions/examineObject')
const { takeObject } = require('../actions/takeObject')
const textHelpers = require("../helperFunctions/textHelpers")
const {getUserDbIdByUserId} = require("../objectFunctions/getObjectFunctions")

async function command(userCom, userId) {
    // processes the user command
    if (userCom.trim() === "") {
        return false
    } else {
        const commandArray = await splitCommands(userCom, userId, "adventureRoom")
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
    let response = await executeCommandArray(splitCommands, userId, roomName)
    return response
}

async function executeCommandArray(comArr, userId, roomName) {
    const action = comArr[0]
    const userDbId = await getUserDbIdByUserId(userId)
    // examine commands
    if (action === "x" | action === "examine" && comArr[1]) {
        let output = await examineObject(roomName, userDbId, comArr[1])
        return output
    } else if (action === "x" | action === "examine" && comArr.length === 1) {
        return "Please specify something to examine."
    } 

    // take commands
    if (action === "take" && comArr[1]) {
        let output = await takeObject(roomName, userDbId, comArr[1])
        return output
    } else if (action === "take" && comArr.length === 1) {
        return "Please specify something to take."
    } 
        
    return textHelpers.capitalizeFirstLetter(comArr[0] + " is not a relevant command right now.")
}

module.exports = {
    command
}