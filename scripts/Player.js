const cameraBtn = document.querySelector('.game__footer--camares');
const cameraTogglingBtns = document.querySelectorAll('.camera-toggling-button');
const maskBtn = document.querySelector('.game__footer--mask');
const flashlightCircle = document.getElementById('light-circle');
const flashlightButton = document.querySelector('.game__footer--close--flashlight');

const camera = document.getElementById('camera');
const locations = document.querySelectorAll('.camera__screen--location');
const locationWrap = document.querySelectorAll('.camera__screen--wrap');
const locationButtons = document.querySelectorAll('.camera-toggling-button');
const moveButtons = document.querySelectorAll('.game__footer--arrow-move');
const mask = document.getElementById('mask');
const batteryCapacityObject = document.querySelector('.game__header--energy--capacity');
const batteryConsumptionText = document.querySelector('.game__header--energy--consumption');
const oxygenCapacityObject = document.querySelector('.game__header--oxygen--capacity');
const bloodAnimationObject = document.querySelector('.blood-effect');
const puppetBoxButton = document.querySelector('.puppet-box-update-button');
const puppetBoxProgressBar = document.querySelector('.puppet-box-progress-bar');

const greenIndicator = document.getElementById('green-indicator');
const yellowIndicator = document.getElementById('yellow-indicator');
const redIndicator = document.getElementById('red-indicator');


// Import audio files
const maskBreath = document.getElementById('mask-breath');
const openCamera = document.getElementById('open-camera');
const changeCamera = document.getElementById('change-camera');
const noise = document.getElementById('noise');
noise.volume = 0.1; // default noise volume
const puppetBoxAudio = document.getElementById('puppet-box');
const twistingPuppetSound = document.getElementById('twisting-puppet');
const emptyBatteryLevel = document.getElementById('empty-battery-end');
const powerOutage = document.getElementById('power-outage');

class Player {
    constructor(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig, endScreenAppearDelay) {
        this.backgroundMoveStep = backgroundMoveStep;
        this.endScreenAppearDelay = endScreenAppearDelay;

        this.batteryCapacity = batteryConfig.battery_capacity;
        this.batteryCameraConsumption = batteryConfig.battery_camera_consumption;
        this.batteryFlashlightConsumption = batteryConfig.battery_flashlight_consumption;
        this.batteryUsed = 0;
        this.batteryGeneralConsumption = 0;

        this.oxygenCapacity = oxygenConfig.oxygen_capacity;
        this.oxygenMaskConsumption = oxygenConfig.oxygen_mask_consumption;
        this.oxygenRestoration = oxygenConfig.oxygen_restoration;
        this.oxygenUsed = 0;
        this.oxygenGeneralConsumption = 0;

        this.bloodStartShowing = bloodStartShowing // bloodStartShowing = to percent when blood apears

        this.puppetBoxDuration = puppetBoxConfig.puppet_box_duration;
        this.puppetBoxUpdateSec = puppetBoxConfig.puppet_box_update;
        this.puppetBoxTimer = this.puppetBoxDuration;

        this.screamerPopupDelay = screamerConfig.screamer_popup_delay;
        this.screamerShaking = screamerConfig.changing_screamer_delay;


        // screamers
        this.puppetScreamerConfig = {
            background_image: screamerConfig.puppet_screamer.background_image,
            background_active_image: screamerConfig.puppet_screamer.background_active_image,
            screamer_sound: screamerConfig.puppet_screamer.screamer_sound,
        };


        // Gameplay objects 
        this.background = document.getElementById('background-location');

        // Base configs
        this.offset = 0;
        this.toggleDelay = 400;


        // Bind function
        this.toggleCamera = this.toggleCamera.bind(this); // Bind method to the current instance
        this.toggleCameraLocation = this.toggleCameraLocation.bind(this);
        this.putOnMask = this.putOnMask.bind(this);
        this.updatePuppetBox = this.updatePuppetBox.bind(this);


        // Intervals and Timeout
        this.updateTimer = setInterval(() => {
            this.updateBatteryStatus();
            this.updateOxygenStatus();
            this.updatePuppetBox();

            let currentLocation = document.querySelector('.camera__screen--location:not(.d-none)');

            this.changeIndicator(currentLocation);


            if (puppetBoxAudio.paused) {
                clearInterval(this.updateTimer);
            }
        }, 1000);
    }

