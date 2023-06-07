import { LitElement, html, css } from '/web_modules/lit-element.js';
import ciede2000 from '../diff.js';
import * as workerTimers from '/node_modules/worker-timers/build/es2019/module.js';

class CanvasRenderer extends LitElement {
	constructor() {
		super();
		
		this.tmpcanvas = document.createElement('canvas');
		this.tmpctx = this.tmpcanvas.getContext('2d');
		
		this.zoom = 2;
		this.mapped = {}, this.mapped_quantized = {}, this.colorMap = {};
		this.images = [];
		this.frame = 0, this.last_delta = 0;
		this.fps = 12;
		this.tpf = 1e3 / this.fps;
		this.max_colors = 2;
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
		this.setDither = this.setDither.bind(this);
		this.animate = this.animate.bind(this);
		this.renderFrames = this.renderFrames.bind(this);
		this.selectDitheringMatrix = this.selectDitheringMatrix.bind(this);
		this.changeRatio = this.changeRatio.bind(this);
		
		this.quantizing_queue = {};
		
		this.background = false;
		this.transformed = {};
		
		window.listen('fps_change', this.setFPS.bind(this));
		window.listen('skip_frames_change', this.setSkip.bind(this));
		window.listen('background_change', value => {
			this.background = value;
		});
		
		window.listen('dither_change', this.setDither);
		
		this.dither = true;
		this.ratio = 4;
		
		this.bayer8 = [
			[0, 32, 8, 40, 2, 34, 10, 42],
			[48, 16, 56, 24, 50, 18, 58, 26],
			[12, 44, 4, 36, 14, 46, 6, 38],
			[60, 28, 52, 20, 62, 30, 54, 22],
			[3, 35, 11, 43, 1, 33, 9, 41],
			[51, 19, 59, 27, 49, 17, 57, 25],
			[15, 47, 7, 39, 13, 45, 5, 37],
			[63, 31, 55, 23, 61, 29, 53, 21]
		]
		
		this.bayer4 = [
			[0, 8, 2, 10],
			[12, 4, 14, 6],
			[3, 11, 1, 9],
			[15, 7, 13, 5]
		];
		
		this.bayer2 = [
			[0, 2],
			[3, 1]
		]
		
		this.tictac = [
			[15, 5, 11, 10],
			[6, 7, 2, 12],
			[13, 1, 8, 3],
			[9, 14, 4, 16],
		]
		
		this.dithering_indexes = {
			tictac: this.tictac,
			bayer2: this.bayer2,
			bayer4: this.bayer4,
			bayer8: this.bayer8
		}
		
		this.selectDitheringMatrix('bayer4');
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
			// background: #fafafa;
			padding: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;	
		}
		
