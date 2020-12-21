const { get } = require("mongoose")
const getObjs = require("../objectFunctions/getObjectFunctions")
const moveObjs = require("../objectFunctions/moveObjectFunctions")

async function goDoor(roomName, userId, doorName) {
    let doors = await getObjs.getAllDoorsInRoom(roomName)
    if (doors.length > 1) {
        // more than one door by that name
        return 'There are more than one thing by the name ' + '"' + doorName + '." Please be more specific as to which one you mean.'
    } else if (doors.length === 0) {
        // no door
        return 'No such thing exists.'
    } else if (doors.length === 1) {
        let door = doors[0]
        if (door.locked) {
            return "It's locked."
        } else if (door.closed) {
            return "It's closed. You should open it first"
        } else {
            // user goes through the door
            let toRoomName = door.toRoom
            await moveObjs.moveUserIdToAnotherRoom(userId, toRoomName)
            return "You go through the " + doorName
        }
    }
}

module.exports = {
    goDoor
}