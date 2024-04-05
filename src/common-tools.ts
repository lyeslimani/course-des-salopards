export const PARALYSED_STATE_DURATION = 2000

export const applyParalysedState = () => {
    WA.controls.disablePlayerControls();
    const paralysedSound = WA.sound.loadSound('/sound/hurt_effect.wav')
    paralysedSound.play({loop: true,})
    WA.ui.banner.openBanner({
        id: "banner-test",
        text: "Vous êtes paralysé!!!",
        bgColor: "#deff89",
        textColor: "#8c7b75",
        closable: false,
        timeToClose: 120000,
    });
    setTimeout(() => {
        WA.ui.banner.closeBanner()
        WA.controls.restorePlayerControls()
        paralysedSound.stop()
    }, PARALYSED_STATE_DURATION)
}
