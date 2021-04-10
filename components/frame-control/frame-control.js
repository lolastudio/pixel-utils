import { LitElement, html, css } from '/web_modules/lit-element.js';

class FrameControl extends LitElement {
	constructor() {
		super();

		this.setImages = this.setImages.bind(this);
		this.setFrame = this.setFrame.bind(this);

		this.fps = 12;
		this.tpf = 1e3 / this.fps;
		this.skip_frames = 2;

		this.images = [];

		window.addListener('real_tpf', tpf => {
			this.rfps = Math.ceil(1e3 / tpf);
		})

		window.addListener('fps_change', this.setFPS.bind(this));
	}

	static get properties() {
		return {
			active: Boolean
		}
	}

	static get styles() {
		return css`
			:host {
				top: 2vh;
				position: fixed;
				left: 10vw;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80vw;
				padding-top: 40px;
			}

			.list {
				height: 98px;
				overflow-x: scroll;
				display: flex;
				box-sizing: border-box;
				overflow-y: hidden
				-ms-overflow-style: none;  /* IE and Edge */
  				scrollbar-width: none;  /* Firefox */
			}

			.list::-webkit-scrollbar {
				display: none;
			}

			img, .extra {
				height: 10vh;
			}

			img {
				opacity: .3;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 5px;
			}

			.active {
				// background: #fafafa;
				border-radius: 5px;
			}

			.active img {
				opacity: 1;
			}

			.fps, .skip-frame {
				position: fixed;
				display: flex;
				flex-direction: column;
				top: 2vh;
				padding: 50px 30px;
			}

			.fps {
				right: 2vh;
			}

			.skip-frame {
				left: 2vh;
			}

			button {
				background: #2e2549;
				border-radius: 6px;
				border: none;
				text-transform: uppercase;
				font-weight: bold;
				box-sizing: border-box;
				padding: 10px 18px;
				cursor: pointer;
				margin: 0 10px;
				letter-spacing: 2px;
				height: 46px;
				color: #fffbd1
			}

			.round {
                border-radius: 50%;
                padding: 20px;
                width: 24px;
                height: 24px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
				margin-top: 4px;
            }

            .round p {
                margin: 0;
            }

			p {
				margin: 0;
			}

			.fps p, .skip-frame p {
				width: 100%;
				text-align: center;
				font-size: 20px;
				text-transform: uppercase;
				font-weight: bold;
			}

			.buttons {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				width: 102px;
				margin-top: 10px;
			}

			.buttons button {
				margin: 0;
			}

			.__hidden {
				display: none;
			}

			:host .img-container {
				min-width: 98px;
				min-height: 98px;
				padding: 10px;
				box-sizing: border-box;
				position: relative;
			}

			.img-container:hover {
				cursor: pointer;
			}

			.img-container:hover img {
				opacity: 1;
			}

			.img-container p {
				position: absolute;
				width: 100%;
				text-align: center;
				bottom: 0;
				margin: 0;
				margin-left: -10px;
			}
		`;
	}

	render() {
		return html`
			<div class="skip-frame ${this.images.length > 1 ? '' : '__hidden'}">
				<p>skip ${this.skip_frames - 1}</p>
				<div class="buttons">
					<button class="round __small" @click=${this.subSkip}>-</button>
					<button class="round __small" @click=${this.addSkip}>+</button>
				</div>
			</div>
			<div class="list">
				${this.getList()}
			</div>
			<div class="fps ${this.images.length > 1 ? '' : '__hidden'}">
				<p>${this.fps} fps</p>
				<!-- <p>real fps: ${this.rfps}</p> -->
				<div class="buttons">
					<button class="round" @click=${this.subFPS}>-</button>
					<button class="round" @click=${this.addFPS}>+</button>
				</div>
			</div>

		`;
	}

	getList() {
		let ret = [];

		for (let i = 0; i < this.images.length; i++) {
			ret.push(html`<div @click=${() => { this.setFrame(i, true)} } class="img-container ${this.actual_frame == i ? 'active' : ''}">
				<img src="${this.images[i].src}" />
				<p>${i + 1}</p>
			</div>`)
		}

		let width = this.shadowRoot.querySelector('.img-container')?.clientWidth;
		if (width) {
			let extra = Math.floor(((window.innerWidth * .8) / width) / 2);
			let item = html`<div class="extra" style="min-width: ${width}px;"></div>`;

			for (let i = 0; i < extra; i++) {
				ret.unshift(item);
				ret.push(item);
			}
		}

		return ret;
	}

	updated() {
		this.setOffset();
	}

	setOffset() {
		let width = +this.shadowRoot.querySelector('.img-container')?.clientWidth || 0;
		this.shadowRoot.querySelector('.list').scroll({
			left: ((this.actual_frame * width) - (width / 4)) || 0,
			top: 0,
			// behavior: 'smooth'
		});
	}

	addFPS() {
		this.fps += 1;
		this.tpf = 1e3 / this.fps;

		window.on('fps_change', this.fps);
		this.requestUpdate();
	}

	subFPS() {
		this.fps -= 1;
		this.fps = this.fps > 0 ? this.fps : 0;
		this.tpf = 1e3 / this.fps;

		window.on('fps_change', this.fps);
		this.requestUpdate();
	}

	addSkip() {
		this.skip_frames += 1;
		window.on('skip_frames_change', this.skip_frames);
		this.requestUpdate();
	}

	subSkip() {
		this.skip_frames -= 1;
		this.skip_frames = this.skip_frames > 1 ? this.skip_frames : 1;
		window.on('skip_frames_change', this.skip_frames);
		this.requestUpdate();
	}

	setFPS(fps) {
		this.fps = fps;
		this.tpf = 1e3 / this.fps;
	}

	setFrame(id, emit) {
		this.actual_frame = id;

		if(emit) {
			window.on('frame_set', id);
		}

		this.requestUpdate();
	}

	setImages(images) {
		this.images = images;
		this.requestUpdate();
	}
}

customElements.define('frame-control', FrameControl);

export default FrameControl;
