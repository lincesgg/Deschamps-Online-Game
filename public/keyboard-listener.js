import {returnEventEmitter} from "./utils.js"

export default function createKeyboardListener(document, game) {
    // Initilizing Vars
    const eventEmmiter = returnEventEmitter()

    // Start Input Handling
    document.addEventListener("keydown", handleKeydown)

    function handleKeydown(event) {
        const key = event.key

        const command = game.filterInputCommands({
            playerId: game.localData.currentPlayerId,
            key: key.toLowerCase()
        })

        if (command) {
            eventEmmiter.emit("commandEmmited", command)
        }
    }

    return {eventEmmiter}
}


function create1ParamFilter(arr) {
    return (val) => {
        return arr.includes(val) ? val : null
    }
}

// const oneParamFilter = (arr) => (val) => arr.includes(val) ? val : null

// function printResults(result) {
//     console.log(result)
// }

// function createFilterDecorator(callback) {
//     return (...args => {
//         callback(
//             filter(...args)
//         )
//     }
// }

// createFilterDecorator(printResults)