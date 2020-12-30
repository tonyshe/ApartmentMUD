const app = require('express')();
const cors = require('cors')
const express = require('express');
const path = require('path')
const http = require('http').createServer(app);
const options = { cors: true }
const io = require('socket.io')(http, options);
const { create } = require('domain');
const { command } = require("../gameFunctions/commandFunctions/command")
const { createPerson, deletePerson } = require("../gameObjects/personObject")
const { makeRandomWord } = require("../gameFunctions/helperFunctions/gameHelpers")
const fetch = require("node-fetch")
const getObjs = require('../gameFunctions/objectFunctions/getObjectFunctions')
const textHelpers = require("../gameFunctions/helperFunctions/textHelpers")

async function setupSocket() {

    await io.on('connection', async (socket) => {
        await socket.on('userinfo', async (userInfo) => {
            const userId = userInfo[0]
            const userName = userInfo[1].toLowerCase()
            console.log('User logon and Id created: ' + userId)
            socket.userId = userId
            await socket.join('lobby')
            socket.room = "lobby"
            await createPerson({
                roomName: "mud_bedroom",
                names: [userName, "person"],
                userName: userName,
                description: "It's your friend " + textHelpers.capitalizeFirstLetter(userName) + ".",
                userId: userId
            })
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
                await deletePerson(socket.userId)
                socket.userId = ""
            }
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
