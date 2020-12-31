// game objects
const { createBaseObject } = require("../gameObjects/baseObject");
const { createRoomObject } = require("../gameObjects/roomObject");
const { createDoorObjectPair } = require("../gameObjects/doorObject")
const { createContainerObject } = require("../gameObjects/containerObject")
const { putObjectAdmin } = require("../gameFunctions/actions/putObject")

async function apartmentScenario() {
    // Make rooms

    // Tony's Room
    await createRoomObject({
        names: ["room", 'bedroom', 'Tony', "Tony's Room"],
        roomName: "mud_bedroom",
        roomTitle: "Tony's Room",
        description: "A weird pentagonal room. A window looks out to the front porch area. There is a <b>door</b> leading out to the hallway."
    })
    await createContainerObject({
        names: ["carpet", "floor", "shag carpet", "ground"],
        roomName: "mud_bedroom",
        description: "Off-white fuzzy carpet. Feels good on your toes."
    })
    const sandwichId = await createBaseObject({
        names: ["sandwich", "food", "sub", "sammy"],
        roomName: "mud_bedroom",
        description: "A yummy sandwich.",
        takeable: true
    })
    const falafelId = await createBaseObject({
        names: ["falafel wrap", "falafel", "food", "wrap"],
        roomName: "mud_bedroom",
        description: "A falafel wrap drenched in zesty dill tzatziki sauce.",
        takeable: true
    })
    const tonyTableId = await createContainerObject({
        names: ["table", "wooden table", "desk", "wooden desk"],
        roomName: "mud_bedroom",
        description: "A simple wooden table.",
        important: true
    })
    await createContainerObject({
        names: ["futon", "bed", 'cot', 'mattress'],
        roomName: "mud_bedroom",
        description: "A sad green futon.",
        closeable: true,
        hidesContents: false,
        describe: 'futonDescribe',
        important: true
    })
    await createContainerObject({
        names: ["window"],
        roomName: "mud_bedroom",
        description: "A window overlooking the front porch area. You can see a glimpse of Stone Ave.",
        closeable: true,
        open: false,
        objsAllowed: ['nothing_at_all']
    })
    await putObjectAdmin(sandwichId, tonyTableId, "mud_bedroom")
    await putObjectAdmin(falafelId, tonyTableId, "mud_bedroom")
    await createBaseObject({
        roomName: "mud_bedroom",
        names: ["ceiling", "up"],
        description: "A plain ceiling with a poster of Donna Summer.",
    })
    await createBaseObject({
        roomName: "mud_bedroom",
        names: ["wall", "walls"],
        description: "Unadorned white drywall.",
    })
    await createBaseObject({
        roomName: "mud_bedroom",
        names: ["poster", "donna", "donna summer", "summer"],
        description: 'A poster of Donna Summer promoting her hit dance song "On the Radio."'
    })

    // Create door from tony's room to hallway
    await createDoorObjectPair({
        names: ['door', 'hallway', 'bedroom door', 'exit'],
        roomName: "mud_bedroom",
        description: "A door to the hallway.",
    }, {
        names: ["door", "Tony's room", "Tony door", "Tony's door", "Tony", 'bedroom', 'bedroom door', 'room'],
        roomName: "mud_hallway",
        description: "A door to Tony's room.",
    })

    // Matt's Room
    await createRoomObject({
        names: ['room', "Matt's room", "Matt", 'bedroom'],
        roomName: "mud_mattroom",
        roomTitle: "Matt's room",
        description: "A simple four-sided bedroom with shag carpet. There is a <b>door</b> leading out to the hallway."
    })
    await createContainerObject({
        names: ["carpet", "floor", "ground"],
        roomName: "mud_mattroom",
        description: "Off-white fuzzy carpet. Feels good on your toes."
    })
    const mattTableId = await createContainerObject({
        names: ["table", "wooden table", "desk", "wooden desk"],
        roomName: "mud_mattroom",
        description: "A desk with a small utility drawer.",
        important: true
    })
    const mattDrawerId = await createContainerObject({
        roomName: "mud_mattroom",
        names: ["drawer"],
        description: "A drawer attached to the desk.",
        open: false,
        closeable: true,
        preposition: 'in'
    })
    const steamedHamId = await createBaseObject({
        names: ["steamed ham", "hamburger", "burger", "burg", "cheeseburger", "food"],
        roomName: "mud_mattroom",
        description: "A simple cheeseburger, which appears to be grilled, despite its name.",
        takeable: true
    })
    const penId = await createBaseObject({
        names: ["pen", "ballpoint pen", "ballpoint"],
        roomName: "mud_mattroom",
        description: "A blue ballpoint pen.",
        takeable: true
    })
    await createBaseObject({
        roomName: "mud_mattroom",
        names: ["ceiling", "up"],
        description: "A plain ceiling.",
    })
    await createBaseObject({
        roomName: "mud_mattroom",
        names: ["wall", "walls"],
        description: "Unadorned white drywall.",
    })
    await putObjectAdmin(steamedHamId, mattDrawerId, "mud_mattroom")
    await putObjectAdmin(penId, mattTableId, "mud_mattroom")
    await createContainerObject({
        roomName: "mud_mattroom",
        names: ["bed", "mattress"],
        description: "A full sized bed with a sag in the middle.",
        important: true
    })
    await createBaseObject({
        roomName: "mud_mattroom",
        names: ["sag"],
        description: "Gross.",
    })
    await createContainerObject({
        names: ["window"],
        roomName: "mud_mattroom",
        description: "A window looking out into the backyard.",
        closeable: true,
        open: false,
        objsAllowed: ['nothing_at_all']
    })

    // Create door from matts's room to hallway
    await createDoorObjectPair({
        names: ['door', 'hallway', 'bedroom door', 'exit'],
        roomName: "mud_mattroom",
        description: "A door to the hallway.",
    }, {
        names: ["door", "Matt's room", "Matt door", "Matt's door", "Matt", 'bedroom', 'bedroom door', 'room'],
        roomName: "mud_hallway",
        description: "A door to Matt's room.",
    })

    // Ian's Room
    await createRoomObject({
        names: ["room", "Ian's room", "Ian", 'bedroom',],
        roomName: "mud_ianroom",
        roomTitle: "Ian's room",
        description: "A simple four-sided bedroom. There is a <b>door</b> leading out to the hallway."
    })
    await createContainerObject({
        names: ["carpet", "floor", "shag carpet", "ground"],
        roomName: "mud_ianroom",
        description: "Off-white fuzzy carpet. Feels good on your toes."
    })
    const ianBedId = await createContainerObject({
        roomName: "mud_ianroom",
        names: ["bed", "mattress"],
        description: "Ian's bed.",
        important: true
    })
    const soccerBallId = await createBaseObject({
        roomName: "mud_ianroom",
        names: ["soccer ball", "ball", "futbol"],
        description: "A blue soccer ball",
    })
    const ianTableId = await createContainerObject({
        names: ["table", "wooden table", "desk", "wooden desk"],
        roomName: "mud_ianroom",
        description: "A simple wooden table.",
        important: true
    })
    const tacoId = await createBaseObject({
        roomName: "mud_ianroom",
        names: ["taco", "food"],
        description: "A Doritos Locos taco from Taco Bell. There's a bite taken out of it.",
    })
    await putObjectAdmin(soccerBallId, ianBedId, "mud_ianroom")
    await putObjectAdmin(tacoId, ianTableId, "mud_ianroom")
    await createBaseObject({
        roomName: "mud_ianroom",
        names: ["ceiling", "up"],
        description: "A plain ceiling.",
    })
    await createBaseObject({
        roomName: "mud_ianroom",
        names: ["wall", "walls"],
        description: "Unadorned white drywall.",
    })
    await createContainerObject({
        names: ["window"],
        roomName: "mud_ianroom",
        description: "A window overlooking the backyard and slightly into the neighbor's yard.",
        closeable: true,
        objsAllowed: ['nothing_at_all']
    })

    // Create door from ian's room to hallway
    await createDoorObjectPair({
        names: ['door', 'hallway', 'bedroom door', 'exit'],
        roomName: "mud_ianroom",
        description: "A door to the hallway.",
    }, {
        names: ["door", "Ian's room", "Ian door", "Ian's door", "Ian", 'bedroom', 'bedroom door', 'room'],
        roomName: "mud_hallway",
        description: "A door to Ian's room.",
    })

    // Hallway
    await createRoomObject({
        names: ['hallway', 'corridor', 'hall'],
        roomName: "mud_hallway",
        description: "A small hallway connecting the different parts of the upstairs. \
        There are doors to <b>Matt</b>, <b>Tony</b>, and <b>Ian's rooms</b>, as well as a door to the <b>bathroom</b>. \
        In the middle of the hallway are <b>stairs</b> that lead down to the living room."
    })
    await createContainerObject({
        names: ["carpet", "floor", "shag carpet", "ground"],
        roomName: "mud_hallway",
        description: "Off-white fuzzy carpet. Feels good on your toes."
    })
    await createBaseObject({
        roomName: "mud_hallway",
        names: ["ceiling", "up"],
        description: "A plain ceiling.",
    })
    await createBaseObject({
        names: ["wall", "walls"],
        roomName: "mud_hallway",
        description: "Unadorned white drywall.",
    })

    // Bathroom
    await createRoomObject({
        names: ['bathroom', "room"],
        roomName: "mud_bathroom",
        description: "A bathroom with everything you'd expect: a toilet, bathtub, sink, and mirror. There's a <b>door</b> leading back into the hallway."
    })
    await createDoorObjectPair({
        names: ['door', 'hallway', 'bathroom door', 'exit'],
        roomName: "mud_bathroom",
        description: "A door to the hallway.",
    }, {
        names: ["door", "bathroom", "bath", "toilet", "lav", "lavatory", "restroom", "rest room", "loo", "washroom", "wash room"],
        roomName: "mud_hallway",
        description: "A door to the bathroom.",
    })

    await createContainerObject({
        names: ["bathtub", "tub", "shower", "bath tub"],
        roomName: "mud_bathroom",
        description: "A standard bathtub with a shower faucet and curtain."
    })
    await createContainerObject({
        names: ["sink"],
        roomName: "mud_bathroom",
        description: "A white ceramic sink.",
    })
    await createContainerObject({
        names: ["faucet"],
        roomName: "mud_bathroom",
        description: "A silver modern-looking faucet.",
    })
    await createBaseObject({
        names: ["wall", "walls"],
        roomName: "mud_bathroom",
        description: "Unadorned white drywall.",
    })
    await createContainerObject({
        names: ["floor", "ground", "tile"],
        roomName: "mud_bathroom",
        description: "Grey matte bathroom tile."
    })
    await createContainerObject({
        roomName: "mud_bathroom",
        names: ["toilet"],
        description: "A drawer attached to the desk.",
        open: false,
        closeable: true,
        preposition: 'in',
    })
    await createBaseObject({
        roomName: "mud_bathroom",
        names: ["ceiling", "up"],
        description: "It's the ceiling.",
    })
    await createBaseObject({
        roomName: "mud_bathroom",
        names: ["mirror", "refelction"],
        description: "Lookin' good!",
    })

    // Living room
    await createRoomObject({
        names: ['living room', 'room'],
        roomName: "mud_livingroom",
        description: "The main downstairs area. \
        On one side of the living room, there is a <b>door</b> to the front porch, and the other side leads into the <b>kitchen</b> area. \
        There is a couch against a wall, opposite a TV on the other side of the room, with a coffee table between them. \
        There are <b>stairs</b> leading to the hallway upstairs."
    })
    await createDoorObjectPair({
        names: ['stairs', 'living room', 'staircase', 'down', 'downstairs', 'stair'],
        roomName: "mud_hallway",
        description: "Stairs leading down to the living room.",
        preposition: "down"
    }, {
        names: ['stairs', 'hallway', 'upstairs', 'up', 'staircase', 'stair'],
        roomName: "mud_livingroom",
        description: "Stairs leading up to the hallway on the second level.",
        preposition: "up",
    })
    await createContainerObject({
        names: ["floor", "hardwood", "ground"],
        roomName: "mud_livingroom",
        description: "Dark hardwood floors."
    })
    const coffeeTableId = await createContainerObject({
        names: ["coffee table", "table"],
        roomName: "mud_livingroom",
        description: "A cheap coffee table with a broken leg.",
    })
    await createContainerObject({
        names: ["couch", "sofa"],
        roomName: "mud_livingroom",
        description: "A nice comfy couch.",
    })
    await createBaseObject({
        roomName: "mud_livingroom",
        names: ["TV", "television"],
        description: "A flat screen TV.",
    })

    await createDoorObjectPair({
        names: ['door', "front porch", "front", 'porch', 'outside'],
        roomName: "mud_livingroom",
        description: "A door leading outside to the front porch.",
    }, {
        names: ['door', "living room", "livingroom", 'inside'],
        roomName: "mud_front",
        description: "A door leading inside into the house.",
    })

    await createDoorObjectPair({
        names: ['room', "kitchen area", "kitchen"],
        roomName: "mud_livingroom",
        description: "The kitchen area of the downstairs.",
    }, {
        names: ['room', "living area", "living room", 'livingroom'],
        roomName: "mud_kitchen",
        description: "The living room area of the downstairs.",
    })

    // Kitchen
    await createRoomObject({
        names: ['kitchen', 'room'],
        roomName: "mud_kitchen",
        description: 'Fancy black marble countertop. It has all your essential kitchen appliances: oven, stove, fridge, microwave, sink. In the middle of the kitchen there is a dining table. \
        There is a <b>door</b> leading out to the backyard. \
        On the other side of the is the downstairs is the <b>living room</b>.'
    })

    await createContainerObject({
        names: ["floor", "hardwood", "ground"],
        roomName: "mud_kitchen",
        description: "Dark hardwood floors."
    })

    await createContainerObject({
        names: ["stove", "range",],
        roomName: "mud_kitchen",
        description: "A glasstop stove."
    })

    await createContainerObject({
        names: ["counter", "countertop", "marble"],
        roomName: "mud_kitchen",
        description: "Black marble countertops."
    })

    const kitchenTableId = await createContainerObject({
        names: ["table", "kitchen table", "dining table"],
        roomName: "mud_kitchen",
        description: "A sturdy kitchen table.",
    })

    await createBaseObject({
        names: ["cat", "Eddie", "feline", "kitty",],
        roomName: "mud_kitchen",
        description: "Eddie the cat. He looks hungry, but don't believe him that's a lie.",
        important: true
    })

    const turkeyId = await createBaseObject({
        names: ["turkey", "bird", "food", "roasted turkey"],
        roomName: "mud_kitchen",
        description: "A whole roasted turkey. Gobble gobble!",
        takeable: true
    })

    const ovenId = await createContainerObject({
        roomName: "mud_kitchen",
        names: ["oven"],
        description: "A standard oven.",
        open: false,
        closeable: true,
        preposition: 'in',
    })

    await createContainerObject({
        roomName: "mud_kitchen",
        names: ["microwave"],
        description: "A standard microwave.",
        open: false,
        closeable: true,
        preposition: 'in',
    })

    await createContainerObject({
        roomName: "mud_kitchen",
        names: ["sink", "faucet"],
        description: "A dual-tub kitchen sink with a self-cleaning faucet. Nice!",
        preposition: 'in',
    })

    await putObjectAdmin(turkeyId, ovenId, "mud_kitchen")

    const fridgeId = await createContainerObject({
        roomName: "mud_kitchen",
        names: ["refrigerator", "fridge", "freezer"],
        description: "A refrigerator with a brushed steel finish.",
        open: false,
        closeable: true,
        preposition: 'in'
    })

    const popsicleId = await createBaseObject({
        roomName: "mud_kitchen",
        names: ["popsicle", "ice cream", "food", "b"],
        description: "A melting popsicle.",
        takeable: true
    })
    await putObjectAdmin(popsicleId, fridgeId, "mud_kitchen")

    await createDoorObjectPair({
        names: ['door', "kitchen area", "kitchen", "inside"],
        roomName: "mud_back",
        description: "A door leading from the backyard to the inside of the house.",
    }, {
        names: ['door', "back yard", "backyard", 'outside'],
        roomName: "mud_kitchen",
        description: "The door leading to the backyard.",
    })

    // Front Porch
    await createRoomObject({
        names: ['front porch', 'porch', "front", "outside"],
        roomName: "mud_front",
        description: 'The entrance alleyway to the house. Behind you is the <b>door</b> to go back inside.'
    })
    await createContainerObject({
        names: ["ground", "floor", "tile"],
        roomName: "mud_front",
        description: "Cement tile."
    })

    // Backyard
    await createRoomObject({
        names: ["backyard", "back yard", "outside"],
        roomName: "mud_back",
        description: "The back yard area of the house. The ground is paved with uneven cement tiles. \
        There is a glass patio table in the middle, with a large fig tree looming over it. \
        Behind you is the <b>door</b> to go back inside."
    })
    await createContainerObject({
        names: ["ground", "floor", "tile", "brick"],
        roomName: "mud_back",
        description: "Brick tiles. Slightly uneven but still impressive!"
    })

    const patioTableId = await createContainerObject({
        names: ["table", "patio table"],
        roomName: "mud_back",
        description: "A glass patio table.",
        preposition: "on"
    })

    const figId = await createBaseObject({
        names: ["fig", "fruit", "rotten fig"],
        roomName: "mud_back",
        description: "A rotten fig.",
        takeable: true
    })

    await putObjectAdmin(figId, patioTableId, "mud_back")

    await createBaseObject({
        names: ["fig tree", "tree"],
        roomName: "mud_back",
        description: "A huge fig tree. Once a year it dumps its fruit all over the backyard.",
    })
}

module.exports = {
    apartmentScenario
}