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
export function onPlayerInside() {
    WA.room.area.onEnter(ObjectWaitingRoom.INSIDE).subscribe(async () => {
        WA.room.hideLayer(ObjectWaitingRoom.WALLS);
    })
}

export function onPlayerOutside() {
    WA.room.area.onEnter(ObjectWaitingRoom.OUTSIDE).subscribe(async () => {
        WA.room.showLayer(ObjectWaitingRoom.WALLS);
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

function closePopup(popUp: Popup) {
    if (popUp !== undefined) {
        popUp.close();
    }
}