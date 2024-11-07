
export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600

export const TILE_WIDTH = 64
export const TILE_HEIGHT = 64

export const getWorldPosFromCellv = (k, vec) => {
    return k.vec2(vec.x * TILE_WIDTH, vec.y * TILE_HEIGHT)
}

export const getWorldPosFromCellvCenter = (k, vec) => {
    return k.vec2(
        vec.x * TILE_WIDTH + TILE_WIDTH * 0.5,
        vec.y * TILE_HEIGHT + TILE_HEIGHT * 0.5
    )
}
