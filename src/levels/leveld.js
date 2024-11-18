
const m1 = () => ({
    maxAmount: 2,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 1,
        },
        {
            deployOnDeathCount: 1,
            deployAmount: 1,
        },
    ],
})

const m2 = () => ({
    maxAmount: 3,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 3,
        },
    ],
})

const m3 = () => ({
    maxAmount: 9,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 2,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 4,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 7,
            deployAmount: 1,
        },
    ],
})

const m4 = () => ({
    maxAmount: 13,
    waves: [
        {
            deployOnDeathCount: 0,
            deployAmount: 2,
        },
        {
            deployOnDeathCount: 2,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 4,
            deployAmount: 4,
        },
        {
            deployOnDeathCount: 7,
            deployAmount: 3,
        },
        {
            deployOnDeathCount: 10,
            deployAmount: 1,
        },
    ],
})

const level = {
    columns: 2,
    rows: 4,
    startCoord: { x: 1, y: 0 },
    endCoord: { x: 1, y: 3 },
    roomSizes: [
        [ "3x3", "3x3" ],
        [ "5x5", "9x7" ],
        [ "5x7", "3x3" ],
        [ "9x7", "9x3" ],
    ],
    doors: [
        "┌◄",
        "└┐",
        "┌┘",
        "└◄",
    ],
    monsters: [
        [ m1(), null ],
        [ m2(), m3() ],
        [ m2(), m1() ],
        [ m4(), null ],
    ],
}

export default level
