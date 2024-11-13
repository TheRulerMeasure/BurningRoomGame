import makeMover from "./mover"

const SlimeaStates = {
    IDLING:     0,
    CHASING:    1,
    DANCING:    2,
    ATTACKING:  3,
    RECOVERING: 4,
    DYING:      5,
    SPAWNING:   6,
}

const onSlimeaEnterSpawning = (k, slimea) => {
    slimea.spritePlay("spawn")
}

const onSlimeaEnterState = (k, slimea, newState) => {
    if (newState == SlimeaStates.SPAWNING) {
        onSlimeaEnterSpawning(k, slimea)
    }
    if (newState == SlimeaStates.IDLING) {
        slimea.spritePlay("idle")
    }
}

const onSlimeaLeaveState = (k, slimea, oldState) => {

}

const updateSlimeaIdling = (k, slimea) => {
    if (!slimea.spawned) {
        return SlimeaStates.SPAWNING
    }
    return -1
}

const updateSlimeaChasing = (k, slimea) => {
    return -1
}

const updateSlimeaDancing = (k, slimea) => {
    return -1
}

const updateSlimeaAttacking = (k, slimea) => {
    return -1
}

const updateSlimeaRecovering = (k, slimea) => {
    return -1
}

const updateSlimeaDying = (k, slimea) => {
    return -1
}

const updateSlimeaSpawning = (k, slimea) => {
    if (slimea.spawned) {
        return SlimeaStates.IDLING
    }
    const animationTime = 0.75
    if (slimea.stateTimeElapse >= animationTime) {
        slimea.spawned = true
        return SlimeaStates.IDLING
    }
    return -1
}

const onUpdateSystem = k => {
    k.onUpdate("slimea", slimea => {
        let newState = -1
        slimea.stateTimeElapse += k.dt()
        switch (slimea.currentState) {
            case SlimeaStates.CHASING:
                newState = updateSlimeaChasing(k, slimea)
                break
            case SlimeaStates.DANCING:
                newState = updateSlimeaDancing(k, slimea)
                break
            case SlimeaStates.ATTACKING:
                newState = updateSlimeaAttacking(k, slimea)
                break
            case SlimeaStates.RECOVERING:
                newState = updateSlimeaRecovering(k, slimea)
                break
            case SlimeaStates.DYING:
                newState = updateSlimeaDying(k, slimea)
                break
            case SlimeaStates.SPAWNING:
                newState = updateSlimeaSpawning(k, slimea)
                break
            default: // IDLING
                newState = updateSlimeaIdling(k, slimea)
                break
        }
        if (newState >= 0) {
            slimea.stateTimeElapse = 0.0
            onSlimeaEnterState(k, slimea, slimea.currentState)
            slimea.currentState = newState
            onSlimeaLeaveState(k, slimea, slimea.currentState)
        }
    })
}

const makeSlimea = (k, posVec) => {
    const comp = createMoverComp(1245, 109, 960)
    const slimea = makeMover(k, posVec, 32, 32, "slimea", comp)
    const slimeSp = k.make([
        k.pos(),
        k.sprite("slime", { anim: "idle" }),
        k.anchor("center"),
    ])
    slimea.add(slimeSp)
    slimea.currentState = SlimeaStates.IDLING
    slimea.stateTimeElapse = 0.0
    slimea.spawned = false
    slimea.spritePlay = animName => slimeSp.play(animName)
    return slimea
}

const addSlimeaSystem = k => {
    [
        onUpdateSystem,
    ].forEach(s => s(k))
}

export default makeSlimea
export { addSlimeaSystem }
