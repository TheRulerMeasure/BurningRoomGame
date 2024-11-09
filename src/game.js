import makePlayer from "./mob"
import { addMoverSystem } from "./mover"
import { getInputVec } from "./kputil"
import { getWorldPosFromCellvCenter, TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"
import newGameAuto, { GameStates, gameUpdate } from "./gameAuto"
import radialShade from "./shaders/radialshade"
import makeFader, { faderEvent } from "./gameFader"
import makeRoom, { addDoorSystem, DOOR_DOWN, DOOR_RIGHT, DOOR_UP, getRoomCenterWorldPos } from "./room"
import makeRooms from "./house"

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
    addDoorSystem(k)
    faderEvent.onUpdate(k, gameAuto)

    k.onUpdate("player", player => {
        if (gameAuto.currentState != GameStates.NORMAL) {
            player.motionAxis = k.vec2(0, 0)
        } else {
            player.motionAxis = getInputVec(k)
        }
    })

    k.add(makeFader(k))

    const newRoomCallback = (destInfo) => {
        k.camPos(destInfo.camDestPos)
        k.get("player").forEach(p => {
            p.pos = destInfo.playerDestPos
        })
    }

    const rooms = makeRooms(k, 0, 0, newRoomCallback)
    rooms.forEach(room => {
        room.forEach(t => k.add(t))
    })

    const playerPos = getWorldPosFromCellvCenter(k, k.vec2(4, 3))
    k.add(makePlayer(k, playerPos))
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
