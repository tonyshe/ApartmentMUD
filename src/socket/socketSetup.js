const app = require('express')();
const cors = require('cors')
const http = require('http').createServer(app);
const options = { cors: true }
const io = require('socket.io')(http, options);
const { command } = require("../gameFunctions/commandFunctions/command")
const { createPerson, deletePerson } = require("../gameObjects/personObject")
const getObjs = require('../gameFunctions/objectFunctions/getObjectFunctions')
const getUsers = require('../gameFunctions/userFunctions/getUserFunctions')
const setObjs = require('../gameFunctions/objectFunctions/setObjectFunctions')
const moveObjs = require('../gameFunctions/objectFunctions/moveObjectFunctions')
const textHelpers = require("../gameFunctions/helperFunctions/textHelpers")
const {putObjectAdmin} = require("../gameFunctions/actions/putObject")
const {lookFunctions} = require("../gameFunctions/describeFunctions/describeFunctions")

async function setupSocket() {

    await io.on('connection', async (socket) => {
        await socket.on('userinfo', async (userInfo) => {
            const userId = userInfo[0]
            const userName = userInfo[1].toLowerCase()
            console.log('User logon and Id created: ' + userId)
            socket.userId = userId
            await socket.join('lobby')
            socket.room = "lobby"
            io.emit('chat message', textHelpers.capitalizeFirstLetter(userName) + " has connected." )
            await createPerson({
                roomName: "mud_bedroom",
                names: [userName, "person"],
                userName: userName,
                description: "It's your friend " + textHelpers.capitalizeFirstLetter(userName) + ".",
                userId: userId
            })
            const roomObj = await getObjs.getRoomObjByRoomName("mud_bedroom")
            const roomDescribe = await lookFunctions[roomObj.look](userId, roomObj)
            const message = "<br><b>" + textHelpers.capitalizeFirstLetter(roomObj.roomTitle) + "</b><br>" + roomDescribe
            io.emit('chat message_' + userId, message)
        });

        await socket.on('chat message', async (msg) => {
            // msg is an array of [user submitted message, userid]
            let returnMsg = await command(msg[0], socket.userId)
            let returnMsgList = Object.entries(returnMsg)
            for (let i = 0; i < returnMsgList.length; i++) {
                for (let j = 0; j < returnMsgList[i][1].length; j++) {
                    await io.emit('chat message_' + returnMsgList[i][1][j], returnMsgList[i][0])
                }
            };
        });

        await socket.on('disconnect', async () => {
            if (socket.userId) {
                console.log('user disconnected: ' + socket.userId);
                const userName = await getUsers.getUserNameByUserId(socket.userId)
                await io.emit('chat message', textHelpers.capitalizeFirstLetter(userName) + " has disconnected." )
                
                // move all items in user inventory to ground
                const userInv = await getObjs.getAllObjectsInInventory(socket.userId)
                const roomName = await getUsers.getUserRoomByUserId(socket.userId)
                const floorObjList = await getObjs.getAllObjsByNameInRoom("floor", roomName)
                let floorObj = floorObjList[0]
                for (let i=0;i < userInv.length; i++) {
                    // Add items to floor container
                    await floorObj.contains.push(userInv[i])
                    await setObjs.setObjectPropertyByDbIdAndRoomName(floorObj._id, roomName, 'contains', floorObj.contains)  
                    // set items as visible
                    await setObjs.setObjectPropertyByDbIdAndRoomName(userInv[i]._id, "userInventory_" + socket.userId, 'visible', true)
                    // move items from user inventory to room 
                    await moveObjs.moveObjectToAnotherDb(userInv[i]._id, "userInventory_" + socket.userId, roomName)
                    // add container obj id to floors "inside" property
                    await setObjs.setObjectPropertyByDbIdAndRoomName(userInv[i]._id, roomName, 'inside', String(floorObj._id))
                }
                
                // Delete person
                await deletePerson(socket.userId)
                socket.userId = ""
            }

            // remove socket from the socket room
            await socket.leave(socket.room);
        });

        await socket.on('userquery', async (queryInfo) => {
            const userObjList = await getObjs.getAllPeopleInRoom("mud_bedroom")
            const userNameList = userObjList.map((obj) => {return obj.names[0]})
            if (userNameList.includes(queryInfo[0].toLowerCase())) {
                await io.emit('query_'+queryInfo[1], 'duplicate')
                console.log('query_'+queryInfo[1])
                console.log(userNameList)
            } else {
                await io.emit('query_'+queryInfo[1], 'no_duplicate')
            }
        });
    });

    app.use(cors())
    io.listen(4000, () => {
        console.log('-----')
        console.log('listening on *:4000')
        console.log('-----')
    });
}

module.exports = {
    setupSocket
}
