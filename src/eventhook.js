
const unHook = (listeners, goid) => {
    for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].goid == goid) {
            listeners.splice(i, 1)
            break
        }
    }
}

const hookInvoke = (listeners, ...args) => {
    let indexsToBeRemoved = []
    for (let i = 0; i < listeners.length; i++) {
        listeners[i].callback(...args)
        if (listeners[i].onlyOnce) {
            indexsToBeRemoved.push(i)
        }
    }
    indexsToBeRemoved.forEach(i => {
        listeners.splice(i, 1)
    })
}

const hookAdd = (listeners, gameObj, callback, onlyOnce) => {
    const id = gameObj.id
    listeners.push({
        goid: id,
        callback: callback,
        onlyOnce: onlyOnce ?? false,
    })
    gameObj.onDestroy(() => unHook(listeners, id))
}

const hook = (listeners) => ({
    invoke: (...args) => hookInvoke(listeners, ...args),
    hookAdd: (gameObj, callback, onlyOnce) => {
        hookAdd(listeners, gameObj, callback, onlyOnce)
    },
})

const newEventHook = () => {
    const listeners = []
    return hook(listeners)
}

export default newEventHook
