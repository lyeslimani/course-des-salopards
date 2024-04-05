import {Popup, ScriptingEvent} from "@workadventure/iframe-api-typings";
import {quizData} from "../../questions";

export enum GameRaceEvents {
    GAME_START_COUNTDOWN = "game:start_countdown",
    GAME_START_COUNTDOWN_END = "game:start_countdown_end",
    SHOW_QUIZ = "quiz:enter",
    WRONG_ANSWER = "quiz:wrong_answer",
    RIGHT_ANSWER = "quiz:right_answer",
}

export interface QuizData {
    id: number
    question: string
    answers: { id: number, answer: string }[]
    rightAnswer: number
}

const iPopupQueue: Popup[] = []

export function setupGameListeners() {
    WA.event.on(GameRaceEvents.GAME_START_COUNTDOWN).subscribe(async () => {
        WA.controls.disablePlayerControls()
        await handleGameCountdown()
    })
    WA.event.on(GameRaceEvents.GAME_START_COUNTDOWN_END).subscribe(() => {
        WA.controls.restorePlayerControls()
        handleGameCountdownEnd()
    })
    WA.event.on(GameRaceEvents.SHOW_QUIZ).subscribe(async (eventData: ScriptingEvent) => {
        let data = eventData.data as any
        if(data.concernedPlayer !== WA.player.playerId) {
            return
        }
        WA.controls.disablePlayerControls()
        await showQuiz(data.obstacle)
    })
    WA.event.on(GameRaceEvents.RIGHT_ANSWER).subscribe(async (eventData) => {
        let data = eventData.data as any
        if(data.concernedPlayer !== WA.player.playerId) {
            return
        }
        const paralysedSound = WA.sound.loadSound('/sound/right_answer.wav')
        paralysedSound.play({})
        const website = iPopupQueue.pop()
        if (website) {
            website.close()
        }
        const currentPosition = await WA.player.getPosition()
        await WA.player.teleport(currentPosition.x, currentPosition.y - 150)
        WA.controls.restorePlayerControls()
    })
    WA.event.on(GameRaceEvents.WRONG_ANSWER).subscribe((eventData) => {
        let data = eventData.data as any
        if(data.concernedPlayer !== WA.player.playerId) {
            return
        }
        const wrongAnswer = WA.sound.loadSound('/sound/wrong_answer.wav')
        wrongAnswer.play({})
        const paralysedSound = WA.sound.loadSound('/sound/wrong_answer.wav')
        paralysedSound.play({})
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

export const showQuiz = async (obstacleName: string) => {
    const randomQuestion = quizData[Math.floor(Math.random() * quizData.length)]
    let questionPopup = WA.ui.openPopup(`${obstacleName}popup`, randomQuestion.question, randomQuestion.answers.map((answer) => {
        return {
            label: answer.answer,
            className: "primary",
            callback: (popup) => {
                if (answer.id === randomQuestion.rightAnswer) {
                    WA.event.broadcast(GameRaceEvents.RIGHT_ANSWER, {concernedPlayer:WA.player.playerId,questionId: randomQuestion.id}).then()
                    popup.close()
                } else {
                    WA.event.broadcast(GameRaceEvents.WRONG_ANSWER, {concernedPlayer:WA.player.playerId,questionId: randomQuestion.id}).then()
                }
            },
        }
    }))
    iPopupQueue.push(questionPopup)
}