    initializingGame() {
        // Initializing game
        cameraBtn.addEventListener('click', this.toggleCamera);
        cameraTogglingBtns.forEach(button => {
            button.addEventListener('click', event => {
                this.toggleCameraLocation(event);
            });
        });


        flashlightButton.addEventListener('click', () => this.toggleFlahlight());
        this.flashlightCircleMove();


        maskBtn.addEventListener('click', () => this.putOnMask());


        moveButtons.forEach(btn => {
            btn.addEventListener('click', event => this.moveBackground(event.currentTarget.getAttribute('data-direction')));
        });


        // Added event listeners for specific buttons
        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') this.moveBackground('left');
            else if (event.key === 'ArrowRight') this.moveBackground('right');

            if (event.key === ' ') this.putOnMask();
            if (event.key === 'Shift') this.toggleCamera();

            if (event.key === 'Meta') this.toggleFlahlight();
        });


        puppetBoxButton.addEventListener('click', () => {
            let percentage = this.puppetBoxTimer * 100 / this.puppetBoxDuration * 3.6 + 'deg';
            let puppetBoxBackgroundStyle = window.getComputedStyle(puppetBoxProgressBar);
            puppetBoxProgressBar.style.background = puppetBoxBackgroundStyle.background.replace(/\d+deg/g, percentage);
            
            twistingPuppetSound.play()
            if (this.puppetBoxTimer + this.puppetBoxUpdateSec < this.puppetBoxDuration) {
                this.puppetBoxTimer += this.puppetBoxUpdateSec;
                puppetBoxAudio.currentTime = Math.max(0, puppetBoxAudio.currentTime - this.puppetBoxUpdateSec);
            } else {
                this.puppetBoxTimer = this.puppetBoxDuration;
            }

        });
    }


    flashlightCircleMove() {
        // Move flashlight circle when user hover over the screen

        document.body.addEventListener('mousemove', (event) => {
            flashlightCircle.style.left = `${event.pageX - 100}px`;
            flashlightCircle.style.top = `${event.pageY - 100}px`;
        });
    }


    updateBatteryStatus() {
        // Updates battery status
        this.batteryUsed += this.batteryGeneralConsumption;
        let convertedUsedCapacity = 100 - (100 * this.batteryUsed / this.batteryCapacity);

        if (convertedUsedCapacity <= 0) {
            convertedUsedCapacity = 0;
            this.batteryGeneralConsumption = 0;

        }

        batteryConsumptionText.textContent = this.batteryGeneralConsumption;
        batteryCapacityObject.style.width = `${convertedUsedCapacity}%`;


        if (convertedUsedCapacity <= 0) {
            this.endGameDueToBattery();
        }
    }

    toggleFlahlight() {
        if (flashlightCircle.classList.contains('d-none')) {
            flashlightCircle.classList.remove('d-none');
            document.body.classList.add('hide-cursor');
            this.batteryGeneralConsumption += this.batteryFlashlightConsumption;
        } else {
            flashlightCircle.classList.add('d-none');
            document.body.classList.remove('hide-cursor');
            this.batteryGeneralConsumption -= this.batteryFlashlightConsumption;
        }

    }

    endGameDueToBattery() {
        // Ends game

        clearInterval(this.updateTimer)

        locationWrap.forEach(location => {
            location.remove();
        });

        noiseCanvas.classList.add('d-none');
        this.background.classList.add('d-none');

        powerOutage.play();
        setTimeout(() => {
            emptyBatteryLevel.play();
            puppetBoxAudio.pause();
        }, powerOutage.duration);

        setTimeout(() => {
            this.puppetBoxEndGame();
        }, emptyBatteryLevel.duration * 1000);
    }

    updateOxygenStatus() {
        // Updated oxygen consumption status

        if (this.oxygenGeneralConsumption != 0) {
            this.oxygenUsed += this.oxygenGeneralConsumption;
        } else {
            if (this.oxygenUsed - this.oxygenRestoration > 0) {
                this.oxygenUsed -= this.oxygenRestoration;
            }
        }


        let convertedUsedCapacity = 100 - (100 * this.oxygenUsed / this.oxygenCapacity);

        if (convertedUsedCapacity < this.bloodStartShowing) {
            bloodAnimationObject.classList.add('active');
        } else {
            if (bloodAnimationObject.classList.contains('active')) {
                bloodAnimationObject.classList.remove('active');
            }
        }

        oxygenCapacityObject.style.width = `${convertedUsedCapacity}%`;
        // console.log(this.oxygenGeneralConsumption, typeof this.oxygenGeneralConsumption, convertedUsedCapacity);
    }

    updatePuppetBox() {
        // Updated puppet box every second


        let percentage = this.puppetBoxTimer * 100 / this.puppetBoxDuration * 3.6 + 'deg';
        let puppetBoxBackgroundStyle = window.getComputedStyle(puppetBoxProgressBar);
        puppetBoxProgressBar.style.background = puppetBoxBackgroundStyle.background.replace(/\d+deg/g, percentage);

        this.puppetBoxTimer -= 1;
        if (this.puppetBoxTimer <= 0) {
            this.puppetBoxEndGame();
        }
    }

    toggleCamera() {
        // Show camera screen for the user

        if (mask.classList.contains('active')) {
            mask.classList.remove('active');
            if (this.oxygenGeneralConsumption - this.oxygenMaskConsumption > 0) {
                this.oxygenGeneralConsumption -= this.oxygenMaskConsumption;
            } else {
                this.oxygenGeneralConsumption = 0
            }


            maskBreath.pause();
            noise.play();
            maskBreath.currentTime = 0;

            setTimeout(() => {
                camera.classList.add('active');
                openCamera.play();
                this.batteryGeneralConsumption += this.batteryCameraConsumption;
            }, this.toggleDelay);

        } else if (camera.classList.contains('active')) {
            camera.classList.remove('active');
            this.batteryGeneralConsumption = Math.max(0, this.batteryGeneralConsumption - this.batteryCameraConsumption);
            openCamera.play();
            noise.pause();
        } else {
            camera.classList.add('active');
            this.batteryGeneralConsumption += this.batteryCameraConsumption;
            openCamera.play();
            noise.play();
        }
    }

    toggleCameraLocation(event) {
        // Toggle images on the camera's screen by clicking a button
        let locationId = event.currentTarget.getAttribute('data-cameraId');
        locationButtons.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
        changeCamera.play();

        this.changeIndicator(locations[Number(locationId) - 1]);

        locations.forEach((location, count) => {
            location.classList.add('d-none');
            if (count === Number(locationId) - 1) {
                location.classList.remove('d-none');
            }
        });

        locationWrap.forEach((wrap, count) => {
            wrap.classList.add('d-none');
            if (count === Number(locationId) - 1) {
                wrap.classList.remove('d-none');
            }
        });
    }

    changeIndicator(location) {
        // Change indicator's color depening on camera's location status

        redIndicator.classList.remove('active');
        yellowIndicator.classList.remove('active');
        greenIndicator.classList.remove('active');

        if (location.classList.contains('broken')) {
            redIndicator.classList.add('active');
            return;
        } else if (location.getAttribute('data-enemyId') !== '0') {
            yellowIndicator.classList.add('active');
            return
        } else {
            greenIndicator.classList.add('active');
        }
    }

    putOnMask() {
        // Toggle user mask
        if (camera.classList.contains('active')) {
            camera.classList.remove('active');
            this.batteryGeneralConsumption = Math.max(0, this.batteryGeneralConsumption - this.batteryCameraConsumption);
            openCamera.play();
            noise.pause();

            setTimeout(() => {
                mask.classList.add('active');
                this.oxygenGeneralConsumption += this.oxygenMaskConsumption;
                maskBreath.play();
            }, this.toggleDelay / 2);

        } else if (mask.classList.contains('active')) {
            mask.classList.remove('active');

            if (this.oxygenGeneralConsumption - this.oxygenMaskConsumption > 0) {
                this.oxygenGeneralConsumption -= this.oxygenMaskConsumption;
            } else {
                this.oxygenGeneralConsumption = 0

            }

            maskBreath.pause();
            maskBreath.currentTime = 0;
        } else {
            mask.classList.add('active');
            this.oxygenGeneralConsumption += this.oxygenMaskConsumption;
            maskBreath.play();
        }
    }

    moveBackground(direction) {
        // Move background for 3D effect
        const containerWidth = document.body.clientWidth;
        const backgroundWidth = this.background.offsetWidth;

        if (direction === 'left' && this.offset + this.backgroundMoveStep <= 0) {
            this.offset += this.backgroundMoveStep;
        } else if (direction === 'right' && this.offset - this.backgroundMoveStep >= containerWidth - backgroundWidth) {
            this.offset -= this.backgroundMoveStep;
        }

        this.background.style.left = `${this.offset}px`;
    }

    puppetBoxEndGame() {
        if (camera.classList.contains('active')) {
            camera.classList.remove('active');
        } else if (mask.classList.contains('active')) {
            mask.classList.remove('active');
        }

        clearInterval(this.updateTimer);
        puppetBoxAudio.pause();


        const screamer = new Screamer(this.screamerPopupDelay, this.puppetScreamerConfig, this.screamerShaking, this.endScreenAppearDelay);
        screamer.screamerInitializing();
        screamer.runEndGameScreamer();
    }
}
