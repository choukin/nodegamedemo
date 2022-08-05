import { updateRanking } from "./render";

const gameUpdates = []

export function processGameUpdate(update) {
    // console.log('update');
    // console.log(update);
    gameUpdates.push(update)
    
}
// export function updateranking(update){
//     updateRanking(update.leaderboard)
// }

export function getCurrentState() {
    return gameUpdates[gameUpdates.length-1]
}

