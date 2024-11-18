
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

const m3 = () => ({
    maxAmount: 4,
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
            deployOnDeathCount: 2,
            deployAmount: 1,
        },
    ],
})

const level = {
    columns: 3,
    rows: 3,
    startCoord: { x: 1, y: 2 },
    endCoord: { x: 2, y: 0 },
    roomSizes: [
        [ "5x3", "5x7", "5x5" ],
        [ "9x7", "3x3", "7x5" ],
        [ "9x7", "3x3", "9x3" ],
    ],
    doors: [
        "┌┬┐",
        "├┼┤",
        "▲▲▲",
    ],
    monsters: [
        [ null, m3(), null ],
        [ M_02, null, M_01 ],
        [ m3(), null, null ],
    ],
}

export default level
