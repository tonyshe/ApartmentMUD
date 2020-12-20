const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { create } = require('domain');
const { command } = require("../commandFunctions/command")
const {createPerson, deletePerson} = require("../gameObjects/personObject")
const {makeRandomWord} = require("../helperFunctions/gameHelpers")

async function setupSocket() {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('userId', async (userId) => {
            console.log('User Id created: ' + userId)
            socket.userId = userId
            socket.join('lobby')
            socket.room = "lobby"
            console.log("lobby " + socket.userId)
            const randomName = makeRandomWord(6)
            await createPerson({
                roomName: "adventureRoom", 
                names: [randomName, "person"], 
                description: "It's your friend " + randomName, 
                userId: userId
            })
        });

        socket.on('chat message', async (msg) => {
            // msg is an array of [user submitted message, userid]
            let returnMsg = await command(msg[0])
            if (returnMsg) io.emit('chat message', returnMsg);
        });

        socket.on('disconnect', async (msg) => {
            console.log('user disconnected: ' + socket.userId);
            // socket.broadcast.to(socket.room).emit(socket.userId)
            await deletePerson(socket.userId)
            await socket.leave(socket.room);
        });
    });

    http.listen(3000, () => {
        console.log('listening on *:3000');
    });
}

module.exports = {
    setupSocket
}
