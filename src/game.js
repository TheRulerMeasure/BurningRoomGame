import makePlayer from "./mob"
import { addMoverSystem } from "./mover"
import { getInputVec } from "./kputil"
import { getWorldPosFromCellvCenter, TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import newGameAuto, { GameStates, gameUpdate } from "./gameAuto"
import { teleporterEvent } from "./teleporter"
import radialShade from "./shaders/radialshade"
import makeFader, { faderEvent } from "./gameFader"
import makeRoom, { getRoomCenterWorldPos } from "./room"

const MAX_ASSETS_COUNT = 4

const startLoad = (k, addProgress) => {
    k.loadSprite("ft_tile", "textures/tilemaps/ft_tile_sheet.png", {
        sliceX: 6,
        sliceY: 1,
    }).onFinish(addProgress) // 1
    k.loadSprite("checker_down", "textures/interfaces/checkers2.png").onFinish(addProgress) // 2
    k.loadFont("pixel_font", "fonts/alpha-beta/alpha-beta-brk.regular.ttf").onFinish(addProgress) // 3
    k.loadShader("radial_shade", null, radialShade).onFinish(addProgress) // 4
}

const ready = (k) => {
    k.layers(["background", "game", "foreground"], "game")

    const gameAuto = newGameAuto(k)
    k.onUpdate(() => gameUpdate(k, gameAuto))
    addMoverSystem(k, gameAuto)
    teleporterEvent.onCollide(k, gameAuto)
    faderEvent.onUpdate(k, gameAuto)
    k.onCollide("player", "jerk", (pl, jerk, col) => {
        console.log("collided with a jerk")
    })

    k.onCollide("player", "jack", (pl, jack, col) => {
        console.log("collided with a jack")
    })

    k.onCollide("player", "my_door", (pl, door, col) => {
        console.log("collided with a DOOR")
    })

    k.onUpdate("player", player => {
        if (gameAuto.currentState != GameStates.NORMAL) {
            player.motionAxis = k.vec2(0, 0)
        } else {
            player.motionAxis = getInputVec(k)
        }
    })

    k.add(makeFader(k))

    const enterCallback = dir => {
        k.debug.log(dir)
    }

    makeRoom(k, 9, 7, k.vec2(0, 0), enterCallback, { right: true, down: true }).forEach(tile => k.add(tile))
    makeRoom(k, 9, 7, k.vec2(1, 0), enterCallback, { left: true, down: true }).forEach(tile => k.add(tile))
    makeRoom(k, 3, 5, k.vec2(0, 1), enterCallback, { right: true, up: true }).forEach(tile => k.add(tile))
    makeRoom(k, 9, 7, k.vec2(1, 1), enterCallback, { left: true, up: true }).forEach(tile => k.add(tile))

    const playerPos = getWorldPosFromCellvCenter(k, k.vec2(4, 3))
    k.add(makePlayer(k, playerPos))
    k.camPos(getRoomCenterWorldPos(k, k.vec2(0, 0)).add(0, TILE_HEIGHT * -0.5))

    k.add([
        k.pos(32, 32),
        k.rect(100, 100),
        k.area(),
        "jerk",
    ])

    k.add([
        k.pos(32, 256),
        k.rect(100, 100),
        k.area(),
        "jack",
    ])

    k.add([
        k.pos(256, 256),
        k.rect(TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5),
        k.area(),
        "my_door",
    ])
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
