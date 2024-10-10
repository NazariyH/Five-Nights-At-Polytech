const screamerObject = document.querySelector('.game__screamer--wrap');
const screamerImageObject = screamerObject.querySelector('div');

// Import audio
const screamerSound = document.querySelector('.screamer-audio');

class Screamer {
    constructor(screamerDelay, screamerConfig, screamerShakingInterval) {
        this.screamerDelay = screamerDelay;
        this.screamerConfig = screamerConfig;
        this.changingScreamerDelay = screamerShakingInterval;

        this.runEndGameScreamer = this.runEndGameScreamer.bind(this);
    }

    screamerInitializing() {
    }

    runEndGameScreamer() {
        setTimeout(() => {
            screamerObject.classList.add('active');
        }, this.screamerDelay);

        setInterval(() => {
            const currentBackground = screamerImageObject.style.backgroundImage;
            screamerSound.play();

            const { background_image, background_active_image } = this.screamerConfig;

            const currentBgUrl = currentBackground.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

            const backgroundImageUrl = background_image.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            const backgroundActiveImageUrl = background_active_image.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

            screamerImageObject.style.backgroundImage = (currentBgUrl === backgroundImageUrl)
                ? `url(${backgroundActiveImageUrl})`
                : `url(${backgroundImageUrl})`;

        }, this.changingScreamerDelay);
    }
}
