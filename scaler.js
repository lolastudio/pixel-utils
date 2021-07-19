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
var capturer = new CCapture({ format: 'webm', framerate: 60, motionBlurFrames: 1 });
let padding = 1;

let img = new Image();
img.src = 'dk.jpg';
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    canvas_resize.width = img.width / (size / 2);
    canvas_resize.height = img.height / (size / 2);

    canvas2.width = img.width + (canvas_resize.width * padding);
    canvas2.height = img.height + (canvas_resize.height * padding);
    canvas3.width = img.width + (canvas_resize.width * padding);
    canvas3.height = img.height + (canvas_resize.height * padding);
    ctx.drawImage(img, 0, 0);
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

let rendering = false;
function mapRays() {
    let data = image_data.data;
    for (let y = 0; y < canvas_resize.height; ++y) {
        for (let x = 0; x < canvas_resize.width; ++x) {
            let index = (y * canvas_resize.width + x) * 4;
            let [r, g, b, a] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
            let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let radius = (size / 2) + ((luminance / 255));
            if (!mapped[y]) mapped[y] = {}

            mapped[y][x] = {
                x: (x * (size / 2)) + (Math.random() / 2),
                y: (y * (size / 2)) + (Math.random() / 4),
                rx: radius * 1.9,
                ry: radius * .1,
                radius,
                color: `rgb(${r}, ${g}, ${b})`
                // color: 'rgb(255,255,255)'
            }
        }
    }

    // capturer.start();

    draw(0);
}

let steps = 8;
let count = 0;
let filter = `contrast(1.1) brightness(${1.4}) saturate(1.4) blur(${size / 4}px)`;
function draw(y) {
    if (y >= canvas_resize.height) {
        y = 0;
        
        return;
        
        if (rendering === false) {
            rendering = true;
            console.time('render');
            capturer.start();
        }
        else if (rendering === true && count > 1) {
            console.timeEnd('render');
            capturer.stop();
            capturer.save();
            rendering = null
        }
        console.log(rendering, count);
        
        count++;
    }
    
    requestAnimationFrame(() => { draw(y + 1) });
    // ctx3.drawImage(canvas, 0, 0);
    ctx3.drawImage(canvas2, 0, 0);
    capturer.capture(canvas3);
    
    let w = canvas_resize.width;
    let h = canvas_resize.height;

    for (let x = 0; x < w; x++) {
        // for (let y = 0; y < h; y++) {
        let ray = mapped[y][x];
        ctx2.beginPath();
        ctx.moveTo(ray.x, ray.y);
        ctx2.ellipse(ray.x + (x * (padding * 1.1)), ray.y + (y * padding), ray.rx, ray.ry, 0, 0, 2 * Math.PI, true);
        ctx2.fillStyle = ray.color;
        ctx2.fill();
        ctx2.fill();
        // }
    }
    
    ctx2.filter = filter;
    if (y % Math.round(canvas.height / steps) === 0) {
    }

    if (y % Math.round(canvas.height / (steps * 4)) === 0) {
        ctx2.fillStyle = `rgba(0, 0, 0, ${1 / (steps * 6)})`;
        // ctx2.fillRect(0, 0, canvas.width, canvas.height);
    }

}