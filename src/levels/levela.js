
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
    rows: 3,
    startCoord: { x: 0, y: 0 },
    roomSizes: [
        [ "3x3", "3x5", "3x3" ],
        [ "5x3", "5x3", "5x5" ],
        [ "3x3", "5x5", "3x3" ],
    ],
    doors: [
        "┌┬┐",
        "│├┤",
        "▲└┘",
    ],
    monsters: [
        [ null, null, null ],
        [ null, null, M_01 ],
        [ null, M_02, null ],
    ],
}

export default level
