import { LitElement, html, css } from '/web_modules/lit-element.js';
import ciede2000 from '../diff.js';

class CanvasRenderer extends LitElement {
	constructor() {
		super();

		this.tmpcanvas = document.createElement('canvas');
		this.tmpctx = this.tmpcanvas.getContext('2d');

		this.zoom = 2;
		this.mapped = {}, this.mapped_quantized = {}, this.cacheData = {}, this.colorMap = {};
		this.images = [];
		this.frame = 0, this.last_delta = 0;
		this.fps = 12;
		this.tpf = 1e3 / this.fps;
		this.max_colors = 24;
		this.colorThief = new ColorThief();
		this.skip_frames = 2;
		this.active = true;

		this.draw = this.draw.bind(this);
		this.setImages = this.setImages.bind(this);
		this.animate = this.animate.bind(this);
		this.setPalette = this.setPalette.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
		this.zoomIn = this.zoomIn.bind(this);
		this.renderGIF = this.renderGIF.bind(this);
		this.saveFrame = this.saveFrame.bind(this);
		this.setFrame = this.setFrame.bind(this);
		this.setPlayerState = this.setPlayerState.bind(this);

		this.background = false;

		window.addListener('fps_change', this.setFPS.bind(this));
		window.addListener('skip_frames_change', this.setSkip.bind(this));
		window.addListener('background_change', value => { 
			this.background = value;
			this.mapped_quantized = {};
		});
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

			:host .__hidden { 
				display: none !important;
			}

			:host .container {
				border-radius: 6px;
				background: #fafafa;
				padding: 20px;
				display: flex;
				align-items: center;
				justify-content: center;	
			}
		`;
	}

	setImages(images) {
		this.images = images;
		window.animation_active = true;
		if (this.images.length < 12) {
			this.setFPS(this.images.length);
			window.on('fps_change', this.fps);
		}
		window.on('updateApp');

		this.animate(this.last_delta, true);
		this.requestUpdate();
	}

	setFPS(fps) {
		this.fps = fps;
		this.tpf = 1e3 / this.fps;
	}

	setSkip(skip) {
		this.skip_frames = skip;
	}

	render() {
		return html`
			<div class="container ${window.animation_active ? '' : '__hidden'}">
				<canvas></canvas>
			</div>
		`;
	}

	firstUpdated() {
		this.canvas = this.shadowRoot.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.animate();
	}

	draw(img) {
		this.checkImg(img, () => {
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
							let color = `rgba(${r},${g},${b},${this.background ? 1 : a})`;
							if (!this.mapped_quantized[img.id]) this.mapped_quantized[img.id] = {};
							this.mapped_quantized[img.id][color] ? this.mapped_quantized[img.id][color].push({ x, y }) : this.mapped_quantized[img.id][color] = [{ x, y }];
						}
						else {
							let color = `rgba(${r},${g},${b},${this.background ? 1 : a})`;
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

	quantize(cb) {
		window.showLoader(() => {
			if (this.classified) {
				this.quantized = true;
			}
			else {
				this.classifyColors();
				this.quantized = true;
			}

			if (cb) {
				try {
					cb();
				} catch (err) { }
			}

			window.hideLoader();

			this.animate(this.last_delta, true);
		});
	}

	classifyColors() {
		let total = {}
		for (let image of this.images) {
			let colors = this.colorThief.getPalette(image, this.max_colors, 1);
			for (let color of colors || []) {
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
			ordered.push({ color, total, array_color: color.split(',') });
		}

		ordered.sort((a, b) => {
			return b.total - a.total;
		});

		if (ordered.length < this.max_colors) this.max_colors = ordered.length;

		this.colors_ordered = ordered;
		this.classified = true;
	}

	getQuantized(r, g, b) {
		let key = [r, g, b].join(',');
		let mapped = this.colorMap[key]

		if (!mapped) {
			let scores = {};
			for (let i = 0; i < this.max_colors; i++) {
				let q = this.colors_ordered[i].array_color;
				scores[this.colors_ordered[i].color] = ciede2000({ r, g, b }, { r: +q[0], g: +q[1], b: +q[2] });
			}

			let quantized = { color: [r, g, b].join(','), total: Infinity };
			for (let key in scores) {
				if (scores[key] < quantized.total) {
					quantized = { color: key, total: scores[key] };
				}
			}

			let split = quantized.color.split(',');
			this.colorMap[key] = split;
			return split;
		}
		else {
			return mapped;
		}
	}

	updateCanvasSize(img) {
		this.canvas.width = img.width * this.zoom;
		this.canvas.height = img.height * this.zoom;
		this.tmpcanvas.width = img.width;
		this.tmpcanvas.height = img.height;
	}

	checkImg(img, resolve) {
		// return new Promise((resolve, reject) => {
		if (img) {
			if (img.complete) {
				resolve();
			}
			else {
				img.onload = resolve;
			}
		}
		// });
	}

	animate(delta, jump) {
		!jump && window.requestAnimationFrame(this.animate);

		if (this.rendering) { jump = true; }

		if (!this.stopped && delta - this.last_delta >= this.tpf || jump) {
			window.on('real_tpf', delta - this.last_delta);
			this.last_delta = delta;

			window.on('frame', this.frame);

			this.draw(this.images[this.frame]);

			if (this.frame === 0 && this.rendering) {
				this.capturer.start();
			}

			if(!jump && this.active) this.frame += this.skip_frames;

			if (this.frame > this.images.length - 1) {
				this.frame = 0;

				if (this.rendering) {
					this.rendering = false;
					this.stopped = true;

					this.capturer.stop();
					this.capturer.save();

					window.hideLoader();
				}
			}
			else {
				if (this.rendering) {
					this.capturer.capture(this.canvas);
				}
			}
		}
	}

	setPalette(palette) {
		if (!this.quantized) {
			this.quantize(() => {
				this.setPalette(palette);
			});
		}
		else {
			window.showLoader(() => {
				let new_colors = [];
				for (let color of palette) {
					new_colors.push({ color, total: 1, array_color: color.split(',') });
				}

				this.colors_ordered = new_colors;
				this.max_colors = palette.length;
				this.colorMap = {};
				this.mapped_quantized = {};
				// this.frame = 0;

				window.hideLoader();
				this.animate(this.last_delta, true);
			});
		}
	}

	zoomIn() {
		this.zoom *= 2;
		this.animate(this.last_delta, true);
		this.requestUpdate();
	}

	zoomOut() {
		this.zoom /= 2;
		this.animate(this.last_delta, true);
		this.requestUpdate();
	}

	renderGIF() {
		window.showLoader();
		this.capturer = new CCapture({
			framerate: this.fps,
			format: 'gif',
			workersPath: 'web_modules/',
			quality: 10,
			name: `pixel_utils_${window.getDate()}`
		});
		this.frame = 0;
		this.rendering = true;
	}

	saveFrame() {
		window.showLoader(() => {
			let image = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
			let link = document.createElement('a');
			link.setAttribute('download', `pixel_utils_${window.getDate()}.png`);
			link.setAttribute('href', image);
			link.click();

			window.hideLoader();
		});
	}

	setFrame(frame) {
		this.frame = frame;
		this.animate(this.last_delta, true);
	}

	setPlayerState(state) {
		this.active = state;
	}
}

customElements.define('canvas-renderer', CanvasRenderer);

export default CanvasRenderer;
