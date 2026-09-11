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

const categories = window.document.getElementById('categories');
const picker = window.document.getElementById('picker');
const color = window.document.getElementById('color');

// Start from a known category, then select a specific picture in that category.
const categoryButton = window.document.querySelector('#categoriesGrid .cat[data-cat="food"]');
assert(categoryButton, 'Food category button was not rendered');
categoryButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

const selectedBefore = window.document.querySelector('#pickerGrid .template[data-index="1"]');
assert(selectedBefore, 'Expected second picture in the original category was not rendered');
selectedBefore.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

assert.strictEqual(window.wadfunColorLibraryState.category, 'food', 'Selected category must be food before Change Picture');
assert.strictEqual(window.wadfunColorLibraryState.index, 1, 'Selected picture index must be 1 before Change Picture');

// Put the app in Canvas state before simulating the user action.
categories.classList.remove('active');
picker.classList.remove('active');
color.classList.add('active');

const changeButton = window.document.getElementById('wadfunChangePicture');
assert(changeButton, 'Change Picture button was not installed');

// Simulate the actual user action: Canvas -> click "เปลี่ยนรูป".
changeButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

// 1) The picker must open and categories must stay closed.
assert(picker.classList.contains('active'), '#picker must be active after clicking Change Picture');
assert(!categories.classList.contains('active'), '#categories must not be active after clicking Change Picture');
assert.notStrictEqual(picker.style.display, 'none', '#picker must not be hidden after clicking Change Picture');
assert.strictEqual(categories.style.getPropertyValue('display'), 'none', '#categories must be hidden after clicking Change Picture');

// 2) The original category must still be displayed.
assert.strictEqual(window.document.getElementById('pickerGrid').dataset.wadfunCategory, 'food', 'Original category must remain selected');
assert.strictEqual(window.wadfunColorLibraryState.category, 'food', 'State category must remain food after Change Picture');
assert.strictEqual(window.document.getElementById('pickerTitle').textContent, '🍎 อาหาร 🍎', 'Picker title must show the original category');

// 3) The original picture must still carry the selected marker (✓).
const selectedAfter = window.document.querySelector('#pickerGrid .template.selected[data-index="1"]');
assert(selectedAfter, 'Original picture must remain selected after Change Picture');
assert(selectedAfter.textContent.includes('✓'), 'Original picture must still display the ✓ marker after Change Picture');
assert.strictEqual(window.wadfunColorLibraryState.index, 1, 'Selected picture index must remain 1 after Change Picture');

console.log('PASS: Canvas -> Change Picture opens #picker, keeps #categories closed, preserves the original category, and preserves the original picture ✓');
