import makePlayer, { addPlayerSystem } from "./mob"
import { getWorldPosFromCellvCenter, TILE_HEIGHT } from "./gameConstant"
import radialShade from "./shaders/radialshade"
import makeFader, { faderEvent } from "./gameFader"
import { addDoorSystem, getRoomCenterWorldPos } from "./room"
import makeHouse from "./house"
import makeGameAuto, { addGameAutoSystem } from "./gameAuto"
import { addBulletSystem } from "./bullet"
import { addSlimeaSystem } from "./slimea"

const MAX_ASSETS_COUNT = 9

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
    k.loadFont("pixel_font", "fonts/alpha-beta/alpha-beta-brk.regular.ttf").onFinish(addProgress) // 8
    k.loadShader("radial_shade", null, radialShade).onFinish(addProgress) // 9
}

const ready = (k) => {
    k.layers(["background", "game", "foreground"], "game")

    addGameAutoSystem(k)
    addDoorSystem(k)
    addBulletSystem(k)
    faderEvent.onUpdate(k)
    addPlayerSystem(k)
    addSlimeaSystem(k)

    k.add(makeFader(k))

    const gameAuto = k.add(makeGameAuto(k))

    const house = k.add(makeHouse(k, 2, 0))

    const evTeleport = [
        gameAuto.on("teleported", () => house.putNewRoom()),
        gameAuto.on("found_monsters", monsters => house.putMonsters(monsters)),
    ]
    house.onDestroy(() => evTeleport.forEach(ev => ev.cancel()))

    house.on("entered_new_room", destPos => gameAuto.mobEnteredNewRoom(destPos))

    house.initRoom()
    // rooms.forEach(room => k.add(room))

    // const playerPos = getWorldPosFromCellvCenter(k, k.vec2(5, 5))
    // k.add(makePlayer(k, playerPos))
    // k.camPos(getRoomCenterWorldPos(k, k.vec2(0, 0)).add(0, TILE_HEIGHT * -0.5))
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
