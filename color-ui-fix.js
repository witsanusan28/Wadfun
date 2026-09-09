/* Wadfun Color UI V5 — reliable selected color indicator */
(function(){
'use strict';
const css=`
/* WADFUN COLOR UI V5 */
.colorPopup{touch-action:none;user-select:none;-webkit-user-select:none}
.colorPopup .colorSquare{touch-action:none;cursor:crosshair}
.colorPopup .hue,.colorPopup .shade input{touch-action:pan-x}
.colorPopup .swatches{max-height:118px;overflow-y:auto;padding:3px 2px;touch-action:pan-y}
.colorPopup .swatch{width:100%;min-width:28px;min-height:28px}
.colorMini{display:block!important;width:30px!important;height:30px!important;border-radius:50%!important;border:3px solid #fff!important;box-shadow:0 0 0 2px #8aa0ad,0 2px 5px #0003!important;flex:0 0 auto!important}
#draw .toolbar .tb:has(#drawDot),#color .toolbar .tb:has(#colorDot){min-width:82px!important}
.pickerSelectedPreview{position:sticky;top:0;z-index:8}
.pickerPreviewDot{transition:background .08s linear}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function hex(c){return /^#[0-9a-f]{6}$/i.test(c)?c.toUpperCase():null}
function rgbToHex(s){const m=(s||'').match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join('').toUpperCase():null}
function paint(c){
 c=hex(c)||'#E53935';
 window.wadfunSelectedColor=c;
 try{localStorage.setItem('wadfunSelectedColor',c)}catch(e){}
 const d=document.getElementById('drawDot'),q=document.getElementById('colorDot');
 [d,q].forEach(x=>{if(x){x.style.setProperty('background-color',c,'important');x.style.setProperty('background',c,'important');x.dataset.selectedColor=c;x.title='สีที่เลือก '+c}});
 document.querySelectorAll('.colorMini').forEach(x=>{x.style.setProperty('background-color',c,'important');x.style.setProperty('background',c,'important');x.dataset.selectedColor=c});
 const prev=document.querySelector('.pickerPreviewDot'),txt=document.querySelector('.pickerPreviewHex');
 if(prev)prev.style.background=c;if(txt)txt.textContent=c;
 const btn=d&&d.closest('button');if(btn){btn.dataset.selectedColor=c;btn.setAttribute('aria-label','สีที่เลือก '+c)}
}
function current(){
 const saved=window.wadfunSelectedColor||(()=>{try{return localStorage.getItem('wadfunSelectedColor')}catch(e){return null}})();
 if(hex(saved))return saved;
 const el=document.getElementById('drawDot')||document.getElementById('colorDot');
 return rgbToHex(el&&getComputedStyle(el).backgroundColor)||'#E53935';
}
window.pickColor=function(c){paint(c);if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()};
window.setHue=function(v){const h=Number(v)||0;if(typeof window.hslHex==='function')paint(window.hslHex(h,85,50));const hue=document.getElementById('hue');if(hue)hue.value=v;syncSquare();if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()};
window.setShade=function(v){const base=current();if(typeof window.rgbToHsl==='function'&&typeof window.hslHex==='function'){const h=window.rgbToHsl(base);paint(window.hslHex(h[0],h[1],Number(v)||50))}const shade=document.getElementById('shadeRange');if(shade)shade.value=v;if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()};
function syncSquare(){
 const sq=document.querySelector('.colorSquare');if(!sq)return;
 const h=(document.getElementById('hue')&&Number(document.getElementById('hue').value))||0;
 sq.style.background=`linear-gradient(to top,#000,transparent),linear-gradient(90deg,#fff,hsl(${h} 100% 50%))`;
}
function bindSquare(){
 const sq=document.querySelector('.colorSquare');if(!sq||sq.dataset.v5)return;sq.dataset.v5='1';let down=false;
 const pick=e=>{const r=sq.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));const h=(document.getElementById('hue')&&Number(document.getElementById('hue').value))||0;if(typeof window.hslHex==='function')paint(window.hslHex(h,x*100,(1-y)*100));if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()};
 sq.addEventListener('pointerdown',e=>{down=true;sq.setPointerCapture?.(e.pointerId);e.preventDefault();pick(e)},{passive:false});
 sq.addEventListener('pointermove',e=>{if(!down)return;e.preventDefault();pick(e)},{passive:false});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>sq.addEventListener(t,()=>{down=false}));
}
function bindHue(){const h=document.getElementById('hue');if(!h||h.dataset.v5)return;h.dataset.v5='1';h.addEventListener('input',()=>{syncSquare();if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()},{passive:true})}
function bindShade(){const s=document.getElementById('shadeRange');if(!s||s.dataset.v5)return;s.dataset.v5='1';s.addEventListener('input',()=>{if(window.wadfunColorPickerV3)window.wadfunColorPickerV3.update()},{passive:true})}
function bindSwatches(){
 const p=document.getElementById('colorPopup');if(!p||p.dataset.v5)return;p.dataset.v5='1';
 p.addEventListener('pointerdown',e=>{
  const sw=e.target.closest?.('.swatch');if(!sw)return;
  const c=rgbToHex(sw.style.backgroundColor)||rgbToHex(getComputedStyle(sw).backgroundColor)||sw.dataset.color;
  if(hex(c))setTimeout(()=>paint(c),0);
 },{capture:true,passive:true});
 p.addEventListener('click',e=>{
  const sw=e.target.closest?.('.swatch');if(!sw)return;
  const c=rgbToHex(sw.style.backgroundColor)||rgbToHex(getComputedStyle(sw).backgroundColor)||sw.dataset.color;
  if(hex(c))setTimeout(()=>paint(c),20);
 },{capture:true,passive:true});
}
function boot(){
 bindSquare();bindHue();bindShade();bindSwatches();syncSquare();paint(current());
}
const timer=setInterval(()=>{if(document.getElementById('colorPopup')){boot();clearInterval(timer)}},80);
setTimeout(boot,500);
})();