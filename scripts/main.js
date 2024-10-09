window.onload = function () {
    const startGameBtn = document.getElementById('start-new-game');
    const preloader = document.getElementById('preloader');
    const cameraBtn = document.querySelector('.game__footer--camares');
    const cameraTogglingBtns = document.querySelectorAll('.camera-toggling-button');
    const maskBtn = document.querySelector('.game__footer--mask');

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');



    fetchConfig().then(({ startMenuConfig, backgroundMoveStep }) => {
        startMenu.initializeStartMenu(startMenuConfig);

        const player = new Player(backgroundMoveStep);

        cameraBtn.addEventListener('click', player.toggleCamera);
        cameraTogglingBtns.forEach(button => {
            button.addEventListener('click', event => {
                player.toggleCameraLocation(event);
            });
        });

        maskBtn.addEventListener('click', () => player.putOnMask());

        // Added event listeners for specific buttons
        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') player.moveBackground('left');
            else if (event.key === 'ArrowRight') player.moveBackground('right');

            if (event.key === ' ') player.putOnMask();
            if (event.key === 'Shift') player.toggleCamera(); 

            console.log(event);
        });
    }).catch(error => {
        console.error('Error loading config:', error);
    });
};

function fetchConfig() {
    const settingsPath = window.location.hostname === 'localhost'
        ? 'settings.json'  // Local development
        : 'https://nazariyh.github.io/Five-Nights-At-Polytech/settings.json';  // GitHub Pages

    return fetch('settings.json')
        .then(response => response.json())
        .then(settings => {
            const startMenuConfig = {
                start_menu_shake_interval: settings['start_menu_shake_interval'],
                start_menu_shake_delay: settings['start_menu_shake_delay'],
                start_menu_shake_times: settings['start_menu_shake_times'],
                start_menu_sound_interval: settings['start_menu_sound_interval'],
            };
            const backgroundMoveStep = settings['background_move_step'];
            return { startMenuConfig, backgroundMoveStep };
        })
        .catch(error => {
            console.log('Error with loading settings', error);
            throw error;
        });
}


// Make noise effect
const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function generateNoise() {
    const imageData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    for (let i = 0; i < buffer32.length; i++) {
        buffer32[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
    }
    ctx.putImageData(imageData, 0, 0);
}

function loop() {
    generateNoise();
    requestAnimationFrame(loop);
}

loop();