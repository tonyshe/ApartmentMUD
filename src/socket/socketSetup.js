const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { create } = require('domain');
const { command } = require("../gameFunctions/commandFunctions/command")
const {createPerson, deletePerson} = require("../gameObjects/personObject")
const {makeRandomWord} = require("../gameFunctions/helperFunctions/gameHelpers")
const fetch = require("node-fetch")


async function setupSocket() {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    
    await io.on('connection', async (socket) => {
        await socket.on('userId', async (userId) => {
            console.log('User logon and Id created: ' + userId)
            socket.userId = userId
            await socket.join('lobby')
            socket.room = "lobby"
            const randomNameArrayRaw = await fetch('http://names.drycodes.com/1')
            const randomNameArray = await randomNameArrayRaw.json()
            const randomName = randomNameArray[0]
            // const randomName = await makeRandomWord(6)
            await createPerson({
                roomName: "mud_bedroom", 
                names: [randomName, "person"], 
                userName: randomName,
                description: "It's your friend " + randomName + ".", 
                userId: userId
            })
        });

        await socket.on('chat message', async (msg) => {
            // msg is an array of [user submitted message, userid]
            let returnMsg = await command(msg[0], socket.userId)
            let returnMsgList = Object.entries(returnMsg)
            for (let i=0; i < returnMsgList.length; i++) {
                for (let j=0; j < returnMsgList[i][1].length; j++) {
                    await io.emit('chat message_'+returnMsgList[i][1][j] , returnMsgList[i][0])
                }
            };
        });

        await socket.on('disconnect', async (msg) => {
            console.log('user disconnected: ' + socket.userId);
            // socket.broadcast.to(socket.room).emit(socket.userId)
            await deletePerson(socket.userId)
            await socket.leave(socket.room);
        });
    });

    http.listen(3000, () => {
        console.log('-----')
        console.log('listening on *:3000')
        console.log('-----')
    });
}

module.exports = {
    setupSocket
}
