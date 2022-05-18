class CRT {
    constructor(options = {}) {
        this.options = Object.assign(this.default, options);
    }

    get default() {
        return {
            ray_size: 1,
            filter: 'contrast(2) brightness(1.8) saturate(1.2) blur(1px) hue-rotate(10deg)'
        }
    }

    draw(data, to) {
        let toctx = to.getContext('2d');
        let scale_x = 3;
        let scale_y = 3;
        let offset_x = 3;
        let offset_y = 3;

        toctx.fillStyle = `rgb(0,0,0)`;
        toctx.fillRect(0, 0, to.width, to.height)
        toctx.filter = this.options.filter;

        for (let y = 0; y < data.height; ++y) {
            for (let x = 0; x < data.width; ++x) {
                let index = (y * data.width + x) * 4;
                let [r, g, b, a] = [data.data[index], data.data[index + 1], data.data[index + 2], data.data[index + 3]];
                let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                let nluminance = luminance / 255;

                toctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nluminance})`;
                toctx.fillRect(x + (x * offset_x), y + (y * offset_y), scale_x * nluminance, scale_y * nluminance);
                toctx.fillRect(x + (x * offset_x), y + (y * offset_y), scale_x * nluminance, scale_y * nluminance);
                toctx.fillRect(x + (x * offset_x), y + (y * offset_y), scale_x * nluminance, scale_y * nluminance);
            }
        }
    }
}

export default CRT;