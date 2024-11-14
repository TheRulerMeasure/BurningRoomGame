import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import makeRoom, { DOOR_DOWN, DOOR_RIGHT, DOOR_UP, getRoomCenterWorldPos } from "./room"

const makeWarningMark = (k, posVec) => k.make([
    k.pos(posVec),
    k.sprite("warning_rect", { anim: "dance" }),
    k.anchor("center"),
])

const enterRight = (k, coordX, coordY, roomInfos, newRoomCallback, hasMonsters) => {
    const x = Math.floor(roomInfos[coordY][coordX].sizeX / 2) * TILE_WIDTH * -1
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(x, 0),
        hasMonsters: hasMonsters,
    })
}

const enterLeft = (k, coordX, coordY, roomInfos, newRoomCallback, hasMonsters) => {
    const x = Math.floor(roomInfos[coordY][coordX].sizeX / 2) * TILE_WIDTH
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(x, 0),
        hasMonsters: hasMonsters,
    })
}

const enterUp = (k, coordX, coordY, roomInfos, newRoomCallback, hasMonsters) => {
    const y = Math.floor(roomInfos[coordY][coordX].sizeY / 2) * TILE_HEIGHT
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, y),
        hasMonsters: hasMonsters,
    })
}

const enterDown = (k, coordX, coordY, roomInfos, newRoomCallback, hasMonsters) => {
    const y = Math.floor(roomInfos[coordY][coordX].sizeY / 2) * TILE_HEIGHT * -1
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, y),
        hasMonsters: hasMonsters,
    })
}

const makeRooms = (k, startCoordX, startCoordY, newRoomCallback) => {
    let rooms = []
    let coordX = startCoordX
    let coordY = startCoordY
    const D = { down: true }
    const U = { up: true }
    const UD = { up: true, down: true }
    const DR = { down: true, right: true }
    const DL = { down: true, left: true }
    const UR = { up: true, right: true }
    const UDR = { up: true, down: true, right: true }
    const UL = { up: true, left: true }
    const UDL = { up: true, down: true, left: true }
    const UDLR = { up: true, down: true, left: true, right: true }
    const roomMaxColumn = 3
    const roomInfos = [
        [ { sizeX: 3, sizeY: 3, doors: DR, }, { sizeX: 9, sizeY: 7, doors: DL, }, { sizeX: 9, sizeY: 7, doors: D, }, ],
        [ { sizeX: 5, sizeY: 5, doors: UDR, }, { sizeX: 5, sizeY: 7, doors: UDL, }, { sizeX: 9, sizeY: 7, doors: UD, }, ],
        [ { sizeX: 9, sizeY: 7, doors: UDR, }, { sizeX: 9, sizeY: 7, doors: UDLR, }, { sizeX: 9, sizeY: 7, doors: UDL, }, ],
        [ { sizeX: 9, sizeY: 7, doors: UR, }, { sizeX: 9, sizeY: 7, doors: UL, }, { sizeX: 9, sizeY: 7, doors: U, }, ],
    ]
    const monsterRooms = [
        [ 0, 0, 0, ],
        [ 0, 2, 0, ],
        [ 0, 0, 0, ],
        [ 0, 0, 0, ],
    ]
    const enterCallback = (dir) => {
        switch (dir) {
            case DOOR_RIGHT:
                coordX += 1
                enterRight(k, coordX, coordY, roomInfos, newRoomCallback, monsterRooms[coordY][coordX] > 0)
                break
            case DOOR_UP:
                coordY -= 1
                enterUp(k, coordX, coordY, roomInfos, newRoomCallback, monsterRooms[coordY][coordX] > 0)
                break
            case DOOR_DOWN:
                coordY += 1
                enterDown(k, coordX, coordY, roomInfos, newRoomCallback, monsterRooms[coordY][coordX] > 0)
                break
            default:
                coordX -= 1
                enterLeft(k, coordX, coordY, roomInfos, newRoomCallback, monsterRooms[coordY][coordX] > 0)
                break
        }
        if (monsterRooms[coordY][coordX] > 0) {
            const index = (coordX % roomMaxColumn) + (coordY * roomMaxColumn)
            k.tween(0, 1, 0.7, _ => {}).onEnd(() => {
                rooms[index].blockDoors()
            })
            k.tween(0, 1, 1.5, _ => {}).onEnd(() => {
                rooms[index].initMonsters(monsterRooms[coordY][coordX])
            })
        }
    }
    for (let y = 0; y < roomInfos.length; y++) {
        for (let x = 0; x < roomInfos[y].length; x++) {
            const roomInfo = roomInfos[y][x]
            rooms.push(makeRoom(k, roomInfo.sizeX, roomInfo.sizeY, k.vec2(x, y), enterCallback, roomInfo.doors))
        }
    }
    return rooms
}

export default makeRooms
