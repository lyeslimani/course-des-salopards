import {GameRaceEvents} from "./events";

export function setupCourseTriggers() {
    for (let i = 1; i <= 5; i++) {
        WA.room.area.onEnter('obstacle' + i).subscribe(() => {
            onObstacleEnter('obstacle' + i)
        })
    }

    WA.room.area.onEnter("end").subscribe(() => {
        onFinishedLine()
    })
}

export function onObstacleEnter(obstacleName: string) {
    WA.event.broadcast(GameRaceEvents.SHOW_QUIZ, {concernedPlayer: WA.player.playerId, obstacle: obstacleName}).then()
}

export function onFinishedLine(){
    WA.event.broadcast(GameRaceEvents.GAME_END, {concernedPlayerId: WA.player.playerId, concernedPlayerName: WA.player.name}).then()
}