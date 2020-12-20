const getObjs = require("../objectFunctions/GetObjectFunctions")
const textHelpers = require("../helperFunctions/textHelpers")

const describeFunctions = {
    "baseDescribe": (obj) => {return obj.description}
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
            for (let i = 0; i < importantObjs.length-1; i++) {
                outString +=addArticle(importantObjects[i].names[0]) + ", ";
            };
            outString += "and " + addArticle(importantObjects[i].names[0]) + " ";
            outString += "are in the room.";
        }
        return 
    },
    "alexRoomLook": () => {
        return "Alex's main studio room. There is a bed in the corner, with a nightstand next to it. Along the wall is a brown leather couch. In the middle of the room is a coffee table and a large bean bag chair. There are a few windows on the opposite wall and a small book shelf. Around the corner is the kitchen area. To the other side is the entrance to the walk-in closet and bathroom."
    }
}

module.exports = {
    describeFunctions,
    lookFunctions
}