// imports
const MongoClient = require('mongodb').MongoClient;
const scriptHelpers = require("./gameFunctions/helperFunctions/scriptHelpers")
const { setupSocket } = require("./socket/socketSetup")

// game objects
const { createBaseObject } = require("./gameObjects/basicObject");
const { createRoomObject } = require("./gameObjects/roomObject")

// aux functions
const { sleep } = require('./gameFunctions/helperFunctions/textHelpers')

async function dropAllRoomDbs(roomDbs) {
	const baseUrl = "mongodb://127.0.0.1:27017/"
	for (let i = 0; i < roomDbs.length; i++) {
		let url = baseUrl + roomDbs[i]
		let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		let dbo = client.db(roomDbs[i]);
		dbo.dropDatabase(async function (err, delOK) {
			if (err) throw err;
			if (delOK) console.log("  -Collection deleted: " + roomDbs[i]);
			await client.close();
		})
	}
}

async function dropAllUserInventories() {
	// ugh basically does the same thing as drop all room dbs but this parses the db list for the string "userInventory_"
	const baseUrl = "mongodb://127.0.0.1:27017/"
	let client = await MongoClient.connect(baseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	let db_list = await client.db().admin().listDatabases()
	await client.close()
	let db_filtered_list = db_list.databases
	db_filtered_list = db_filtered_list.filter((item) => { return item.name.includes("userInventory_") })
		.map((db) => { return db.name })

	for (let i = 0; i < db_filtered_list.length; i++) {
		let url = baseUrl + db_filtered_list[i]
		let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		let dbo = client.db(db_filtered_list[i]);
		dbo.dropDatabase(async function (err, delOK) {
			if (err) throw err;
			if (delOK) console.log("  -Collection deleted: " + db_filtered_list[i]);
			await client.close();
		})
	}
}

// Setup environment
async function envSetup() {
	console.log("Cleaning up user inventories")
	await dropAllUserInventories()
	// Clean up databases
	console.log("Cleaning up databases")
	const roomDbs = ['userIdMap', 'adventureRoom', 'orphanedObjs']
	await dropAllRoomDbs(roomDbs)


	console.log("Creating world...")
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
		names: ["coffee table", "table", "ikea table"],
		description: "A small IKEA coffee table.",
		takeable: true
	})

	// socketsss
	await setupSocket()
}

envSetup()
