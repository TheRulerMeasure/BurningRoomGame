import { TeleportConst } from "./teleporter"

const GameStates = {
    NORMAL: 0,
    ENTERING_TELEPORTER: 1,
    LEAVING_TELEPORTER: 2,
}

const gameUpdateNormal = (g) => {
    if (!g.teleportDestPos.isZero()) {
        return GameStates.ENTERING_TELEPORTER
    }
    return -1
}

const gameUpdateEnteringTeleporter = (k, g, dt) => {
    g.teleTimeElapse += dt
    if (g.teleTimeElapse >= TeleportConst.ENTER_DURATION) {
        g.teleTimeElapse = 0.0
        let query = k.get("player")
        if (query.length > 0) {
            query[0].pos = k.vec2(g.teleportDestPos)
            // k.camPos(k.vec2(query[0].pos))
        }
        return GameStates.LEAVING_TELEPORTER
    }
    return -1
}

const gameUpdateLeavingTeleporter = (k, g, dt) => {
    g.teleTimeElapse += dt
    if (g.teleTimeElapse >= TeleportConst.EXIT_DURATION) {
        g.teleTimeElapse = 0.0
        g.teleportDestPos = k.vec2()
        return GameStates.NORMAL
    }
    return -1
}

const gameUpdate = (k, g) => {
    let newState = -1
    switch (g.currentState) {
        case GameStates.ENTERING_TELEPORTER:
            newState = gameUpdateEnteringTeleporter(k, g, k.dt())
            break
        case GameStates.LEAVING_TELEPORTER:
            newState = gameUpdateLeavingTeleporter(k, g, k.dt())
            break
        default:
            newState = gameUpdateNormal(g)
            break
    }
    if (newState >= 0) {
        g.currentState = newState
    }
}

const newGameAuto = (k) => ({
    currentState: GameStates.NORMAL,
    teleTimeElapse: 0.0,
    teleportDestPos: k.vec2(),
})

export default newGameAuto
export { gameUpdate, GameStates }
