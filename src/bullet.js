
const makeBullet = (k, pos, dir, speed) => {
    const bullet = k.make([
        k.pos(pos),
        k.sprite("dagger", { anim: "spin" }),
        k.anchor("center"),
        k.move(dir, speed),
        k.offscreen({ destroy: true }),
        "bullet",
    ])
    bullet.add([
        k.pos(),
        k.rect(16, 16),
        k.opacity(0),
        k.anchor("center"),
        k.area(),
        "bullet_rect"
    ])
    return bullet
}

const bulletOnCollide1 = k => {
    k.onCollide("bullet_rect", "room_wall", (bullet, roomWall, col) => {
        k.destroy(bullet.parent)
    })
}

const bulletOnCollide2 = k => {
    k.onCollide("bullet_rect", "door_blocker", (bullet, roomWall, col) => {
        k.destroy(bullet.parent)
    })
}

const bulletOnCollide3 = k => {
    k.onCollide("bullet_rect", "team2_hitbox", (bullet, hitbox, col) => {
        const dir = hitbox.worldPos().sub(bullet.pos).unit()
        k.destroy(bullet.parent)
        hitbox.takeDamage(2, dir)
    })
}

const addBulletSystem = (k) => {
    [
        bulletOnCollide1,
        bulletOnCollide2,
        bulletOnCollide3,
    ].forEach(bulletSystem => bulletSystem(k))
}

export default makeBullet
export { addBulletSystem }
