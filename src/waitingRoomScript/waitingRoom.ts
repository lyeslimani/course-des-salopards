
import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {Popup} from "@workadventure/iframe-api-typings";
import {closePopup, onClock, onPlayerInside, onPlayerOutside, onPlayerSpawn} from "./events";
import { ObjectWaitingRoom } from "./objectWaitingRoom";

console.log('Script started successfully');

let clockPopUp: Popup;
const startGameBtnName = 'startGameBtn';

function getPlayers(): Set<string> {
    if (!WA.state.loadVariable('players')) {
        console.log('players not found, go undefined')
        WA.state.saveVariable('players', [])
    }

    const res = WA.state.loadVariable('players') as string[] || []
    console.log('players loaded')
    console.log(res)
    return new Set(res)
}

WA.onInit().then(async () => {
    getPlayers()
    // sound
    const paralysedSound = WA.sound.loadSound('../../public/sound/waitingRoom.wav')
    paralysedSound.play({loop: true})

    onPlayerSpawn(WA.player);
    onPlayerInside(ObjectWaitingRoom.INSIDE, async () => {
        if (!WA.player.uuid) {
            console.error('Player UUID not found');
            return;
        }

        WA.room.hideLayer(ObjectWaitingRoom.WALLS);
        // WA.event.broadcast('playerInside', WA.player.uuid);
        console.log("player inside")
        const players = getPlayers()
        players.add(WA.player.uuid)
        
        await WA.state.saveVariable('players', Array.from(players))
        // WA.event.broadcast('players', Array.from(getPlayers()))
    });
    onPlayerOutside(ObjectWaitingRoom.OUTSIDE, async () => {
        if (!WA.player.uuid) {
            console.error('Player UUID not found');
            return;
        }

        WA.room.showLayer(ObjectWaitingRoom.WALLS);
        // WA.event.broadcast('playerOutside', WA.player.uuid);
        console.log("player outside")

        const players = getPlayers()
        players.delete(WA.player.uuid)

        await WA.state.saveVariable('players',  Array.from(players))
        // WA.event.broadcast('players', Array.from(getPlayers()))
    });

    // WA.event.on('players').subscribe(async (ev) => {
    //     // console.log(ev)
    //     const players = new Set(ev.data as any)
    //     // console.log('players events')
    //     console.log(players)
    //     // await WA.state.saveVariable('players', players)
    // })

    const subPlayers = WA.state.onVariableChange('players').subscribe((x) => {
        // players = x as string[] || []
        console.log('players changed', x)
        console.log('players changed', getPlayers())
    })

    onClock(clockPopUp)

    WA.ui.actionBar.addButton({
        id: startGameBtnName,
        label: 'Start game',
        callback: (event) => {
        console.log('players', getPlayers().values.length)
            if (getPlayers().values.length < 2) {
                const popup = WA.ui.openPopup('popup', 'You need at least 2 players to start the game', []);
                setTimeout(() => closePopup(popup), 2000)
                return;
            }

            //
        }
    });

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


export {};
