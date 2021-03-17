import './listeners.js';
import './drop-area/drop-area.js';
import './lospec-palette/lospec-palette.js';
import './frame-control/frame-control.js';
import './canvas-renderer/canvas-renderer.js';

window.addListener('drop', images => {
    document.querySelector('canvas-renderer')?.setImages(images);
    document.querySelector('frame-control')?.setImages(images);
});

window.addListener('frame', index => {
    document.querySelector('frame-control')?.setFrame(index);
});