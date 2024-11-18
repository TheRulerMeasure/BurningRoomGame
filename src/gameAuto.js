import { default as levelA } from "./levels/levela"
import { default as levelA2 } from "./levels/levela2"
import { default as LevelB } from "./levels/levelb"
import { default as LevelC } from "./levels/levelc"
import { default as LevelD } from "./levels/leveld"
import { default as LevelE } from "./levels/levele"
import { getRoomCenterWorldPos } from "./room"
import { makeStatsLabel } from "./roomlabel"
import { TeleportConst } from "./teleporter"

const GameStates = {
    NORMAL: 0,
    ENTERING_TELEPORTER: 1,
    LEAVING_TELEPORTER: 2,
    ENTERING_STAIRS: 3,
    LEAVING_STAIRS: 4,
    RESTARTING_LEVEL: 5,
}

const makeGameAuto = (k) => {
    const room = {
        destInfo: null,
    }
    const level = {
        levelDatas: [levelA2, levelA, LevelB, LevelC, LevelD, LevelE],
        currentIndex: 0,
        enteredStairs: false,
    }
    const playerInfo = {
        playerAlive: true,
        playerHealth: 2,
        playerAttackSpeed: 2.9,
        rebirth: 0,
    }

    const gAuto = k.make([
        k.pos(0, 0),
        "game_auto",
        {
            currentState: GameStates.NORMAL,
            transitionTime: 0.0,

            getDestInfo: () => room.destInfo,

            freeDestInfo: () => room.destInfo = null,

            mobEnteredNewRoom: destInfo => room.destInfo = destInfo,

            mobEnteredStairs: () => {
                level.currentIndex++
                level.enteredStairs = true
            },

            nextLevelFromCurIndex: () => {
                level.enteredStairs = false
                if (level.levelDatas[level.currentIndex]) {
                    console.log("has level")
                } else {
                    console.log("no level")
                }
                return level.levelDatas[level.currentIndex]
            },

            wantsToGoNewLevel: () => level.enteredStairs,

            playerDie: () => {
                playerInfo.playerAlive = false
                playerInfo.playerHealth += 1
                playerInfo.playerAttackSpeed += 0.5
            },
            playerRevive: () => {
                playerInfo.playerAlive = true
                playerInfo.rebirth += 1
                k.add(makeStatsLabel(k, playerInfo))
            },

            getCurPlayerHealth: () => playerInfo.playerHealth,
            getCurPlayerAttackSpeed: () => playerInfo.playerAttackSpeed,

            isPlayerAlive: () => playerInfo.playerAlive,
        },
    ])
    return gAuto
}

const updateNormal = (k, gAuto) => {
    if (gAuto.getDestInfo()) {
        k.get("mover").forEach(mover => mover.moveProcessing = false)
        k.get("game_fader").forEach(fader => fader.faderOut())
        return GameStates.ENTERING_TELEPORTER
    }
    if (gAuto.wantsToGoNewLevel()) {
        return GameStates.ENTERING_STAIRS
    }
    if (!gAuto.isPlayerAlive()) {
        return GameStates.RESTARTING_LEVEL
    }
    return -1
}

const updateEnteringTele = (k, gAuto, dt) => {
    gAuto.transitionTime += dt
    if (gAuto.transitionTime >= TeleportConst.ENTER_DURATION) {
        gAuto.transitionTime = 0.0
        k.get("player").forEach(p => p.pos = gAuto.getDestInfo().playerDestPos)
        k.get("game_fader").forEach(fader => fader.faderIn())
        k.camPos(gAuto.getDestInfo().camDestPos)
        gAuto.trigger("teleported")
        return GameStates.LEAVING_TELEPORTER
    }
    return -1
}

const updateLeavingTele = (k, gAuto, dt) => {
    gAuto.transitionTime += dt
    let exitDuration = TeleportConst.EXIT_DURATION
    if (gAuto.getDestInfo().monsters) {
        if (!gAuto.getDestInfo().monsters.spawned) {
            exitDuration += 0.5
        }
    }
    if (gAuto.transitionTime >= exitDuration) {
        gAuto.transitionTime = 0.0
        k.get("mover").forEach(mover => mover.moveProcessing = true)
        if (gAuto.getDestInfo().monsters) {
            if (!gAuto.getDestInfo().monsters.spawned) {
                gAuto.trigger("found_monsters", gAuto.getDestInfo().monsters)
            }
        }
        gAuto.freeDestInfo()
        return GameStates.NORMAL
    }
    return -1
}

const updateEnteringStairs = (k, gAuto, dt) => {
    return GameStates.LEAVING_STAIRS
}

const updateLeavingStairs = (k, gAuto, dt) => {
    const levelData = gAuto.nextLevelFromCurIndex()
    const posVec = getRoomCenterWorldPos(k, k.vec2(levelData.startCoord.x, levelData.startCoord.y))
    k.get("player").forEach(p => p.pos = posVec)
    k.camPos(posVec)
    gAuto.trigger("give_new_level", levelData)
    return GameStates.NORMAL
}

const updateRestartingLevel = (k, gAuto, dt) => {
    const levelData = gAuto.nextLevelFromCurIndex()
    const posVec = getRoomCenterWorldPos(k, k.vec2(levelData.startCoord.x, levelData.startCoord.y))
    k.get("player").forEach(p => {
        p.setHP(gAuto.getCurPlayerHealth())
        p.shootSpeed = gAuto.getCurPlayerAttackSpeed()
        p.pos = posVec
    })
    k.get("hp_bar").forEach(bar => {
        bar.changeHpValue(2)
    })
    k.camPos(posVec)
    gAuto.trigger("house_reset", levelData.startCoord.x, levelData.startCoord.y)
    gAuto.playerRevive()
    return GameStates.NORMAL
}

const gameAutoUpdate = (k, gAuto) => {
    let newState = -1
    switch (gAuto.currentState) {
        case GameStates.ENTERING_TELEPORTER:
            newState = updateEnteringTele(k, gAuto, k.dt())
            break
        case GameStates.LEAVING_TELEPORTER:
            newState = updateLeavingTele(k, gAuto, k.dt())
            break
        case GameStates.ENTERING_STAIRS:
            newState = updateEnteringStairs(k, gAuto, k.dt())
            break
        case GameStates.LEAVING_STAIRS:
            newState = updateLeavingStairs(k, gAuto, k.dt())
            break
        case GameStates.RESTARTING_LEVEL:
            newState = updateRestartingLevel(k, gAuto, k.dt())
            break
        default:
            newState = updateNormal(k, gAuto)
            break
    }
    if (newState >= 0) {
        gAuto.currentState = newState
    }
}

const addGameAutoSystem = (k) => {
    k.onUpdate("game_auto", gAuto => {
        gameAutoUpdate(k, gAuto)
    })
}

export default makeGameAuto
export { addGameAutoSystem, GameStates }
