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


var startMenu = {
    start_menu_shake_interval: null,
    start_menu_shake_delay: null,
    start_menu_shake_times: null,
    start_menu_sound_interval: null,


    fetchSettings() {
        // Fetch settings from jsong settings

        fetch('../settings.json')
            .then(response => response.json())
            .then(settings => {
                this.start_menu_shake_interval = settings['start_menu_shake_interval'];
                this.start_menu_shake_delay = settings['start_menu_shake_delay'];
                this.start_menu_shake_times = settings['start_menu_shake_times'];
                this.start_menu_sound_interval = settings['start_menu_sound_interval'];
            })
            .catch(error => console.log('Error with load settings', error));
    },

    initializeStartMenu() {
        // Initialize start menu view

        this.fetchSettings();
        this.setUpDisclaimer();

        startGameBtn.addEventListener('click', () => {
            startMenuBlock.classList.add('d-none');
            game.classList.remove('d-none');
        });
    },

    setUpDisclaimer() {
        // Set up disclaimer view

        disclaimerBtn.addEventListener('click', () => {
            disclaimer.classList.add('d-none');
            startMenuBlock.classList.remove('d-none');

            this.launchStartMenuAnimation();

            try {
                startMenuBackgroundMusic.play();
            } catch (error) {
                console.error('Error with adding class', error);
            }
        });
    },

    shakeImage(obj, i) {
        // Launch shaking and replacing image and play camera toggeling sound

        if (i == 1) {
            startMenuImagesGroup.classList.toggle('shaking')
        }; // Get a rid of double toggle


        obj.classList.toggle('active');
        cameraTogglingSound.play();
    },

    launchStartMenuAnimation() {
        // Set intecal to launch shaking and replacing image

        startMenuImages.forEach((obj, i) => {
            setInterval(() => {
                for (j = 0; j < this.start_menu_shake_times; j++) {
                    setTimeout(() => {
                        this.shakeImage(obj, i);
                    }, this.start_menu_shake_delay * j);
                }
            }, this.start_menu_shake_interval);
        });

        this.launchStartMenuRandomSound();
    },

    launchStartMenuRandomSound() {
        // Automatically generate a random value and play a sound effect after a certain period of time
        setInterval(() => {
            let randomSoundId = Math.floor(Math.random() * startMenuSoundEffects.length);
            startMenuSoundEffects[randomSoundId].play();
        }, this.start_menu_sound_interval);
    }
}