const disclaimer = document.getElementById('disclaimer');
const disclaimerBtn = document.getElementById('disclaimer-button');
const startMenuBlock = document.getElementById('start-menu');
const startMenuBackgroundMusic = document.getElementById('start-menu-background-music');
const startMenuImages = document.querySelectorAll('.two-options');
const startMenuImagesGroup = document.querySelector('.start__block__group');
const startMenuSoundEffects = document.querySelectorAll('.start-menu-sound-effect');
const cameraTogglingSound = document.getElementById('camera-toggling-sound');
const startGameBtn = document.getElementById('start-new-game');
const game = document.getElementById('game');
const backgroundId = document.getElementById('background-location');

var startMenu = {
    startMenuConfig: null,

    startMenuAnimationInterval: null,
    startMenuSoundInterval: null,
    intervals: [],

    initializeStartMenu(startMenuConfig) {
        this.startMenuConfig = startMenuConfig;

        this.setUpDisclaimer();

        startGameBtn.addEventListener('click', () => {
            startMenuBlock.classList.add('d-none');
            backgroundId.classList.remove('d-none');
            game.classList.remove('d-none');

            this.clearAllIntervals();
        });
    },

    setUpDisclaimer() {
        disclaimerBtn.addEventListener('click', () => {
            disclaimer.classList.add('d-none');
            startMenuBlock.classList.remove('d-none');

            this.launchStartMenuAnimation();

            try {
                startMenuBackgroundMusic.play();
            } catch (error) {
                console.error('Error with playing background music', error);
            }
        });
    },

    shakeImage(obj, i) {
        if (i === 1) {
            startMenuImagesGroup.classList.toggle('shaking');
        }
        obj.classList.toggle('active');
        cameraTogglingSound.play();
    },

    launchStartMenuAnimation() {
        startMenuImages.forEach((obj, i) => {
            this.startMenuAnimationInterval = setInterval(() => {
                for (let j = 0; j < this.startMenuConfig['start_menu_shake_times']; j++) {
                    setTimeout(() => {
                        this.shakeImage(obj, i);
                    }, this.startMenuConfig['start_menu_shake_delay'] * j);
                }
            }, this.startMenuConfig['start_menu_shake_interval']);
            this.intervals.push(this.startMenuAnimationInterval);
        });

        this.launchStartMenuRandomSound();
    },

    launchStartMenuRandomSound() {
        this.startMenuSoundInterval = setInterval(() => {
            let randomSoundId = Math.floor(Math.random() * startMenuSoundEffects.length);
            startMenuSoundEffects[randomSoundId].play();
        }, this.startMenuConfig['start_menu_sound_interval']);
        this.intervals.push(this.startMenuSoundInterval);
    },

    clearAllIntervals() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }
};
