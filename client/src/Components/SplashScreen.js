import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import "./Styles/SplashScreen.css"


function SplashScreen({ mudLogin }) {
    const ENDPOINT = "http://" + global.serverName + ":4000"
    const socket = socketIOClient(ENDPOINT);
    const queryId = Math.random().toString(36).substring(2, 15)

    const [userName, setUserName] = useState("")
    const [userNameTaken, setUserNameTaken] = useState(false)
    const [warningText, setWarningText] = useState("")
    const [submitted, setSubmitted] = useState(false)

    function setUserData() {
        const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        socket.emit('userinfo', [userName, queryId])
        mudLogin(userName, userId)
    }

    async function sendUserNameForValidation(e) {
        e.preventDefault()
        if (userName.length < 3) {
            setWarningText('Username is too short!')
        } else if (userName.length > 25) {
            setWarningText('Username is too long!')
        } else {
            socket.emit('userquery', [userName, queryId])
        }
    }

    useEffect(() => {
        // submits user data for creation
        if (submitted) {
            setSubmitted(false)
            setUserData()
            socket.disconnect()
        }
    })

    useEffect(() => {
        if (userNameTaken) {
            setWarningText('Username is in use right now!')
        }
    })

    useEffect(() => {
        // if server verifise username, then logs the user in
        socket.on('query_' + queryId, async function (msg) {
            if (msg === "duplicate") {
                setUserNameTaken(true)
            } else {
                setSubmitted(true)
            }
        });
    })

    return (
        <div>
            <div className="center">
                <p>Welcome to the Adventure MUD! Please enter a username below.</p>
                <form
                    autoComplete="off"
                    value={userName}
                    onChange={e => {
                        setUserName(e.target.value)
                        setUserNameTaken(false)
                        setWarningText('')
                    }}
                    onSubmit={sendUserNameForValidation}>
                    <b>&gt;&gt;</b>
                    <input
                        className="inputForm"
                        type="text"
                        autoFocus
                        placeholder='Enter your username here'
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = "Enter your username here"}
                    />
                </form>
                <br />
                <button onClick={sendUserNameForValidation}>Enter Room</ button>
                <br />
                <p style={{ color: 'red' }}>{warningText}</p>
            </div>
        </div>
    )
}

export default SplashScreen