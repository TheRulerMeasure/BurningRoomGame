import makeBullet from "./bullet"
import { getInputVec } from "./kputil"
import makeMover from "./mover"

const hitboxComp = () => {
    return {
        id: "hitbox",
        takeDamage(dmg) {
            this.trigger("takenDamage", dmg)
        },
    }
}

const gunComp = k => ({
    id: "gunComp",

    require: ["pos"],

    shootSpeed: 2.9,
    curShotDelay: 0.0,

    shootAt(targetPos) {
        const dir = targetPos.sub(this.pos).unit()
        k.add(makeBullet(k, k.vec2(this.pos), dir, 500))
    },
})

const blinking = k => ({
    id: "blinking",

    require: ["opacity"],

    blinkingActive: false,
    blinkSpeed: 69,

    update() {
        if (this.blinkingActive) {
            this.opacity = (Math.sin(k.time() * this.blinkSpeed) + 1) * 0.5
        }
    },

    startBlinking() {
        this.blinkingActive = true
    },

    stopBlinking() {
        this.blinkingActive = false
        this.opacity = 1.0
    },
})

const invincibilityFrame = k => ({
    id: "invincibility_frame",

    require: ["health"],

    invincibled: false,
    invincibilityDuration: 3.5,
    invincibilityTime: 0,

    add() {
        this.onHurt(amount => {
            this.startInvincibility()
        })
    },

    update() {
        if (!this.invincibled) {
            return
        }
        this.invincibilityTime += k.dt()
        if (this.invincibilityTime >= this.invincibilityDuration) {
            this.stopInvincibility()
        }
    },

    startInvincibility() {
        this.invincibled = true
        this.trigger("invincibility_start")
    },

    stopInvincibility() {
        this.invincibilityTime = 0.0
        this.invincibled = false
        this.trigger("invincibility_end")
    },
})

const makePlayer = (k, pos, startHP) => {
    const player = makeMover(k, pos, 32, 32)
    player.use("player")
    player.use(gunComp(k))
    player.use(k.health(startHP ?? 2))
    player.use(invincibilityFrame(k))

    const heroSp = k.make([
        k.pos(0, 0),
        k.sprite("hero", { anim: "run" }),
        k.anchor("center"),
        k.opacity(1),
        blinking(k),
    ])

    const hitbox = k.make([
        k.pos(0, 0),
        k.rect(20, 20),
        k.anchor("center"),
        k.area(),
        k.opacity(0),
        hitboxComp(),
        {
            canHit: true,
        },
        "team1_hitbox",
    ])

    hitbox.on("takenDamage", dmg => {
        if (hitbox.canHit) {
            player.hurt(dmg)
        }
    })

    player.on("invincibility_start", () => {
        hitbox.canHit = false
    })
    player.on("invincibility_start", () => {
        heroSp.startBlinking()
    })

    player.on("invincibility_end", () => {
        hitbox.canHit = true
    })
    player.on("invincibility_end", () => {
        heroSp.stopBlinking()
    })

    player.on("sprite_flip", flip => {
        heroSp.flipX = flip
    })

    player.add(heroSp)
    player.add(hitbox)

    return player
}

const addPlayerSystem = (k) => {
    k.onUpdate("player", player => {
        player.motionAxis = getInputVec(k)
        const motionX = player.motionAxis.x
        if (motionX > 0.2) {
            player.trigger("sprite_flip", false)
        } else if (motionX < -0.2) {
            player.trigger("sprite_flip", true)
        }
        player.curShotDelay -= player.shootSpeed * k.dt()
        player.curShotDelay = Math.max(player.curShotDelay, 0.0)
        if (k.isButtonDown("shoot")) {
            if (player.curShotDelay <= 0) {
                player.curShotDelay = 1.0
                const toPos = k.toWorld(k.mousePos())
                player.shootAt(toPos)
            }
        }
    })
}

export default makePlayer
export { addPlayerSystem }
