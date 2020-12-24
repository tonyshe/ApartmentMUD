// game objects
const { createBaseObject } = require("../gameObjects/baseObject");
const { createRoomObject } = require("../gameObjects/roomObject");
const { createDoorObjectPair } = require("../gameObjects/doorObject")
const { createContainerObject } = require("../gameObjects/containerObject")
const { putObjectAdmin } = require("../gameFunctions/actions/putObject")

async function apartmentScenario() {
    // Make rooms
    await createRoomObject(
        {
            roomName: "mud_bedroom",
            names: ['bedroom', 'room'],
            description: "A simple four-sided bedroom with shag carpet."
        }
    )
    await createRoomObject(
        {
            roomName: "mud_hallway",
            names: ['hallway', 'corridor', 'hall'],
            description: "A small hallway connecting the bedroom, stairs, and bathroom."
        }
    )
    await createRoomObject({
        roomName: "mud_livingroom",
        names: ['living room', 'room'],
        description: 'The main downstairs area.'
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
    await createDoorObjectPair(
        {
            names: ['stairs', 'living room', 'staircase', 'down', 'downstairs'],
            roomName: "mud_hallway",
            description: "Stairs leading down to the living room.",
            preposition: "down"
        },
        {
            names: ['stairs', 'hallway', 'upstairs', 'up', 'staircase'],
            roomName: "mud_livingroom",
            description: "Stairs leading up to the hallway on the second level.",
            preposition: "up",
        }
    )

    // Make base objects
    const sandwichId = await createBaseObject({
        roomName: "mud_bedroom",
        names: ["sandwich", "food", "c"],
        description: "A yummy sandwich.",
        takeable: true,
        important: true
    })
    const popsicleId = await createBaseObject(
        {
            roomName: "mud_bedroom",
            names: ["popsicle", "ice cream", "food", "b"],
            description: "A melting popsicle.",
            takeable: true
        }
    )

    // Make container objs
    const tableId = await createContainerObject(
        {
            roomName: "mud_bedroom",
            names: [ "table", "wooden table", 't'],
            description: "A simple wooden table.",
        }
    )
    const drawerId = await createContainerObject(
        {
            roomName: "mud_bedroom",
            names: [ "drawer", 'd'],
            description: "A drawer.",
            important: true,
            open: false,
            closeable: true,
            preposition: 'in'
        }
    )
    await putObjectAdmin(sandwichId, drawerId, "mud_bedroom")
    

    await createContainerObject(
        {
            roomName: "mud_bedroom",
            names: ["carpet", "floor", "shag carpet", "ground"],
            description: "Off-white fuzzy carpet. Feels good on your toes."
        }
    )
}

module.exports = {
    apartmentScenario
}