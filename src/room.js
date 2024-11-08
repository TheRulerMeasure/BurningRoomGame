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

const makeTile = (k, roomCoordv, tileCoordv, frame) => {
    const pos = getRoomWorldCoord(k, roomCoordv).add(tileCoordv.scale(TILE_WIDTH, TILE_HEIGHT))
    return k.make([
        k.pos(pos),
        k.sprite("ft_tile", { frame: frame ?? 0 }),
        k.layer("background"),
    ])
}

const makeDoorDown = (k, roomCoordv, tileCoordv, enterCallback) => {
    const d = makeTile(k, roomCoordv, tileCoordv, 5)
    // d.add([
    //     k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    //     k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    //     k.area(),
    //     "door",
    //     {
    //         mobEntered: () => enterCallback(DOOR_DOWN),
    //     },
    // ])
    return d
}

const makeDoorUp = (k, roomCoordv, tileCoordv, enterCallback) => {
    const d = makeTile(k, roomCoordv, tileCoordv, 1)
    // d.add([
    //     k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    //     k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    //     k.area(),
    //     "door",
    //     {
    //         mobEntered: () => enterCallback(DOOR_UP),
    //     },
    // ])
    return d
}

const makeDoorLeft = (k, roomCoordv, tileCoordv, enterCallback) => {
    const d = makeTile(k, roomCoordv, tileCoordv, 4)
    // d.add([
    //     k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    //     k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    //     k.area(),
    //     "door",
    //     {
    //         mobEntered: () => enterCallback(DOOR_LEFT),
    //     },
    // ])
    return d
}

const makeDoorRight = (k, roomCoordv, tileCoordv, enterCallback) => {
    const tile = makeTile(k, roomCoordv, tileCoordv, 5)
    const tilePos = tile.pos
    const door = k.make([
        k.pos(tilePos.x + TILE_WIDTH * 0.25, tilePos.y + TILE_HEIGHT * 0.25),
        k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
        k.area(),
        "my_door",
        // {
        //     mobEntered: () => enterCallback(DOOR_RIGHT),
        // },
    ])
    return [tile, door]
}

const getRoomCenterWorldPos = (k, roomCoordv) => {
    const offset = k.vec2(MAX_ROOM_WIDTH * TILE_WIDTH * 0.5, MAX_ROOM_HEIGHT * TILE_HEIGHT * 0.5)
    return getRoomWorldCoord(k, roomCoordv).add(offset)
}

const makeFloor = (k, tiles, sizeX, sizeY, roomCoordv) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            const frame = Math.random() < 0.5 ? 4 : 5
            tiles.push(makeTile(k, roomCoordv, k.vec2(x + floorCoord.x, y + floorCoord.y), frame))
        }
    }
}

const makeWallUp = (k, tiles, sizeX, sizeY, roomCoordv) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < sizeX; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 2), 0))
        tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 1), 2))
    }
}

const makeWallUpWithDoor = (k, tiles, sizeX, sizeY, roomCoordv, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < sizeX; i++) {
        if (i == Math.floor(sizeX / 2)) {
            tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 2), 0))
            tiles.push(makeDoorUp(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 1), enterCallback))
        } else {
            tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 2), 0))
            tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y - 1), 2))
        }
    }
}

const makeWallDown = (k, tiles, sizeX, sizeY, roomCoordv) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < sizeX; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y + sizeY), 0))
    }
}

const makeWallDownWithDoor = (k, tiles, sizeX, sizeY, roomCoordv, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < sizeX; i++) {
        if (i == Math.floor(sizeX / 2)) {
            tiles.push(makeDoorDown(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y + sizeY), enterCallback))
        } else {
            tiles.push(makeTile(k, roomCoordv, k.vec2(i + floorCoord.x, floorCoord.y + sizeY), 0))
        }
    }
}

const makeWallLeft = (k, tiles, sizeX, sizeY, roomCoordv) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < 2; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y - 2 + i), 0))
    }
    for (let i = 0; i < sizeY; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + i), 0))
    }
    tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + sizeY), 0))
}

const makeWallLeftWithDoor = (k, tiles, sizeX, sizeY, roomCoordv, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < 2; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y - 2 + i), 0))
    }
    for (let i = 0; i < sizeY; i++) {
        if (i == Math.floor(sizeY / 2) - 1) {
            tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + i), 1))
        } else if (i == Math.floor(sizeY / 2)) {
            tiles.push(makeDoorLeft(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + i), enterCallback))
        } else {
            tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + i), 0))
        }
    }
    tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x - 1, floorCoord.y + sizeY), 0))
}

const makeWallRight = (k, tiles, sizeX, sizeY, roomCoordv) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < 2; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y - 2 + i), 0))
    }
    for (let i = 0; i < sizeY; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + i), 0))
    }
    tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + sizeY), 0))
}

const makeWallRightWithDoor = (k, tiles, sizeX, sizeY, roomCoordv, enterCallback) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    for (let i = 0; i < 2; i++) {
        tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y - 2 + i), 0))
    }
    for (let i = 0; i < sizeY; i++) {
        if (i == Math.floor(sizeY / 2) - 1) {
            tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + i), 1))
        } else if (i == Math.floor(sizeY / 2)) {
            makeDoorRight(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + i), enterCallback).forEach(t => {
                tiles.push(t)
            })
            // tiles.push(makeDoorRight(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + i), enterCallback))
        } else {
            tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + i), 0))
        }
    }
    tiles.push(makeTile(k, roomCoordv, k.vec2(floorCoord.x + sizeX, floorCoord.y + sizeY), 0))
}

const makeRoom = (k, sizeX, sizeY, roomCoordv, enterCallback, doorsOpt) => {
    let tiles = []
    makeFloor(k, tiles, sizeX, sizeY, roomCoordv)

    if (doorsOpt.up) {
        makeWallUpWithDoor(k, tiles, sizeX, sizeY, roomCoordv, enterCallback)
    } else {
        makeWallUp(k, tiles, sizeX, sizeY, roomCoordv)
    }

    if (doorsOpt.down) {
        makeWallDownWithDoor(k, tiles, sizeX, sizeY, roomCoordv, enterCallback)
    } else {
        makeWallDown(k, tiles, sizeX, sizeY, roomCoordv)
    }

    if (doorsOpt.left) {
        makeWallLeftWithDoor(k, tiles, sizeX, sizeY, roomCoordv, enterCallback)
    } else {
        makeWallLeft(k, tiles, sizeX, sizeY, roomCoordv)
    }

    if (doorsOpt.right) {
        makeWallRightWithDoor(k, tiles, sizeX, sizeY, roomCoordv, enterCallback)
    } else {
        makeWallRight(k, tiles, sizeX, sizeY, roomCoordv)
    }

    return tiles
}

export default makeRoom
export { MAX_FLOOR_WIDTH, MAX_FLOOR_HEIGHT, getRoomCenterWorldPos }
