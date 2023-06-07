import * as workerTimers from '/node_modules/worker-timers/build/es2019/module.js';

let size = 4;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let canvas_resize = document.createElement('canvas');
let ctx_resize = canvas_resize.getContext('2d');
let canvas2 = document.createElement('canvas');
let ctx2 = canvas2.getContext('2d');
let canvas3 = document.createElement('canvas');
let ctx3 = canvas3.getContext('2d');
let image_data;
let mapped = {};
var capturer = new CCapture({
    format: 'gif',
    workersPath: 'web_modules/',
    quality: 10,
    framerate: 60,
    motionBlurFrames: 1
});
let padding_y = 1.25;
let padding_x = 1.25;

let img = new Image();
let intensity = 4;
let blur_value = 2;

window.listen('drop', (images) => {
    document.body.querySelector('drop-area').remove();
    img = images[0];
    size = +window.prompt('phosphor size') || 8;
    intensity = +window.prompt('phosphor intensity') || 2;
    blur_value = +window.prompt('blur') || 2;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas_resize.width = img.width / size;
        canvas_resize.height = img.height / size;

        canvas2.width = canvas_resize.width * size + (padding_x * canvas_resize.width);
        canvas2.height = canvas_resize.height * size + (padding_y * canvas_resize.height);
        canvas3.width = canvas2.width;
        canvas3.height = canvas2.height;
        ctx.drawImage(img, 0, 0);
        // ctx_resize.filter = 'contrast(1.2)';
        ctx_resize.drawImage(img, 0, 0, canvas_resize.width, canvas_resize.height);
        // ctx2.fillStyle = '#000';
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height)

        // document.body.appendChild(canvas);
        // document.body.appendChild(canvas_resize);
        // document.body.appendChild(canvas2);
        document.body.appendChild(canvas3);

        // ctx2.globalCompositeOperation = 'luminosity';
        ctx2.globalCompositeOperation = 'source-atop';

        image_data = ctx_resize.getImageData(0, 0, canvas_resize.width, canvas_resize.height);
        mapRays();
    }
});

let rendering = false;
function mapRays() {
    let data = image_data.data;
    for (let y = 0; y < canvas_resize.height; ++y) {
        for (let x = 0; x < canvas_resize.width; ++x) {
            let index = (y * canvas_resize.width + x) * 4;
            let [r, g, b, a] = [data[index], data[index + 1], data[index + 2] / 1.75, data[index + 3]];
            let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let radius = (size / 2) + ((luminance / 255));
            if (!mapped[y]) mapped[y] = {}

            mapped[y][x] = {
                // x: (x * (size)) + (x * padding_x) + (Math.random() * (size / 20)),
                // y: (y * (size)) + (y * padding_y) + (Math.random() * (size / 40)),
                x: (x * (size)) + (x * padding_x),
                y: (y * (size)) + (y * padding_y),
                radius,
                color: `rgb(${r}, ${g}, ${b})`,
                r: r, g: g, b: b,
                luminance: luminance / (255)
                // color: 'rgb(255,255,255)'
            }
        }
    }

    // capturer.start();

    ctx2.filter = filter;
    draw(0);
}

let steps = 8;
let count = 0;
let filter = `contrast(1.2) brightness(1.2) saturate(1.2) blur(${blur_value}px) hue-rotate(10deg)`;
function draw(y) {
    if (y >= canvas_resize.height) {
        y = -2;
        // return;

        // if (rendering === false) {
        //     rendering = true;
        //     capturer.start();
        // }
        // else if (rendering === true && count > 1) {
        //     capturer.stop();
        //     capturer.save();
        //     rendering = null
        // }

        count++;
    }

    workerTimers.setTimeout(() => { draw(y + 1) }, 0);
    ctx3.drawImage(canvas2, 0, 0);
    if (rendering === true) capturer.capture(canvas3);

    if (y < 0) return;
    let w = canvas_resize.width;

    for (let x = 0; x < w; x++) {
        shadowMask(x, y);
    }

    ctx2.fillStyle = `rgba(0, 0, 0, ${1 / (canvas_resize.height * 2)})`;
    ctx2.fillRect(0, 0, canvas3.width, canvas3.height);
}

function shadowMask(x, y) {
    let ray = mapped[y][x];
    let intensinance = intensity * 2 * ray.luminance;
    let offset = size / 4;

    let size_y = size / 1.25
    let size_x = (size / 4) - (offset / 4);
    y = ray.y + ((x % 2) * (size / 2))
    let r = size / 8;

    // console.log(ray, offset, offset * 2, size_x, size_y)

    ctx2.roundRect(ray.x, y, size_x, size_y, r)
    ctx2.fillStyle = `rgb(${ray.r}, 0, 0)`;
    for (let i = 0; i < intensinance; i++) {
        ctx2.fill();
    }

    ctx2.roundRect(ray.x + offset, y, size_x, size_y, r)
    ctx2.fillStyle = `rgb(0, ${ray.g}, 0)`;
    for (let i = 0; i < intensinance; i++) {
        ctx2.fill();
    }

    ctx2.roundRect(ray.x + (offset * 2), y, size_x, size_y, r)
    ctx2.fillStyle = `rgb(0, 0, ${ray.b})`;
    for (let i = 0; i < intensinance; i++) {
        ctx2.fill();
    }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
}