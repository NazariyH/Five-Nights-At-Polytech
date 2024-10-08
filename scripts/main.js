window.onload = function () {
    const startGameBtn = document.getElementById('start-new-game');
    const preloader = document.getElementById('preloader');
    const puppetBox = document.getElementById('puppet-box');
    puppetBox.volume = 0.5; // default noise volume

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');


    fetchConfig().then(({ startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig }) => {
        startMenu.initializeStartMenu(startMenuConfig);


        startGameBtn.addEventListener('click', () => {
            const player = new Player(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig);
            player.initializingGame();


            puppetBox.play();
        });
    }).catch(error => {
        console.error('Error loading config:', error);
    });
};

function fetchConfig() {
    const settingsPath = window.location.hostname === 'localhost'
        ? 'settings.json'  // Local development
        : 'https://nazariyh.github.io/Five-Nights-At-Polytech/settings.json';  // GitHub Pages

    return fetch('https://nazariyh.github.io/Five-Nights-At-Polytech/settings.json')
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

            const puppetBoxConfig = {
                puppet_box_duration: settings[current_level]['puppet_box_duration'],
                puppet_box_update: settings[current_level]['puppet_box_update'],
            }

            const screamerConfig = {
                screamer_popup_delay: settings['screamer_popup_delay'],
                puppet_screamer: settings['screamers']['puppet_screamer'],
                changing_screamer_delay: settings['changing_screamer_image_delay'],
            }

            const bloodStartShowing = settings['blood_start_showing'];

            const backgroundMoveStep = settings['background_move_step'];

            return { startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig };
        })
        .catch(error => {
            console.log('Error with loading settings', error);
            throw error;
        });
}


console.clear();
for (i = 0; i < 100; i++) {
    console.log(`${i}) А НУ ВИЙШОВ ОТ СЮДА РОЗБІЙНИК`);
}
