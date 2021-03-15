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

function openPalettes() {
    setTimeout(() => {
        document.querySelector('lospec-palette').toggle();
    }, 0)
}

function drawApp() {
    render(html`
        <style>
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
            }

            .fixed-buttons {
                position: fixed;
                display: flex;
                bottom: 2vh;
                padding: 40px;
                box-sizing: border-box;
                align-items: center;
                z-index: 1000;
            }

            .fixed-buttons-right {
                position: fixed;
                display: flex;
                bottom: 2vh;
                right: 2vh;
                padding: 40px;
            }

            .fixed-buttons-left {
                position: fixed;
                display: flex;
                bottom: 2vh;
                left: 2vh;
                padding: 40px;
            }

            .round {
                border-radius: 50%;
                padding: 20px;
                width: 54px;
                height: 54px;
                font-size: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .round p {
                margin: 0;
                width: 24px;
            }

            .no-outline {
                border: none;
                outline: none;
            }
        </style>
        <canvas-renderer></canvas-renderer>
        <frame-control></frame-control>
        ${window.animation_active ? html`
        <lospec-palette></lospec-palette>

        <div class="fixed-buttons-left">
            <button class="no-outline" @click=${openPalettes}>Palettes</button>
        </div>

        <div class="fixed-buttons">
            <button class="round" @click=${zoomOut}><p>-</p></button>
            <button class="round" @click=${zoomIn}><p>+</p></button>
            <button @click=${quantize}>Quantize colors!</button>
        </div>

        <div class="fixed-buttons-right">
            <button>Export GIF</button>
        </div>

        ` : html`<drop-area></drop-area>`}
    `, document.body);
}

drawApp();

window.addEventListener('click', evt => {
    if(evt.target.nodeName != 'LOSPEC-PALETTE') {
        document.querySelector('lospec-palette').toggle(false);
    }
})
window.addListener('updateApp', drawApp);