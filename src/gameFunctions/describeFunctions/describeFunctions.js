const getObjs = require("../objectFunctions/getObjectFunctions")
const textHelpers = require("../helperFunctions/textHelpers")
const getUsers = require("../userFunctions/getUserFunctions")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")
const { mongo } = require("mongoose")

const describeFunctions = {
    "baseDescribe": (obj) => { return obj.description },
    "containerDescribe": (obj) => {
        let outString = obj.description
        if (obj.closeable) {
            if (obj.open) {
                var openString = ' open.'
            }
            else {
                var openString = ' closed.'
            };
            outString += ' It is currently ' + openString;
        }

        if (obj.open) {
            const nameArray = obj.contains.map((obj) => { return obj.names[0] })
            const wordList = textHelpers.objLister(nameArray)
            if (wordList[1] != '') {
                outString += ' ' + textHelpers.capitalizeFirstLetter(wordList[0] + ' ' + wordList[1] + ' ' + obj.preposition + ' the ' + obj.names[0] + '.');
            };
        };

        return outString
    },

    "futonDescribe": (obj) => {
        let outString = obj.description
        if (obj.closeable) {
            if (obj.open) {
                var openString = ' configured as a bed.'
            }
            else {
                var openString = ' configured as a sofa.'
            };
            
            outString += ' It is currently ' + openString;
        }

        const nameArray = obj.contains.map((obj) => { return obj.names[0] })
        const wordList = textHelpers.objLister(nameArray)
        if (wordList[1] != '') {
            outString += ' ' + textHelpers.capitalizeFirstLetter(wordList[0] + ' ' + wordList[1] + ' ' + obj.preposition + ' the ' + obj.names[0] + '.');
        };

        return outString
    }
}

const lookFunctions = {
    "defaultLook": async (userId, roomObj) => {
        const client = await mongoDbClient()
        let outString = roomObj.description
        // listing important objects
        const importantObjs = await getObjs.getAllImportantObjectsInRoom(client, roomObj.roomName)
        const importantObjsNameArray = importantObjs.map((obj) => { return obj.names[0] })
        const wordList = textHelpers.objLister(importantObjsNameArray)
        if (wordList[1] != '') {
            outString += ' ' + textHelpers.capitalizeFirstLetter(wordList[0] + ' ' + wordList[1] + ' ' + ' in the ' + roomObj.names[0] + '.');
        };

        const peopleObjArray = await getObjs.getAllPeopleInRoom(client, roomObj.roomName)
        const userName = await getUsers.getUserNameByUserId(client, userId)
        const peopleNamesArray = await peopleObjArray.map((obj) => { return obj.names[0] })
        const otherPeopleNamesArray = await peopleNamesArray.filter((name) => { return (name != userName) })
        if (otherPeopleNamesArray.length > 0) {
            const peopleWordList = textHelpers.objLister(otherPeopleNamesArray, article = false)
            if (peopleWordList[1] != '') {
                outString += ' ' + textHelpers.capitalizeFirstLetter(peopleWordList[0] + ' ' + peopleWordList[1] + ' ' + ' also in the ' + roomObj.names[0] + '.');
            };
        }
        
        const floor = await getObjs.getAllObjsByNameInRoom(client, "floor", roomObj.roomName)
        const floorObjs = floor[0].contains
        if (floorObjs.length > 0) {
            const floorObjNames = floorObjs.map((obj) => { return obj.names[0] })
            const floorWordList = textHelpers.objLister(floorObjNames)
            outString += ' ' + textHelpers.capitalizeFirstLetter(floorWordList[0] + ' ' + floorWordList[1] + ' on the ' + floor[0].names[0] + '.')
        }
        client.close()
        return outString
    }
}

module.exports = {
    describeFunctions,
    lookFunctions
}