const disclaimerBtn = document.getElementById('disclaimer-button');
const startMenuBackgroundMusic = document.getElementById('start-menu-background-music');

const setUpDisclaimer = function() {
    // Set up disclaimer view

    const disclaimer = document.getElementById('disclaimer');
    disclaimer.classList.remove('d-none');

    if (startMenuBackgroundMusic) {
        disclaimerBtn.addEventListener('click', () => {
            startMenuBackgroundMusic.play();
        });
    } else {
        console.error('Audio element not found');
    }
};
