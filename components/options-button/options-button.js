import { LitElement, html, css } from '/web_modules/lit-element.js';

class OptionsButton extends LitElement {
	constructor() {
		super();

		this.c = [];
		this.disable = this.disable.bind(this);
	}

	static get styles() {
		return css`
			:host {
				position: relative;
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
				transition: all ease .2s;
				outline: none;
				width: 196px;
				padding-right: 28px;
				transform: scale(1);
                transition: all ease .2s;
			}

			* {
				color: #fffbd1;
				font-family: 'Fredoka One', sans-serif;
			}

			.menu {
				position: absolute;
				// top: -46px;
				background: #2e2549;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				margin: 0px 10px;
				width: 196px;
				height: 0;
				opacity: 0;
				bottom: 46px;
				z-index: -1;
			}

			.menu.__active {
				height: auto;
				opacity: 1;
				z-index: 1;
			}

			.menu button {
				margin: 0;
			}

			.chevron {
				width: 24px;
				border-left: 2px solid #1b1829;
				position: absolute;
				right: 10px;
				height: 46px;
				bottom: 0;
				z-index: 100;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				box-sizing: border-box;
			}

			button:hover {
				transform: scale(1.05);
                transition: all ease .2s;
			}

			.chevron:hover {
				transform: scale(1.1);
			}

			.chevron svg {
				transform: scale(1.1);
			}

			.menu button:hover {

			}

			.menu button {
				border-bottom: 2px solid #1b1829;
				border-radius: 0;
				z-index: 200;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				padding: 10px;
			}
		`;
	}

	render() {
		return html`
			${this.active_item}
			<div class="chevron" @click=${this.toggle}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical"
					viewBox="0 0 16 16">
					<path
						d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
					</path>
				</svg>
			</div>
			<div class="menu ${this.active ? '__active' : ''}">
				${this.getMenu()}
			</div>
		`;
	}

	disable() {
		this.active = false;
		this.requestUpdate();
	}

	toggle() {
		this.active = !this.active;
		this.requestUpdate();
	}

	firstUpdated() {
		for (let e = 0; e < this.children.length; e++) {
			this.children[e].addEventListener('click', () => { 
				this.active = false;
				this.changeActiveItem(e);
			});
			this.children[e].id = Math.random().toString(36);
			this.c.push(this.children[e]);
		}

		this.active_item = this.c[0];
		this.requestUpdate();
	}

	changeActiveItem(pos) {
		this.active_item = this.c[pos];
		this.requestUpdate();
	}

	getMenu() {
		let ret = [];
		for (let e = 0; e < this.c.length; e++) {
			if (this.c[e].id !== this.active_item.id) {
				ret.push(this.c[e]);
			}
		}
		return ret;
	}
}

customElements.define('options-button', OptionsButton);

export default OptionsButton;
