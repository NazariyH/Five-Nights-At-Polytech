window.onload = function () {
    const startGameBtn = document.getElementById('start-new-game');
    const preloader = document.getElementById('preloader');
    const puppetBox = document.getElementById('puppet-box');
    puppetBox.volume = 0.5; // default noise volume

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');


    fetchConfig().then(({ startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing,
        puppetBoxConfig, screamerConfig, timerClock, winGameBlock, enemyObjects, enemyMoveInterval, 
        cameraRepairSpeed, enemyDelayBeforeAtack }) => {
        startMenu.initializeStartMenu(startMenuConfig);


        startGameBtn.addEventListener('click', () => {
            const player = new Player(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig);
            player.initializingGame();


            const enemy = new Enemy(enemyObjects, enemyMoveInterval, cameraRepairSpeed, enemyDelayBeforeAtack, screamerConfig);
            enemy.initialize();


            puppetBox.play();

            const game = new Game(timerClock, winGameBlock);
            game.initialize();
        });
    }).catch(error => {
        console.error('Error loading config:', error);
    });
};

function fetchConfig() {
    const settingsPath = window.location.hostname === 'localhost'
        ? 'settings.json'  // Local development
        : 'https://nazariyh.github.io/Five-Nights-At-Polytech/settings.json';  // GitHub Pages

<<<<<<< HEAD
    return fetch('settings.json')
=======
    return fetch('https://nazariyh.github.io/Five-Nights-At-Polytech/settings.json')
>>>>>>> origin/main
        .then(response => response.json())
        .then(settings => {
            let current_level = 'level_1';


            const timerClock = settings['timer_clock'];
            const winGameBlock = settings['win_game_block'];

            const startMenuConfig = {
                start_menu_shake_interval: settings['start_menu_shake_interval'],
                start_menu_shake_delay: settings['start_menu_shake_delay'],
                start_menu_shake_times: settings['start_menu_shake_times'],
                start_menu_sound_interval: settings['start_menu_sound_interval'],
            };

            const batteryConfig = {
                battery_capacity: settings[current_level]['battery_capacity'],
                battery_camera_consumption: settings[current_level]['battery_camera_consumption'],
                battery_flashlight_consumption: settings[current_level]['battery_flashlight_consumption'],
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
                preloader_screamer_remove_delay: settings['preloader_screamer_remove_delay'],
                puppet_screamer: settings[current_level]['screamers']['puppet_screamer'],
                screamer_sound: settings[current_level]['screamers']['screamer_sound'],
                changing_screamer_delay: settings['changing_screamer_image_delay'],
            }

            const bloodStartShowing = settings['blood_start_showing'];

            const backgroundMoveStep = settings['background_move_step'];
            const cameraRepairSpeed = settings[current_level]['camera-repair-speed'];


            const enemyObjects = settings[current_level]['enemies'];
            const enemyMoveInterval = settings[current_level]['move_enemy_interval'];
            const enemyDelayBeforeAtack = settings[current_level]['enemy_delay_before_atack'];

            return {
                startMenuConfig,
                backgroundMoveStep,
                batteryConfig,
                oxygenConfig,
                bloodStartShowing,
                puppetBoxConfig,
                screamerConfig,
                timerClock,
                winGameBlock,
                enemyObjects,
                enemyMoveInterval,
                cameraRepairSpeed,
                enemyDelayBeforeAtack,
            };
        })
        .catch(error => {
            console.log('Error with loading settings', error);
            throw error;
        });
}


<<<<<<< HEAD
// console.clear();
// for (i = 0; i < 100; i++) {
//     console.log(`${i}) А НУ ВИЙШОВ ОТ СЮДА РОЗБІЙНИК`);
// }
=======
console.clear();
for (i = 0; i < 100; i++) {
    console.log(`${i}) А НУ ВИЙШОВ ОТ СЮДА РОЗБІЙНИК`);
}
>>>>>>> origin/main
