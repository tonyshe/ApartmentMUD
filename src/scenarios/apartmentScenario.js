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
            names: ['bedroom', 'room'],
            description: "A simple four-sided bedroom with shag carpet."
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
        names: ["sandwich", "food", "c"],
        description: "A yummy sandwich.",
        takeable: true,
        important: true
    })
    await createBaseObject(
        {
            roomName: "mud_bedroom",
            names: ["popsicle", "ice cream", "food", "b"],
            description: "A melting popsicle.",
            takeable: true
        }
    )

    // Make container objs
    await createContainerObject(
        {
            roomName: "mud_bedroom",
            names: ["wooden table", "table"],
            description: "A simple wooden table."
        }
    )
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