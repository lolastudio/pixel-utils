import { LitElement, html, css } from '/web_modules/lit-element.js';

class DropArea extends LitElement {
	constructor() {
		super();
		this.images = [];
	}

	static get styles() {
		return css`
			:host .container {
				opacity: .5;
				border-radius: 6px;
				padding: 60px 80px;
				box-sizing: border-box;
				text-align: center;
				border: 3px dashed #f4a374;
				border-radius: 6px;
				transition: .2s ease-in-out all;
			}

			:host input {
				display: none;
			}

			:host p {
				margin: 0;
				font-weight: bold;
				font-size: 24px;
			}

			:host .hint {
				font-weight: 300;
				font-size: 18px;
				margin-top: 10px;
			}

			:host form.is-dragover {
				opacity: 1;
				transition: .2s ease-in-out all;
			}
		`;
	}

	render() {
		return html`
			<form class="container">
				<input type="file" multiple accept="image/*">
				<p>Drop your image(s) here!</p>
				<p class="hint">(or click here for upload)</p>
			</form>
		`;
	}

	onDrop(e) {
		e.preventDefault();
		e.stopPropagation();
		this.onFiles(e);
	}

	onFiles(e) {
		let target = e.dataTransfer || e.target;
		for (let i = 0; i < target.files.length; i++) {
			let src = URL.createObjectURL(target.files[i]);
			this.images.push(this.newImage(src));
		}

		window.on('drop', this.images);
		this.requestUpdate();
	}

	firstUpdated() {
		let form = this.shadowRoot.querySelector('form');
		this.shadowRoot.querySelector('.container').addEventListener('drop', this.onDrop.bind(this));
		this.shadowRoot.querySelector('.container').addEventListener('change', this.onFiles.bind(this));

		['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
			form.addEventListener(event, (e) => {
				e.preventDefault();
				e.stopPropagation();
			});
		});

		['dragover', 'dragenter'].forEach((event) => {
			form.addEventListener(event, () => {
				form.classList.add('is-dragover');
			});
		});

		['dragleave', 'dragend', 'drop'].forEach((event) => {
			form.addEventListener(event, () => {
				form.classList.remove('is-dragover');
			});
		});
	}

	newImage(path) {
		let img = new Image();
		img.src = path;
		return img;
	}
}

customElements.define('drop-area', DropArea);

export default DropArea;
