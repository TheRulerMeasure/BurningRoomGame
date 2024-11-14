import makeMover, { createMoverComp } from "./mover"

const SlimeaStates = {
    IDLING:     0,
    CHASING:    1,
    DANCING:    2,
    ATTACKING:  3,
    RECOVERING: 4,
    DYING:      5,
    SPAWNING:   6,
}

const getWaypointAroundPos = (k, slimeaPos, plPos) => {
    let angDeg = slimeaPos.sub(plPos).unit().angle()
    angDeg += k.rand() * 45 * (k.rand() < 0.5 ? -1 : 1)
    const radius = 200.0 + k.rand() * 100.0
    const dir = k.Vec2.fromAngle(angDeg)
    const wp = k.vec2(plPos).add(dir.scale(radius))
    return wp
}

const onSlimeaEnterAttacking = (k, slimea) => {
    slimea.acceleration = slimea.attackMoverComp.acceleration
    slimea.maxSpeed = slimea.attackMoverComp.maxSpeed
    slimea.friction = slimea.attackMoverComp.friction
    let attackDir = k.vec2(1, 0)
    const players = k.get("player")
    if (players.length <= 0) {
        slimea.attackDir = attackDir
    } else {
        attackDir = players[0].pos.sub(slimea.pos).unit()
        slimea.attackDir = attackDir
    }
    slimea.setSpriteFlip(slimea.attackDir.x < 0)
}

const onSlimeaLeaveAttacking = (k, slimea) => {
    slimea.acceleration = slimea.normalMoverComp.acceleration
    slimea.maxSpeed = slimea.normalMoverComp.maxSpeed
    slimea.friction = slimea.normalMoverComp.friction
}

const onSlimeaEnterRecovering = (k, slimea) => {
    slimea.acceleration = slimea.attackMoverComp.acceleration
    slimea.maxSpeed = slimea.attackMoverComp.maxSpeed
    slimea.friction = slimea.attackMoverComp.friction
}

const onSlimeaLeaveRecovering = (k, slimea) => {
    slimea.acceleration = slimea.normalMoverComp.acceleration
    slimea.maxSpeed = slimea.normalMoverComp.maxSpeed
    slimea.friction = slimea.normalMoverComp.friction
}

const onSlimeaEnterDying = (k, slimea) => {
    slimea.died()
    slimea.spritePlay("die")
}

const onSlimeaEnterState = (k, slimea, newState) => {
    if (newState == SlimeaStates.SPAWNING) {
        slimea.spritePlay("spawn")
    } else if (newState == SlimeaStates.IDLING) {
        slimea.spritePlay("idle")
    } else if (newState == SlimeaStates.ATTACKING) {
        onSlimeaEnterAttacking(k, slimea)
    } else if (newState == SlimeaStates.RECOVERING) {
        onSlimeaEnterRecovering(k, slimea)
    } else if (newState == SlimeaStates.DYING) {
        onSlimeaEnterDying(k, slimea)
    }
}

const onSlimeaLeaveState = (k, slimea, oldState) => {
    if (oldState == SlimeaStates.DANCING) {
        slimea.danceTimeElapse = 0.0
    } else if (oldState == SlimeaStates.ATTACKING) {
        onSlimeaLeaveAttacking(k, slimea)
    } else if (oldState == SlimeaStates.RECOVERING) {
        onSlimeaLeaveRecovering(k, slimea)
    }
}

const updateSlimeaIdling = (k, slimea) => {
    if (slimea.hp() <= 0) {
        return SlimeaStates.DYING
    }
    if (!slimea.spawned) {
        return SlimeaStates.SPAWNING
    }
    if (k.get("player").length > 0) {
        return SlimeaStates.CHASING
    }
    slimea.motionAxis = k.vec2()
    return -1
}

