
const makeBullet = (k, pos, dir, speed) => k.make([
    k.pos(pos),
    k.sprite("bullet_sp"),
    k.anchor("center"),
    k.area(),
    k.move(dir, speed),
    k.offscreen({ destroy: true }),
    "bullet",
])

const bulletOnCollide1 = (k) => {
    k.onCollide("bullet", "room_wall", (bullet, roomWall, col) => {
        k.destroy(bullet)
    })
}

const bulletOnCollide2 = (k) => {
    k.onCollide("bullet", "door_blocker", (bullet, roomWall, col) => {
        k.destroy(bullet)
    })
}

const addBulletSystem = (k) => {
    [
        bulletOnCollide1,
        bulletOnCollide2,
    ].forEach(bulletSystem => bulletSystem(k))
}

export default makeBullet
export { addBulletSystem }
