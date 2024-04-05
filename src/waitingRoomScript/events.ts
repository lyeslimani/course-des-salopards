import {ObjectWaitingRoom} from "./objectWaitingRoom";
import {Popup} from "@workadventure/iframe-api-typings";
import {WorkadventurePlayerCommands} from "@workadventure/iframe-api-typings/front/Api/Iframe/player";

export function onPlayerSpawn(player: WorkadventurePlayerCommands) {
    welcome(player.name)
}

function welcome(playerName: String) {
    let welcomePopUp = WA.ui.openPopup(ObjectWaitingRoom.WELCOME_POP_UP, `Welcome : ${playerName} `, []);
    setTimeout(() => closePopup(welcomePopUp), 2000)
}

export function onPlayerInside(zone: ObjectWaitingRoom, callback: () => void) {
    WA.room.area.onEnter(zone).subscribe(async () => {
        callback();
    })
}

export function onPlayerOutside(zone: ObjectWaitingRoom, callback: () => void) {
    WA.room.area.onEnter(zone).subscribe(async () => {
        callback();
    })
}

export function onClock(clockPopUp: Popup) {

    WA.room.area.onEnter(ObjectWaitingRoom.CLOCK).subscribe(async () => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        clockPopUp = WA.ui.openPopup(ObjectWaitingRoom.CLOCK_POP_UP, time, []);
    })

    WA.room.area.onLeave(ObjectWaitingRoom.CLOCK).subscribe(() => closePopup(clockPopUp))

}

export function closePopup(popUp: Popup) {
    if (popUp !== undefined) {
        popUp.close();
    }
}