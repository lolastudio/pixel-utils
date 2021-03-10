import { LitElement, html, css } from '/web_modules/lit-element.js';
import mock from '../../lospecmock.js';

class LospecPalette extends LitElement {
	constructor() {
		super();
		this.page = 0;
		this.palettes = mock;

		// this.getPalette();
	}

	static get styles() {
		return css`
			:host .color-preview-box {
				width: 12px;
				height: 12px;
			}

			:host .color-preview {
				display: flex;
			}

			:host p {
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
			${this.getList()}
		`;
	}

	setPage(page) {
		this.page = page;
		this.getPalette();
	}

	getPalette() {
		fetch(`https://lospec.com/palette-list/load?colorNumberFilterType=any&page=${this.page}&tag=&sortingType=default`, { mode: 'no-cors' }).then(res => {
			res.json().then(data => {
				this.palettes = data;
				this.requestUpdate();
			}).catch(err => {

			});
		})
	}

	getList() {
		let palettes = this.palettes.palettes;
		let ret = []
		for (let palette of palettes) {
			ret.push(html`
				<p @click=${() => { this.setPalette(palette) }}>${palette.title} (${palette.colorsArray.length} colors)</p>
				<div class="color-preview">
					${palette.colorsArray.map(color => html`<div class="color-preview-box" style="background: #${color}"></div>`)}
					<br>
					${palette.rgbaArray ? palette.rgbaArray.map(color => html`<div class="color-preview-box"
						style="background: rgb(${color})"></div>`) : ''}
				</div>
			`)
		}

		return ret;
	}

	setPalette(palette) {
		palette.rgbaArray = [];
		for (let color of palette.colorsArray) {
			color = this.hexToRgbA(color);
			palette.rgbaArray.push(color.join(','));
		}
		document.querySelector('canvas-renderer').setPalette(palette.rgbaArray);
		this.requestUpdate();
	}

	hexToRgbA(hex) {
		var aRgbHex = hex.match(/.{1,2}/g);
		var aRgb = [
			parseInt(aRgbHex[0], 16),
			parseInt(aRgbHex[1], 16),
			parseInt(aRgbHex[2], 16)
		];
		return aRgb;
	}

}

customElements.define('lospec-palette', LospecPalette);

export default LospecPalette;
