import { LitElement, html, css } from '/web_modules/lit-element.js';

class PaletteRenderer extends LitElement {
	constructor() {
		super();

		this.palette = [];

		window.listen('palette_change', (palette) => { 
			this.palette = palette;
			this.requestUpdate();
		});
	}

	static get styles() {
		return css`
			:host {
				position: fixed;
				left: 2vw;
				top: 2vh;
				padding: 50px 30px;
			}

			:host .container {
				width: 51px;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				
			}

			:host .item {
				width: 15px;
				height: 15px;
				border-radius: 3px;
				margin-right: 2px;
				margin-bottom: 2px;
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				${this.getPalette()}
			</div>
		`;
	}

	getPalette() {
		let ret = []
		for(let color of this.palette) {
			ret.push(html`<div class="item" title="rgb(${color})" style="background: rgb(${color});"></div>`);
		}
		return ret;
	}
}

customElements.define('palette-renderer', PaletteRenderer);

export default PaletteRenderer;
