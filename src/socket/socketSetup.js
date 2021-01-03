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
const { lookFunctions } = require("../gameFunctions/describeFunctions/describeFunctions")
const { helpResponse } = require("../gameFunctions/actions/showHelp")
const Queue = require("bee-queue");
const { sleep } = require('../gameFunctions/helperFunctions/scriptHelpers')
const { mongoDbClient } = require("../backendFunctions/mongoHelpers");

// Setup bee-queue for commands
const queueConfig = { redis: process.env.REDIS_ADDRESS || "http://127.0.0.1:6379" }
const commandQueue = new Queue('command', queueConfig)
commandQueue.process(async (job, done) => {
    console.log("\x1b[36m", job.data.userId + ": " + job.data.command,)
    let returnMsg = await command(job.data.command, job.data.userId)
    let returnMsgList = Object.entries(returnMsg)
    for (let i = 0; i < returnMsgList.length; i++) {
        for (let j = 0; j < returnMsgList[i][1].length; j++) {
            await io.to(returnMsgList[i][1][j]).emit('response message', returnMsgList[i][0])
        }
    };
})

commandQueue.on('failed', (err) => {
    console.log(`A queue error happened: ${err.options.stacktraces}`);
});

// setup bee-queue for user creation
const userCreateQueue = new Queue('userCreate', queueConfig)
userCreateQueue.process(async (job, done) => {
    await createPerson(job.data)
})

userCreateQueue.on('failed', (err) => {
    console.log(`A queue error happened: ${err.options.stacktraces}`);
});

// setup bee-queue for chat
const chatQueue = new Queue('chat', queueConfig)
chatQueue.process(async (job, done) => {
    const client = await mongoDbClient()
    console.log(job.data.userId)
    getUsers.get
    const roomName = await getUsers.getUserRoomFriendlyNameByUserId(client, job.data.userId)
    const roomObj = await getObjs.getRoomObjByRoomName(client, roomName)
    client.close()
    const chatString = "<b>" + textHelpers.capitalizeFirstLetter(job.data.userName) + " (" + roomObj.roomTitle + "): </b>" + job.data.message
    await io.emit('chat reply', chatString)
})

chatQueue.on('failed', (err) => {
    console.log(`A queue error happened: ${err.options.stacktraces}`);
});


async function setupSocket() {
    await io.on('connection', async (socket) => {
        await socket.on('userinfo', async (userInfo) => {
            const userId = userInfo[0]
            const userName = userInfo[1].toLowerCase()
            console.log('User logon and Id created: ' + userId)
            socket.userId = userId

            await socket.join(userId)
            socket.room = "lobby"
            io.to('lobby').emit('response', textHelpers.capitalizeFirstLetter(userName) + " has connected.")
            await socket.join('lobby')

            await userCreateQueue.createJob({
                roomName: "mud_bedroom",
                names: [userName, "person"],
                userName: userName,
                description: "It's your friend " + textHelpers.capitalizeFirstLetter(userName) + ".",
                userId: userId
            }).save()
            const client = await mongoDbClient()
            await sleep(500)
            const roomObj = await getObjs.getRoomObjByRoomName(client, "mud_bedroom")
            const roomDescribe = await lookFunctions[roomObj.look](userId, roomObj)
            const message = "<br><b>" + textHelpers.capitalizeFirstLetter(roomObj.roomTitle) + "</b><br>" + roomDescribe
            io.to(userId).emit('response message', helpResponse)
            io.to(userId).emit('response message', message)
            await client.close()
        });

        await socket.on('command message', async (msg) => {
            // msg is an array of [user submitted message, userid]
            // send command to bee-queue
            const cmdMessage = msg[0].replace(/</g, "&lt;").replace(/>/g, "&gt;")
            await commandQueue.createJob({ command: cmdMessage, userId: msg[1] }).save()
        });

        await socket.on('chat message', async (msg) => {
            // msg is an array of [user submitted message, username, userid]
            // send command to bee-queue
            const chatMessage = msg[0].replace(/</g, "&lt;").replace(/>/g, "&gt;")
            await chatQueue.createJob({ message: chatMessage, userName: msg[1], userId: msg[2] }).save()
        });

        await socket.on('disconnect', async () => {
            if (socket.userId) {
                console.log('user disconnected: ' + socket.userId);
                const client = await mongoDbClient()
                const userName = await getUsers.getUserNameByUserId(client, socket.userId)
                await io.to('lobby').emit('response message', textHelpers.capitalizeFirstLetter(userName) + " has disconnected.")

                // move all items in user inventory to ground
                const userInv = await getObjs.getAllObjectsInInventory(client, socket.userId)
                const roomName = await getUsers.getUserRoomByUserId(client, socket.userId)

                const floorObjList = await getObjs.getAllObjsByNameInRoom(client, "floor", roomName)

                let floorObj = floorObjList[0]
                for (let i = 0; i < userInv.length; i++) {
                    // Add items to floor container
                    await floorObj.contains.push(userInv[i])
                    await setObjs.setObjectPropertyByDbIdAndRoomName(client, floorObj._id, roomName, 'contains', floorObj.contains)
                    // set items as visible
                    await setObjs.setObjectPropertyByDbIdAndRoomName(client, userInv[i]._id, "userInventory_" + socket.userId, 'visible', true)
                    // move items from user inventory to room 
                    await moveObjs.moveObjectToAnotherDb(client, userInv[i]._id, "userInventory_" + socket.userId, roomName)
                    // add container obj id to floors "inside" property
                    await setObjs.setObjectPropertyByDbIdAndRoomName(client, userInv[i]._id, roomName, 'inside', String(floorObj._id))
                }

                // Delete person
                await deletePerson(client, socket.userId)
                await client.close()
                await socket.leave(socket.userId)
                socket.userId = ""
            }

            // remove socket from the socket room
            await socket.leave(socket.room);
            await socket.disconnect()
        });

        await socket.on('userquery', async (queryInfo) => {
            const client = await mongoDbClient()
            const userObjList = await getObjs.getAllPeopleInRoom(client, "mud_bedroom")
            const userNameList = userObjList.map((obj) => { return obj.names[0] })
            if (userNameList.includes(queryInfo[0].toLowerCase())) {
                await io.emit('query_' + queryInfo[1], 'duplicate')
            } else {
                await io.emit('query_' + queryInfo[1], 'no_duplicate')
            }
            await client.close()
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
