/* Wadfun Workspace Fix V14 — hard Draw Finish guard + home menu cleanup */
(function(){
'use strict';
const style=document.createElement('style');style.textContent=`@media(max-width:650px){#color.active .toolbar,#draw.active .toolbar{flex-wrap:wrap!important;justify-content:center!important;align-content:center!important;overflow-x:hidden!important;overflow-y:visible!important;white-space:normal!important;gap:5px!important;padding:5px!important}#color.active .toolbar .tb,#draw.active .toolbar .tb{min-width:46px!important;width:46px!important;height:46px!important;flex:0 0 46px!important}#color.active .toolbar .sizeBox,#draw.active .toolbar .sizeBox{min-width:122px!important;width:122px!important;height:46px!important;flex:0 0 122px!important}}@media(min-width:651px){#color.active .toolbar,#draw.active .toolbar{overflow-x:auto;overflow-y:hidden}}`;
document.head.appendChild(style);
const homeStyle=document.createElement('style');homeStyle.id='wadfun-home-menu-v14';homeStyle.textContent='.home .sideMenu .woodBtn:nth-child(2),.home .sideMenu .woodBtn:nth-child(3){display:none!important}';document.head.appendChild(homeStyle);
function exportImage(c){const max=1000,s=Math.min(1,max/Math.max(c.width,c.height)),w=Math.max(1,Math.round(c.width*s)),h=Math.max(1,Math.round(c.height*s)),o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(c,0,0,w,h);return o.toDataURL('image/jpeg',.86)}
function showFinish(){document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.style.removeProperty('display')});const f=document.getElementById('finish');if(f){f.classList.add('active');f.style.setProperty('display','block','important')}try{window.scrollTo(0,0)}catch(e){}}
function saveCanvas(id,icon,name){const c=document.getElementById(id);if(!c)return null;try{window.wadfunRestoreColorTemplateWalls?.()}catch(e){}const img=exportImage(c);let works=[];try{works=JSON.parse(localStorage.getItem('wadfunWorks')||'[]')}catch(e){}works.unshift({id:Date.now(),name:name||'ผลงานของฉัน',icon:icon||'🎨',img,date:new Date().toLocaleDateString('th-TH')});for(const n of [30,10,3,1]){try{localStorage.setItem('wadfunWorks',JSON.stringify(works.slice(0,n)));break}catch(e){}}return img}
function finishCanvas(id,icon,name){const mode=(id==='colorCanvas'||document.querySelector('#color.active'))?'color':'draw';if(typeof window.wadfunFinish==='function')return window.wadfunFinish(mode);const c=document.getElementById(id);if(!c)return false;let img;try{img=saveCanvas(id,icon,name)}catch(e){}if(!img)try{img=exportImage(c)}catch(e){return false}const f=document.getElementById('finishImg');if(f)f.src=img;showFinish();return true}
window.exportImage=exportImage;window.saveCanvas=saveCanvas;window.finishCanvas=finishCanvas;window.__wadfunFinishFixV14=true;window.__wadfunFinishFixV13=true;window.__wadfunFinishFixV12=true;window.__wadfunFinishFixV11=true;window.__wadfunFinishFixV10=true;
function toolState(){const bar=document.querySelector('#color .toolbar');if(!bar)return[];return[...bar.querySelectorAll('button.on')].filter(b=>{const t=(b.textContent||'').toLowerCase();return /ถังสี|เทสี|ระบาย|ยางลบ|bucket|pen|eraser|fill/.test(t)||/color.*(pen|erase|bucket|fill)/i.test(b.id||'')}).map(b=>({id:b.id,text:(b.textContent||'').trim()}))}
function restoreToolState(saved){if(!saved)return;const bar=document.querySelector('#color .toolbar');if(!bar)return;const candidates=[...bar.querySelectorAll('button')].filter(b=>{const t=(b.textContent||'').toLowerCase();return /ถังสี|เทสี|ระบาย|ยางลบ|bucket|pen|eraser|fill/.test(t)||/color.*(pen|erase|bucket|fill)/i.test(b.id||'')});candidates.forEach(b=>b.classList.remove('on'));saved.forEach(s=>{let b=s.id?document.getElementById(s.id):null;if(!b||!bar.contains(b))b=candidates.find(x=>(x.textContent||'').trim()===s.text);if(b)b.classList.add('on')})}
function startNewSafe(){const lib=window.wadfunColorLibraryState||{};const beforeId=`${lib.category||''}:${Number.isInteger(lib.index)?lib.index:''}`;const savedTools=toolState();const color=document.getElementById('color');if(color&&!color.classList.contains('active'))color.classList.add('active');let ok=false;try{if(typeof window.wadfunColorFreshReset==='function')ok=!!window.wadfunColorFreshReset();else if(typeof window.wadfunColorResetV25==='function')ok=!!window.wadfunColorResetV25()}catch(e){console.error('[Wadfun] Start New reset failed',e)}restoreToolState(savedTools);const after=window.wadfunColorLibraryState||{};const afterId=`${after.category||''}:${Number.isInteger(after.index)?after.index:''}`;if(afterId!==beforeId){console.error('[Wadfun] Start New changed current imageId',beforeId,afterId);return false}try{window.wadfunColorHistoryState?.()}catch(e){}return ok}
window.wadfunStartNewColorSafe=startNewSafe;
window.addEventListener('click',e=>{const b=e.target?.closest?.('#color .toolbar button');if(!b)return;const t=(b.textContent||'').trim();if(!/เริ่มใหม่|start new/i.test(t))return;e.preventDefault();e.stopImmediatePropagation();startNewSafe()},true);
function wireColor(){const root=document.querySelector('#color .toolbar');if(!root)return;for(const b of root.querySelectorAll('button')){if(b.dataset.finishV14)continue;const t=(b.textContent||'').trim();if(/เสร็จ|finish|done/i.test(t)){b.dataset.finishV14='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();finishCanvas('colorCanvas','🎨','ผลงานระบายสี')},true)}}}
function wireDraw(){const root=document.querySelector('#draw .toolbar');if(!root)return;for(const b of root.querySelectorAll('button')){if(b.dataset.finishDrawV14)continue;const t=(b.textContent||'').trim();if(/เสร็จ|finish|done/i.test(t)){b.dataset.finishDrawV14='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(typeof window.wadfunFinish==='function')window.wadfunFinish('draw');else finishCanvas('drawCanvas','✏️','ภาพวาดของฉัน')},true)}}}
function installDrawFinishGuard(){if(window.__wadfunDrawFinishGuardV13)return;document.addEventListener('click',e=>{const b=e.target?.closest?.('#draw .toolbar button');if(!b)return;const t=(b.textContent||'').trim();if(!/เสร็จ|finish|done/i.test(t))return;e.preventDefault();e.stopImmediatePropagation();if(typeof window.wadfunFinish==='function')window.wadfunFinish('draw');else finishCanvas('drawCanvas','✏️','ภาพวาดของฉัน')},true);window.__wadfunDrawFinishGuardV13=true}
function cleanGalleryEdit(){document.querySelectorAll('.wadfun-gallery-edit,.wadfun-viewer-edit').forEach(b=>b.remove());}
installDrawFinishGuard();setInterval(()=>{wireColor();wireDraw();cleanGalleryEdit()},250);wireColor();wireDraw();cleanGalleryEdit();
/* WADFUN ICON RENDERER V5 — single owner; inline SVG only; presentation-only */
(function(){
'use strict';
if(window.__wadfunIconRendererV5)return;
window.__wadfunIconRendererV5=true;
const NS='http://www.w3.org/2000/svg';
const I={
home:'<path d="M18 46L50 18l32 28v34H61V58H39v22H18z" fill="#63C8F2" stroke="#245B78" stroke-width="5" stroke-linejoin="round"/><path d="M12 47L50 13l38 34" fill="none" stroke="#245B78" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="67" cy="30" r="7" fill="#FFD34F" stroke="#8A6A24" stroke-width="3"/>',
pencil:'<g transform="rotate(-42 50 50)"><rect x="30" y="12" width="38" height="68" rx="12" fill="#FFD34F" stroke="#17466B" stroke-width="5"/><path d="M30 62h38v18H30z" fill="#F5A623"/><path d="M30 12h38v17H30z" fill="#FF7EB6"/><path d="M30 80l19 15 19-15" fill="#F3D4A4" stroke="#17466B" stroke-width="5"/></g>',
crayon:'<g transform="rotate(-38 50 50)"><rect x="30" y="13" width="40" height="72" rx="18" fill="#FF3F79" stroke="#6B244B" stroke-width="5"/><path d="M30 30h40M30 68h40" stroke="#FF9CC0" stroke-width="6"/><path d="M36 13h28l-14-9z" fill="#FF668F" stroke="#6B244B" stroke-width="4"/></g>',
brush:'<g transform="rotate(35 50 50)"><path d="M42 20h18v53H42z" fill="#A66A38" stroke="#5A3925" stroke-width="5"/><path d="M40 20h22l-3-9H43z" fill="#D5E3E9" stroke="#466273" stroke-width="4"/><path d="M40 73h22c-2 17-8 23-11 23s-9-6-11-23z" fill="#4DB9F2" stroke="#315B78" stroke-width="5"/></g>',
marker:'<g transform="rotate(-38 50 50)"><rect x="29" y="14" width="42" height="66" rx="10" fill="#8A55E8" stroke="#382C6E" stroke-width="5"/><path d="M29 63h42v17H29z" fill="#6236BD"/><path d="M39 14h22l10 10H29z" fill="#B38BFF"/><path d="M39 80h22l-5 14H44z" fill="#6431D0" stroke="#382C6E" stroke-width="4"/></g>',
sparkle:'<path d="M47 16l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill="#FFD84D" stroke="#8A5A20" stroke-width="4"/><path d="M72 48l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="#FF7BC1" stroke="#7A3E6A" stroke-width="3"/><circle cx="32" cy="75" r="6" fill="#63D6FF"/>',
eraser:'<g transform="rotate(-35 50 50)"><path d="M24 29a12 12 0 0 1 17-17l39 39a12 12 0 0 1 0 17l-9 9H43L24 58a12 12 0 0 1 0-29z" fill="#FF6FA9" stroke="#4D5274" stroke-width="5"/><path d="M24 29l19 29h28l9-9-39-39z" fill="#FFF"/></g>',
undo:'<path d="M26 44h39c18 0 25 12 25 25 0 11-7 20-18 24M27 44l20-18M27 44l20 18" fill="none" stroke="#FFB52E" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
redo:'<path d="M74 44H35C17 44 10 56 10 69c0 11 7 20 18 24M73 44L53 26M73 44L53 62" fill="none" stroke="#39BFF2" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
clear:'<path d="M29 28h42l-4 58H33zM24 28h52M38 18h24M41 43v29M59 43v29" fill="none" stroke="#234F76" stroke-width="7" stroke-linecap="round"/>',
save:'<path d="M22 16h48l12 12v56H22zM34 16v27h31V16" fill="#FFD34F" stroke="#5A4A32" stroke-width="5"/><rect x="36" y="57" width="28" height="20" rx="4" fill="#55C7EE" stroke="#3B6A83" stroke-width="4"/>'};
function make(id){const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 100 100');s.setAttribute('aria-hidden','true');s.classList.add('wadfunToolIcon');s.innerHTML=I[id]||I.pencil;return s}
function setIcon(b,id){if(!b)return;let i=b.querySelector('i');if(!i){i=document.createElement('i');b.insertBefore(i,b.firstChild)}if(i.dataset.wadfunIcon===id)return;i.replaceChildren(make(id));i.dataset.wadfunIcon=id;b.classList.add('wadfunIconButton')}
function penMode(){const item=document.querySelector('#draw .penItem.on');if(item){const c=[...item.classList];const m=['pencil','crayon','brush','marker','sparkle'].find(x=>c.includes(x));if(m)return m;const t=(item.textContent||'').toLowerCase();if(t.includes('ดินสอ'))return'pencil';if(t.includes('สีเทียน'))return'crayon';if(t.includes('พู่กัน'))return'brush';if(t.includes('เมจิก')||t.includes('marker')||t.includes('มาร์กเกอร์'))return'marker';if(t.includes('ประกาย'))return'sparkle'}return window.__wadfunSelectedPen||'pencil'}
function find(root,label){return[...root.querySelectorAll('button')].find(b=>(b.textContent||'').includes(label))}
function render(){const root=document.querySelector('#draw .toolbar');if(!root)return;setIcon(root.querySelector('button:first-child'),'home');setIcon(document.getElementById('penBtn'),penMode());setIcon(document.getElementById('eraserBtn'),'eraser');setIcon(find(root,'ย้อนกลับ'),'undo');setIcon(find(root,'ทำซ้ำ'),'redo');setIcon(find(root,'ล้าง'),'clear');setIcon(find(root,'เสร็จ'),'save');document.querySelectorAll('#draw .penItem').forEach(item=>{const h=item.querySelector('.penIcon');if(!h)return;const t=(item.textContent||'').toLowerCase();const id=t.includes('ดินสอ')?'pencil':t.includes('สีเทียน')?'crayon':t.includes('พู่กัน')?'brush':(t.includes('เมจิก')||t.includes('marker')||t.includes('มาร์กเกอร์'))?'marker':t.includes('ประกาย')?'sparkle':null;if(id)h.replaceChildren(make(id))})}
const st=document.createElement('style');st.textContent='.wadfunIconButton i{width:30px;height:30px;display:grid;place-items:center;line-height:1}.wadfunToolIcon{width:30px;height:30px;display:block;overflow:visible}.wadfunIconButton.tb.on .wadfunToolIcon{filter:drop-shadow(0 0 3px #58c9f7)}.wadfunIconButton:disabled .wadfunToolIcon{filter:grayscale(1);opacity:.38}.wadfunIconButton:disabled{opacity:.62}';document.head.appendChild(st);
render();
window.__wadfunRenderPenIconV5=render;
document.addEventListener('click',e=>{const item=e.target?.closest?.('#draw .penItem');if(!item)return;const c=[...item.classList];const m=['pencil','crayon','brush','marker','sparkle'].find(x=>c.includes(x));if(m)window.__wadfunSelectedPen=m;setTimeout(render,0)},true);
window.addEventListener('wadfun:draw-ready',render);
window.wadfunRenderToolIcons=render;
})();
/* WADFUN PEN RENDERER V1 — clearly distinct pencil/crayon/brush/marker/sparkle strokes */
(function(){
'use strict';
if(window.__wadfunPenRendererV1)return;window.__wadfunPenRendererV1=true;
function color(){return typeof window.wadfunCurrentDrawColor==='function'?window.wadfunCurrentDrawColor():(typeof selectedColor!=='undefined'?selectedColor:'#e53935')}
function mode(){return window.__wadfunSelectedPen||'pencil'}
function drawLine(x,p,alpha,width,dash){x.globalCompositeOperation='source-over';x.strokeStyle=color();x.globalAlpha=alpha;x.lineWidth=width;x.lineCap='round';x.lineJoin='round';x.setLineDash(dash||[]);x.lineTo(p.x,p.y);x.stroke()}
const original=window.wadfunStrokePoint;
window.wadfunStrokePoint=function(c,x,p){const m=mode();const base=(typeof drawSize!=='undefined'?drawSize:12)*Math.min(devicePixelRatio||1,2);if(m==='crayon'){drawLine(x,p,.30,Math.max(3,base*1.12),[2,3]);drawLine(x,{x:p.x+.8,y:p.y-.8},.18,Math.max(2,base*.62),[1,4]);return}if(m==='brush'){drawLine(x,p,.22,Math.max(5,base*1.55));drawLine(x,p,.72,Math.max(2.5,base*.72));return}if(m==='marker'){drawLine(x,p,.58,Math.max(5,base*1.38));return}if(m==='sparkle'){drawLine(x,p,.55,Math.max(2,base*.62));x.setLineDash([]);x.globalAlpha=.9;x.fillStyle=color();const r=Math.max(1.5,base*.13);for(let i=0;i<2;i++){const a=Math.random()*Math.PI*2,d=base*(.35+.55*Math.random());x.fillRect(p.x+Math.cos(a)*d-r,p.y+Math.sin(a)*d-r,r*2,r*2)}return}drawLine(x,p,.72,Math.max(1.5,base*.58));};
window.__wadfunOriginalStrokePoint=original;
})();
/* WADFUN DRAW UNDO/REDO UI STATE V1 — UI-only state reflection; does not alter drawing engine */
(function(){
'use strict';
let undoCount=0,redoCount=0,installed=false;
function buttons(){const root=document.querySelector('#draw .toolbar');if(!root)return{};const find=t=>[...root.querySelectorAll('button')].find(b=>(b.textContent||'').includes(t));return{undo:find('ย้อนกลับ'),redo:find('ทำซ้ำ'),clear:find('ล้าง')};}
function render(){const b=buttons();if(b.undo){b.undo.disabled=undoCount<=0;b.undo.setAttribute('aria-disabled',String(b.undo.disabled))}if(b.redo){b.redo.disabled=redoCount<=0;b.redo.setAttribute('aria-disabled',String(b.redo.disabled))}}
function hasInk(c){try{const x=c.getContext('2d',{willReadFrequently:true});if(!x)return false;const d=x.getImageData(0,0,c.width,c.height).data;for(let i=3;i<d.length;i+=4){if(d[i]>0){const r=d[i-3],g=d[i-2],b=d[i-1];if(r<250||g<250||b<250)return true}}}catch(e){}return false}
function resetFromCanvas(){const c=document.getElementById('drawCanvas');if(c){undoCount=hasInk(c)?1:0;redoCount=0}else{undoCount=0;redoCount=0}render()}
function install(){if(installed)return;const c=document.getElementById('drawCanvas');if(!c)return;installed=true;
['pointerdown','touchstart'].forEach(type=>c.addEventListener(type,e=>{if(type==='touchstart'&&e.touches&&e.touches.length!==1)return;if(e.defaultPrevented&&type==='pointerdown')return;undoCount=Math.max(0,undoCount)+1;redoCount=0;render()},{passive:true}));
document.addEventListener('click',e=>{const b=e.target?.closest?.('#draw .toolbar button');if(!b)return;const bs=buttons();if(b===bs.undo){if(undoCount>0){undoCount--;redoCount++;render()}}else if(b===bs.redo){if(redoCount>0){redoCount--;undoCount++;render()}}else if(b===bs.clear){undoCount=0;redoCount=0;render()}},true);
resetFromCanvas();
}
install();setInterval(()=>{install();render()},250);
})();
})();

/* WADFUN PEN ICON POST-CLICK SYNC V2 — sync after choosePen inline handler */
(function(){'use strict';
function sync(){
  const item=document.querySelector('#draw .penItem.on');
  if(!item)return;
  const c=[...item.classList];
  const m=['pencil','crayon','brush','marker','sparkle'].find(x=>c.includes(x));
  if(m)window.__wadfunSelectedPen=m;
  window.__wadfunRenderPenIconV5?.();
}
document.addEventListener('click',e=>{
  if(!e.target?.closest?.('#draw .penItem'))return;
  setTimeout(sync,0);setTimeout(sync,80);setTimeout(sync,250);
},false);
})();
