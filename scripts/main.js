window.onload = function () {
    const startNewGameBtn = document.getElementById('start-new-game');
    const continueGameBtn = document.getElementById('continue-game');
    const preloader = document.getElementById('preloader');
    const puppetBox = document.getElementById('puppet-box');
    puppetBox.volume = 0.5; // default noise volume

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');

    fetchConfig().then(({ startMenuConfig, backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing,
        puppetBoxConfig, screamerConfig, timerClock, winGameBlock, enemyObjects, enemyMoveInterval,
        cameraRepairSpeed, enemyDelayBeforeAtack, endScreenAppearDelay }) => {
        
        startMenu.initializeStartMenu(startMenuConfig);

        // Function to start the game, shared by both buttons
        function startGame() {
            const player = new Player(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig, endScreenAppearDelay);
            player.initializingGame();

            const enemy = new Enemy(enemyObjects, enemyMoveInterval, cameraRepairSpeed, enemyDelayBeforeAtack, screamerConfig, endScreenAppearDelay);
            enemy.initialize();

            puppetBox.play();

            const game = new Game(timerClock, winGameBlock);
            game.initialize();
        }

        // Add event listeners to both buttons
        startNewGameBtn.addEventListener('click', startGame);
        continueGameBtn.addEventListener('click', startGame);

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

            if (!localStorage.getItem('current_night')) localStorage.setItem('current_night', 1);

            let current_level = (`level_${localStorage.getItem('current_night')}`)
                ? `level_${localStorage.getItem('current_night')}`
                : 'level_1';

            const timerClock = settings['timer_clock'];
            const winGameBlock = settings['win_game_block'];
            const endScreenAppearDelay = settings['end_screen_appear_delay'];

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
                endScreenAppearDelay,
            };
        })
        .catch(error => {
            console.log('Error with loading settings', error);
            throw error;
        });
}

console.clear();
for (let i = 0; i < 100; i++) {
    console.log(`${i}) А НУ ВИЙШОВ ОТ СЮДА РОЗБІЙНИК`);
}
