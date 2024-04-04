import {GameRaceEvents} from "./events";

export function setupObstacleTriggers() {
    WA.room.area.onEnter('obstacle1').subscribe(() => {
        onObstacleEnter()
    })
}

export function onObstacleEnter() {
    WA.event.broadcast(GameRaceEvents.OBSTACLE_ENTER, {playerId: WA.player.playerId}).then()
    WA.event.broadcast(GameRaceEvents.SHOW_QUIZ, {playerId: WA.player.playerId}).then()
}