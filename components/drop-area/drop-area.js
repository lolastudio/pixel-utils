import { LitElement, html, css } from '/web_modules/lit-element.js';

class DropArea extends LitElement {
	constructor() {
		super();
		this.images = [];
	}

	static get styles() {
		return css`
			:host .container {
				border-radius: 6px;
				border: 1px solid #c4c4c4;
				padding: 40px;
				box-sizing: border-box;
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				<input type="file" multiple accept="image/*">
			</div>
			<p>Drop your images here!</p>
		`;
	}

	onDrop(e) {

	}

	onFiles(e) {
		for (let i = 0; i < e.target.files.length; i++) {
			let src = URL.createObjectURL(e.target.files[i]);
			this.images.push(this.newImage(src));
		}

		window.on('drop', this.images);
		this.requestUpdate();
	}

	firstUpdated() {
		this.shadowRoot.querySelector('.container').addEventListener('drop', this.onDrop);
		this.shadowRoot.querySelector('.container').addEventListener('change', this.onFiles.bind(this));
	}

	newImage(path) {
		let img = new Image();
		img.src = path;
		return img;
	}
}

customElements.define('drop-area', DropArea);

export default DropArea;
