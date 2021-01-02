const getObjs = require("../objectFunctions/getObjectFunctions")
const setObjs = require("../objectFunctions/setObjectFunctions")
const getUsers = require("../userFunctions/getUserFunctions")
const textHelpers = require("../helperFunctions/textHelpers")
const {mongoDbClient} = require("../../backendFunctions/mongoHelpers")

async function openContainer(roomName, userId, comArr) {
    /**
     * Opens a container, if allowed. sets all things inside to visible
     * @param {String} roomName - db name of the room
     * @param {[String]} comArr - Array of text commands from the user
     * @param {String} userId - ID of the user doing the action
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */

    if (comArr.length === 1) {
        return { ["Please specify something to open."]: [userId] }
    }

    const containerObjName = comArr.slice(1).join(" ")

    // get container obj
    const client = await mongoDbClient()
    const containerObjs = await getObjs.getAllVisibleObjsInRoomByName(client, containerObjName, roomName)
    

    if (containerObjs.length === 0) {

        await client.close()
        return { ["You don't see that."]: [userId] }
    } else if (containerObjs.length > 1) {
        await client.close()
        return { ['There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.']: [userId] }
    } else if (containerObjs.length === 1) {
        const containerObj = containerObjs[0]
        if (!containerObj.closeable) {
            await client.close()
            return { ["That can't be opened."]: [userId] }
        }
        if (containerObj.open) {
            await client.close()
            return { ["It's already open."]: [userId] }
        }
        else if (containerObj.locked) {
            await client.close()
            return { ["It's locked."]: [userId] }
        } else {
            if (containerObj.hidesContents) {
                for (let i = 0; i < containerObj.contains.length; i++) {
                    // set all things inside as visible
                    await setObjs.setObjectPropertyByDbIdAndRoomName(client, containerObj.contains[i]._id, roomName, 'visible', true)
                }
            }

            // set container to open
            await setObjs.setObjectPropertyByDbIdAndRoomName(client, containerObj._id, roomName, 'open', true)

            // get list of userids of everyone else in the room
            let userIdList = await getUsers.getAllUserIdsInRoom(client, roomName)
            userIdList = userIdList.filter((id) => { return id != userId })
            const userName = await getUsers.getUserNameByUserId(client, userId)

            // construct a sentence to describe what is inside
            const nameArray = containerObj.contains.map((obj) => { return obj.names[0] })
            const wordList = textHelpers.objLister(nameArray)
            let outString = "You open the " + containerObjName + "."
            if (wordList[1] != '' && containerObj.hidesContents) {
                outString += ' It reveals ' + wordList[0] + '.';
            };
            await client.close()
            return {
                [outString]: [userId],
                [userName + " opens the " + containerObjName + "."]: userIdList
            }
        }
    }
}

async function closeContainer(roomName, userId, comArr) {
    /**
     * Closes a container, if allowed. sets all things inside to not visible
     * @param {String} roomName - db name of the room
     * @param {[String]} comArr - Array of text commands from the user
     * @param {String} userId - ID of the user doing the action
     * @return {String: [String]} - Obj containing message: [userid] keypairs. consumed by the socket handler to give custom messages to users
     */

    if (comArr.length === 1) {
        return { ["Please specify something to " + comArr[0] + "."]: [userId] }
    }
    const containerObjName = comArr.slice(1).join(" ")

    // get container obj
    const client = await mongoDbClient()
    const containerObjs = await getObjs.getAllVisibleObjsInRoomByName(client, containerObjName, roomName)


    if (containerObjs.length === 0) {
        await client.close()
        return { ["You don't see that."]: [userId] }
    } else if (containerObjs.length > 1) {
        await client.close()
        return { ['There are more than one thing by the name ' + '"' + containerObjName + '." Please be more specific as to which one you mean.']: [userId] }
    } else if (containerObjs.length === 1) {
        const containerObj = containerObjs[0]
        if (!containerObj.open) {
            await client.close()
            return { ["It's already closed."]: [userId] }
        } else if (!containerObj.closeable) {
            await client.close()
            return { ["That can't be closed."]: [userId] }
        } else {
            if (containerObj.hidesContents) {
                for (let i = 0; i < containerObj.contains.length; i++) {
                    // set all things inside as not visible
                    await setObjs.setObjectPropertyByDbIdAndRoomName(client, containerObj.contains[i]._id, roomName, 'visible', false)
                }
            }

            // set container to closed
            await setObjs.setObjectPropertyByDbIdAndRoomName(client, containerObj._id, roomName, 'open', false)

            // get list of userids of everyone else in the room
            let userIdList = await getUsers.getAllUserIdsInRoom(client, roomName)
            userIdList = userIdList.filter((id) => { return id != userId })
            const userName = await getUsers.getUserNameByUserId(client, userId)
            await client.close()
            return {
                ["You close the " + containerObjName + "."]: [userId],
                [userName + " closes the " + containerObjName + "."]: userIdList
            }
        }
    }
}

module.exports = {
    openContainer,
    closeContainer
}