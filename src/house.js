import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import makePlayer from "./mob"
import makeRoom, { DOOR_DOWN, DOOR_LEFT, DOOR_RIGHT, DOOR_UP, getRoomCenterWorldPos } from "./room"

const enterRight = (k, house) => {
    const roomInfo = house.roomInfos[house.coordY][house.coordX]
    const x = Math.floor(roomInfo.sizeX / 2) * TILE_WIDTH * -1
    return {
        camDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(x, 0),
        monsters: roomInfo.monsters,
    }
}

const enterLeft = (k, house) => {
    const roomInfo = house.roomInfos[house.coordY][house.coordX]
    const x = Math.floor(roomInfo.sizeX / 2) * TILE_WIDTH
    return {
        camDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(x, 0),
        monsters: roomInfo.monsters,
    }
}

const enterUp = (k, house) => {
    const roomInfo = house.roomInfos[house.coordY][house.coordX]
    const y = Math.floor(roomInfo.sizeY / 2) * TILE_HEIGHT
    return {
        camDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, y),
        monsters: roomInfo.monsters,
    }
}

const enterDown = (k, house) => {
    const roomInfo = house.roomInfos[house.coordY][house.coordX]
    const y = Math.floor(roomInfo.sizeY / 2) * TILE_HEIGHT * -1
    return {
        camDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, TILE_HEIGHT * -0.5),
        playerDestPos: getRoomCenterWorldPos(k, k.vec2(house.coordX, house.coordY)).add(0, y),
        monsters: roomInfo.monsters,
    }
}

const houseComp = (k, startCoordX, startCoordY) => {
    return {

        id: "houseComp",

        coordX: startCoordX,
        coordY: startCoordY,

        currentRoomObj: null,

        roomInfos: [
            [ { sizeX: 5, sizeY: 3, doors: { right: true } }, { sizeX: 3, sizeY: 3, doors: { left: true, right: true, down: true } }, { sizeX: 3, sizeY: 3, doors: { left: true } }, ],
            [ { sizeX: 9, sizeY: 7, doors: { right: true }, monsters: { count: 2 } }, { sizeX: 3, sizeY: 5, doors: { left: true, right: true, up: true } }, { sizeX: 9, sizeY: 7, doors: { left: true } }, ],
        ], // { sizeX: 3, sizeY: 3, doors: { right: true } }

        initRoom() {
            const roomObj = this.add(this.makeRoomAtCoord(this.coordX, this.coordY))
            const evEnteredDoor = roomObj.on("mob_entered", dir => this.movedToNewRoom(dir))
            roomObj.onDestroy(() => evEnteredDoor.cancel())

            this.currentRoomObj = roomObj

            let posVec = getRoomCenterWorldPos(k, k.vec2(this.coordX, this.coordY))
            k.add(makePlayer(k, posVec))

            k.camPos(getRoomCenterWorldPos(k, k.vec2(this.coordX, this.coordY)).add(0, TILE_HEIGHT * -0.5))
        },

        movedToNewRoom(dir) {
            if (dir == DOOR_LEFT) {
                this.coordX--
                const destPos = enterLeft(k, this)
                this.trigger("entered_new_room", destPos)
            } else if (dir == DOOR_RIGHT) {
                this.coordX++
                this.trigger("entered_new_room", enterRight(k, this))
            } else if (dir == DOOR_UP) {
                this.coordY--
                this.trigger("entered_new_room", enterUp(k, this))
            } else {
                this.coordY++
                this.trigger("entered_new_room", enterDown(k, this))
            }
        },

        makeRoomAtCoord(x, y) {
            const roomInfo = this.roomInfos[y][x]
            return makeRoom(k, roomInfo.sizeX, roomInfo.sizeY, k.vec2(x, y), roomInfo.doors)
        },

        putNewRoom() {
            k.destroy(this.currentRoomObj)
            const roomObj = this.add(this.makeRoomAtCoord(this.coordX, this.coordY))
            const evEnteredDoor = roomObj.on("mob_entered", dir => this.movedToNewRoom(dir))
            roomObj.onDestroy(() => evEnteredDoor.cancel())
            this.currentRoomObj = roomObj
        },

        putMonsters(monsters) {
            this.currentRoomObj.blockDoors()
            this.currentRoomObj.initMonsters(monsters.count)
        },
    }
}

const makeHouse = (k, startCoordX, startCoordY) => {
    const house = k.make([
        k.pos(0, 0),
        houseComp(k, startCoordX, startCoordY),
    ])
    return house
}

export default makeHouse
