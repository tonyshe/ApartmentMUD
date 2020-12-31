// imports
const MongoClient = require('mongodb').MongoClient;
const scriptHelpers = require("./src/gameFunctions/helperFunctions/scriptHelpers")
const { setupSocket } = require("./src/socket/socketSetup")

// Scenarios
const {apartmentScenario} = require("./src/scenarios/apartmentScenario")

// aux functions
const { sleep } = require('./src/gameFunctions/helperFunctions/scriptHelpers')

global.mongoDbAddress = process.env.MONGO_ADDRESS || "127.0.0.1"

async function dropAllRoomDbs(roomDbs) {
	const baseUrl = "mongodb://" + global.mongoDbAddress + ":27017/"
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
	const baseUrl = "mongodb://" + global.mongoDbAddress + ":27017/"
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
	const baseUrl = "mongodb://" + global.mongoDbAddress + ":27017/"
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
	// Clean up databases
	console.log("Cleaning up user inventories")
	await dropAllUserInventories()
	console.log("Cleaning up databases")
	const roomDbs = ['userIdMap', 'orphanedObjs']
	await dropAllRoomDbs(roomDbs)
	await dropAllGameRooms()
	await sleep(100)
	console.log("Creating world...")
	await apartmentScenario()	

	// socketsss
	await setupSocket()
}

envSetup()
