import {GameRaceEvents} from "./events";

export function setupObstacleTriggers() {
    WA.room.area.onEnter('obstacle1').subscribe(() => {
        onObstacleEnter('obstacle1')
    })
}

export function onObstacleEnter(obstacleName: string) {
    WA.event.broadcast(GameRaceEvents.SHOW_QUIZ, {concernedPlayer:WA.player.playerId,obstacle: obstacleName}).then()
}