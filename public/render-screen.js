import colors from "./colors.js"

export default function renderScreen(ctx, game, requestAnimationFrame){
    ctx.fillStyle = colors["game-background"]
    ctx.fillRect(0, 0, game.status.canvas.width, game.status.canvas.height)

    const renderPlayer = (player, color=green) => {
        ctx.fillStyle = color
        ctx.fillRect(player.x, player.y, 1, 1)
    }
    
    const renderFruit = (fruit, color="red") => {
        ctx.fillStyle = color
        ctx.fillRect(fruit.x, fruit.y, 1, 1)
    }

    for (const fruitId in game.status.fruits){
        const fruit = game.status.fruits[fruitId]
        renderFruit(fruit, colors["general-fruits"])
    }

    for (const playerId in game.status.players){
        const player = game.status.players[playerId]
        renderPlayer(player, colors["general-players"])
    }

    const currentPlayer = game.status.players[game.localData.currentPlayerId]
    if  (currentPlayer) {
        renderPlayer(game.status.players[game.localData.currentPlayerId], colors["current-player"])
    }

    requestAnimationFrame(() => {
        renderScreen(ctx, game, requestAnimationFrame)
    })
}

