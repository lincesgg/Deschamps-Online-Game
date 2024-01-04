export function returnEventEmitter() {
    const subscriptions = {
        // "eventName": [observersFuncs, ...]
    }

    function subscribe(eventName, observerFunction){
        if (!(eventName in subscriptions)) {
            subscriptions[eventName] = []
        }

        subscriptions[eventName].push(observerFunction)
    }

    function unsubscribe(eventName, observerFunction) {
        funcIndex = subscriptions[eventName].indexOf(observerFunction)

        if (funcIndex > -1) {
            subscriptions[eventName].splice(funcIndex, 1)
        }

        if (subscriptions[eventName].length == 0) {
            delete subscriptions[eventName]
        }
    }

    function unsubscribeAll(eventName) {
        if (!subscriptions[eventName]) return

        delete subscriptions[eventName]
    }

    function emit(eventName, ...args) {
        if (!subscriptions[eventName]) return

        for (const observerFunction of subscriptions[eventName]) {
            observerFunction(...args)
        }
    }

    return {
        subscribe,
        unsubscribe,
        unsubscribeAll,
        emit
    }
}

export function createMiddleware() {
    const middlewares = []

    function use(middlewareFunction) {
        middlewares.push(middlewareFunction)
    }

    function execute(data, func){
        func(middlewares.reduceRight((done, nextFn) => nextFn(...[done].flat()), data))
    }
}
