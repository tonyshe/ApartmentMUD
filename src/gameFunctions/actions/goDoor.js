const { get } = require("mongoose")
const getObjs = require("../objectFunctions/getObjectFunctions")
const moveObjs = require("../objectFunctions/moveObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const textHelpers = require("../helperFunctions/textHelpers")
const {lookFunctions} = require("../describeFunctions/describeFunctions")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")
const MongoClient = require('mongodb').MongoClient

async function goDoor(roomName, userId, comArr) {
    /**
     * Moves the user through a door if it's open
     * TO-DO add message for the people in the other room
     * @param {String} roomName - room db name that the user and door are in
     * @param {String} userId - user id of the user
     * @param {[String]} comArr - Array of text commands from the user
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */

    if (comArr.length === 1) {
        return { ["Please specify where to go."]: [userId] }
    }
    
    const doorName = comArr.slice(1).join(" ")

    const client = await mongoDbClient()
    let doors = await getObjs.getAllDoorsInRoom(client, roomName)
    

    doors = doors.filter((door) => {
        const doorNamesLowercase = door.names.map((doorname) => {return doorname.toLowerCase()}) 
        return doorNamesLowercase.includes(doorName.toLowerCase()) 
    })
    if (doors.length > 1) {
        // more than one door by that name
        await client.close()
        return { ['There are more than one thing by the name ' + '"' + doorName + '." Please be more specific as to which one you mean.']: [userId] }
    } else if (doors.length === 0) {
        // no door
        await client.close()
        return { ["You don't see that."]: [userId] }
    } else if (doors.length === 1) {
        let door = doors[0]
        if (door.locked) {
            await client.close()
            return { ["It's locked."]: [userId] }
        } else if (door.closed) {
            await client.close()
            return { ["It's closed. You should open it first."]: [userId] }
        } else {
            // user goes through the door
            let toRoomName = door.toRoom
            await moveObjs.moveUserIdToAnotherRoom(client, userId, toRoomName)
            // kind of janky. expects at least 2 names, with the first being the common name of the door
            // and the second name being the common name of the destination.

            // get list of userids of everyone else in the room
            let userIdList = await getUsers.getAllUserIdsInRoom(client, roomName)
            userIdList = userIdList.filter((id) => { return id != userId })
            const userName = await getUsers.getUserNameByUserId(client, userId)

            // get list of userids of everyone in destination room 
            let userIdListDestination = await getUsers.getAllUserIdsInRoom(client, toRoomName)
            userIdListDestination = userIdListDestination.filter((id) => { return id != userId })
            
            const newRoomObj = await getObjs.getRoomObjByRoomName(client, toRoomName)
            const roomDescribe = await lookFunctions[newRoomObj.look](userId, newRoomObj)
            const roomTitle = textHelpers.capitalizeFirstLetter(newRoomObj.roomTitle)
            await client.close()
            return {
                ["You go " + door.preposition + " the " + door.names[0] + " to the " + door.names[1] + ". \
                <br><br><b>" + roomTitle + "</b><br>" + roomDescribe]: [userId],
                [textHelpers.capitalizeFirstLetter(userName + " goes " + door.preposition + " the " + door.names[0] + " to the " + door.names[1] + ".")]: userIdList,
                [textHelpers.capitalizeFirstLetter(userName + " comes " + door.preposition + " the " + door.names[0] + " to the " + door.names[1] + '.')]: userIdListDestination,
            }
        }
    }
}

module.exports = {
    goDoor
}