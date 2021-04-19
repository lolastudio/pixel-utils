let img = new Image();
img.src = '0027.png';

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let scale = 2;

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let canvas2 = document.createElement('canvas');
    canvas2.width = canvas.width * scale;
    canvas2.height = canvas.height * scale;
    document.body.appendChild(canvas2);

    let ctx2 = canvas2.getContext('2d');
    console.time('resize');
    let newid = nearest(ctx.getImageData(0, 0, canvas.width, canvas.height), img.width * scale, img.height * scale);
    ctx2.putImageData(newid, 0, 0);
    console.timeEnd('resize');
}

function nearest(original, width, height) {
    let result = new ImageData(width, height);

    let xFactor = original.width / width,
        yFactor = original.height / height,
        dstIndex = 0, x, y, offset;

    for (y = 0; y < height; y++) {
        offset = ((y * yFactor) | 0) * original.width;
        for (x = 0; x < width; x++) {
            let srcIndex = (offset + x * xFactor) << 2;

            result.data[dstIndex] = original.data[srcIndex];
            result.data[dstIndex + 1] = original.data[srcIndex + 1];
            result.data[dstIndex + 2] = original.data[srcIndex + 2];
            result.data[dstIndex + 3] = original.data[srcIndex + 3];
            dstIndex += 4;
        }
    }

    return result;
};