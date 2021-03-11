import { LitElement, html, css } from '/web_modules/lit-element.js';

class LospecPalette extends LitElement {
	constructor() {
		super();
		this.page = 0;

		this.getPalette();
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

			:host .pagination {
				display: flex;
			}

			:host .pagination .page {
				width: 42px;
				height: 52px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}

			:host .pagination .page.active {
				font-weight: bold;
			}
		`;
	}

	render() {
		return html`
			${this.getList()}
			<div class="pagination">
				${this.getPagination()}
			</div>
		`;
	}

	setPage(page) {
		this.page = page;
		this.getPalette();
	}

	getPalette() {
		fetch(`http://localhost/lospec/palettes?colorNumberFilterType=any&page=${this.page}&tag=&sortingType=default`).then(res => {
			res.json().then(data => {
				this.palettes = data;
				this.total_pages = Math.ceil(data.totalCount / data.palettes.length);
				this.requestUpdate();
			}).catch(err => {

			});
		})
	}

	getList() {
		if (this.palettes) {
			let palettes = this.palettes.palettes;
			let ret = []
			for (let palette of palettes) {
				ret.push(html`
					<p @click=${()=> { this.setPalette(palette) }}>${palette.title} (${palette.colorsArray.length} colors)</p>
					<div class="color-preview">
						${palette.colorsArray.map(color => html`<div class="color-preview-box" style="background: #${color}"></div>`)}
					</div>
				`)
			}

			return ret;
		}
	}

	getPagination() {
		let actual = this.page + 1;
		let total = this.total_pages + 1;
		let ret = [];

		for (let i = actual - 2; i <= actual + 2; i++) {
			ret.push(html`<div class="page ${i == actual ? 'active' : ''}" @click=${()=> { this.setPage(i - 1) }}>${i}</div>`);
		}

		actual != total && ret.push(html`<div class="page" @click=${()=> { this.setPage(total - 1) }}>${total}</div>`);

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
