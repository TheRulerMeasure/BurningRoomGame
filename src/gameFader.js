
const makeFader = (k) => {
    const shaderParam = {
        u_color: k.rgb(0.46, 0.57, 0.59),
        u_amount: 0.0,
    }
    return k.make([
        k.pos(0, 0),
        k.sprite("checker_down"),
        k.scale(3.5, 2.5),
        k.anchor("center"),
        k.layer("foreground"),
        k.shader("radial_shade", () => shaderParam),
        "game_fader",
        {
            shaderParam: shaderParam,
        },
    ])
}

const faderUpdate = (k, fader) => {
    fader.pos = k.vec2(k.camPos())
}

const faderEvent = {
    onUpdate: k => k.onUpdate("game_fader", fader => faderUpdate(k, fader)),
}

export default makeFader
export { faderEvent }
