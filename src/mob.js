import makeBullet from "./bullet"
import { getInputVec } from "./kputil"
import makeMover, { createMoverComp } from "./mover"

const makePlayer = (k, pos) => {
    const comp = createMoverComp(1437, 163, 964)
    const player = makeMover(k, pos, 32, 32, "player", comp)
    player.shootAt = (targetPos, fromPos) => {
        const dir = targetPos.sub(fromPos).unit()
        k.add(makeBullet(k, fromPos, dir, 500))
    }
    return player
}

const makeEnemy = (k, pos) => {
    const comp = createMoverComp(1153, 109, 960)
    const enemy = makeMover(k, pos, 32, 32, "enemy", comp)
    return enemy
}

const addPlayerSystem = (k) => {
    k.onUpdate("player", player => {
        player.motionAxis = getInputVec(k)
        if (k.isButtonPressed("shoot")) {
            const toPos = k.toWorld(k.mousePos())
            player.shootAt(toPos, player.pos)
        }
    })
}

export default makePlayer
export { addPlayerSystem }
