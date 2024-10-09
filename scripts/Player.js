const camera = document.getElementById('camera');
const locations = document.querySelectorAll('.camera__screen--location');
const locationButtons = document.querySelectorAll('.camera-toggling-button');
const mask = document.getElementById('mask');

// Const imort audio files
const maskBreath = document.getElementById('mask-breath');
const openCamera = document.getElementById('open-camera');
const changeCamera = document.getElementById('change-camera');
const noise = document.getElementById('noise');
noise.volume = 0.1; //default noise volume

function Player(backgroundMoveStep) {
    this.backgroundMoveStep = backgroundMoveStep;

    // Gameplay objects 
    this.background = document.getElementById('background-location');

    // Base configs
    this.offset = 0;
    this.toggleDelay = 400;
}




Player.prototype.toggleCamera = function () {
    // Show camera screen for user
    if (mask.classList.contains('active')) {
        mask.classList.remove('active');
        maskBreath.pause();
        noise.play();
        maskBreath.currentTime = 0;

        setTimeout(() => {
            camera.classList.add('active');
            openCamera.play();
        }, this.toggleDelay);

        return;
    }

    if (camera.classList.contains('active')) {
        camera.classList.remove('active');
        openCamera.play();
        noise.pause();
    } else {
        camera.classList.add('active');
        openCamera.play();
        noise.play();
    }
}

Player.prototype.toggleCameraLocation = function (event) {
    // This function toggles images on the camera's screen by clicking on the button

    let locationId = event.currentTarget.getAttribute('data-cameraId');
    locationButtons.forEach(btn => {
        if (btn.className === 'camera-toggling-button active') {
            btn.classList.remove('active');
            changeCamera.play();
        }
    });

    locations.forEach((location, count) => {
        if (location.className === 'camera__screen--location') {
            location.classList.add('d-none');
        }

        if (count === Number(locationId - 1)) {
            location.classList.remove('d-none');
            event.currentTarget.classList.add('active');
        }
    });
}


Player.prototype.putOnMask = function () {
    // Toggle user musk

    if (camera.classList.contains('active')) {
        camera.classList.remove('active');
        openCamera.play();
        noise.pause();
        setTimeout(() => {
            mask.classList.add('active');
            maskBreath.play();
        }, this.toggleDela / 2);
        return;
    }

    let timeOfDead = null;

    if (mask.className !== 'active') {
        timeOfDead = setTimeout(() => {
            console.log('DEAD')
        }, mask.duration);
    } else {
        clearTimeout(timeOfDead);
    }

    if (mask.classList.contains('active')) {
        mask.classList.remove('active');
        maskBreath.pause();
        maskBreath.currentTime = 0;
    } else {
        mask.classList.add('active');
        maskBreath.play();
    }
}


Player.prototype.moveBackground = function (direction) {
    // This function move background making 3d effect
    const containerWidth = document.body.clientWidth;

    if (direction === 'left') {
        if (this.offset + this.backgroundMoveStep <= 0) {
            this.offset += this.backgroundMoveStep;
        }
    } else if (direction === 'right') {
        if (this.offset - this.backgroundMoveStep >= containerWidth - this.background.offsetWidth) {
            this.offset -= this.backgroundMoveStep;
        }
    }

    this.background.style.left = `${this.offset}px`;
}