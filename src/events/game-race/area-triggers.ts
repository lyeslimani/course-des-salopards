import {GameRaceEvents} from "./events";

export function setupCourseTriggers() {
    WA.room.area.onEnter('obstacle1').subscribe(() => {
        onObstacleEnter('obstacle1')
    })

    WA.room.area.onEnter("end").subscribe(() => {
        onFinishedLine()
    })
}

export function onObstacleEnter(obstacleName: string) {
    WA.event.broadcast(GameRaceEvents.SHOW_QUIZ, {concernedPlayer:WA.player.playerId,obstacle: obstacleName}).then()
}

export function onFinishedLine(){
    WA.event.broadcast(GameRaceEvents.GAME_END, {concernedPlayerId: WA.player.playerId, concernedPlayerName: WA.player.name}).then()
}