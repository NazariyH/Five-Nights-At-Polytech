const screamerObject = document.querySelector('.game__screamer--wrap');
const screamerImageObject = screamerObject.querySelector('div');
const mainLocation = document.getElementById('background-location');
const waitingScreamerWrapObj = document.querySelector('.game__screamer--waiting');
const soundEffects = document.getElementById('sound-effects');

// Import audio
const screamerSound = document.querySelector('.screamer-audio');


class Enemy {
    constructor(enemyObjects, enemyMoveInterval, cameraRepairSpeed, enemyDelayBeforeAtack, screamerConfig) {
        this.enemyObjects = enemyObjects;
        this.enemyMoveInterval = enemyMoveInterval;
        this.cameraRepairSpeed = cameraRepairSpeed;
        this.enemyDelayBeforeAtack = enemyDelayBeforeAtack;
    

        this.dynamicEnemyObject = {}
        this.preloadScreamerRemoveDelay = 2000;


        this.screamerPopupDelay = screamerConfig.screamer_popup_delay;
        this.screamerShaking = screamerConfig.changing_screamer_delay;

        // Define intervals
        this.enemySpawnInterval = null;
        this.updateImageSrcInterval = null;
        this.checkMaskStatusInterval = null;
    }

    initialize() {
        // Initialize enemy move interval

        this.initializeInitialEnemyPosition();

    }

    moveEnemyToMainLocation(enemy, enemyId, enemyWaitingDuration) {
        // Move enemy to the main location when they passed their route

        const enemyImage = {
            background_image: enemy['background_image'],
            background_active_image: enemy['background_active_image'],
            screamer_sound: enemy['screamer_sound'],
        }

        if (!mask.classList.contains('active')) {
            this.runScreamer(enemyImage);
        };

        mainLocation.setAttribute('data-enemyId', enemyId);
        waitingScreamerWrapObj.querySelector('div').style.backgroundImage = `url(${enemy['background_image']})`;


        setTimeout(() => {
            if (this.checkMaskStatusInterval === null) {
                this.checkMaskStatusInterval = setInterval(() => {
                    this.checkMaskStatus(enemyImage);
                }, 100);
            }

            waitingScreamerWrapObj.classList.add('waiting');
            waitingScreamerWrapObj.style.opacity = 1;
    
            setTimeout(() => {
                waitingScreamerWrapObj.classList.remove('waiting');
                waitingScreamerWrapObj.classList.add('unload');
    
                setTimeout(() => {
                    waitingScreamerWrapObj.style.opacity = 0;
                    waitingScreamerWrapObj.classList.remove('unload');
                    
                    mainLocation.setAttribute('data-enemyId', '0');

                    clearInterval(this.checkMaskStatusInterval);
                    this.checkMaskStatusInterval = null;

                }, this.preloadScreamerRemoveDelay);
            }, enemyWaitingDuration);
        }, this.enemyDelayBeforeAtack);
    }


    checkMaskStatus(enemyImage) {
        // Check if user's mask is puted on else screamer will kill the user and the game will end

        if (!mask.classList.contains('active')) {
            this.runScreamer(enemyImage);
        };
    }


    runScreamer(enemyImage) {
        // Run screamer when user's mask has unactive status


        waitingScreamerWrapObj.classList.add('d-none');
        const screamer = new Screamer(this.screamerPopupDelay, enemyImage, this.screamerShaking);
        screamer.screamerInitializing();
        screamer.runEndGameScreamer();

        clearInterval(this.checkMaskStatusInterval);
        this.checkMaskStatusInterval = null;
    };


    enemyMove(enemy) {
        // Move enemy

        let objectName = `enemy_object_${enemy['enemy_id']}`;
        let currentObject = this.dynamicEnemyObject[objectName];
        let oldLocationPosition = currentObject['current_location'];
        let currentLocationIndex = currentObject['enemy_locations'].indexOf(currentObject['current_location']);

        let randomValue = Math.floor(Math.random() * 100);
        let nextLocation;

        const statusOfMainLocation = mainLocation.getAttribute('data-enemyId');


        if (currentLocationIndex <= currentObject['enemy_locations'].length - 1) {
            if (currentLocationIndex != -1) {
                if (randomValue <= currentObject['enemy_chance_to_skip_over_location']) {
                    nextLocation = currentObject['enemy_locations'][currentLocationIndex + 2];

                    if (nextLocation) {
                        if (this.locationIsFree(nextLocation)) {
                            currentObject['current_location'] = nextLocation;
                        }
                    } else if (currentObject['enemy_locations'][currentLocationIndex + 1]) {
                        nextLocation = currentObject['enemy_locations'][currentLocationIndex + 1];

                        if (this.locationIsFree(nextLocation)) {
                            currentObject['current_location'] = nextLocation;
                        }
                    } else {
                        if (statusOfMainLocation === '0') {
                            locations[oldLocationPosition - 1].setAttribute('data-enemyId', '0');
                            this.moveEnemyToMainLocation(enemy, enemy['enemy_id'], enemy['enemy_waiting_duration']);
                        }
                    }
                } else {
                    nextLocation = currentObject['enemy_locations'][currentLocationIndex + 1];

                    if (nextLocation) {
                        if (this.locationIsFree(nextLocation)) {
                            currentObject['current_location'] = nextLocation;
                        }
                    } else {
                        if (statusOfMainLocation === '0') {
                            locations[oldLocationPosition - 1].setAttribute('data-enemyId', '0');
                            this.moveEnemyToMainLocation(enemy, enemy['enemy_id'], enemy['enemy_waiting_duration']);
                        }
                    }
                }
            }
        }

        let newLocationPosition = currentObject['current_location'];

        this.updateImage(oldLocationPosition, newLocationPosition, enemy['enemy_id']);
    }

