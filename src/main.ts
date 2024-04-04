import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {setupObstacleTriggers} from "./events/game-race/area-triggers";
import {GameRaceEvents, setupGameListeners} from "./events/game-race/events";

console.log('Script started successfully');


WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)
    console.log('Player id: ', WA.player.playerId)

    setupObstacleTriggers()
    setupGameListeners()

    await startGame()

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

async function startGame() {
    await WA.event.broadcast(GameRaceEvents.GAME_START_COUNTDOWN, {})
}