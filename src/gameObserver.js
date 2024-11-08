
const newObserver = () => {
    return {
        methods: [],
    }
}

const gObserver = {
    registerNewMethod: (gObs, newMethod) => {
        gObs.methods.push(newMethod)
    },
    invokeMethods: (gObs, ...args) => {
        gObs.methods.forEach(m => m(args))
    }
}

const makeObj = (k) => {
    const obj = k.make([
        k.pos(0, 0),
        {
            levelChanged: {
                connectedObjects: [],
                connect: (obj, methodName) => {
                    connectedObjects.push({obj: obj, methodName: methodName})
                },
            },
        },
    ])

    const obj2 = k.make([
        k.pos(0, 0),
        {
            onObj1LvlChanged: (lvl) => console.log("obj1 is level", lvl),
        },
    ])
    obj.levelChanged.connect(obj2, "onObj1LvlChanged")
}

export default makeObj
