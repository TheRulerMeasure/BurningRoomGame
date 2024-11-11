import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"

const MAX_ROOM_WIDTH = 12
const MAX_ROOM_HEIGHT = 10

const MAX_FLOOR_WIDTH = 10
const MAX_FLOOR_HEIGHT = 7

const DOOR_LEFT = 0
const DOOR_RIGHT = 1
const DOOR_UP = 2
const DOOR_DOWN = 3

const getRoomWorldCoord = (k, roomCoordv) => {
    const x = TILE_WIDTH * MAX_ROOM_WIDTH * roomCoordv.x
    const y = TILE_HEIGHT * MAX_ROOM_HEIGHT * roomCoordv.y
    return k.vec2(x, y)
}

const getFloorCoord = (k, sizeX, sizeY) => {
    const x = MAX_ROOM_WIDTH * 0.5 - sizeX * 0.5
    const y = MAX_ROOM_HEIGHT * 0.5 - sizeY * 0.5
    return k.vec2(x, y)
}

const getRoomCenterWorldPos = (k, roomCoordv) => {
    const offset = k.vec2(MAX_ROOM_WIDTH * TILE_WIDTH * 0.5, MAX_ROOM_HEIGHT * TILE_HEIGHT * 0.5)
    return getRoomWorldCoord(k, roomCoordv).add(offset)
}

const makeDoor = (k, dir, cb) => k.make([
    k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    k.area(),
    "door",
    {
        mobEntered: () => cb(dir),
    },
])

const makeFloorTiles = (k, room, sizeX, sizeY) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            const tilePos = k.vec2(floorCoord.x + x, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)
            room.add([
                k.pos(tilePos),
                k.sprite("ft_tile", { frame: 5 }),
                k.layer("background"),
            ])
        }
    }
}

const makeWallUp = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let x = 0; x < sizeX; x++) {
        const topTilePos = k.vec2(floorCoord.x + x, floorCoord.y - 2).scale(TILE_WIDTH, TILE_HEIGHT)
        const bottomTilePos = k.vec2(floorCoord.x + x, floorCoord.y - 1).scale(TILE_WIDTH, TILE_HEIGHT)
        room.add([
            k.pos(topTilePos),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
        if (hasDoor) {
            if (x == Math.floor(sizeX / 2)) {
                room.add([
                    k.pos(bottomTilePos),
                    k.sprite("ft_tile", { frame: 1 }),
                    k.layer("background"),
                    k.area(),
                    k.body({ isStatic: true }),
                    "door_tile",
                ]).add(makeDoor(k, DOOR_UP, enterCallback))
                continue
            }
        }
        room.add([
            k.pos(bottomTilePos),
            k.sprite("ft_tile", { frame: 2 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
}

const makeWallDown = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let x = 0; x < sizeX; x++) {
        const tilePos = k.vec2(floorCoord.x + x, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT)
        if (hasDoor) {
            if (x == Math.floor(sizeX / 2)) {
                room.add([
                    k.pos(tilePos),
                    k.sprite("ft_tile", { frame: 4 }),
                    k.layer("background"),
                    k.area(),
                    k.body({ isStatic: true }),
                    "door_tile",
                ]).add(makeDoor(k, DOOR_DOWN, enterCallback))
                continue
            }
        }
        room.add([
            k.pos(tilePos),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
}

const makeWallLeft = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < 2; y++) {
        room.add([
            k.pos(k.vec2(floorCoord.x - 1, floorCoord.y + y - 2).scale(TILE_WIDTH, TILE_HEIGHT)),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
    for (let y = 0; y < sizeY; y++) {
        if (hasDoor) {
            if (y == Math.floor(sizeY / 2) - 1) {
                room.add([
                    k.pos(k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
                    k.sprite("ft_tile", { frame: 1 }),
                    k.area(),
                    k.body({ isStatic: true }),
                ])
                continue
            }
            if (y == Math.floor(sizeY / 2)) {
                room.add([
                    k.pos(k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
                    k.sprite("ft_tile", { frame: 5 }),
                    k.layer("background"),
                    k.area(),
                    k.body({ isStatic: true }),
                    "door_tile",
                ]).add(makeDoor(k, DOOR_LEFT, enterCallback))
                continue
            }
        }
        room.add([
            k.pos(k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
    room.add([
        k.pos(k.vec2(floorCoord.x - 1, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT)),
        k.sprite("ft_tile", { frame: 0 }),
        k.area(),
        k.body({ isStatic: true }),
        k.layer("background"),
    ])
}

const makeWallRight = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < 2; y++) {
        room.add([
            k.pos(k.vec2(floorCoord.x + sizeX, floorCoord.y + y - 2).scale(TILE_WIDTH, TILE_HEIGHT)),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
    for (let y = 0; y < sizeY; y++) {
        if (hasDoor) {
            if (y == Math.floor(sizeY / 2) - 1) {
                room.add([
                    k.pos(k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
                    k.sprite("ft_tile", { frame: 1 }),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.layer("background"),
                ])
                continue
            }
            if (y == Math.floor(sizeY / 2)) {
                room.add([
                    k.pos(k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
                    k.sprite("ft_tile", { frame: 4 }),
                    k.layer("background"),
                    k.area(),
                    k.body({ isStatic: true }),
                    "door_tile",
                ]).add(makeDoor(k, DOOR_RIGHT, enterCallback))
                continue
            }
        }
        room.add([
            k.pos(k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)),
            k.sprite("ft_tile", { frame: 0 }),
            k.area(),
            k.body({ isStatic: true }),
            k.layer("background"),
        ])
    }
    room.add([
        k.pos(k.vec2(floorCoord.x + sizeX, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT)),
        k.sprite("ft_tile", { frame: 0 }),
        k.area(),
        k.body({ isStatic: true }),
        k.layer("background"),
    ])
}

const makeRoom = (k, sizeX, sizeY, roomCoordv, enterCallback, doorsOpt) => {
    const roomPos = getRoomWorldCoord(k, roomCoordv)
    const room = k.make([
        k.pos(roomPos),
    ])
    makeFloorTiles(k, room, sizeX, sizeY)
    makeWallUp(k, room, sizeX, sizeY, doorsOpt.up, enterCallback)
    makeWallDown(k, room, sizeX, sizeY, doorsOpt.down, enterCallback)
    makeWallLeft(k, room, sizeX, sizeY, doorsOpt.left, enterCallback)
    makeWallRight(k, room, sizeX, sizeY, doorsOpt.right, enterCallback)
    return room
}

const addDoorSystem = (k) => {
    k.onCollide("player", "door", (player, door, col) => {
        door.mobEntered()
    })
}

export default makeRoom
export { MAX_FLOOR_WIDTH, MAX_FLOOR_HEIGHT, getRoomCenterWorldPos }
export { DOOR_LEFT, DOOR_RIGHT, DOOR_UP, DOOR_DOWN }
export { addDoorSystem }
