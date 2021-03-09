import { LitElement, html, css } from '/web_modules/lit-element.js';

class LospecPalette extends LitElement {
	constructor() {
		super();

		// https://lospec.com/palette-list/load?colorNumberFilterType=any&page=0&tag=&sortingType=default
	}

	static get styles() {
		return css``;
	}

	render() {
		return html`
			lospec-palette web component
		`;
	}
}

customElements.define('lospec-palette', LospecPalette);

export default LospecPalette; 
