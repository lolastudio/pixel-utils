import { html, render } from '/web_modules/lit-html.js';
import '/components/entry.js';

function quantize() {
    document.querySelector('canvas-renderer').quantize();
}

render(html`
    <drop-area></drop-area>
    <canvas-renderer></canvas-renderer>
    <lospec-palette></lospec-palette>
    <button @click=${quantize}>Quantize colors!</button>
`, document.body);