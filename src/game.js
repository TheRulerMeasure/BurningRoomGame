import makePlayer, { addPlayerSystem } from "./mob"
import { addMoverSystem } from "./mover"
import { getWorldPosFromCellvCenter, TILE_HEIGHT } from "./gameConstant"
import radialShade from "./shaders/radialshade"
import makeFader, { faderEvent } from "./gameFader"
import { addDoorSystem, getRoomCenterWorldPos } from "./room"
import makeRooms from "./house"
import makeGameAuto, { addGameAutoSystem } from "./gameAuto"
import { addBulletSystem } from "./bullet"

const MAX_ASSETS_COUNT = 6

const startLoad = (k, addProgress) => {
    k.loadSprite("ft_tile", "textures/tilemaps/ft_tile_sheet.png", {
        sliceX: 6,
        sliceY: 1,
    }).onFinish(addProgress) // 1
    k.loadSprite("checker_down", "textures/interfaces/checkers2.png").onFinish(addProgress) // 2
    k.loadSprite("bean", "sprites/bean.png").onFinish(addProgress) // 3
    k.loadSprite("bullet_sp", "textures/projectiles/bullet.png").onFinish(addProgress) // 4
    k.loadSprite("x_mark", "textures/obstacles/x_mark.png").onFinish(addProgress) // 5
    k.loadFont("pixel_font", "fonts/alpha-beta/alpha-beta-brk.regular.ttf").onFinish(addProgress) // 6
    k.loadShader("radial_shade", null, radialShade).onFinish(addProgress) // 7
}

const ready = (k) => {
    k.layers(["background", "game", "foreground"], "game")

    addGameAutoSystem(k)
    addMoverSystem(k)
    addDoorSystem(k)
    addBulletSystem(k)
    faderEvent.onUpdate(k)
    addPlayerSystem(k)

    k.add(makeFader(k))

    const gameAuto = k.add(makeGameAuto(k))

    const rooms = makeRooms(k, 0, 0, gameAuto.newRoomCallback)
    rooms.forEach(room => k.add(room))

    const playerPos = getWorldPosFromCellvCenter(k, k.vec2(5, 5))
    k.add(makePlayer(k, playerPos))
    k.camPos(getRoomCenterWorldPos(k, k.vec2(0, 0)).add(0, TILE_HEIGHT * -0.5))

    // test
    // rooms[2].blockDoors()
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