		:host p {
			position: absolute;
			bottom: -38px;
			right: 0;
		}
		`;
	}
	
	get ditheringRatio() {
		return this.ratio;
	}
	
	selectDitheringMatrix(id) {
		this.dithering_index_id = id;
		this.selected_matrix = this.dithering_indexes[id];
		this.bayer_size = this.selected_matrix.length;
	}
	
	getDitheringId() {
		return this.dithering_index_id;
	}
	
	setImages(images) {
		this.images = images;
		for (let i = 0; i < this.images.length; i++) {
			if (!this.images[i].id) {
				this.images[i].id = Math.random().toString(36);
				this.mapped[this.images[i].id] = {};
			}
		}
		
		window.animation_active = true;
		if (this.images.length < 12) {
			this.setFPS(this.images.length);
			window.on('fps_change', this.fps);
		}
		if (this.images.length == 1) {
			this.setPlayerState(false);
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
	
	setDitheringRatio(ratio) {
		this.ratio = ratio;
	}
	
	render() {
		return html`
		<div class="container ${window.animation_active ? '' : '__hidden'}">
		<canvas></canvas>
		${this.frameDebug()}
		</div>
		`;
	}
	
	frameDebug() {
		if (this.quantized && !this.transformed[this.actual_image?.id]?.quantized) {
			return html`<p>Processing frame (${this.frame + 1})</p>`;
		}
		else {
			return html`<p>(${this.frame + 1})</p>`;
		}
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
		if (!this.transformed[img.id]) {
			this.transformed[img.id] = this.tmpctx.getImageData(0, 0, img.width, img.height);
		}
		
		if (this.quantized && !this.transformed[img.id].quantized && !this.quantizing_queue[img.id]) {
			this.quantizing_queue[img.id] = true;
			let data = this.tmpctx.getImageData(0, 0, img.width, img.height).data;
			
			for (let y = 0; y < img.height; ++y) {
				for (let x = 0; x < img.width; ++x) {
					let index = (y * img.width + x) * 4;
					let [r, g, b, a] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
					
					if (this.dither) {
						let map = this.selected_matrix[x % this.bayer_size][y % this.bayer_size];
						
						r += map * this.ratio;
						r -= r >> 8;
						g += map * this.ratio;
						g -= g >> 8;
						b += map * this.ratio;
						b -= b >> 8;
					}
					
					[r, g, b] = this.getQuantized(r, g, b);
					this.transformed[img.id].data[index] = r;
					this.transformed[img.id].data[index + 1] = g;
					this.transformed[img.id].data[index + 2] = b;
					this.transformed[img.id].data[index + 3] = a;
				}
			}
			
			setTimeout(() => {
				this.transformed[img.id].quantized = true;
			}, 0);
		}
		
		return this.transformed[img.id];
	}
	
	drawMapped(img) {
		this.ctx.putImageData(this.resize(this.transformed[img.id], img.width * this.zoom, img.height * this.zoom), 0, 0);
	}
	
	resize(original, width, height) {
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
				result.data[dstIndex + 3] = !this.background ? original.data[srcIndex + 3] : 255;
				dstIndex += 4;
			}
		}
		
		return result;
	};
	
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
		let mkey = [r, g, b].join(',');
		let mapped = this.colorMap[mkey];
		
		if (!mapped) {
			let scores = {};
			for (let i = 0; i < this.max_colors; i++) {
				let q = this.colors_ordered[i].array_color;
				scores[this.colors_ordered[i].color] = ciede2000({ r, g, b }, { r: +q[0], g: +q[1], b: +q[2] });
				// scores[this.colors_ordered[i].color] = deltaE([r, g, b], [+q[0], +q[1], +q[2]]);
			}
			
			let quantized = { color: mkey, total: Infinity };
			for (let key in scores) {
				if (scores[key] < quantized.total) {
					quantized = { color: key, total: scores[key] };
				}
			}
			
			let split = quantized.color.split(',');
			this.colorMap[mkey] = split;
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
		// if (!jump) window.requestAnimationFrame(this.animate);
		if (!jump) {
			this.wtimeout !== undefined && workerTimers.clearTimeout(this.wtimeout);
			this.wtimeout = workerTimers.setTimeout(this.animate, this.rendering ? 0 : this.tpf);
		}
		
		if (this.rendering) { jump = true; }
		
		this.actual_image = this.images[this.frame];
		
		// if (!this.stopped && delta - this.last_delta >= this.tpf || jump) {
		window.on('frame', this.frame);
		window.on('real_tpf', delta - this.last_delta);
		this.last_delta = delta;
		
		this.requestUpdate();
		this.draw(this.actual_image);
		
		if (this.frame == 0 && this.rendering && !this.capturing) {
			this.capturer.start();
			this.capturing = true;
		}
		
		if (this.rendering_frames) {
			this.zip.file(`${this.frame}.png`, this.canvas.toDataURL().split('base64,')[1], { base64: true });
		}
		
		if (this.rendering && this.capturing) {
			this.capturer.capture(this.canvas);
		}
		
		if (this.frame >= this.images.length - 1) {
			if (this.rendering) {
				this.rendering = false;
				this.capturing = false;
				this.stopped = true;
				
				this.mime.split('webm').length > 1 && this.capturer.capture(this.canvas);
				this.capturer.stop();
				
				this.capturer.save((blob) => {
					download(blob, this.capturer_options.name + (this.mime.split('webm').length > 1 ? '.webm' : ''), this.mime);
					this.stopped = false;
					window.requestAnimationFrame(this.animate);
					window.hideLoader();
				});
				
				// this.capturer.save();
			}
			
			if (this.rendering_frames) {
				this.rendering_frames = false;
				this.zip.generateAsync({ type: "blob" }).then((content) => {
					saveAs(content, `frames_skip${(this.skip_frames - 1)}_${('' + this.fps).split('.').join('-')}fps_${window.getDate()}.zip`);
					window.hideLoader();
				});
			}
			
			this.frame = 0;
		}
		else {
			if (this.quantized && this.actual_image && !this.transformed[this.actual_image.id]?.quantized) {
				return;
			}
			
			if (this.active) this.frame += this.skip_frames;
		}
		// }
	}
	
	setPalette(palette) {
		this.palette = palette;
		if (!this.quantized) {
			this.quantize(() => {
				this.setPalette(palette);
			});
		}
		else {
			let last_state = this.active;
			this.setPlayerState(false);
			window.showLoader(() => {
				let new_colors = [];
				for (let color of palette) {
					new_colors.push({ color, total: 1, array_color: color.split(',') });
				}
				
				this.colors_ordered = new_colors;
				this.max_colors = palette.length;
				this.colorMap = {};
				this.mapped_quantized = {};
				this.resetQuantization();
				this.setPlayerState(last_state);
				this.animate(this.last_delta, true);
				window.hideLoader();
			});
		}
		
		window.on('palette_change', this.palette);
	}
	
	classifyAll(index, cb) {
		if (this.images[index]) {
			this.frame++;
			this.animate(this.last_delta, true);
			
			setTimeout(() => {
				this.classify(this.images[index]);
				
				index++;
				this.classifyAll(index, cb);
			}, 0);
		}
		else {
			if (cb) cb();
		}
	}
	
	resetQuantization() {
		this.colorMap = {};
		this.quantizing_queue = {};
		for (let id in this.transformed) {
			this.transformed[id].quantized = false;
		}
	}
	
	zoomIn() {
		this.zoom *= 2;
		this.zoom = parseInt(this.zoom);
		this.animate(this.last_delta, true);
		this.requestUpdate();
	}
	
	zoomOut() {
		this.zoom /= 2;
		this.zoom = parseInt(this.zoom);
		this.zoom = this.zoom >= 1 ? this.zoom : 1;
		this.animate(this.last_delta, true);
		this.requestUpdate();
	}
	
	renderGIF() {
		this.mime = 'image/gif';
		window.showLoader();
		
		this.capturer_options = {
			framerate: parseInt(this.fps),
			frameDuration: this.tpf,
			format: 'gif',
			workersPath: 'web_modules/',
			quality: 10,
			name: `output_skip${(this.skip_frames - 1)}_${('' + this.fps).split('.').join('-')}fps_${window.getDate()}`
		};
		
		this.capturer = new CCapture(this.capturer_options);
		this.frame = 0;
		this.rendering = true;
	}
	
	renderWEBM() {
		this.mime = 'video/webm';
		window.showLoader();
		
		this.capturer_options = {
			framerate: parseInt(this.fps),
			format: 'webm',
			name: `output_skip${(this.skip_frames - 1)}_${('' + this.fps).split('.').join('-')}fps_${window.getDate()}`
		};
		
		this.capturer = new CCapture(this.capturer_options);
		this.frame = 0;
		this.rendering = true;
	}
	
	saveFrame() {
		// window.showLoader(() => {
		let image = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
		let link = document.createElement('a');
		link.setAttribute('download', `${this.frame}_${window.getDate()}.png`);
		link.setAttribute('href', image);
		link.click();
		
		// window.hideLoader();
		// });
	}
	
	setFrame(frame) {
		this.frame = frame;
		this.animate(this.last_delta, true);
	}
	
	setPlayerState(state) {
		this.active = state;
	}
	
	setDither(value) {
		this.dither = value;
		this.resetQuantization();
	}
	
	setPaletteLimit(value) {
		this.max_colors = value;
		
		if (this.quantized && !this.palette) {
			this.classified = false;
			this.quantize(() => {
				this.resetQuantization();
			});
		}
	}
	
	renderFrames() {
		window.showLoader();
		this.zip = new JSZip();
		this.rendering_frames = true;
		this.frame = 0;
	}
	
	changeRatio(value) {
		this.ratio += value;
	}
}

customElements.define('canvas-renderer', CanvasRenderer);

function deltaE(rgbA, rgbB) {
	let labA = rgb2lab(rgbA);
	let labB = rgb2lab(rgbB);
	let deltaL = labA[0] - labB[0];
	let deltaA = labA[1] - labB[1];
	let deltaB = labA[2] - labB[2];
	let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
	let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
	let deltaC = c1 - c2;
	let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	let sc = 1.0 + 0.045 * c1;
	let sh = 1.0 + 0.015 * c1;
	let deltaLKlsl = deltaL / (1.0);
	let deltaCkcsc = deltaC / (sc);
	let deltaHkhsh = deltaH / (sh);
	let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb) {
	let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
	x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
	y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
	z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
	return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

export default CanvasRenderer;
