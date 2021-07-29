import { html, render } from '/web_modules/lit-html.js';
import '/components/entry.js';
let image_count = 0;
let player_state = true;
let options = {
    background: false,
    dither: false
}
let palette_limit = 24;
let canvasRendererEl;

function getCanvas() {
    if (!canvasRendererEl) canvasRendererEl = document.querySelector('canvas-renderer');
    return canvasRendererEl;
}

function quantize() {
    getCanvas().quantize();
}

function zoomOut() {
    getCanvas().zoomOut();
}

function zoomIn() {
    getCanvas().zoomIn();
}

function renderGIF() {
    getCanvas().renderGIF();
}

function renderWEBM() {
    getCanvas().renderWEBM();
}

function saveFrame() {
    getCanvas().saveFrame();
}

function setFrame(frame) {
    getCanvas().setFrame(frame);
}

function openPalettes() {
    setTimeout(() => {
        document.querySelector('lospec-palette')?.toggle();
    }, 0)
}

function togglePlayerState() {
    player_state = !player_state;

    getCanvas().setPlayerState(player_state);

    drawApp();
}

function paletteLimit(value) {
    palette_limit += value;
    palette_limit = palette_limit >= 2 ? palette_limit : 2;
    getCanvas().setPaletteLimit(palette_limit);
    drawApp();
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
                transition: all ease .2s;
                outline: none;
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
                padding: 40px 30px;
            }

            .fixed-buttons-left {
                position: fixed;
                display: flex;
                bottom: 2vh;
                left: 2vh;
                padding: 40px 30px;
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
                height: 54px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom: 8px;
                padding-left: 1px;
            }

            .round.minus p {
                padding-bottom: 9px;
            }

            .no-outline {
                border: none;
                outline: none;
            }

            .floating-options {
                position: fixed;
                bottom: calc(2vh + 106px);
                right: calc(2vh + 40px);
                text-align: right;
            }

            .floating-options p {
                opacity: .2;
                transition: .2s ease all;
                margin: 0;
            }

            .floating-options p:hover {
                opacity: .75;
                transition: .1s ease all;
                cursor: pointer;
            }

            .floating-options p.__active {
                opacity: 1;
                transition: .2s ease all;
                cursor: pointer;
            }
            
            .color-palette-limit {
                position: relative;
                display: flex;
                margin-left: 8px;
            }

            .chevron {
                position: absolute;
                cursor: pointer;
                transition: all ease .2s;
            }

            .chevron:hover {
                transform: scale(1.2);
                transition: all ease .2s;
            }

            .chevron.up{
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 10px 15px 10px;
                border-color: transparent transparent #2e2549 transparent;
                top: -2px;
            }

            .chevron.down {
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 15px 10px 0 10px;
                border-color: #2e2549 transparent transparent transparent;
                bottom: -2px;
            }

            button:hover {
                transform: scale(1.05);
                transition: all ease .2s;
            }

            button.round:hover {
                transform: scale(1.2);
            }
        </style>
        <canvas-renderer></canvas-renderer>
        <frame-control active=${image_count > 1}></frame-control>
        <palette-renderer></palette-renderer>
        ${window.animation_active ? html`
        <lospec-palette></lospec-palette>

        <div class="fixed-buttons-left">
            <button class="no-outline" @click=${openPalettes}>Palettes</button>
        </div>

        <div class="fixed-buttons">
            <button class="round" @click=${togglePlayerState}><img src="${player_state ? 'pause.svg' : 'play.svg'}"></button>
            <button class="round minus" @click=${zoomOut}><p>-</p></button>
            <button class="round" @click=${zoomIn}><p>+</p></button>
            <button @click=${quantize}>Quantize colors!</button>
            <div class="color-palette-limit">
                <div class="chevron up" @click=${() => { paletteLimit(1) }}></div>
                <p class="limit">${palette_limit} colors</p>
                <div class="chevron down" @click=${() => { paletteLimit(-1) }}></div>
            </div>
        </div>

        <div class="fixed-buttons-right">
            <options-button>
                ${image_count > 1 ? html`<button @click=${renderGIF}>Export GIF</button>` : ''}
                ${image_count > 1 ? html`<button @click=${renderWEBM}>Export WEBM</button>` : ''}
            </options-button>
            <button @click=${saveFrame}>Save Frame</button>
        </div>

        <div class="floating-options">
            <p class="${options.dither ? '__active' : ''}" @click=${() => toggle('dither')}>ordered dithering ${options.dither ? 'on' : 'off'}</p>
            <p class="${!options.background ? '__active' : ''}" @click=${() => toggle('background')}>transparency ${!options.background ? 'on' : 'off'}</p>
        </div>

        ` : html`<drop-area></drop-area>`}
    `, document.querySelector('.app'));
}

drawApp();

window.addEventListener('click', evt => {
    if (evt.target.nodeName != 'LOSPEC-PALETTE') {
        document.querySelector('lospec-palette')?.toggle(false);
    }

    if (evt.target.nodeName != 'FRAME-CONTROL') {
        document.querySelector('frame-control')?.onFPSInputKey(null, true);
    }
})
window.listen('updateApp', drawApp);

window.listen('drop', images => {
    image_count = images.length;
    drawApp();
});

window.listen('frame_set', setFrame);

function toggle(key) {
    options[key] = !options[key];

    window.on(`${key}_change`, options[key]);
    drawApp();
}

window.listen('drop', images => {
    document.querySelector('canvas-renderer')?.setImages(images);
    document.querySelector('frame-control')?.setImages(images);
});

window.listen('frame', index => {
    document.querySelector('frame-control')?.setFrame(index);
});