// game objects
const { createBaseObject } = require("../gameObjects/baseObject");
const { createRoomObject } = require("../gameObjects/roomObject");
const { createDoorObjectPair } = require("../gameObjects/doorObject")
const { createContainerObject } = require("../gameObjects/containerObject") 

async function apartmentScenario() {
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
			names: ['door', 'hallway', 'bedroom door', 'exit'],
			roomName: "mud_bedroom",
			description: "A door to the hallway.",
		},
		{
			names: ['door', 'bedroom', 'bedroom door'],
			roomName: "mud_hallway",
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
    
    // Make container objs
    await createContainerObject(
        {
            roomName: "mud_bedroom",
            names: ["wooden table", "table"],
            description: "A simple wooden table"
        }
    )
}

module.exports = {
    apartmentScenario
}