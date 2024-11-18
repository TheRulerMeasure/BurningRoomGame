import { GameStates } from "./gameAuto"

const createMoverComp = (acceleration, maxSpeed, friction) => {
    return {
        acceleration: acceleration,
        maxSpeed: maxSpeed,
        friction: friction,
    }
}

const moverFixedUpdate = (k, mover) => {
    if (!mover.moveProcessing) {
        mover.vel = k.vec2()
        return
    }
    let vel = k.vec2(mover.vel)
    if (mover.motionAxis.isZero()) {
        const amount = mover.movementInfo.friction * k.fixedDt()
        if (vel.len() < amount) {
            vel = k.vec2(0, 0)
        } else {
            vel = vel.sub(vel.unit().scale(amount))
        }
    } else {
        const motion = mover.motionAxis.scale(mover.movementInfo.acceleration * k.fixedDt())
        vel = vel.add(motion)
        vel = vel.unit().scale(Math.min(vel.len(), mover.movementInfo.maxSpeed))
    }
    mover.vel = k.vec2(vel)
}

const moverComp = (k) => {
    return {
        id: "moverComp",
        require: ["pos", "body"],
        moveProcessing: true,
        motionAxis: k.vec2(),
        movementInfo: {
            acceleration: 1437,
            maxSpeed: 163,
            friction: 964,
        },

        fixedUpdate() { moverFixedUpdate(k, this) },

        setMovementProperties(mInfo) {
            this.movementInfo.acceleration = mInfo.acceleration
            this.movementInfo.maxSpeed = mInfo.maxSpeed
            this.movementInfo.friction = mInfo.friction
        },
    }
}

const makeMover = (k, pos, width, height) => {
    const mover = k.make([
        k.pos(k.vec2(pos)),
        k.rect(width, height),
        k.area(),
        k.body(),
        k.anchor("center"),
        k.opacity(0),
        moverComp(k),
        "mover",
    ])
    mover.collisionIgnore.push("mover")
    return mover
}

export default makeMover
export { createMoverComp }