const updateSlimeaChasing = (k, slimea) => {
    if (slimea.hp() <= 0) {
        return SlimeaStates.DYING
    }
    const players = k.get("player")
    if (players.length <= 0) {
        return SlimeaStates.IDLING
    }
    const direction = players[0].pos.sub(slimea.pos).unit()
    slimea.motionAxis = direction
    slimea.setSpriteFlip(slimea.motionAxis.x < 0)
    if (slimea.pos.dist(players[0].pos) < 198) {
        return SlimeaStates.DANCING
    }
    return -1
}

const updateSlimeaDancing = (k, slimea) => {
    if (slimea.hp() <= 0) {
        return SlimeaStates.DYING
    }
    const players = k.get("player")
    if (players.length <= 0) {
        return SlimeaStates.IDLING
    }
    if (slimea.pos.dist(players[0].pos) > 312) {
        return SlimeaStates.CHASING
    }
    slimea.danceTimeElapse += k.dt()
    if (slimea.danceTimeElapse >= 0.5) {
        slimea.danceTimeElapse = 0.0
        slimea.currentDanceWaypoint = getWaypointAroundPos(k, slimea.pos, players[0].pos)
    }
    slimea.motionAxis = slimea.currentDanceWaypoint.sub(slimea.pos).unit()
    slimea.setSpriteFlip(slimea.motionAxis.x < 0)
    if (slimea.stateTimeElapse >= 2.1) {
        return SlimeaStates.ATTACKING
    }
    return -1
}

const updateSlimeaAttacking = (k, slimea) => {
    if (slimea.hp() <= 0) {
        return SlimeaStates.DYING
    }
    if (slimea.stateTimeElapse < 0.68) {
        slimea.motionAxis = k.vec2(slimea.attackDir)
        return -1
    }
    return SlimeaStates.RECOVERING
}

const updateSlimeaRecovering = (k, slimea) => {
    if (slimea.hp() <= 0) {
        return SlimeaStates.DYING
    }
    slimea.motionAxis = k.vec2()
    if (slimea.stateTimeElapse >= 2.27) {
        return SlimeaStates.CHASING
    }
    return -1
}

const updateSlimeaDying = (k, slimea) => {
    slimea.motionAxis = k.vec2()
    if (slimea.stateTimeElapse >= 0.5) {
        k.destroy(slimea)
    }
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
    slimea.motionAxis = k.vec2()
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
            onSlimeaLeaveState(k, slimea, slimea.currentState)
            slimea.currentState = newState
            onSlimeaEnterState(k, slimea, slimea.currentState)
        }
    })
}

const makeSlimea = (k, posVec) => {
    const comp = createMoverComp(1245, 109, 960)
    const slimea = makeMover(k, posVec, 32, 32, "slimea", comp)
    slimea.use(k.health(10))
    const hitbox = k.make([
        k.pos(),
        k.rect(64, 64),
        k.area(),
        k.anchor("center"),
        k.opacity(0),
        "team2_hitbox",
        {
            takeDamage: (dmg, direction) => {
                slimea.hurt(dmg)
            },
        },
    ])
    slimea.add(hitbox)
    const slimeSp = k.make([
        k.pos(),
        k.sprite("slime", { anim: "idle" }),
        k.anchor("center"),
    ])
    slimea.add(slimeSp)
    slimea.normalMoverComp = comp
    slimea.attackMoverComp = createMoverComp(3359, 500, 847)
    slimea.currentState = SlimeaStates.IDLING
    slimea.stateTimeElapse = 0.0
    slimea.danceTimeElapse = 0.0
    slimea.currentDanceWaypoint = k.vec2()
    slimea.atackDir = k.vec2()
    slimea.spawned = false
    slimea.spritePlay = animName => slimeSp.play(animName)
    slimea.setSpriteFlip = flip => slimeSp.flipX = flip
    slimea.diedListeners = []
    slimea.onDied = function (cb) {
        this.diedListeners.push(cb)
    }
    slimea.died = function () {
        this.diedListeners.forEach(cb => cb())
    }
    return slimea
}

const addSlimeaSystem = k => {
    [
        onUpdateSystem,
    ].forEach(s => s(k))
}

export default makeSlimea
export { addSlimeaSystem }
