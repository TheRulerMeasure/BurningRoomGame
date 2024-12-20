import { TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import makeInstructionLabel, { makeEggLabel } from "./roomlabel"
import makeSlimea from "./slimea"

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

const makeDoor = (k, dir) => k.make([
    k.pos(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
    k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
    k.opacity(0),
    k.area(),
    "door",
    {
        direction: dir,
        // mobEntered: () => cb(dir),
    },
])

const makeStairs = (k, pos) => k.make([
    k.pos(pos),
    k.sprite("stairs"),
    k.anchor("center"),
    k.area(),
    k.layer("background"),
    "level_stairs",
])

const makeCollisionRect = (k, pos, width, height) => k.make([
    k.pos(pos),
    k.rect(width, height),
    k.opacity(0),
    k.area(),
    k.body({ isStatic: true }),
    "room_wall",
])

const drawFloorTiles = (k, room, sizeX, sizeY) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    const floorObj = k.make([
        k.pos(floorCoord.scale(TILE_WIDTH, TILE_HEIGHT)),
        k.layer("background"),
    ])
    floorObj.onDraw(() => {
        k.drawSprite({
            sprite: "ft_tile",
            width: sizeX * TILE_WIDTH,
            height: sizeY * TILE_HEIGHT,
            frame: 5,
            tiled: true,
        })
    })
    room.add(floorObj)
}

const drawWallUp = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    const wallObj = k.make([
        k.pos(floorCoord.add(0, -2).scale(TILE_WIDTH, TILE_HEIGHT)),
        k.layer("background"),
    ])
    wallObj.onDraw(() => {
        k.drawSprite({
            sprite: "ft_tile",
            width: sizeX * TILE_WIDTH,
            height: TILE_HEIGHT * 2,
            frame: 0,
            tiled: true,
        })
        for (let x = 0; x < sizeX; x++) {
            if (hasDoor && (x == Math.floor(sizeX / 2))) {
                continue
            }
            k.drawSprite({
                sprite: "ft_tile",
                pos: k.vec2(x * TILE_WIDTH, TILE_HEIGHT),
                frame: 2,
            })
        }
    })
    room.add(wallObj)
}

const drawWallDown = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    const wallObj = k.make([
        k.pos(floorCoord.add(0, sizeY).scale(TILE_WIDTH, TILE_HEIGHT)),
        k.layer("background"),
    ])
    wallObj.onDraw(() => {
        if (hasDoor) {
            for (let x = 0; x < sizeX; x++) {
                if (x == Math.floor(sizeX / 2)) {
                    continue
                }
                k.drawSprite({
                    sprite: "ft_tile",
                    pos: k.vec2(TILE_WIDTH * x, 0),
                    frame: 0,
                })
            }
        } else {
            k.drawSprite({
                sprite: "ft_tile",
                width: TILE_WIDTH * sizeX,
                height: TILE_HEIGHT,
                tiled: true,
            })
        }
    })
    room.add(wallObj)
}

