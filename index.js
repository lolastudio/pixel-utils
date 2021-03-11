import { html, render } from '/web_modules/lit-html.js';
import '/components/entry.js';

function quantize() {
    document.querySelector('canvas-renderer').quantize();
}

function zoomOut() {
    document.querySelector('canvas-renderer').zoomOut();
}

function zoomIn() {
    document.querySelector('canvas-renderer').zoomIn();
}

render(html`
    <drop-area></drop-area>
    <canvas-renderer></canvas-renderer>
    <button @click=${zoomOut}>-</button>
    <button @click=${zoomIn}>+</button>
    <lospec-palette></lospec-palette>
    <button @click=${quantize}>Quantize colors!</button>
`, document.body);