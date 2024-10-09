// Noise effect
const noiseCanvas = document.getElementById('noiseCanvas');
const noiseCtx = noiseCanvas.getContext('2d');
const noiseWidth = noiseCanvas.width = window.innerWidth;
const noiseHeight = noiseCanvas.height = window.innerHeight;

function generateNoise() {
    const imageData = noiseCtx.createImageData(noiseWidth, noiseHeight);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    for (let i = 0; i < buffer32.length; i++) {
        buffer32[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff; // Black and white noise
    }
    noiseCtx.putImageData(imageData, 0, 0);
}

function loop() {
    generateNoise();
    requestAnimationFrame(loop);
}

loop();
