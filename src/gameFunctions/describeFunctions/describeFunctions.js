const getObjs = require("../objectFunctions/GetObjectFunctions")
const textHelpers = require("../helperFunctions/textHelpers")
const { text } = require("express")

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
    }
}

const lookFunctions = {
    "baseRoomLook": async (roomObj) => {
        let importantObjs = await getObjs.getAllImportantObjectsInRoom(roomObj.roomName)
        let outString = ""
        if (importantObjs.length === 0) {
            outString = "There is nothing in the room."
        } else if (importantObjs.length === 1) {
            outString = textHelpers.addArticle(importantObjs[0].names[0] + " is in the room")
        } else {
            for (let i = 0; i < importantObjs.length - 1; i++) {
                outString += addArticle(importantObjects[i].names[0]) + ", ";
            };
            outString += "and " + addArticle(importantObjects[i].names[0]) + " ";
            outString += "are in the room.";
        }
        return
    },
    "bedroomLook": () => {
        return "Alex's main studio room. There is a bed in the corner, with a nightstand next to it. Along the wall is a brown leather couch. In the middle of the room is a coffee table and a large bean bag chair. There are a few windows on the opposite wall and a small book shelf. Around the corner is the kitchen area. To the other side is the entrance to the walk-in closet and bathroom."
    }
}

module.exports = {
    describeFunctions,
    lookFunctions
}