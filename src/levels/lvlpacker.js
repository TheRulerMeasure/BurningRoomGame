
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
    return {
        sizeX: Number(s[0]),
        sizeY: Number(s[1]),
        doors: lvlData.doors ? getDoorsFromSymbol(lvlData.doors[y].at(x)) : null,
        monsters: lvlData.monsters ? lvlData.monsters[y][x] : null,
        hasStairs: (x == lvlData.endCoord.x) && (y == lvlData.endCoord.y),
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