    locationIsFree(nextLocation) {
        // Cycle through an array of objects to compare if next location is not equal to current location of others

        for (let key in this.dynamicEnemyObject) {
            if (this.dynamicEnemyObject[key]['current_location'] === nextLocation) return false;
        }

        return true;
    }

    initializeInitialEnemyPosition() {
        // Initialize initial enemy positions

        for (let key in this.enemyObjects) {
            let enemyStartLocationId = this.enemyObjects[key]['enemy_start_location'];
            let locationDataAttribute = locations[enemyStartLocationId - 1].getAttribute('data-enemyId') || '';

            if (locationDataAttribute === '0') {
                locations[enemyStartLocationId - 1].setAttribute('data-enemyId', String(this.enemyObjects[key]['enemy_id']));
            } else {
                locationDataAttribute += String(this.enemyObjects[key]['enemy_id']);
                let sortedData = locationDataAttribute.split('').sort().join('');
                locations[enemyStartLocationId - 1].setAttribute('data-enemyId', sortedData);
            }
        }

        for (let key in this.enemyObjects) {
            if (this.enemyObjects.hasOwnProperty(key)) {
                this.dynamicEnemyObject[key] = this.enemyObjects[key];
                this.dynamicEnemyObject[key]['current_location'] = this.dynamicEnemyObject[key]['enemy_start_location'];
            }
        }

        this.enemySpawnInterval = setInterval(() => {
            let randomEnemy = Math.floor(Math.random() * Object.keys(this.enemyObjects).length) + 1;
            this.enemyMove(this.enemyObjects[`enemy_object_${randomEnemy}`]);
        }, this.enemyMoveInterval);

        this.updateImageSrcInterval = setInterval(() => {
            this.updateImageSrc();
        }, this.enemyMoveInterval);
    }


    updateImage(oldLocationPosition, newLocationPosition, enemyId) {
        // Updates image locations

        if (oldLocationPosition === newLocationPosition) return;

        let oldPosition = locations[oldLocationPosition - 1];
        let newPosition = locations[newLocationPosition - 1];

        let oldEnemyId = oldPosition.getAttribute('data-enemyId');



        newPosition.setAttribute('data-enemyId', String(enemyId));


        if (oldEnemyId === String(enemyId)) {
            oldPosition.setAttribute('data-enemyId', '0');
        } else {
            let oldEnemyIds = oldPosition.getAttribute('data-enemyId');
            if (oldEnemyIds.includes(enemyId)) {
                oldPosition.setAttribute('data-enemyId', oldEnemyIds.replace(String(enemyId), ''));
                if (oldPosition.getAttribute('data-enemyId') === '') {
                    oldPosition.setAttribute('data-enemyId', '0');
                }
            }
        }
    }

    updateImageSrc() {
        // Update the part of the src after 'location_' and before '.png'



        locations.forEach((loc, i) => {
            let locSrc = loc.getAttribute('src');
            let locData = loc.getAttribute('data-enemyId');

            let newFileSrc = locSrc.replace(/(location_)(\d+)(\.png)/, `$1${locData}$3`);


            let backgroundSrc = mainLocation.getAttribute('src');
            let backgroundEnemyId = mainLocation.getAttribute('data-enemyId');
            backgroundSrc = backgroundSrc.replace(/(background_)(\d+)(\.png)/, `$1${backgroundEnemyId}$3`);
            mainLocation.setAttribute('src', backgroundSrc);

            const camera = document.getElementById('camera');
            if (camera.classList.contains('active')) {
                if (locSrc != newFileSrc) {
                    if (!loc.classList.contains('d-none')) {
                        loc.classList.add('broken');
                        setTimeout(() => {
                            loc.classList.remove('broken');
                        }, this.cameraRepairSpeed);
                    }
                }
            }

            loc.setAttribute('src', newFileSrc);
        });
    }

}

class Screamer {
    constructor(screamerDelay, screamerConfig, screamerShakingInterval) {
        this.screamerDelay = screamerDelay;
        this.screamerConfig = screamerConfig;
        this.changingScreamerDelay = screamerShakingInterval;

        this.runEndGameScreamer = this.runEndGameScreamer.bind(this);

    }

    screamerInitializing() {
        if (camera.classList.contains('active')) {
            camera.classList.remove('active');
        }
    }

    runEndGameScreamer() {
        const screamerAudioSrc = this.screamerConfig.screamer_sound;
        screamerSound.setAttribute('src', screamerAudioSrc);
        console.log(screamerSound);
        screamerSound.play();

        
        setTimeout(() => {
            screamerObject.classList.add('active');
        }, this.screamerDelay);

        setInterval(() => {
            const currentBackground = screamerImageObject.style.backgroundImage;


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
