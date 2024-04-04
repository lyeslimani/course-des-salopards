import {ScriptingEvent, UIWebsite} from "@workadventure/iframe-api-typings";

export enum GameRaceEvents {
    GAME_START_COUNTDOWN = "game:start_countdown",
    GAME_START_COUNTDOWN_END = "game:start_countdown_end",
    OBSTACLE_ENTER = "obstacle:enter",
    SHOW_QUIZ = "quiz:enter",
    CLOSE_QUIZ = "quiz:close",
    SEND_ANSWER = "quiz:send_answer",
    WRONG_ANSWER = "quiz:wrong_answer",
    RIGHT_ANSWER = "quiz:right_answer",
}

export interface QuizData {
    id: number
    question: string
    answers: { id: number, answer: string }[]
}

const iframesQueue: UIWebsite[] = []

export function setupGameListeners() {
    WA.event.on(GameRaceEvents.GAME_START_COUNTDOWN).subscribe(async () => {
        WA.controls.disablePlayerControls()
        await handleGameCountdown()
    })
    WA.event.on(GameRaceEvents.GAME_START_COUNTDOWN_END).subscribe(() => {
        WA.controls.restorePlayerControls()
        handleGameCountdownEnd()
    })
    WA.event.on(GameRaceEvents.SHOW_QUIZ).subscribe(async (_: ScriptingEvent) => {
        WA.controls.disablePlayerControls()
        // const quizData = data.data as QuizData;
        const myWebsite = await WA.ui.website.open({
            url: "http://localhost:4200/quiz/unequestion/premiere%7Cmola" ?? 'https://google.fr',
            position: {
                vertical: "middle",
                horizontal: "middle",
            },
            size: {
                height: "50vh",
                width: "50vw",
            },
        });
        iframesQueue.push(myWebsite)
    })
    WA.event.on(GameRaceEvents.CLOSE_QUIZ).subscribe(() => {
        const website = iframesQueue.pop()
        if (website) {
            website.close().then()
        }
    })
    WA.event.on(GameRaceEvents.WRONG_ANSWER).subscribe(() => {
        const website = iframesQueue.pop()
        if (website) {
            website.close().then()
        }
    })
}

export const handleGameCountdown = async () => {
    const paralysedSound = WA.sound.loadSound('/sound/countdown.wav')
    paralysedSound.play({})
    for (let i = 3; i > 0; i--) {
        WA.ui.banner.openBanner({
            id: "banner-countdown",
            text: i.toString(),
            bgColor: "#deff89",
            textColor: "#8c7b75",
            closable: false,
            timeToClose: 1000,
        });
        await new Promise(r => setTimeout(r, 1000));
    }
    WA.ui.banner.closeBanner()
    WA.event.broadcast(GameRaceEvents.GAME_START_COUNTDOWN_END, {}).then()
}

export const handleGameCountdownEnd = () => {
    const paralysedSound = WA.sound.loadSound('/sound/countdown_end.wav')
    paralysedSound.play({})
    WA.ui.banner.openBanner({
        id: "banner-countdown",
        text: "Partez!!!",
        bgColor: "#deff89",
        textColor: "#8c7b75",
        closable: false,
        timeToClose: 3000,
    });
}

