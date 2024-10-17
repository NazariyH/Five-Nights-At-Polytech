const disclaimer = document.getElementById('disclaimer');
const disclaimerBtn = document.getElementById('disclaimer-button');
const startMenuBlock = document.getElementById('start-menu');
const startMenuBackgroundMusic = document.getElementById('start-menu-background-music');
const startMenuImages = document.querySelectorAll('.two-options');
const startMenuImagesGroup = document.querySelector('.start__block__group');
const startMenuSoundEffects = document.querySelectorAll('.start-menu-sound-effect');
const cameraTogglingSound = document.getElementById('camera-toggling-sound');
const startNewGameBtn = document.getElementById('start-new-game');
const game = document.getElementById('game');
const backgroundId = document.getElementById('background-location');
const continueBtn = document.querySelector('.continue');
const continueGameBtn = document.getElementById('continue-game');

const selectMenuButton = document.getElementById('select-menu');
const selectMenuList = document.getElementById('select-menu-list');
const selectMenuOptions = selectMenuList.querySelectorAll('li');
const helpfulLinks = document.getElementById('helpful-links');
const documentationBtn = document.getElementById('documentation');


var startMenu = {
    startMenuConfig: null,

    startMenuAnimationInterval: null,
    startMenuSoundInterval: null,
    intervals: [],
    message: `Хер тобі а не інструкція.\nВсе що тобі потрібно знати: дивись за камерами, якщо когось не видно на камерах, значить він в тебе в кімнаті, вдягни маску поки не пізно. Не забувай крутити шкатулку, бо Андрусяк тебе *****!`,

    launchGame() {
        startMenuBlock.classList.add('d-none');
        backgroundId.classList.remove('d-none');
        game.classList.remove('d-none');

        this.clearAllIntervals();
    },

    initializeStartMenu(startMenuConfig) {
        this.startMenuConfig = startMenuConfig;


        documentationBtn.addEventListener('click', () => alert(this.message));



        this.setUpDisclaimer();

        startNewGameBtn.addEventListener('click', () => {
            localStorage.setItem('current_night', 1);
            this.launchGame();
        });

        continueGameBtn.addEventListener('click', () => {
            this.launchGame();
        });

        selectMenuOptions.forEach(option => option.addEventListener('click', event => {
            localStorage.setItem('current_night', event.currentTarget.getAttribute('data-night'));
            continueBtn.textContent = `Продовжити ${localStorage.getItem('current_night')} ніч`;
            selectMenuList.classList.add('d-none');
            selectMenuButton.querySelector('img').classList.remove('close');
            selectMenuButton.querySelector('img').classList.add('open');
        }));

        selectMenuButton.addEventListener('click', this.toggleSelectMenu);
    },

    toggleSelectMenu() {
        // Toggle menu list for helpful links displayed on the start screen

        if (selectMenuList.classList.contains('d-none')) {
            selectMenuList.classList.remove('d-none');
            selectMenuButton.querySelector('img').classList.add('close');
            selectMenuButton.querySelector('img').classList.remove('open');
        } else {
            selectMenuList.classList.add('d-none');
            selectMenuButton.querySelector('img').classList.add('open');
            selectMenuButton.querySelector('img').classList.remove('close');
        }
    },

    setUpDisclaimer() {
        disclaimerBtn.addEventListener('click', () => {
            disclaimer.classList.add('d-none');
            startMenuBlock.classList.remove('d-none');
            fpsCount.classList.remove('d-none');

            this.launchStartMenuAnimation();

            try {
                startMenuBackgroundMusic.play();
            } catch (error) {
                console.error('Error with playing background music', error);
            }

            if(!localStorage.getItem('current_night')) 
                localStorage.setItem('current_night', '1');
            else
                continueBtn.textContent = `Продовжити ${localStorage.getItem('current_night')} ніч`;
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
