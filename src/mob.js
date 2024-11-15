import makeBullet from "./bullet"
import { getInputVec } from "./kputil"
import makeMover, { createMoverComp } from "./mover"

const gunComp = k => ({
    id: "gunComp",
    require: ["pos"],
    shootAt(targetPos) {
        const dir = targetPos.sub(this.pos).unit()
        k.add(makeBullet(k, k.vec2(this.pos), dir, 500))
    },
})

const makePlayer = (k, pos) => {
    const comp = createMoverComp(1437, 163, 964)
    const player = makeMover(k, pos, 32, 32, "player", comp)
    player.use(gunComp(k))
    return player
}

const addPlayerSystem = (k) => {
    k.onUpdate("player", player => {
        player.motionAxis = getInputVec(k)
        if (k.isButtonPressed("shoot")) {
            const toPos = k.toWorld(k.mousePos())
            player.shootAt(toPos)
        }
    })
}

export default makePlayer
export { addPlayerSystem }
