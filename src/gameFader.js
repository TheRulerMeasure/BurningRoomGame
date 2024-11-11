import { TeleportConst } from "./teleporter"

const tweenFadeOut = (k, sp) => {
    return k.tween(
        0.0,
        1.0,
        TeleportConst.ENTER_DURATION,
        v => sp.u_amount = v,
        k.easings.linear
    )
}

const tweenFadeIn = (k, sp) => {
    return k.tween(
        1.0,
        0.0,
        TeleportConst.EXIT_DURATION,
        v => sp.u_amount = v,
        k.easings.linear
    )
}

const makeFader = (k) => {
    const shaderParam = {
        u_color: k.rgb(0.46, 0.57, 0.59),
        u_amount: 0.0,
    }
    const faderParam = {
        tweener: null,
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
            faderOut: () => {
                if (faderParam.tweener) {
                    faderParam.tweener.finish()
                }
                faderParam.tweener = tweenFadeOut(k, shaderParam)
            },
            faderIn: () => {
                if (faderParam.tweener) {
                    faderParam.tweener.finish()
                }
                faderParam.tweener = tweenFadeIn(k, shaderParam)
            },
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
