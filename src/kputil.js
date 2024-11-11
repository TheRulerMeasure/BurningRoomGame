const getInputVec = (k) => {
    let vec = k.vec2()
    if (k.isButtonDown("moveRight")) {
        vec = vec.add(k.vec2(1, 0))
    } else if (k.isButtonDown("moveLeft")) {
        vec = vec.add(k.vec2(-1, 0))
    }
    if (k.isButtonDown("moveUp")) {
        vec = vec.add(k.vec2(0, -1))
    } else if (k.isButtonDown("moveDown")) {
        vec = vec.add(k.vec2(0, 1))
    }
    return vec.unit()
}

const createMazeMap = (width, height) => {
    const size = width * height
    const getUnvisitedNeighbours = (map, index) => {
        const n = []
        const x = Math.floor(index / width)
        if (x > 1 && map[index - 2] === 2) n.push(index - 2)
        if (x < width - 2 && map[index + 2] === 2) n.push(index + 2)
        if (index >= 2 * width && map[index - 2 * width] === 2) {
            n.push(index - 2 * width)
        }
        if (index < size - 2 * width && map[index + 2 * width] === 2) {
            n.push(index + 2 * width)
        }
        return n
    }
    const map = new Array(size).fill(1, 0, size)
    map.forEach((_, index) => {
        const x = Math.floor(index / width)
        const y = Math.floor(index % width)
        if ((x & 1) === 1 && (y & 1) === 1) {
            map[index] = 2;
        }
    })

    const stack = []
    const startX = Math.floor(Math.random() * (width - 1)) | 1
    const startY = Math.floor(Math.random() * (height - 1)) | 1
    const start = startX + startY * width
    map[start] = 0
    stack.push(start)
    while (stack.length) {
        const index = stack.pop()
        const neighbours = getUnvisitedNeighbours(map, index)
        if (neighbours.length > 0) {
            stack.push(index)
            const neighbour = neighbours[Math.floor(neighbours.length * Math.random())]
            const between = (index + neighbour) / 2
            map[neighbour] = 0
            map[between] = 0
            stack.push(neighbour)
        }
    }
    return map
}

export { getInputVec }
export { createMazeMap }
