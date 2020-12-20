// imports
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const scriptHelpers = require("./helperFunctions/scriptHelpers")
const { setupSocket } = require("./socket/socketSetup")

// game objects
const { examineObject } = require('./actions/examineObject')
const { createBaseObject } = require("./gameObjects/basicObject");
const { createRoomObject } = require("./gameObjects/roomObject")
const { createPerson, deletePerson } = require("./gameObjects/personObject")

// aux functions
const { sleep } = require('./helperFunctions/textHelpers')

async function dropAllRoomDbs(roomDbs) {
	const baseUrl = "mongodb://127.0.0.1:27017/"
	for (let i = 0; i < roomDbs.length; i++) {
		let url = baseUrl + roomDbs[i]
		MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
			function (err, db) {
				if (err) throw err;
				var dbo = db.db(roomDbs[i]);
				dbo.dropDatabase(function (err, delOK) {
					if (err) throw err;
					if (delOK) console.log("Collection deleted: " + roomDbs[i]);
					db.close();
				});
			}
		)
	}
}

console.log("Cleaning up databases")
const roomDbs = ['userIdMap', 'adventureRoom', 'orphanedObjs']
dropAllRoomDbs(roomDbs)

// Setup environment
async function envSetup() {
	// Make a room
	await createRoomObject({
		roomName: "adventureRoom",
		names: ['studio', 'apartment', 'room'],
		description: "Hardwood floors and white painted walls. Located on the top floor of an apartment building on the corner of Howell and 12th.",
		look: 'alexRoomLook'
	})

	// Make base objects
	await createBaseObject({
		roomName: "adventureRoom",
		names: ["sandwich", "food"],
		description: "A yummy sandwich.",
		takeable: true
	})

	await createBaseObject({
		roomName: "adventureRoom",
		names: ["book", "novel"],
		description: "A hardback copy of Blowjobs: An Oral History.",
		takeable: true
	})

	// socketsss
	await setupSocket()
}

envSetup()