const makeWallUp = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    if (hasDoor) {
        const doorPos = k.vec2(floorCoord.x + Math.floor(sizeX / 2), floorCoord.y - 1).scale(TILE_WIDTH, TILE_HEIGHT)
        const doorTile = makeTile(k, doorPos, 1)
        const doorObj = makeDoor(k, DOOR_UP)
        doorObj.on("mob_entered", dir => room.trigger("mob_entered", dir))
        doorTile.add(doorObj)
        room.add(doorTile)

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

const makeWallDown = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    if (hasDoor) {
        const tilePos = k.vec2(floorCoord.x + Math.floor(sizeX / 2), floorCoord.y + sizeY).scale(TILE_WIDTH, TILE_HEIGHT)
        const doorTile = makeTile(k, tilePos, 4)
        const doorObj = doorTile.add(makeDoor(k, DOOR_DOWN))
        doorObj.on("mob_entered", dir => room.trigger("mob_entered", dir))
        room.add(doorTile)

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

const makeWallLeft = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    if (hasDoor) {
        const doorTile = makeTile(k, k.vec2(floorCoord.x - 1, floorCoord.y + Math.floor(sizeY / 2)).scale(TILE_WIDTH, TILE_HEIGHT), 5)
        const doorObj = doorTile.add(makeDoor(k, DOOR_LEFT))
        doorObj.on("mob_entered", dir => room.trigger("mob_entered", dir))
        room.add(doorTile)

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

const makeWallRight = (k, room, sizeX, sizeY, hasDoor) => {
    const floorCoord = getFloorCoord(k, sizeX, sizeY)
    if (hasDoor) {
        const doorTile = makeTile(k, k.vec2(floorCoord.x + sizeX, floorCoord.y + Math.floor(sizeY / 2)).scale(TILE_WIDTH, TILE_HEIGHT), 4)
        const doorObj = doorTile.add(makeDoor(k, DOOR_RIGHT))
        doorObj.on("mob_entered", dir => room.trigger("mob_entered", dir))
        room.add(doorTile)

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

const getRandRoomWorldPos = (k, rComp) => {
    let posVec = getRoomWorldCoord(k, rComp.roomCoordv)
    posVec = posVec.add(getFloorCoord(k, rComp.sizeX, rComp.sizeY).scale(TILE_WIDTH, TILE_HEIGHT))
    const offsetX = 32 + k.rand() * (TILE_WIDTH * rComp.sizeX - 64)
    const offsetY = 32 + k.rand() * (TILE_HEIGHT * rComp.sizeY - 64)
    return posVec.add(offsetX, offsetY)
}

const roomComp = (k, sizeX, sizeY, roomCoordv, doorsOpt) => {
    return {
        id: "roomComp",
        sizeX: sizeX,
        sizeY: sizeY,
        roomCoordv: roomCoordv,
        doorsOpt: doorsOpt,
        monstersCount: 0,
        waves: [],
        currentWaveIndex: 0,
        currentMonsterDeathCount: 0,
        nextWaveMonstersDeathCountGoal: 9999,

        blockDoors() {
            const roomPos = getRoomWorldCoord(k, this.roomCoordv)
            const makeDoorBlocker = posVec => k.make([
                k.pos(posVec.add(roomPos)),
                k.sprite("x_mark"),
                k.area(),
                k.body({ isStatic: true }),
                "door_blocker",
            ])
            const floorCoord = getFloorCoord(k, this.sizeX, this.sizeY)
            if (this.doorsOpt.up) {
                const blocker = k.add(makeDoorBlocker(floorCoord.add(Math.floor(this.sizeX / 2), -1).scale(TILE_WIDTH, TILE_HEIGHT)))
                this.onDestroy(() => k.destroy(blocker))
            }
            if (this.doorsOpt.down) {
                const blocker = k.add(makeDoorBlocker(floorCoord.add(Math.floor(this.sizeX / 2), this.sizeY).scale(TILE_WIDTH, TILE_HEIGHT)))
                this.onDestroy(() => k.destroy(blocker))
            }
            if (this.doorsOpt.left) {
                const blocker = k.add(makeDoorBlocker(floorCoord.add(-1, Math.floor(this.sizeY / 2)).scale(TILE_WIDTH, TILE_HEIGHT)))
                this.onDestroy(() => k.destroy(blocker))
            }
            if (this.doorsOpt.right) {
                const blocker = k.add(makeDoorBlocker(floorCoord.add(this.sizeX, Math.floor(this.sizeY / 2)).scale(TILE_WIDTH, TILE_HEIGHT)))
                this.onDestroy(() => k.destroy(blocker))
            }
        },

        unblockDoors() {
            k.destroyAll("door_blocker")
        },

        putWarning(posVec) {
            const warningRect = k.add([
                k.pos(posVec),
                k.sprite("warning_rect", { anim: "dance" }),
                k.anchor("center"),
                k.layer("foreground"),
            ])
            k.tween(0, 1, 0.65, _ => {}).onEnd(() => {
                k.destroy(warningRect)
            })
        },

        putMob(posVec) {
            const mob = k.add(makeSlimea(k, k.vec2(posVec)))
            const diedEvent = mob.on("died", () => this.decrementMonster())
            mob.onDestroy(() => diedEvent.cancel())
            this.onDestroy(() => k.destroy(mob))
        },

        putMonsters(waveIndex) {
            const amount = this.waves[waveIndex].deployAmount
            for (let i = 0; i < amount; i++) {
                const posVec = getRandRoomWorldPos(k, this)
                this.putWarning(posVec)

                const tweenCon = k.tween(0, 1, 0.5, _ => {})
                tweenCon.onEnd(() => {
                    this.putMob(posVec)
                })
                this.onDestroy(() => tweenCon.cancel())
            }
            if (this.waves[waveIndex + 1]) {
                this.nextWaveMonstersDeathCountGoal = this.waves[waveIndex + 1].deployOnDeathCount
            } else {
                this.nextWaveMonstersDeathCountGoal = 9999
            }
        },

        initMonsters(monsters) {
            this.monstersCount = monsters.maxAmount
            this.waves = monsters.waves
            this.currentWaveIndex = 0
            this.currentMonsterDeathCount = 0
            this.putMonsters(this.currentWaveIndex)
        },

        decrementMonster() {
            this.currentMonsterDeathCount++
            this.monstersCount--
            if (this.monstersCount <= 0) {
                this.unblockDoors()
                return
            }
            if (this.currentMonsterDeathCount >= this.nextWaveMonstersDeathCountGoal) {
                this.currentWaveIndex++
                this.putMonsters(this.currentWaveIndex)
            }
        },

    }
}

const makeRoom = (k, sizeX, sizeY, roomCoordv, doorsOpt, hasStairs, hasInstruction, hasEgg) => {
    const roomPos = getRoomWorldCoord(k, roomCoordv)
    const room = k.make([
        k.pos(roomPos),
        k.offscreen({ hide: true }),
        roomComp(k, sizeX, sizeY, roomCoordv, doorsOpt),
    ])
    drawFloorTiles(k, room, sizeX, sizeY)
    if (hasStairs) {
        const posVec = k.vec2(MAX_ROOM_WIDTH * TILE_WIDTH * 0.5, MAX_ROOM_HEIGHT * TILE_HEIGHT * 0.5)
        const stairs = room.add(makeStairs(k, posVec))
        stairs.on("mob_entered_stairs", () => room.trigger("mob_entered_stairs"))
    }
    if (hasInstruction) {
        room.add(makeInstructionLabel(k))
    }
    if (hasEgg) {
        room.add(makeEggLabel(k))
    }
    drawWallUp(k, room, sizeX, sizeY, doorsOpt.up)
    makeWallUp(k, room, sizeX, sizeY, doorsOpt.up)
    // drawWallDown(k, room, sizeX, sizeY, doorsOpt.down)
    makeWallDown(k, room, sizeX, sizeY, doorsOpt.down)
    makeWallLeft(k, room, sizeX, sizeY, doorsOpt.left)
    makeWallRight(k, room, sizeX, sizeY, doorsOpt.right)
    return room
}

const addDoorSystem = k => {
    k.onCollide("player", "door", (player, door, col) => {
        door.trigger("mob_entered", door.direction)
    })
}

const addLevelStairsSystem = k => {
    k.onCollide("player", "level_stairs", (player, lvlStairs, col) => {
        lvlStairs.trigger("mob_entered_stairs")
    })
}

export default makeRoom
export { MAX_FLOOR_WIDTH, MAX_FLOOR_HEIGHT, getRoomCenterWorldPos }
export { DOOR_LEFT, DOOR_RIGHT, DOOR_UP, DOOR_DOWN }
export { addDoorSystem , addLevelStairsSystem }
