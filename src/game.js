import { addPlayerSystem } from "./mob"
import radialShade from "./shaders/radialshade"
import makeFader, { faderEvent } from "./gameFader"
import { addDoorSystem, addLevelStairsSystem } from "./room"
import makeHouse from "./house"
import makeGameAuto, { addGameAutoSystem } from "./gameAuto"
import { addBulletSystem } from "./bullet"
import { addSlimeaSystem } from "./slimea"
import level from "./levels/levela"
import makeHpInterface, { addHpInterfaceSystem } from "./hpinterface"

const MAX_ASSETS_COUNT = 11

const startLoad = (k, addProgress) => {
    k.loadSprite("ft_tile", "textures/tilemaps/ft_tile_sheet.png", {
        sliceX: 6,
        sliceY: 1,
    }).onFinish(addProgress) // 1
    k.loadSprite("checker_down", "textures/interfaces/checkers2.png").onFinish(addProgress) // 2
    k.loadSprite("bean", "sprites/bean.png").onFinish(addProgress) // 3
    k.loadSprite("bullet_sp", "textures/projectiles/bullet.png").onFinish(addProgress) // 4
    k.loadSprite("x_mark", "textures/obstacles/x_mark.png").onFinish(addProgress) // 5
    k.loadSprite("warning_rect", "textures/interfaces/warning_rect_sheet.png", {
        sliceX: 3,
        sliceY: 1,
        anims: {
            dance: { from: 0, to: 2, loop: true, speed: 15 },
        },
    }).onFinish(addProgress) // 6
    k.loadSprite("slime", "textures/mobs/slime-Sheet.png", {
        sliceX: 5,
        sliceY: 1,
        anims: {
            idle: { from: 0, to: 1, speed: 11, loop: true },
            spawn: { from: 2, to: 4, speed: 9 },
            die: { from: 4, to: 2, speed: 8.5 },
        },
    }).onFinish(addProgress) // 7
    k.loadSprite("heart_beat", "textures/interfaces/heart_beat_sheet.png", {
        sliceX: 8,
        sliceY: 1,
        anims: {
            beat: { from: 0, to: 7, speed: 9, loop: true },
        },
    }).onFinish(addProgress) // 8
    k.loadSprite("stairs", "textures/doors/stair_down.png").onFinish(addProgress) // 9
    k.loadFont("pixel_font", "fonts/alpha-beta/alpha-beta-brk.regular.ttf").onFinish(addProgress) // 10
    k.loadShader("radial_shade", null, radialShade).onFinish(addProgress) // 11
}

const ready = (k) => {
    k.layers(["background", "game", "foreground"], "game")

    addGameAutoSystem(k)
    addDoorSystem(k)
    addLevelStairsSystem(k)
    addBulletSystem(k)
    faderEvent.onUpdate(k)
    addHpInterfaceSystem(k)
    addPlayerSystem(k)
    addSlimeaSystem(k)

    k.add(makeFader(k))

    const hpInterface = k.add(makeHpInterface(k))
    hpInterface.changeHpValue(2)

    const gameAuto = k.add(makeGameAuto(k))

    const house = k.add(makeHouse(k, 0, 0))
    house.loadRooms(level)

    const gameAutoEvents = [
        gameAuto.on("teleported", () => house.putNewRoom()),
        gameAuto.on("found_monsters", monsters => house.putMonsters(monsters)),
        gameAuto.on("give_new_level", levelData => {
            house.loadRooms(levelData)
            house.putNewRoom()
        }),
        gameAuto.on("house_reset", (coordX, coordY) => {
            house.houseReset(coordX, coordY)
        }),
    ]
    house.onDestroy(() => gameAutoEvents.forEach(ev => ev.cancel()))

    house.on("entered_new_room", destPos => gameAuto.mobEnteredNewRoom(destPos))
    house.on("entered_stairs", () => gameAuto.mobEnteredStairs())

    house.on("player_hp_changed", hp => hpInterface.changeHpValue(hp))
    house.on("player_died", () => gameAuto.playerDie())

    house.initRoom()
}

const gameRun = k => {
    let finishCount = 0
    let gameReady = false
    startLoad(k, () => {
        finishCount++
        if (finishCount >= MAX_ASSETS_COUNT && !gameReady) {
            ready(k)
            gameReady = true
        }
    })
}

const gamePlugin = k => ({
    run: () => {
        gameRun(k)
    },
})

export default gamePlugin
