window.onload = function () {
    const startGameBtn = document.getElementById('start-new-game');
    const preloader = document.getElementById('preloader');
    const cameraBtn = document.querySelector('.game__footer--camares');
    const cameraTogglingBtns = document.querySelectorAll('.camera-toggling-button');
    const maskBtn = document.querySelector('.game__footer--mask');

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');



    fetchConfig().then(({ startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing }) => {
        startMenu.initializeStartMenu(startMenuConfig);

        const player = new Player(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing);

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
            let current_level = 'level_1';

            const startMenuConfig = {
                start_menu_shake_interval: settings['start_menu_shake_interval'],
                start_menu_shake_delay: settings['start_menu_shake_delay'],
                start_menu_shake_times: settings['start_menu_shake_times'],
                start_menu_sound_interval: settings['start_menu_sound_interval'],
            };

            const batteryConfig = {
                battery_capacity: settings[current_level]['battery_capacity'],
                battery_camera_consumption: settings[current_level]['battery_camera_consumption'],
            }

            const oxygenConfig = {
                oxygen_capacity: settings[current_level]['oxygen_capacity'],
                oxygen_mask_consumption: settings[current_level]['oxygen_mask_consumption'],
                oxygen_restoration: settings[current_level]['oxygen_restoration'],
            }

            const bloodStartShowing = settings['blood_start_showing'];

            const backgroundMoveStep = settings['background_move_step'];

            return { startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing };
        })
        .catch(error => {
            console.log('Error with loading settings', error);
            throw error;
        });
}
