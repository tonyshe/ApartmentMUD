import React, { useEffect } from 'react'
import socketIOClient from "socket.io-client"

function ChatWindow({ username, userId }) {
    const ENDPOINT = "http://" + global.serverName + ":4000"
    const socket = socketIOClient(ENDPOINT);

    async function commandSubmit(e) {
        e.preventDefault();
        const message = e.target[0].value
        e.target.reset()
        socket.emit('chat message', [message, username, userId])
        let messageDiv = document.getElementById('chatbox')
        messageDiv.scrollTo({ behavior: "smooth", top: messageDiv.scrollHeight })
    }

    function newMessage(msg) {
        //Adds new div to HTML body to display messages
        let messages = document.getElementById("chatbox");
        let newDiv = document.createElement('div');
        newDiv.innerHTML = msg

        //Create new div to append to MESSAGEBOX
        newDiv.className = "message";
        messages.appendChild(newDiv);
    }

    useEffect(() => {
        socket.on("chat reply", (msg) => {

            // determine if the user was at the bottom of the page before a new message is given
            let atBottom = false
            // add new message
            let messageDiv = document.getElementById('chatbox')
            if (messageDiv.scrollTop + messageDiv.offsetHeight > messageDiv.scrollHeight - 50) { atBottom = true }
            newMessage(msg);
            if (atBottom) {
                messageDiv.scrollTo({ behavior: "smooth", top: messageDiv.scrollHeight })
            }
        })
    })

    useEffect(() => {
        socket.on("disconnect", (e) => {
            document.getElementById('chatinput').remove()
            socket.disconnect()
        })
    })

    return (
        <div className="chatwindow" id="chatbox">
            <form className="submitform" id="chatinput" action="" autoComplete="off" onSubmit={commandSubmit}>
                <b>&gt;&gt;</b>
                <input
                    className="inputForm"
                    size={48}
                    type="text"
                    placeholder='Enter a command or type "help"'
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = "Say something"}
                >
                </input>
            </form>
        </div>
    )
}

export default ChatWindow