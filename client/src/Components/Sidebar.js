import React, { useEffect } from 'react'
import ChatWindow from './ChatWindow'
import UserLog from './UserLog'
import './Styles/Sidebar.css'

function Sidebar({username, userId}) {
    return (
        <div className="sidebar">
            Chat
            <UserLog />
            <ChatWindow username={username} userId={userId} />
        </div>
    )
}

export default Sidebar