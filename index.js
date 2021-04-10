import { html, render } from '/web_modules/lit-html.js';
import '/components/entry.js';
let image_count = 0;
let player_state = true;
let options = {
    background: false
}

function quantize() {
    document.querySelector('canvas-renderer').quantize();
}

function zoomOut() {
    document.querySelector('canvas-renderer').zoomOut();
}

function zoomIn() {
    document.querySelector('canvas-renderer').zoomIn();
}

function renderGIF() {
    document.querySelector('canvas-renderer').renderGIF();
}

function saveFrame() {
    document.querySelector('canvas-renderer').saveFrame();
}

function setFrame(frame) {
    document.querySelector('canvas-renderer').setFrame(frame);
}

function openPalettes() {
    setTimeout(() => {
        document.querySelector('lospec-palette')?.toggle();
    }, 0)
}

function togglePlayerState() {
    player_state = !player_state;

    document.querySelector('canvas-renderer').setPlayerState(player_state);

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

            .no-outline {
                border: none;
                outline: none;
            }

            .floating-options {
                position: fixed;
                bottom: calc(2vh + 106px);
                right: calc(2vh + 40px);
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
        </style>
        <canvas-renderer></canvas-renderer>
        <frame-control active=${image_count > 1}></frame-control>
        ${window.animation_active ? html`
        <lospec-palette></lospec-palette>

        <div class="fixed-buttons-left">
            <button class="no-outline" @click=${openPalettes}>Palettes</button>
        </div>

        <div class="fixed-buttons">
            <button class="round" @click=${togglePlayerState}><img src="${player_state ? 'pause.svg' : 'play.svg'}"></button>
            <button class="round" @click=${zoomOut}><p>-</p></button>
            <button class="round" @click=${zoomIn}><p>+</p></button>
            <button @click=${quantize}>Quantize colors!</button>
        </div>

        <div class="fixed-buttons-right">
            ${image_count > 1 ? html`<button @click=${renderGIF}>Export GIF</button>` : ''}
            <button @click=${saveFrame}>Save Frame</button>
        </div>

        <div class="floating-options">
            <p class="${!options.background ? '__active' : ''}" @click=${() => toggle('background')}>transparent background</p>
        </div>

        ` : html`<drop-area></drop-area>`}
    `, document.querySelector('.app'));
}

drawApp();

window.addEventListener('click', evt => {
    if (evt.target.nodeName != 'LOSPEC-PALETTE') {
        document.querySelector('lospec-palette')?.toggle(false);
    }
})
window.addListener('updateApp', drawApp);

window.addListener('drop', images => {
    image_count = images.length;
    drawApp();
});

window.addListener('frame_set', setFrame);

function toggle(key) {
    options[key] = !options[key];

    window.on(`${key}_change`, options[key]);
    drawApp();
}

