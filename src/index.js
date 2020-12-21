// imports
const MongoClient = require('mongodb').MongoClient;
const scriptHelpers = require("./gameFunctions/helperFunctions/scriptHelpers")
const { setupSocket } = require("./socket/socketSetup")

// game objects
const { createBaseObject } = require("./gameObjects/basicObject");
const { createRoomObject } = require("./gameObjects/roomObject");
const { createDoorObjectPair } = require("./gameObjects/doorObject")

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

async function dropAllGameRooms() {
	// ugh basically does the same thing as drop all room dbs but this parses the db list for the string "mud_"
	const baseUrl = "mongodb://127.0.0.1:27017/"
	let client = await MongoClient.connect(baseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	let db_list = await client.db().admin().listDatabases()
	await client.close()
	let db_filtered_list = db_list.databases
	db_filtered_list = db_filtered_list.filter((item) => { return item.name.includes("mud_") })
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
	const roomDbs = ['userIdMap', 'orphanedObjs']
	await dropAllRoomDbs(roomDbs)
	await dropAllGameRooms()


	console.log("Creating world...")
	// Make rooms
	await createRoomObject(
		{
			roomName: "mud_bedroom",
			names: ['bedroom','room'],
			description: "A simple four-sided room and shag carpet.",
			look: 'bedroomLook'
		}
	)
	await createRoomObject(
		{
			roomName: "mud_hallway",
			names: ['hallway', 'corridor', 'hall'],
			description: "A small hallway connecting the bedroom, stairs, and bathroom.",
			look: 'bedroomLook'
		}
	)

	// Make doors
	await createDoorObjectPair(
		{
			names: ['door', 'bedroom door', 'hallway'],
			room: "mud_bedroom",
			description: "A door to the hallway.",
		},
		{
			names: ['bedroom', 'bedroom door', 'door'],
			room: "mud_hallway",
			description: "A door to the bedroom.",
		}
	)

	// Make base objects
	await createBaseObject({
		roomName: "mud_bedroom",
		names: ["sandwich", "food"],
		description: "A yummy sandwich.",
		takeable: true
	})
	await createBaseObject(
		{
			roomName: "mud_bedroom",
			names: ["popsicle", "ice cream", "food"],
			description: "A melting popsicle.",
			takeable: true
		}
	)
	await createBaseObject(
		{
			roomName: "mud_bedroom",
			names: ["coffee table", "table", "ikea table"],
			description: "A small IKEA coffee table.",
			takeable: false
		}
	)

	// socketsss
	await setupSocket()
}

envSetup()
