import './App.css';
import socketIOClient from "socket.io-client"
import React, { useState, useEffect } from 'react'
import MudInterface from './Components/MudInterface'
import SplashScreen from './Components/SplashScreen'
import Sidebar from './Components/Sidebar'

export function useForceUpdate() {

}

function App() {
	const [user, setUser] = useState("")
	const [userId, setUserId] = useState("")
	const [splashBool, setSplashBool] = useState(true)

	function mudLogin(username, userId) {
		setUser(username)
		setUserId(userId)
		setSplashBool(false)
	}

	if (!splashBool) {
		return (
			<section className="gamecontainer">
				<MudInterface username={user} userId={userId} />
				<Sidebar username={user} userId={userId} />
			</section>
		);
	} else {
		return (
			<SplashScreen mudLogin={mudLogin} />
		)
	}
}


export default App;
