const cameraBtn = document.querySelector('.game__footer--camares');
const cameraTogglingBtns = document.querySelectorAll('.camera-toggling-button');
const maskBtn = document.querySelector('.game__footer--mask');

const camera = document.getElementById('camera');
const locations = document.querySelectorAll('.camera__screen--location');
const locationWrap = document.querySelectorAll('.camera__screen--wrap');
const locationButtons = document.querySelectorAll('.camera-toggling-button');
const mask = document.getElementById('mask');
const batteryCapacityObject = document.querySelector('.game__header--energy--capacity');
const batteryConsumptionText = document.querySelector('.game__header--energy--consumption');
const oxygenCapacityObject = document.querySelector('.game__header--oxygen--capacity');
const bloodAnimationObject = document.querySelector('.blood-effect');
const puppetBoxButton = document.querySelector('.puppet-box-update-button');


// Import audio files
const maskBreath = document.getElementById('mask-breath');
const openCamera = document.getElementById('open-camera');
const changeCamera = document.getElementById('change-camera');
const noise = document.getElementById('noise');
noise.volume = 0.1; // default noise volume
const puppetBoxAudio = document.getElementById('puppet-box');
const twistingPuppetSound = document.getElementById('twisting-puppet');

class Player {
    constructor(backgroundMoveStep, batteryConfig, oxygenConfig, bloodStartShowing, puppetBoxConfig, screamerConfig) {
        this.backgroundMoveStep = backgroundMoveStep;

        this.batteryCapacity = batteryConfig.battery_capacity;
        this.batteryCameraConsumption = batteryConfig.battery_camera_consumption;
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
        this.puppetScreamerImage = screamerConfig.puppet_screamer;


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


        maskBtn.addEventListener('click', () => this.putOnMask());

        // Added event listeners for specific buttons
        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') this.moveBackground('left');
            else if (event.key === 'ArrowRight') this.moveBackground('right');

            if (event.key === ' ') this.putOnMask();
            if (event.key === 'Shift') this.toggleCamera();
        });


        puppetBoxButton.addEventListener('click', () => {
            twistingPuppetSound.play()
            if (this.puppetBoxTimer + this.puppetBoxUpdateSec < this.puppetBoxDuration) {
                this.puppetBoxTimer += this.puppetBoxUpdateSec;
                puppetBoxAudio.currentTime = Math.max(0, puppetBoxAudio.currentTime - this.puppetBoxUpdateSec);
            } else {
                this.puppetBoxTimer = this.puppetBoxDuration;
            }

        });
    }

    updateBatteryStatus() {
        // Updates battery status
        this.batteryUsed += this.batteryGeneralConsumption;
        let convertedUsedCapacity = 100 - (100 * this.batteryUsed / this.batteryCapacity);
        batteryCapacityObject.style.width = `${convertedUsedCapacity}%`;
        batteryConsumptionText.textContent = this.batteryGeneralConsumption;
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

        console.log(this.screamerShaking);


        clearInterval(this.updateTimer);
        const screamer = new Screamer(this.screamerPopupDelay, this.puppetScreamerImage, this.screamerShaking);
        screamer.screamerInitializing();
        screamer.runEndGameScreamer();
    }
}
