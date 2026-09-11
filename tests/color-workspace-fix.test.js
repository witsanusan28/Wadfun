const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const html = `<!doctype html><html><head></head><body>
<section id="color" class="screen active"><div class="toolbar"><button class="tb"><span>เสร็จ</span></button><div class="sizeBox"><input></div></div><div class="canvasArea"><canvas id="colorCanvas" width="1200" height="700"></canvas></div></section>
<section id="finish" class="screen"><img id="finishImg"></section>
</body></html>`;

const dom = new JSDOM(html, { url: 'https://wadfun.test/' });
const { window } = dom;
const { document } = window;

global.window = window;
global.document = document;
global.localStorage = window.localStorage;
global.Image = window.Image;

window.HTMLCanvasElement.prototype.getContext = function(){
  return { fillStyle: '', fillRect(){}, drawImage(){} };
};
window.HTMLCanvasElement.prototype.toDataURL = function(){
  return 'data:image/jpeg;base64,dGVzdA==';
};

window.wadfunRestoreColorTemplateWalls = () => {};
window.show = id => {
  document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
};
window.saveCanvas = () => null;
window.finishCanvas = () => {};

eval(fs.readFileSync('color-picker-reset-v2.js', 'utf8'));

setTimeout(() => {
  window.finishCanvas('colorCanvas', '🖍️', 'ทดสอบ');
  assert(document.getElementById('finish').classList.contains('active'), 'finish screen should become active');
  assert(document.getElementById('finishImg').src.startsWith('data:image/jpeg'), 'finish preview should receive an exported image');
  const css = [...document.querySelectorAll('style')].map(s => s.textContent).join('\n');
  assert(css.includes('flex-wrap:wrap'), 'mobile toolbar must wrap instead of forcing horizontal scroll');
  assert(css.includes('overflow-x:hidden'), 'mobile toolbar must hide horizontal overflow');
  console.log('Color Workspace Fix V5 behavior OK');
  process.exit(0);
}, 650);
