import {returnEventEmitter} from "./utils.js"

export default function createGame() {
    // Initiizing Game Data
    const status = {
        canvas: {
            height: 20,
            width: 20
        },
        players: {},
        fruits: {}
    }

    function setState(new_state) {
        Object.assign(status, new_state)
    }

    const localData = {
        currentPlayerId: undefined
    }

    function setCurrentPlayer(playerId) {
        console.log("> Current Player UPDATED")
        localData.currentPlayerId = playerId
    }

    const eventEmmiter = returnEventEmitter()

    // Initialize Network Config
    const onlineEventsFunctions = {
        "create-fruit": createFruit,
        "create-player": createPlayer,
        "delete-fruit": deleteFruit,
        "delete-player": deletePlayer,

        "move-player":movePlayer
    }

    // High-Level Game Control
    function start() {
        return setInterval(createFruit, 2000)
    }

    function stop(intervalId) {
        clearInterval(intervalId)
    }

    // Data-Level Game Control
    function createPlayer(command) {
        const playerId = command.playerId
        const x = command.x != undefined ? command.x : Math.floor(Math.random() * status.canvas.width)
        const y = command.y != undefined ? command.y : Math.floor(Math.random() * status.canvas.height)
        
        status.players[playerId] = {x, y}
        eventEmmiter.emit("online-event", {eventType:"create-player", command:{playerId, x, y}})
    }

    function deletePlayer(command) {
        const playerId = command.playerId

        delete status.players[playerId]
        eventEmmiter.emit("online-event", {eventType:"delete-player", command})
    }

    function createFruit(command={}) {
        const fruitId = command.fruitId != undefined ? command.fruitId : Math.floor(Math.random() * Number.MAX_VALUE)
        const x = command.x != undefined ? command.x : Math.floor(Math.random() * status.canvas.width)
        const y = command.y != undefined ? command.y : Math.floor(Math.random() * status.canvas.height)

        status.fruits[fruitId] = {x, y}
        eventEmmiter.emit("online-event", {eventType:"create-fruit", command:{fruitId, x, y}})
    }

    function deleteFruit(command) {
        const fruitId = command.fruitId
        
        delete status.fruits[fruitId]
        eventEmmiter.emit("online-event", {eventType:"delete-fruit", command})

    }

    // --- Moving
    const allowedMoves = {
        moveUp(player) {

            if (player.y - 1 < 0) {
                player.y = status.canvas.height - 1
            } else {
                player.y -= 1
            }
            return 0
        },

        moveDown(player) {
            if (player.y + 1 >= status.canvas.height) {
                player.y = 0
            } else {
                player.y += 1
            }
            return 0
        },

        moveRight(player) {
            if (player.x + 1 >= status.canvas.width) {
                player.x = 0
            } else {
                player.x += 1
            }
            return 0
        },

        moveLeft(player) {
            if (player.x - 1 < 0) {
                player.x = status.canvas.width -1
            } else {
                player.x -= 1
            }
            return 0
        }
    }

    const inputMap = {
        moveUp: ["arrowup", "w"],
        moveDown: ["arrowdown", "s"],
        moveRight: ["arrowright", "d"],
        moveLeft: ["arrowleft", "a"],
    }

    const allowedKeys = [...new Set(Object.values(inputMap).flat())]
    const filterInputCommands = (command) => {
        return (allowedKeys.includes(command.key)) ? command : null
    }

    function movePlayer(command) {
        const key = command.key
        const playerId = command.playerId
        const player = status.players[playerId]

        if (!player) return
        
        let moveFunc

        for (const [index, input] of Object.values(inputMap).entries()) {
            if (input.includes(key)) {
                moveFunc = allowedMoves[Object.keys(inputMap)[index]]
                break
            }
        }

        if (moveFunc) {
            const errorId = moveFunc(player)

            if (errorId == 0) {
                eventEmmiter.emit("online-event", {eventType:"move-player", command})
                testForCollision(playerId)
            }
        
        }
    }

    function testForCollision(playerId) {
        const player = status.players[playerId]

        for (const fruitId in status.fruits) {
            const fruit = status.fruits[fruitId]
            if (fruit.x === player.x && fruit.y == player.y) {
                console.log(`${playerId} COLLIDED with ${fruitId}`)
                deleteFruit({fruitId})
            }                    
        }
    }

    return {
        status,
        setState,
        localData,
        setCurrentPlayer,
        eventEmmiter,

        onlineEventsFunctions,

        start,

        createFruit,
        createPlayer,
        deleteFruit,
        deletePlayer,

        movePlayer,
        filterInputCommands
    }

}
