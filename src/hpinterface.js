import { GAME_HEIGHT, GAME_WIDTH } from "./gameConstant"

const healthInterfaceComp = k => {
    return {
        id: "health_interface",

        maxSpritesCount: 6,

        changeHpValue(hp) {
            this.children.forEach(heartBeat => {
                heartBeat.hidden = true
            })
            const count = Math.min(this.maxSpritesCount, hp)
            for (let i = 0; i < count; i++) {
                this.children[i].hidden = false
            }
        },
    }
}

const makeHeartBeat = (k, posVec) => k.make([
    k.pos(posVec),
    k.sprite("heart_beat", { anim: "beat" }),
])

const makeHpInterface = k => {
    const hpInterface = k.make([
        k.pos(0, 0),
        healthInterfaceComp(k),
        k.layer("foreground"),
        "hp_bar",
    ])
    for (let i = 0; i < hpInterface.maxSpritesCount; i++) {
        let posVec = k.vec2(16, 16)
        posVec = posVec.add(i * 98, 0)
        hpInterface.add(makeHeartBeat(k, posVec))
    }
    return hpInterface
}

const addHpInterfaceSystem = k => {
    k.onUpdate("hp_bar", hpBar => {
        hpBar.pos = k.camPos().add(GAME_WIDTH * -0.5, GAME_HEIGHT * -0.5)
    })
}

export default makeHpInterface
export { addHpInterfaceSystem }
