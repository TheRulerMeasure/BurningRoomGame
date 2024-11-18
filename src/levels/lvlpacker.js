
const getDoorsFromSymbol = charSymbol => {
    return {
        "▲": { up: true },
        "▼": { down: true },
        "◄": { left: true },
        "►": { right: true },
        "─": { left: true, right: true },
        "│": { up: true, down: true },
        "┌": { down: true, right: true },
        "┐": { down: true, left: true },
        "└": { up: true, right: true },
        "┘": { up: true, left: true },
        "├": { up: true, down: true, right: true },
        "┤": { up: true, down: true, left: true },
        "┬": { down: true, left: true, right: true },
        "┴": { up: true, left: true, right: true },
        "┼": { up: true, down: true, left: true, right: true },
    }[charSymbol]
}

const getRoomData = (lvlData, x, y) => {
    const s = lvlData.roomSizes[y][x].split("x")
    let hasStairs = false
    if (lvlData.endCoord) {
        if ((x == lvlData.endCoord.x) && (y == lvlData.endCoord.y)) {
            hasStairs = true
        }
    }
    let hasEgg = false
    if (lvlData.eggCoord) {
        if ((x == lvlData.eggCoord.x) && (y == lvlData.eggCoord.y)) {
            hasEgg = true
        }
    }
    let hasInstruction = false
    if (lvlData.instructionCoord) {
        if ((x == lvlData.instructionCoord.x) && (y == lvlData.instructionCoord.y)) {
            hasInstruction = true
        }
    }
    return {
        sizeX: Number(s[0]),
        sizeY: Number(s[1]),
        doors: lvlData.doors ? getDoorsFromSymbol(lvlData.doors[y].at(x)) : null,
        monsters: lvlData.monsters ? lvlData.monsters[y][x] : null,
        hasStairs: hasStairs,
        hasEgg: hasEgg,
        hasInstruction: hasInstruction,
    }
}

const packLevel = (lvlData) => {
    let roomInfos = []
    for (let y = 0; y < lvlData.rows; y++) {
        let row = []
        for (let x = 0; x < lvlData.columns; x++) {
            row.push(getRoomData(lvlData, x, y))
        }
        roomInfos.push(row)
    }
    return roomInfos
}

export default packLevel
