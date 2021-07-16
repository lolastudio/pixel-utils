import './listeners.js';
import './drop-area/drop-area.js';
import './lospec-palette/lospec-palette.js';
import './frame-control/frame-control.js';
import './canvas-renderer/canvas-renderer.js';
import './svg-loader/svg-loader.js';
import './options-button/options-button.js';
import './palette-renderer/palette-renderer.js';

window.listen('drop', images => {
    document.querySelector('canvas-renderer')?.setImages(images);
    document.querySelector('frame-control')?.setImages(images);
});

window.listen('frame', index => {
    document.querySelector('frame-control')?.setFrame(index);
});