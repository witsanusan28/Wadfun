const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync('color-picker-reset-v2.js', 'utf8');
const dom = new JSDOM(`<!doctype html><html><body>
<section id="color" class="screen active"><div class="toolbar">
  <button id="bucket" class="tb on"><i>🪣</i><span>เทสี</span></button>
  <button id="pen" class="tb"><i>🖍️</i><span>ระบาย</span></button>
  <button id="new" class="tb"><i>🔄</i><span>เริ่มใหม่</span></button>
</div><canvas id="colorCanvas" width="100" height="100"></canvas></section>
</body></html>`, { runScripts: 'outside-only' });

const { window } = dom;
global.window = window;
global.document = window.document;
global.devicePixelRatio = 1;
global.setInterval = setInterval;
global.clearInterval = clearInterval;
window.scrollTo = () => {};

let freshCalls = 0;
let initColorCalls = 0;
let historyCleared = false;
window.wadfunColorLibraryState = { category: 'animals', index: 0 };
window.wadfunColorFreshReset = () => { freshCalls++; historyCleared = true; return true; };
window.wadfunColorHistoryState = () => historyCleared ? { undo: 0, redo: 0 } : { undo: 3, redo: 1 };
window.initColor = () => { initColorCalls++; };

window.eval(source);

const button = window.document.getElementById('new');
button.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

assert.strictEqual(freshCalls, 1, 'Start New must call the engine fresh reset exactly once');
assert.strictEqual(initColorCalls, 0, 'Start New must not re-run initColor when the current color workspace is already active');
assert.deepStrictEqual(window.wadfunColorLibraryState, { category: 'animals', index: 0 }, 'Start New must keep the same current image state');
assert.strictEqual(window.document.getElementById('bucket').classList.contains('on'), true, 'Start New must preserve the active tool');
assert.strictEqual(window.document.getElementById('pen').classList.contains('on'), false, 'Start New must not switch to pen mode');
assert.deepStrictEqual(window.wadfunColorHistoryState(), { undo: 0, redo: 0 }, 'Start New must leave history empty after the reset');

console.log('PASS: Start New keeps the current image, calls fresh reset without initColor, preserves tool mode, and leaves history empty ✓');
process.exit(0);
