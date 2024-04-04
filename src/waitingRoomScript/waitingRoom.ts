
import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {Popup} from "@workadventure/iframe-api-typings";
import {onClock, onPlayerInside, onPlayerOutside, onPlayerSpawn} from "./events";

console.log('Script started successfully');

let clockPopUp: Popup;

WA.onInit().then(() => {
    // sound
    const paralysedSound = WA.sound.loadSound('../../public/sound/waitingRoom.wav')
    paralysedSound.play({loop: true})

    onPlayerSpawn(WA.player);
    onPlayerInside();
    onPlayerOutside();
    onClock(clockPopUp)

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


export {};
