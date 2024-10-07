window.onload = function () {
    const preloader = document.getElementById('preloader');

    preloader.classList.add('d-none');
    disclaimer.classList.remove('d-none');

    startMenu.initializeStartMenu();
};
