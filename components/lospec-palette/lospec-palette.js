import { LitElement, html, css } from '/web_modules/lit-element.js';

class LospecPalette extends LitElement {
	constructor() {
		super();
		this.page = 0;
		this.active = false;
		this.url = 'https://pixelutils.lolastud.io';

		this.getPalette();
		this.toggle = this.toggle.bind(this);
		this.max_colors = 20;
		this.loading = false;
	}

	static get styles() {
		return css`
			:host * {
				font-family: 'Fredoka One', sans-serif;
			}

			:host .color-preview-box {
				width: 12px;
				height: 12px;
				cursor: pointer;
			}

			:host .color-preview {
				display: flex;
				margin-bottom: 8px;
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
				font-weight: bolder;
    			font-size: 24px;
    			transition: .2s ease all;
			}

			:host .container {
				display: none;
				background: #2e2549;
				border-radius: 6px;
				height: 100%;
				box-sizing: border-box;
				padding: 20px;

				position: fixed;
				left: calc(2vh + 30px);
				bottom: calc(2vh + 40px);
				height: 80vh;
				width: 25vw;
				z-index: 1100;
			}

			:host .active {
				display: flex;
				flex-direction: column;
			}

			:host .list {
				display: flex;
				flex-direction: column;
				height: 70vh;
				overflow-y: scroll;
				width: 100%;
				overflow-x: hidden;
			}

			:host .loader-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 70vh;
				width: 100%;
			}
			
			:host .item p {
				font-family: 'Montserrat', sans-serif;
			}

			:host p {
				margin: 0;
				font-size: 18px;
				font-weight: bold;
			}

			:host a.user {
				text-decoration: none;
				color: #fffbd1;
				font-size: 14px;
			}

			:host .description {
				text-decoration: none;
				color: #fffbd1;
				font-size: 14px;
				font-weight: 300;
    			font-size: 12px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
						line-clamp: 2; 
				-webkit-box-orient: vertical;
			}

			:host .description a {
				color: #fffbd1;
			}

			:host a.user:hover {
				text-decoration: underline;	
			}

			:host .item {
				margin-bottom: 20px;
				padding-left: 0;
				transition: .2s ease all;
			}
			
			:host .item:hover {
				cursor: pointer;
				padding-left: 18px;
				transition: .2s ease all;
				transition-delay: .05s;
			}

			:host .item.active {
				padding-left: 20px;
				transition: .2s ease all;
			}
		`;
	}

	render() {
		return html`
			<div class="container ${this.active ? 'active' : ''}">
				${this.loading ? html`<div class="loader-container">
					<svg-loader></svg-loader>
				</div>` : html`<div class="list">
					${this.getList()}
				</div>
				<div class="pagination">
					${this.getPagination()}
				</div>`}
			</div>
		`;
	}

	setPage(page) {
		this.page = page;
		this.loading = true;
		this.requestUpdate();
		this.getPalette();
	}

	getPalette() {
		fetch(`${this.url}/lospec/palettes?colorNumberFilterType=min&page=${this.page}&tag=&sortingType=default&colorNumber=0`).then(res => {
			res.json().then(data => {
				this.palettes = data;
				this.total_pages = Math.ceil(data.totalCount / data.palettes.length);
				this.loading = false;
				this.requestUpdate();
			}).catch(err => {
				console.log(err);
				this.loading = false;
				this.requestUpdate();
			});
		})
	}

	getList() {
		if (this.palettes) {
			console.log(this.palettes);
			let palettes = this.palettes.palettes;
			let ret = []
			for (let palette of palettes) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(palette.description, 'text/html');
				ret.push(html`
					<div class="item ${this.selected?._id == palette._id ? 'active' : ''}" @click=${()=> { this.setPalette(palette) }}>
						<div class="color-preview">
							${palette.colorsArray.map(color => html`<div class="color-preview-box" style="background: #${color};"></div>`)}
						</div>
						<p>${palette.title} (${palette.colorsArray.length} colors)</p>
						<a title="Visit ${palette.user?.name} profile on lospec" class="user"
							href="https://lospec.com/${palette.user?.slug}" target="_blank">by ${palette.user?.name}</a>
						<p class="description" title="${palette.description}">${this.renderDescription(doc.body)}</p>
					</div>
				`)
			}

			return ret;
		}
	}

	renderDescription(body) {
		let ret = [];

		for(let item of body.childNodes) {
			if(item.nodeName == 'A') item.target = '_blank';
			ret.push(html`${item}`);
		}

		console.log(ret);
		return html`${ret}`;
	}

	getPagination() {
		let actual = this.page + 1;
		let total = new Array(this.total_pages);
		let ret = [];

		if (actual > 1) { ret.push(html`<div class="page" @click=${()=> { this.setPage(this.page - 1) }}>${actual - 1}</div>`); }

		for (let i = actual; i <= actual + 5; i++) {
			ret.push(html`<div class="page ${i == actual ? 'active' : ''}" @click=${()=> { this.setPage(i - 1) }}>${i}</div>`);
		}

		return ret;
	}

	setPalette(palette) {
		this.selected = palette;
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

	toggle(state) {
		this.active = state !== undefined ? state : !this.active;
		this.requestUpdate();
	}

	updated() {
		this.shadowRoot.querySelector('.list').scrollTop = 0;
	}
}

customElements.define('lospec-palette', LospecPalette);

export default LospecPalette;
