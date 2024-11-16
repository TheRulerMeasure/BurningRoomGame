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

export { getInputVec }
