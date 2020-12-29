import socketIOClient from "socket.io-client"
import React, { useState, useEffect } from 'react'


function MudInterface({ username, userId }) {
    const ENDPOINT = "http://localhost:4000"
    const socket = socketIOClient(ENDPOINT);

    useEffect(() => {
            socket.on('connect', () => {
                console.log("attempting to connect")
                socket.emit('userinfo', [userId, username])
            })

    })

    useEffect(() => {
        socket.on('chat message_' + userId, function (msg) {
            // determine if the user was at the bottom of the page before a new message is given
            let atBottom = false
            // add new message
            newMessage(msg);
            window.scrollTo({ behavior: "smooth", top: window.height })
        });
    })

    useEffect(() => {
        socket.on("disconnect", (e) => {
            newMessage("<p style='background-color:salmon;'><b>You have been disconnected. Please refresh.</b></p>");
            document.getElementById('command').remove()
            socket.disconnect()
        })
    })

    useEffect(() => {
        socket.on('chat message', function (msg) {
            newMessage(msg);
        });
    })

    async function commandSubmit(e) {
        e.preventDefault();
        const message = e.target[0].value
        e.target.reset()
        socket.emit('chat message', [message, userId])
        newMessage(">> " + message, true);
        window.scrollTo({ behavior: "smooth", top: window.height })
    }

    function newMessage(msg, grey = false) {
        //Adds new div to HTML body to display messages
        let messages = document.getElementById("messageBox");
        let newDiv = document.createElement('div');

        //Create new div to append to MESSAGEBOX
        newDiv.className = "message";
        messages.appendChild(newDiv);

        //Create new p to insert into MESSAGE
        let messageText = document.createElement('p');
        if (grey) { messageText.style.color = "grey" }

        messageText.innerHTML = msg;
        newDiv.appendChild(messageText);
    }

    return (
        <div>
            <div id="messageBox">
                <div className="message">
                    <p>
                        <b>Welcome to the ApartmentMUD!</b>
                        <br />
                        Enter a command or type "help" for a list of commands.
                    </p>
                    <br />
                    <hr />
                </div>
            </div>
            <form className="submitForm" id="command" action="" autoComplete="off" onSubmit={commandSubmit}>
                <b>&gt;&gt;</b>
                <input
                    size={64}
                    className="inputForm"
                    type="text"
                    id="userCom"
                    autoFocus
                    placeholder='Enter a command or type "help"'
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = "Enter a command or type 'help'"}
                >
                </input>
            </form>
        </div >
    );
}

export default MudInterface;
