import { LitElement, html, css } from '/web_modules/lit-element.js';

class CanvasRenderer extends LitElement {
	constructor() {
		super();

		this.tmpcanvas = document.createElement('canvas');
		this.tmpctx = this.tmpcanvas.getContext('2d');

		this.zoom = 2;
		this.mapped = {}, this.mapped_quantized = {}, this.cacheData = {}, this.colorMap = {};
		this.images = [];
		this.frame = 0, this.last_delta = 0;
		this.fps = 24;
		this.tpf = 1e3 / this.fps;
		this.max_colors = 24;
		this.colorThief = new ColorThief();

		this.draw = this.draw.bind(this);
		this.setImages = this.setImages.bind(this);
		this.animate = this.animate.bind(this);
		this.setPalette = this.setPalette.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
		this.zoomIn = this.zoomIn.bind(this);
	}

	static get styles() {
		return css`
			:host canvas, :host img {
				image-rendering: -moz-crisp-edges;
				image-rendering: -webkit-crisp-edges;
				image-rendering: pixelated;
			}

			:host canvas {
				transform: scale(1);
				transform-origin: 0 0;
			}
		`;
	}

	setImages(images) {
		this.images = images;
	}

	render() {
		return html`
			<canvas></canvas>
		`;
	}

	firstUpdated() {
		this.canvas = this.shadowRoot.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.animate();
	}

	draw(img) {
		this.checkImg(img).then(() => {
			this.updateCanvasSize(img);
			this.tmpctx.clearRect(0, 0, img.width, img.height);
			this.tmpctx.drawImage(img, 0, 0);
			this.classify(img);
			this.drawMapped(img);
		});
	}

	classify(img) {
		if (!img.id) {
			img.id = Math.random().toString(36);
			this.mapped[img.id] = {};
		}

		if (this.cacheData[img.id] && !this.quantized) return this.cacheData[img.id];
		else {
			if (this.quantized && !this.mapped_quantized[img.id] || !this.cacheData[img.id]) {
				let data = this.tmpctx.getImageData(0, 0, img.width, img.height).data;
				for (let x = 0; x < img.width; ++x) {
					for (let y = 0; y < img.height; ++y) {
						let index = (y * img.width + x) * 4;
						let [r, g, b, a] = [data[index], data[index + 1], data[index + 2], data[index + 3]];

						if (this.quantized) {
							[r, g, b] = this.getQuantized(r, g, b);
							let color = `rgba(${r},${g},${b},${a / 255})`;
							if (!this.mapped_quantized[img.id]) this.mapped_quantized[img.id] = {};
							this.mapped_quantized[img.id][color] ? this.mapped_quantized[img.id][color].push({ x, y }) : this.mapped_quantized[img.id][color] = [{ x, y }];
						}
						else {
							let color = `rgba(${r},${g},${b},${a / 255})`;
							this.mapped[img.id][color] ? this.mapped[img.id][color].push({ x, y }) : this.mapped[img.id][color] = [{ x, y }];
						}
					}
				}
				this.cacheData[img.id] = data;
				return data;
			}
			else {
				return this.cacheData[img.id];
			}
		}
	}

	drawMapped(img) {
		let iterate = this.quantized ? this.mapped_quantized[img.id] : this.mapped[img.id];
		for (let color in iterate) {
			let coordinates = iterate[color];
			this.ctx.fillStyle = color;
			for (let c = 0; c < coordinates.length; c++) {
				let item = coordinates[c];
				this.ctx.fillRect(item.x * this.zoom, item.y * this.zoom, this.zoom, this.zoom);
			}
		}
	}

	quantize() {
		if (this.classified) {
			this.quantized = true;
		}
		else {
			this.classifyColors();
			this.quantized = true;
		}
	}

	classifyColors() {
		let total = {}
		for (let image of this.images) {
			let colors = this.colorThief.getPalette(image, this.max_colors, 1);
			for (let color of colors) {
				let key = color.join(',');
				if (!total[key]) total[key] = 0;
				total[key]++;
			}
		}

		this.analyzeColors(total);
	}

	analyzeColors(colors) {
		let ordered = [];
		for (let color in colors) {
			let total = colors[color];
			ordered.push({ color, total });
		}

		ordered.sort((a, b) => {
			return b.total - a.total;
		});

		if (ordered.length < this.max_colors) this.max_colors = ordered.length;

		this.colors_ordered = ordered;
		this.classified = true;
	}

	getQuantized(r, g, b) {
		let key = `${r},${g},${b}`;
		if (!this.colorMap[key]) {
			let scores = {};
			for (let i = 0; i < this.max_colors; i++) {
				let q = this.colors_ordered[i].color.split(',');
				scores[this.colors_ordered[i].color] = Math.abs(r - +q[0]) + Math.abs(g - +q[1]) + Math.abs(b - +q[1]);
			}

			let quantized = { color: `${r},${g},${b}`, total: Infinity };
			for (let key in scores) {
				if (scores[key] < quantized.total) {
					quantized = { color: key, total: scores[key] };
				}
			}

			let split = quantized.color.split(',');
			this.colorMap[key] = split
			return split;
		}
		else {
			return this.colorMap[key];
		}
	}

	updateCanvasSize(img) {
		this.canvas.width = img.width * this.zoom;
		this.canvas.height = img.height * this.zoom;
		this.tmpcanvas.width = img.width;
		this.tmpcanvas.height = img.height;
	}

	checkImg(img) {
		return new Promise((resolve, reject) => {
			if (img) {
				if (img.complete) {
					resolve();
				}
				else {
					img.onload = resolve;
				}
			}
		});
	}

	animate(delta) {
		window.requestAnimationFrame(this.animate);

		if (delta - this.last_delta >= this.tpf) {
			this.frame++;
			if (this.frame > this.images.length - 1) this.frame = 0;
			this.draw(this.images[this.frame]);
			this.last_delta = delta;
		}
	}

	setPalette(palette) {
		let new_colors = [];
		for (let color of palette) {
			new_colors.push({ color, total: 1 });
		}

		this.colors_ordered = new_colors;
		this.max_colors = palette.length;
		this.colorMap = {};
		this.mapped_quantized = {};
		this.frame = 0;
	}

	zoomIn() {
		this.zoom *= 2;
		this.requestUpdate();
	}

	zoomOut() {
		this.zoom /= 2;
		this.requestUpdate();
	}
}

customElements.define('canvas-renderer', CanvasRenderer);

export default CanvasRenderer;
