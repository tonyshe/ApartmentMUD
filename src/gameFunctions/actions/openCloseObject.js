const getObjs = require("../objectFunctions/GetObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const textHelpers = require("../helperFunctions/textHelpers")

async function openContainer(roomName, containerObjName, userId) {
    const containerObjs = await getObjs.getAllVisibleObjsInRoomByName(containerObjName, roomName)

    if (containerObjs.length === 0) {
        return { ["You don't see that."]: [userId] }
    } else if (containerObjs.length > 1) {
        return { ['There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.']: [userId] }
    } else if (containerObjs.length === 1) {
        const containerObj = containerObjs[0]
        if (!containerObj.closeable) {
            return {["That can't be opened."]:[userId]}
        }
        if (containerObj.open) {
            return { ["It's already open."]: [userId] }
        }
        else if (containerObj.locked) {
            return { ["It's locked."]: [userId] }
        } else {
            for (let i = 0; i < containerObj.contains.length; i++) {
                // set all things inside as visible
                await setObjs.setObjectPropertyByDbIdAndRoomName(containerObj.contains[i]._id, roomName, 'visible', true)

                // set container to open
                await setObjs.setObjectPropertyByDbIdAndRoomName(containerObj._id, roomName, 'open', true)
            }

            // get list of userids of everyone else in the room
            let userIdList = await getUsers.getAllUserIdsInRoom(roomName)
            userIdList = userIdList.filter((id) => { return id != userId })
            const userName = await getUsers.getUserNameByUserId(userId)

            // construct a sentence to describe what is inside
            const nameArray = containerObj.contains.map((obj) => { return obj.names[0] })
            const wordList = textHelpers.objLister(nameArray)
            let outString = "You open the " + containerObjName + "."
            if (wordList[1] != '') {
                outString += ' It reveals ' + wordList[0] + '.';
            };

            return {
                [outString]: [userId],
                [userName + " opens the " + containerObjName + "."]: [userIdList]
            }
        }
    }
}

async function closeContainer(roomName, containerObjName, userId) {
    // get container obj
    const containerObjs = await getObjs.getAllVisibleObjsInRoomByName(containerObjName, roomName)

    if (containerObjs.length === 0) {
        return { ["You don't see that."]: [userId] }
    } else if (containerObjs.length > 1) {
        return { ['There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.']: [userId] }
    } else if (containerObjs.length === 1) {
        const containerObj = containerObjs[0]
        if (!containerObj.open) {
            return { ["It's already closed."]: [userId] }
        } else if (!containerObj.closeable) {
            return { ["That can't be closed."]: [userId] }
        } else {
            for (let i = 0; i < containerObj.contains.length; i++) {
                // set all things inside as not visible
                await setObjs.setObjectPropertyByDbIdAndRoomName(containerObj.contains[i]._id, roomName, 'visible', false)

                // set container to closed
                await setObjs.setObjectPropertyByDbIdAndRoomName(containerObj._id, roomName, 'open', false)
            }

            // get list of userids of everyone else in the room
            let userIdList = await getUsers.getAllUserIdsInRoom(roomName)
            userIdList = userIdList.filter((id) => { return id != userId })
            const userName = await getUsers.getUserNameByUserId(userId)

            return {
                ["You close the " + containerObjName + "."]: [userId],
                [userName + " closes the " + containerObjName + "."]: [userIdList]
            }
        }
    }
}


module.exports = {
    openContainer,
    closeContainer
}