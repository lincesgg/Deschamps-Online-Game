import createGame from "../public/game.js"
import http from "http"
import express from "express"
import {Server} from "socket.io"

// Initializing Server
const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static("public"))

// Game
const game = createGame()
game.start()

// Propagating Game Online Event to Clients
game.eventEmmiter.subscribe("online-event", (eventData) => {
    console.log(`> Event Emmited: ${eventData.eventType}`)
    sockets.emit("online-event", eventData)
})

// On Client Connection
sockets.on("connect", (socket) => {
    // Initializing
    const playerId = socket.id
    console.log(`> Player Connected: (${playerId})`)

    // Create a Player to User
    game.createPlayer({playerId: playerId})

    // Send Initial Game Data Status
    socket.emit("setup", game.status)

    // Configurate Reception os Client Events
    socket.on("online-event", ({eventType, command}) => {
        if (!eventType) {return}
        console.log(`> Event Received: ${eventType}`)

        game.onlineEventsFunctions[eventType](command)
        sockets.emit(eventType, command)
    })

    // Configurating Disconnection
    socket.on("disconnect", () => {
        console.log(`> Player Disconnected: (${playerId}) `)
        game.deletePlayer({playerId})
    })
})

// Opening Server Port
server.listen(3000, () => {
    console.log("Server Connected on Port 3000")
})