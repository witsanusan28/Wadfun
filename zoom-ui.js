/* Wadfun Zoom Slider V1 — no pinch zoom; slider only. Draw/Color safe. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const states={draw:1,color:1};
let activeType=null,raf=0;
function screen(type){return $(type)}
function layer(type){return $(type+'Zoom')}
function apply(type){const z=layer(type);if(!z)return;const s=states[type];z.style.transformOrigin='center center';z.style.transform='scale('+s+')';const ui=document.querySelector('[data-wadfun-zoom="'+type+'"]');if(ui){const range=ui.querySelector('input');const label=ui.querySelector('.wadfunZoomPct');if(range)range.value=String(s);if(label)label.textContent=Math.round(s*100)+'%'}}
function set(type,s){states[type]=Math.max(.5,Math.min(3,Number(s)||1));apply(type)}
function make(type){const area=$(type+'Viewport')?.parentElement;if(!area||area.querySelector('[data-wadfun-zoom="'+type+'"]'))return;
 const box=document.createElement('div');box.dataset.wadfunZoom=type;box.className='wadfunZoomUI';box.innerHTML='<button type="button" class="wadfunZoomBtn" data-z="plus" aria-label="ซูมเข้า">＋</button><div class="wadfunZoomPct">100%</div><input type="range" min="0.5" max="3" step="0.05" value="1" aria-label="ระดับซูม"><button type="button" class="wadfunZoomBtn" data-z="minus" aria-label="ซูมออก">−</button><button type="button" class="wadfunZoomReset">100%</button>';
 box.addEventListener('pointerdown',e=>{e.stopPropagation()},{capture:true});
 box.addEventListener('pointermove',e=>{if(e.target.tagName==='INPUT')e.stopPropagation()},{capture:true});
 box.querySelector('input').addEventListener('input',e=>{e.stopPropagation();set(type,e.target.value)});
 box.querySelector('[data-z="plus"]').addEventListener('click',()=>set(type,states[type]+.1));
 box.querySelector('[data-z="minus"]').addEventListener('click',()=>set(type,states[type]-.1));
 box.querySelector('.wadfunZoomReset').addEventListener('click',()=>set(type,1));
 area.appendChild(box);apply(type);
}
function install(){['draw','color'].forEach(make);const style=document.createElement('style');style.textContent=`
.wadfunZoomUI{position:absolute;left:7px;top:50%;transform:translateY(-50%);z-index:40;width:50px;padding:7px 5px;border:2px solid #d5e8f2;border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 8px 22px rgba(35,90,115,.18);display:flex;flex-direction:column;align-items:center;gap:6px;touch-action:none;user-select:none}
.wadfunZoomUI .wadfunZoomBtn{width:38px;height:38px;border-radius:12px;background:#eaf8ff;border:2px solid #cbe8f5;font-size:23px;font-weight:1000;line-height:1;touch-action:none}
.wadfunZoomUI .wadfunZoomPct{font-size:10px;font-weight:1000;min-height:15px}
.wadfunZoomUI input{width:190px;height:28px;transform:rotate(-90deg);margin:78px 0;accent-color:#31a9df;touch-action:none}
.wadfunZoomUI .wadfunZoomReset{font-size:9px;font-weight:1000;border-radius:9px;background:#fff6c9;padding:5px 4px;white-space:nowrap;touch-action:none}
.floatHint{display:none!important}
@media(max-width:650px){.wadfunZoomUI{left:5px;width:47px;padding:6px 4px;border-radius:16px}.wadfunZoomUI .wadfunZoomBtn{width:36px;height:36px}.wadfunZoomUI input{margin:72px 0}.wadfunZoomUI .wadfunZoomReset{font-size:8px}}
`;document.head.appendChild(style);
 window.wadfunZoomUI={set:update=>{if(update?.type&&update?.scale)set(update.type,update.scale)},update:(type,scale)=>set(type,scale),get:type=>states[type]||1,reset:type=>set(type,1)};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
