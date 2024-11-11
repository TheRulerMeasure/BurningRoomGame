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

const makeTile = (k, pos, frame) => k.make([
    k.pos(pos),
    k.sprite("ft_tile", { frame: frame ?? 0 }),
    k.layer("background"),
])

const makeDoor = (k, dir, cb) => k.make([
    k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    k.opacity(0),
    k.area(),
    "door",
    {
        mobEntered: () => cb(dir),
    },
])

const makeCollisionRect = (k, pos, width, height) => k.make([
    k.pos(pos),
    k.rect(width, height),
    k.opacity(0.5),
    k.area(),
    k.body({ isStatic: true }),
])

const makeFloorTiles = (k, room, sizeX, sizeY) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            const tilePos = k.vec2(floorCoord.x + x, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT)
            room.add(makeTile(k, tilePos, 5))
        }
    }
}

const makeWallUp = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let x = 0; x < sizeX; x++) {
        const topTilePos = k.vec2(floorCoord.x + x, floorCoord.y - 2).scale(TILE_WIDTH, TILE_HEIGHT)
        const bottomTilePos = k.vec2(floorCoord.x + x, floorCoord.y - 1).scale(TILE_WIDTH, TILE_HEIGHT)
        room.add(makeTile(k, topTilePos, 0))
        if (hasDoor) {
            if (x == Math.floor(sizeX / 2)) {
                const doorTile = makeTile(k, bottomTilePos, 1)
                doorTile.add(makeDoor(k, DOOR_UP, enterCallback))
                room.add(doorTile)
                continue
            }
        }
        room.add(makeTile(k, bottomTilePos, 2))
    }
    if (hasDoor) {
        const rectWidth = (Math.floor(sizeX / 2)) * TILE_WIDTH

        const rectCoordL = k.vec2(floorCoord.x, floorCoord.y - 1)
        room.add(makeCollisionRect(k, rectCoordL.scale(TILE_WIDTH, TILE_HEIGHT), rectWidth, TILE_HEIGHT))

        const rectCoordR = k.vec2(floorCoord.x + Math.floor(sizeX / 2) + 1, floorCoord.y - 1)
        room.add(makeCollisionRect(k, rectCoordR.scale(TILE_WIDTH, TILE_HEIGHT), rectWidth, TILE_HEIGHT))
    } else {
        const rectCoord = k.vec2(floorCoord.x, floorCoord.y - 2)
        room.add(makeCollisionRect(k, rectCoord.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH * sizeX, TILE_HEIGHT * 2))
    }
}

const makeWallDown = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let x = 0; x < sizeX; x++) {
        const tilePos = k.vec2(floorCoord.x + x, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT)
        if (hasDoor) {
            if (x == Math.floor(sizeX / 2)) {
                const doorTile = makeTile(k, tilePos, 4)
                doorTile.add(makeDoor(k, DOOR_DOWN, enterCallback))
                room.add(doorTile)
                continue
            }
        }
        room.add(makeTile(k, tilePos, 0))
    }
    if (hasDoor) {
        const rectWidth = (Math.floor(sizeX / 2)) * TILE_WIDTH

        const rectCoordL = k.vec2(floorCoord.x, floorCoord.y + sizeY)
        room.add(makeCollisionRect(k, rectCoordL.scale(TILE_WIDTH, TILE_HEIGHT), rectWidth, TILE_HEIGHT))

        const rectCoordR = k.vec2(floorCoord.x + Math.floor(sizeX / 2) + 1, floorCoord.y + sizeY)
        room.add(makeCollisionRect(k, rectCoordR.scale(TILE_WIDTH, TILE_HEIGHT), rectWidth, TILE_HEIGHT))
    } else {
        const rectCoord = k.vec2(floorCoord.x, floorCoord.y + sizeY)
        room.add(makeCollisionRect(k, rectCoord.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH * sizeX, TILE_HEIGHT))
    }
}

const makeWallLeft = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < 2; y++) {
        room.add(makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + y - 2).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    }
    for (let y = 0; y < sizeY; y++) {
        if (hasDoor) {
            if (y == Math.floor(sizeY / 2) - 1) {
                room.add(makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 1))
                continue
            }
            if (y == Math.floor(sizeY / 2)) {
                const doorTile = makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 5)
                doorTile.add(makeDoor(k, DOOR_LEFT, enterCallback))
                room.add(doorTile)
                continue
            }
        }
        room.add(makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    }
    room.add(makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    if (hasDoor) {
        const rectHeight = (Math.floor(sizeY / 2)) * TILE_HEIGHT

        const rectCoordTop = k.vec2(floorCoord.x - 1, floorCoord.y)
        room.add(makeCollisionRect(k, rectCoordTop.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, rectHeight))

        const rectCoordBottom = k.vec2(floorCoord.x - 1, floorCoord.y + Math.floor(sizeY / 2) + 1)
        room.add(makeCollisionRect(k, rectCoordBottom.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, rectHeight))
    } else {
        const rectCoord = k.vec2(floorCoord.x - 1, floorCoord.y)
        room.add(makeCollisionRect(k, rectCoord.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, TILE_HEIGHT * sizeY))
    }
}

const makeWallRight = (k, room, sizeX, sizeY, hasDoor, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let y = 0; y < 2; y++) {
        room.add(makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + y - 2).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    }
    for (let y = 0; y < sizeY; y++) {
        if (hasDoor) {
            if (y == Math.floor(sizeY / 2) - 1) {
                room.add(makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 1))
                continue
            }
            if (y == Math.floor(sizeY / 2)) {
                const doorTile = makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 4)
                doorTile.add(makeDoor(k, DOOR_RIGHT, enterCallback))
                room.add(doorTile)
                continue
            }
        }
        room.add(makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + y).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    }
    room.add(makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT), 0))
    if (hasDoor) {
        const rectHeight = (Math.floor(sizeY / 2)) * TILE_HEIGHT

        const rectCoordTop = k.vec2(floorCoord.x + sizeX, floorCoord.y)
        room.add(makeCollisionRect(k, rectCoordTop.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, rectHeight))

        const rectCoordBottom = k.vec2(floorCoord.x + sizeX, floorCoord.y + Math.floor(sizeY / 2) + 1)
        room.add(makeCollisionRect(k, rectCoordBottom.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, rectHeight))
    } else {
        const rectCoord = k.vec2(floorCoord.x + sizeX, floorCoord.y)
        room.add(makeCollisionRect(k, rectCoord.scale(TILE_WIDTH, TILE_HEIGHT), TILE_WIDTH, TILE_HEIGHT * sizeY))
    }
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
