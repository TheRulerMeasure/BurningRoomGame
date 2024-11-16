
const M_01 = {
    maxAmount: 5,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 2,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 3,
            deployAmount: 1,
        },
    ],
}

const M_02 = {
    maxAmount: 5,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 1,
            deployAmount: 1,
        },
        {
            deployOnDeathCount: 3,
            deployAmount: 2,
        },
    ],
}

const level = {
    columns: 3,
    rows: 2,
    startCoord: { x: 2, y: 1 },
    endCoord: { x: 0, y: 0 },
    roomSizes: [
        [ "3x3", "5x5", "5x3" ],
        [ "5x5", "5x3", "3x3" ],
    ],
    doors: [
        "┌┬┐",
        "└┴┘",
    ],
    monsters: [
        [ null, M_01, null ],
        [ M_02, null, null ],
    ],
}

export default level
