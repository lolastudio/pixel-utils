import './listeners.js';
import './drop-area/drop-area.js';
import './lospec-palette/lospec-palette.js';
import './canvas-renderer/canvas-renderer.js';

window.addListener('drop', images => {
    document.querySelector('canvas-renderer').setImages(images)
});