import { GameStates } from "./gameAuto"

const createMoverComp = (acceleration, maxSpeed, friction) => {
    return {
        acceleration: acceleration,
        maxSpeed: maxSpeed,
        friction: friction,
    }
}

const makeMover = (k, pos, width, height, tag, moverComp) => {
    const mover = k.make([
        k.pos(k.vec2(pos)),
        k.rect(width, height),
        k.area(),
        k.body(),
        k.anchor("center"),
        tag,
        "mover",
        {
            moveProcessing: true,
            motionAxis: k.vec2(),
            acceleration: moverComp.acceleration,
            maxSpeed: moverComp.maxSpeed,
            friction: moverComp.friction,
        },
    ])
    mover.collisionIgnore.push("mover")
    return mover
}

const addMoverSystem = (k) => {
    k.onFixedUpdate("mover", mover => {
        if (!mover.moveProcessing) {
            mover.vel = k.vec2()
            return
        }
        let vel = k.vec2(mover.vel)
        if (mover.motionAxis.isZero()) {
            const amount = mover.friction * k.fixedDt()
            if (vel.len() < amount) {
                vel = k.vec2(0, 0)
            } else {
                vel = vel.sub(vel.unit().scale(amount))
            }
        } else {
            const motion = mover.motionAxis.scale(mover.acceleration * k.fixedDt())
            vel = vel.add(motion)
            vel = vel.unit().scale(Math.min(vel.len(), mover.maxSpeed))
        }
        mover.vel = k.vec2(vel)
    })
}

export default makeMover
export { createMoverComp, addMoverSystem }
