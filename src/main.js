import kaplay from "kaplay"
import gamePlugin from "./game"
import { GAME_HEIGHT, GAME_WIDTH } from "./gameConstant"

const k = kaplay({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    global: false,
    letterbox: true,
    background: "9ab5b1",
    texFilter: "nearest",
    crisp: true,
    buttons: {
        moveLeft: {
            keyboard: ["left", "a"],
        },
        moveRight: {
            keyboard: ["right", "d"],
        },
        moveUp: {
            keyboard: ["up", "w"],
        },
        moveDown: {
            keyboard: ["down", "s"],
        },
        shoot: {
            mouse: ["left"],
        },
    },
    plugins: [ gamePlugin ],
})

// k.add([
//     k.health(13)
// ]).setHP()

k.run()
