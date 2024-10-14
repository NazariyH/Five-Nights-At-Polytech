const timerObject = document.querySelector('.game__header--time-count');
const winGameText = document.querySelector('.win-game__text');
const winGameBlock = document.getElementById('win-game');
const fpsCount = document.getElementById('fps-count');

let frameCount = 0;
let lastTime = performance.now();


// Import audio files
const winSound = document.getElementById('win-sound');



class Game {
    constructor(timer_clock, winTextDelay) {
        this.timerClock = timer_clock;
        this.currentHour = 0;
        this.winTextDelay = this.winTextDelay


        // Intervals
        this.timerClockInterval = setInterval(() => {
            this.currentHour += 1;
            timerObject.textContent = this.currentHour;
            this.checkTimerClock();
        }, this.timerClock);
    }

    initialize() {
        // InitialingGame

        this.updateFPSCount();
        setInterval(() => this.calculateFPS(), 100);
    }

    checkTimerClock() {
        // Check timer clock to initialize win

        if (this.currentHour >= 6) {
            clearInterval(this.timerClockInterval);
            this.gameWin();
        }
    }


    gameWin() {
        // Initializing game win
        puppetBoxAudio.pause();
        startMenuBackgroundMusic.pause();
        enemyApproaching.pause();
        winSound.play();

        if (mask.classList.contains('active')) {
            mask.remove('active');
            maskBreath.pause();
        }

        if (camera.classList.contains('active')) {
            camera.remove('active');
            noise.pause();
        }

        winGameBlock.classList.remove('d-none');
        setTimeout(() => {
            winGameText.classList.add('active');
        }, this.winTextDelay);
    }


    updateFPSCount() {
        // Updates fps logic and animation

        frameCount++;
        requestAnimationFrame(() => this.updateFPSCount()); // Use arrow function for proper context
    }

    calculateFPS() {
        const now = performance.now();
        const delta = now - lastTime;

        if (delta > 1000) {
            fpsCount.querySelector('span').innerText = frameCount;
            frameCount = 0;
            lastTime = now;
        }
    }
}