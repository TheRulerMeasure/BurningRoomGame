import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import makeRoom, { DOOR_DOWN, DOOR_RIGHT, DOOR_UP, getRoomCenterWorldPos } from "./room"

const enterRight = (k, coordX, coordY, roomInfos, newRoomCallback) => {
    const x = Math.floor(roomInfos[coordY][coordX].sizeX / 2) * TILE_WIDTH * -1
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(x, 0),
    })
}

const enterLeft = (k, coordX, coordY, roomInfos, newRoomCallback) => {
    const x = Math.floor(roomInfos[coordY][coordX].sizeX / 2) * TILE_WIDTH
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(x, 0),
    })
}

const enterUp = (k, coordX, coordY, roomInfos, newRoomCallback) => {
    const y = Math.floor(roomInfos[coordY][coordX].sizeY / 2) * TILE_HEIGHT
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, y),
    })
}

const enterDown = (k, coordX, coordY, roomInfos, newRoomCallback) => {
    const y = Math.floor(roomInfos[coordY][coordX].sizeY / 2) * TILE_HEIGHT * -1
    newRoomCallback({
        camDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(coordX, coordY)).add(0, y),
    })
}

const makeRooms = (k, startCoordX, startCoordY, newRoomCallback) => {
    let rooms = []
    let coordX = startCoordX
    let coordY = startCoordY
    const roomInfos = [
        [ { sizeX: 3, sizeY: 3 }, { sizeX: 9, sizeY: 7 }, ],
        [ { sizeX: 5, sizeY: 5 }, { sizeX: 3, sizeY: 5 }, ],
    ]
    const enterCallback = (dir) => {
        switch (dir) {
            case DOOR_RIGHT:
                coordX += 1
                enterRight(k, coordX, coordY, roomInfos, newRoomCallback)
                break
            case DOOR_UP:
                coordY -= 1
                enterUp(k, coordX, coordY, roomInfos, newRoomCallback)
                break
            case DOOR_DOWN:
                coordY += 1
                enterDown(k, coordX, coordY, roomInfos, newRoomCallback)
                break
            default:
                coordX -= 1
                enterLeft(k, coordX, coordY, roomInfos, newRoomCallback)
                break
        }
    }
    rooms.push(makeRoom(k, 3, 3, k.vec2(0, 0), enterCallback, { right: true }))
    rooms.push(makeRoom(k, 9, 7, k.vec2(1, 0), enterCallback, { down: true, left: true }))
    rooms.push(makeRoom(k, 5, 5, k.vec2(0, 1), enterCallback, { right: true }))
    rooms.push(makeRoom(k, 3, 5, k.vec2(1, 1), enterCallback, { up: true, left: true }))
    return rooms
}

export default makeRooms
