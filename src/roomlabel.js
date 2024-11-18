import { GAME_HEIGHT, GAME_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./gameConstant"

const statLabelComp = k => ({
    id: "stat_label",

    require: ["pos"],

    update() {
        this.pos = k.camPos()
    },
})

const makeStatsLabel = (k, plStats) => {
    const o = k.make([
        k.pos(0, 0),
        statLabelComp(k),
        k.layer("foreground"),
    ])
    const rebirthText = o.add([
        k.pos(0, 0),
        k.text("Rebirth: ", { font: "pixel_font" }),
    ])
    const hpText = o.add([
        k.pos(0, 64),
        k.text("Health: ", { font: "pixel_font" }),
    ])
    const attSpeedText = o.add([
        k.pos(0, 128),
        k.text("Attack Speed: ", { font: "pixel_font" }),
    ])
    k.tween(
        0,
        plStats.rebirth,
        2.75,
        v => rebirthText.text = "Rebirth: " + Math.round(v),
        k.easings.easeOutCirc
    )
    k.tween(
        0,
        plStats.playerHealth,
        2.75,
        v => hpText.text = "Health: " + Math.round(v),
        k.easings.easeOutCirc
    )
    k.tween(
        0,
        plStats.playerAttackSpeed * 10,
        2.75,
        v => attSpeedText.text = "Attack Speed: " + Math.round(v),
        k.easings.easeOutCirc
    )
    k.tween(0, 1, 5, _ => {}).onEnd(() => {
        k.destroy(o)
    })
    return o
}

const makeInstructionLabel = k => {
    const label = k.make([
        k.pos(TILE_WIDTH * 4, TILE_HEIGHT * 6),
        k.scale(1.5, 1.5),
        k.sprite("instruction_sp", { anim: "dance" }),
        k.layer("foreground"),
    ])
    return label
}

const makeEggLabel = k => {
    const o = k.make([
        k.pos(0, 0),
        k.rect(GAME_WIDTH, GAME_HEIGHT),
        k.color(46, 57, 59),
        k.layer("foreground"),
    ])
    o.add([
        k.pos(TILE_WIDTH * 4, TILE_HEIGHT * 2),
        k.sprite("egg"),
    ])
    o.add([
        k.pos(TILE_WIDTH * 4, TILE_HEIGHT * 4),
        k.sprite("egg_text"),
    ])
    o.add([
        k.pos(TILE_WIDTH * 5, TILE_HEIGHT * 5),
        k.text("The End"),
    ])
    return o
}

export default makeInstructionLabel
export { makeEggLabel, makeStatsLabel }
