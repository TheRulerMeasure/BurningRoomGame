import { GameStates } from "./gameAuto"
import { TeleportConst } from "./teleporter"

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

const faderUpdate = (k, fader, gameAuto) => {
    fader.pos = k.vec2(k.camPos())

    if (gameAuto.currentState == GameStates.ENTERING_TELEPORTER) {
        const enterSpeed = TeleportConst.ENTER_DURATION * TeleportConst.ENTER_DURATION * 100.0
        fader.shaderParam.u_amount += enterSpeed * k.dt()
        fader.shaderParam.u_amount = Math.min(1.0, fader.shaderParam.u_amount)
    } else if (gameAuto.currentState == GameStates.LEAVING_TELEPORTER) {
        const exitSpeed = TeleportConst.EXIT_DURATION * TeleportConst.EXIT_DURATION * 100.0
        fader.shaderParam.u_amount -= exitSpeed * k.dt()
        fader.shaderParam.u_amount = Math.max(0.0, fader.shaderParam.u_amount)
    } else {
        fader.shaderParam.u_amount = 0.0
    }
}

const faderEvent = {
    onUpdate: (k, gameAuto) => k.onUpdate("game_fader", fader => faderUpdate(k, fader, gameAuto)),
}

export default makeFader
export { faderEvent }
