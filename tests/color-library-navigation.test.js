const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync('color-library.js', 'utf8');

const dom = new JSDOM(`<!doctype html><html><body>
  <section id="categories" class="screen"><div id="categoriesGrid"></div></section>
  <section id="picker" class="screen">
    <h2 id="pickerTitle"></h2><p id="pickerSub"></p>
    <div id="pickerGrid"></div>
  </section>
  <section id="color" class="screen">
    <div class="toolbar"></div>
    <div id="colorViewport"></div>
    <canvas id="colorCanvas"></canvas>
  </section>
</body></html>`, { runScripts: 'outside-only' });

const { window } = dom;
global.window = window;
global.document = window.document;
global.devicePixelRatio = 1;

// Load the real production Color Library code, not a test double.
window.eval(source);

const changeButton = window.document.getElementById('wadfunChangePicture');
assert(changeButton, 'Change Picture button was not installed');

// Put the app in the Canvas state before simulating the user click.
window.document.getElementById('categories').classList.remove('active');
window.document.getElementById('picker').classList.remove('active');
window.document.getElementById('color').classList.add('active');

// Simulate the actual user action: Canvas -> click "เปลี่ยนรูป".
changeButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

const picker = window.document.getElementById('picker');
const categories = window.document.getElementById('categories');

assert(picker.classList.contains('active'), '#picker must be active after clicking Change Picture');
assert(!categories.classList.contains('active'), '#categories must not be active after clicking Change Picture');
assert.notStrictEqual(picker.style.display, 'none', '#picker must not be hidden after clicking Change Picture');
assert.strictEqual(categories.style.getPropertyValue('display'), 'none', '#categories must be hidden after clicking Change Picture');

console.log('PASS: Canvas -> Change Picture opens #picker and keeps #categories closed');
