import './App.css';
import socketIOClient from "socket.io-client"
import React, { useState, useEffect } from 'react'
import MudInterface from './Components/MudInterface'
import SplashScreen from './Components/SplashScreen'

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
			<MudInterface username={user} userId={userId}/>
		);
	} else {
		return (
			<SplashScreen mudLogin={mudLogin} />
		)
	}
}


export default App;
