import { GameStates } from "./gameAuto"
import { getWorldPosFromCellv, TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"

const TeleportConst = {
    ENTER_DURATION: 0.25,
    EXIT_DURATION: 0.25,
}

const makeTeleporter = (k, pos, width, height, destPos) => {
    return k.make([
        k.pos(pos),
        k.rect(width, height),
        // k.opacity(0),
        k.area(),
        "teleporter",
        {
            destPos: destPos,
        },
    ])
}

const makeTileTeleporter = (k, cellv, destPos) => {
    return makeTeleporter(
        k,
        getWorldPosFromCellv(k, cellv).add(TILE_WIDTH * 0.25, TILE_HEIGHT * 0.25),
        TILE_WIDTH * 0.5,
        TILE_HEIGHT * 0.5,
        destPos
    )
}

const teleporterOnCollide = (teleporter, gameAuto) => {
    if (gameAuto.currentState != GameStates.NORMAL) {
        return
    }
    gameAuto.teleportDestPos = teleporter.destPos
}

const teleporterEvent = {
    onCollide: (k, gameAuto) => {
        k.onCollide("player", "teleporter", (_, b) => teleporterOnCollide(b, gameAuto))
    }
}

export { TeleportConst }

export { teleporterEvent, makeTeleporter }
export default makeTileTeleporter
