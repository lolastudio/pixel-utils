import * as workerTimers from '/node_modules/worker-timers/build/es2019/module.js';

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let seq1 = [], seq2 = [];
let fps1 = 12, skip1 = 0;
let fps2 = 10, skip2 = 1;
canvas.height = 1536 / 2;
canvas.width = 1536;

window.listen('drop', (images) => {
    if (!seq1.length) seq1 = images;
    else seq2 = images;

    if (seq1.length && seq2.length) {
        start();
    }
});

let last = 0;
let gcount1 = 0, gcount2 = 0, count1 = 0, count2 = 0;
function start() {
    let capture = new CCapture({
        framerate: 12,
        format: 'gif',
        workersPath: 'web_modules/',
        quality: 10,
        name: `output`
    });
    capture.start()

    workerTimers.setInterval(() => {
        let now = +new Date()
        if ((now - last) >= 1e3 / 12 && seq1.length) {
            ctx.clearRect(0, 0, 1536 / 2, canvas.height);
            ctx.drawImage(seq1[gcount1], 0, 0);
            ctx.clearRect(1536 / 2, 0, canvas.width, canvas.height);
            ctx.drawImage(seq2[gcount1], 1536 / 2, 0);
            gcount1++;
            capture.capture(canvas);
        }

        if(gcount1 === 22) {
            capture.stop();
            capture.save();
        }

        last = now;
    }, 1e3 / 2);
}

document.body.appendChild(canvas);