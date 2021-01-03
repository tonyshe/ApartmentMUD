import socketIOClient from "socket.io-client"
import React, { useEffect } from 'react'
import './Styles/MudInterface.css'


function MudInterface({ username, userId }) {
    const ENDPOINT = "http://" + global.serverName + ":4000"
    const socket = socketIOClient(ENDPOINT);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("attempting to connect")
            socket.emit('userinfo', [userId, username])
        })

    })

    useEffect(() => {
        socket.on("disconnect", (e) => {
            newMessage("<p style='background-color:salmon;'><b>You have been disconnected. Please refresh.</b></p>");
            document.getElementById('command').remove()
            socket.disconnect()
        })
    })

    useEffect(() => {
        socket.on('response message', function (msg) {
            // determine if the user was at the bottom of the page before a new message is given
            let atBottom = false
            // add new message
            let messageDiv = document.getElementById('messageBox')
            if (messageDiv.scrollTop + messageDiv.offsetHeight > messageDiv.scrollHeight - 50) { atBottom = true }
            newMessage(msg);
            if (atBottom) {
                messageDiv.scrollTo({ behavior: "smooth", top: messageDiv.scrollHeight })
            }
        });
    })

    async function commandSubmit(e) {
        e.preventDefault();
        const message = e.target[0].value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        e.target.reset()
        socket.emit('command message', [message, userId])
        newMessage(">> " + message, true);
        let messageDiv = document.getElementById('messageBox')
        messageDiv.scrollTo({ behavior: "smooth", top: messageDiv.scrollHeight })
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
        <div className="gamewindow">
            <div className="messagewindow" id="messageBox">
                <div className="message">
                    <p>
                        <b>Welcome to the interactive text adventure house!</b>
                        <br />
                        Enter a command or type "help" for a list of commands.
                    </p>
                    <hr />
                </div>
            </div>
            <form className="submitform" id="command" action="" autoComplete="off" onSubmit={commandSubmit}>
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