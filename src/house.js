import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import packLevel from "./levels/lvlpacker"
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

        roomInfos: [],

        loadRooms(lvlData) {
            this.roomInfos = packLevel(lvlData)
            this.coordX = lvlData.startCoord.x
            this.coordY = lvlData.startCoord.y
        },

        initRoom() {
            const roomObj = this.add(this.makeRoomAtCoord(this.coordX, this.coordY))
            const evEnteredDoor = roomObj.on("mob_entered", dir => this.movedToNewRoom(dir))
            const evEnteredStairs = roomObj.on("mob_entered_stairs", () => this.enterTheStairs())
            roomObj.onDestroy(() => {
                evEnteredDoor.cancel()
                evEnteredStairs.cancel()
            })

            this.currentRoomObj = roomObj

            let posVec = getRoomCenterWorldPos(k, k.vec2(this.coordX, this.coordY))
            const pl = k.add(makePlayer(k, posVec))
            const evPlHurt = pl.onHurt(_ => {
                this.trigger("player_hp_changed", pl.hp())
            })
            const evPlDie = pl.onDeath(() => {
                this.trigger("player_died")
            })
            pl.onDestroy(() => {
                evPlHurt.cancel()
                evPlDie.cancel()
            })

            k.camPos(getRoomCenterWorldPos(k, k.vec2(this.coordX, this.coordY)).add(0, TILE_HEIGHT * -0.5))
        },

        enterTheStairs() {
            this.trigger("entered_stairs")
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
            return makeRoom(k, roomInfo.sizeX, roomInfo.sizeY, k.vec2(x, y), roomInfo.doors, roomInfo.hasStairs)
        },

        putNewRoom() {
            k.destroy(this.currentRoomObj)
            const roomObj = this.add(this.makeRoomAtCoord(this.coordX, this.coordY))
            const evEnteredDoor = roomObj.on("mob_entered", dir => this.movedToNewRoom(dir))
            const evEnteredStairs = roomObj.on("mob_entered_stairs", () => this.enterTheStairs())
            roomObj.onDestroy(() => {
                evEnteredDoor.cancel()
                evEnteredStairs.cancel()
            })
            this.currentRoomObj = roomObj
        },

        putMonsters(monsters) {
            this.currentRoomObj.blockDoors()
            this.currentRoomObj.initMonsters(monsters)
            this.roomInfos[this.coordY][this.coordX].monsters.spawned = true
        },

        putRoomAt(coordX, coordY) {
            this.coordX = coordX
            this.coordY = coordY
            this.putNewRoom()
        },

        houseReset(coordX, coordY) {
            this.roomInfos[this.coordY][this.coordX].monsters.spawned = false
            this.putRoomAt(coordX, coordY)
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
