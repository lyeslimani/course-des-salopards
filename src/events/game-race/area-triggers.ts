import {GameRaceEvents} from "./events";

export function setupObstacleTriggers() {
    for (let i = 1; i <= 5; i++) {
        WA.room.area.onEnter('obstacle' + i).subscribe(() => {
            onObstacleEnter('obstacle' + i)
        })
    }
}

export function onObstacleEnter(obstacleName: string) {
    WA.event.broadcast(GameRaceEvents.SHOW_QUIZ, {concernedPlayer: WA.player.playerId, obstacle: obstacleName}).then()
}