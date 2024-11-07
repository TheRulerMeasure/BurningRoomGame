import makeMover, { createMoverComp } from "./mover"

const makePlayer = (k, pos) => {
    const comp = createMoverComp(1437, 163, 964)
    const player = makeMover(k, pos, 32, 32, "player", comp)
    player.collisionIgnore.push("door")
    return player
}

export default makePlayer
