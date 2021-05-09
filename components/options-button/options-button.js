import { LitElement, html, css } from '/web_modules/lit-element.js';

class OptionsButton extends LitElement {
	constructor() {
		super();

		this.c = [];
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
				width: 168px;
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
				top: -46px;
				background: #2e2549;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				margin: 0px 10px;
				width: 168px;
				height: 0;
				opacity: 0;
			}

			.menu.__active {
				height: 60px;
				opacity: 1;
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
			${this.c[0]}
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
	
	toggle() {
		this.active = !this.active;
		this.requestUpdate();
	}

	firstUpdated() {
		console.log(this.children)
		for (let e = 0; e < this.children.length; e++) {
			this.c.push(this.children[e]);
		}

		this.requestUpdate();
	}

	getMenu() {
		let ret = [];
		for (let e = 1; e < this.c.length; e++) {
			ret.push(this.c[e]);
		}
		return ret;
	}
}

customElements.define('options-button', OptionsButton);

export default OptionsButton;
