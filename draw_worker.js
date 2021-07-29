let last_row = 0;
let padding = 0;
let size = 6;

function draw(count, canvas) {
    let max = (canvas.width * canvas.height / size);
    let center = { x: (canvas.width / size) / 2, y: (canvas.height / size) / 2 };

    if (count > max) count = 0;
    let row = Math.floor(count / (canvas.width / size));
    let column = count % (canvas.width / size);

    if (Math.round(row) != Math.round(last_row)) {
        last_row = row;
        postMessage({ fn: 'setCtx2', data: ['fillStyle', `rgba(0, 0, 0, .025)`] });
        postMessage({ fn: 'fillRectCtx2', data: [0, 0, canvas.width, canvas.height] });
    }

    // let data = ctx.getImageData(column * size, row * size, size, size).data;

    let mean = { r: 0, g: 0, b: 0 };
    for (let i = 0; i < data.length; i += 4) {
        mean.r += data[i];
        mean.g += data[i + 1];
        mean.b += data[i + 2];
    }

    mean.r = Math.round(mean.r / (data.length / 4));
    mean.g = Math.round(mean.g / (data.length / 4));
    mean.b = Math.round(mean.b / (data.length / 4));

    let d = distance(center, { x: column, y: row });

    let l = 0.2126 * mean.r + 0.7152 * mean.g + 0.0722 * mean.b;
    let r = (size / 2) + ((l / 255));
    // ctx2.filter = `contrast(1.1) brightness(${1.1 + (l / 510)}) saturate(1.4) blur(${r / 1.2}px)`;
    // ctx2.beginPath();
    // // ctx2.arc((column * size) + (Math.random() / 2), (row * size) + (Math.random() / 2) + (padding * row), r, 0, 2 * Math.PI, false);
    // ctx2.ellipse((column * size) + (Math.random() / 2), (row * size) + (Math.random() / 2), r * 1.1, r * .9, 0, 0, 2 * Math.PI, false);
    // ctx2.fillStyle = `rgb(${mean.r}, ${mean.g}, ${mean.b})`;
    // ctx2.fill();
}

function distance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

onmessage = function (e) {
    console.log('Message received from main script');
    console.log('Posting message back to main script');
    draw(e.data.count, e.data.canvas);
}