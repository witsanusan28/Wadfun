const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync('color-history.js', 'utf8');
const dom = new JSDOM(`<!doctype html><html><body>
<section id="color" class="screen active"><div class="toolbar">
  <button id="colorUndoBtn" class="tb"><i>↩️</i><span>ย้อนกลับ</span></button>
</div></section>
</body></html>`, { runScripts: 'outside-only' });

const { window } = dom;
global.window = window;
global.document = window.document;

let undoCalls = 0;
let redoCalls = 0;
window.wadfunColorUndo = () => { undoCalls++; return true; };
window.wadfunColorRedo = () => { redoCalls++; return true; };
window.wadfunColorHistoryState = () => ({ undo: 1, redo: 1 });

window.eval(source);
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

const undo = window.document.getElementById('colorUndoBtn');
const redo = window.document.getElementById('colorRedoBtn');
assert(undo, 'Undo button must exist');
assert(redo, 'Redo button must be created');
assert.strictEqual(undo.nextElementSibling, redo, 'Undo and Redo buttons must be adjacent');
assert.strictEqual(undo.disabled, false, 'Undo must be enabled when engine history has undo');
assert.strictEqual(redo.disabled, false, 'Redo must be enabled when engine history has redo');

undo.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
redo.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
assert.strictEqual(undoCalls, 1, 'Undo click must delegate to Color Engine');
assert.strictEqual(redoCalls, 1, 'Redo click must delegate to Color Engine');

console.log('PASS: Color Undo/Redo buttons exist as an adjacent pair, enable from engine history, and delegate clicks to the Color Engine ✓');
process.exit(0);
