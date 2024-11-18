
const m1 = () => ({
    maxAmount: 7,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 1,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 5,
            deployAmount: 2,
        },
    ],
})

const M_02 = {
    maxAmount: 6,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 2,
            deployAmount: 3,
        },
    ],
}

const level = {
    columns: 5,
    rows: 2,
    startCoord: { x: 0, y: 0 },
    endCoord: { x: 4, y: 0 },
    roomSizes: [
        [ "3x3", "9x5", "5x3", "7x7", "5x5" ],
        [ "3x3", "9x3", "5x3", "7x7", "5x5" ],
    ],
    doors: [
        "┌┬─┬┐",
        "└┴─┴┘",
    ],
    monsters: [
        [ null, M_02, null, m1(), null ],
        [ null, null, null, null, m1() ],
    ],
}

export default level
