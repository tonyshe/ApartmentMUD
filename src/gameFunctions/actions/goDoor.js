const { get } = require("mongoose")
const getObjs = require("../objectFunctions/getObjectFunctions")
const moveObjs = require("../objectFunctions/moveObjectFunctions")

async function goDoor(roomName, userId, doorName) {
    let doors = await getObjs.getAllDoorsInRoom(roomName)
    doors = doors.filter((door) => {return door.names.includes(doorName)})
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
            return "It's closed. You should open it first."
        } else {
            // user goes through the door
            let toRoomName = door.toRoom
            await moveObjs.moveUserIdToAnotherRoom(userId, toRoomName)
            // kind of janky. expects at least 2 names, with the first being the common name of the door
            // and the second name being the common name of the destination.
            return "You go through the " + door.names[0] + " to the " + door.names[1] + "."
        }
    }
}

module.exports = {
    goDoor
}