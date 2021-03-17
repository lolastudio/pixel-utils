import { LitElement, html, css } from '/web_modules/lit-element.js';

class FrameControl extends LitElement {
	constructor() {
		super();

		this.setImages = this.setImages.bind(this);
		this.setFrame = this.setFrame.bind(this);

		this.fps = 12;
		this.tpf = 1e3 / this.fps;

		this.images = [];

		window.addListener('real_tpf', tpf => {
			this.rfps = Math.ceil(1e3 / tpf);
		})

		window.addListener('fps_change', this.setFPS.bind(this));
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
				height: 10vh;
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
				opacity: .5;
			}

			.active {
				background: #fafafa;
				border-radius: 5px;
				opacity: 1;
			}

			.fps {
				position: fixed;
				display: flex;
				flex-direction: column;
				right: 2vh;
				top: 2vh;
				padding: 40px;
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

			.fps p {
				text-align: right;
				margin-right: 12px;
				font-size: 20px;
				text-transform: uppercase;
				font-weight: bold;
			}

			.buttons {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
			}

			.__hidden {
				display: none;
			}
		`;
	}

	render() {
		return html`
			<div class="list">
				${this.getList()}
			</div>
			<div class="fps ${this.images.length ? '' : '__hidden'}">
				<p>${this.fps} fps</p>
				<!-- <p>real fps: ${this.rfps}</p> -->
				<div class="buttons">
					<button class="round" @click=${this.addFPS}>+</button>
					<button class="round" @click=${this.subFPS}>-</button>
				</div>
			</div>
		`;
	}

	getList() {
		let ret = [];

		for (let i = 0; i < this.images.length; i++) {
			ret.push(html`<img src="${this.images[i].src}" class="${this.actual_frame == i ? 'active' : ''}" />`)
		}

		let width = this.shadowRoot.querySelector('img')?.width;
		if (width) {
			let extra = Math.floor(((window.innerWidth * .8) / width) / 2); // max-width of .list 80vw
			let item = html`
				<div style="min-width: ${width}px;" class="extra"></div>
			`;
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
		this.shadowRoot.querySelector('.list').scroll({
			left: (this.actual_frame * this.shadowRoot.querySelector('img')?.offsetWidth) - 12 || 0,
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
		this.tpf = 1e3 / this.fps;

		window.on('fps_change', this.fps);
		this.requestUpdate();
	}

	setFPS(fps) {
		this.fps = fps;
		this.tpf = 1e3 / this.fps;
	}

	setFrame(id) {
		this.actual_frame = id;
		this.requestUpdate();
	}

	setImages(images) {
		this.images = images;
		this.requestUpdate();
	}
}

customElements.define('frame-control', FrameControl);

export default FrameControl;
