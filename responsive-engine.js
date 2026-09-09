/* Wadfun Responsive Workspace V6 — locked toolbar + persistent selected color */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function workspaceOn(){return $('draw')?.classList.contains('active')||$('color')?.classList.contains('active')}
function readColor(){
 const els=[$('drawDot'),$('colorDot')].filter(Boolean);
 for(const el of els){
  const bg=getComputedStyle(el).backgroundColor;
  const m=(bg||'').match(/\d+(?:\.\d+)?/g);
  if(m&&m.length>=3)return '#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join('').toUpperCase();
 }
 return window.wadfunSelectedColor||'#E53935';
}
function syncSelectedColor(){
 const c=readColor();window.wadfunSelectedColor=c;
 [$('drawDot'),$('colorDot')].forEach(el=>{if(el){el.style.setProperty('background-color',c,'important');el.style.setProperty('background',c,'important');el.dataset.selectedColor=c;el.title='สีที่เลือก '+c}});
 document.querySelectorAll('.colorMini').forEach(el=>{el.style.setProperty('background-color',c,'important');el.style.setProperty('background',c,'important')});
 const btn=$('drawDot')?.closest('button');if(btn){btn.dataset.selectedColor=c;btn.setAttribute('aria-label','สีที่เลือก '+c)}
}
function sync(){
 const on=workspaceOn();
 document.documentElement.classList.toggle('wadfun-workspace',on);document.body.classList.toggle('wadfun-workspace',on);
 const top=document.querySelector('.top');if(top)top.style.display=on?'none':'';
 const app=document.querySelector('.app');if(app){app.style.maxWidth=on?'none':'';app.style.width=on?'100vw':'';app.style.padding=on?'0':'';app.style.margin=on?'0':''}
 ['draw','color'].forEach(id=>{
  const s=$(id);if(!s||!s.classList.contains('active'))return;
  const page=s.querySelector('.drawPage'),area=s.querySelector('.canvasArea'),view=s.querySelector('.canvasViewport'),layer=s.querySelector('.zoomLayer'),toolbar=s.querySelector('.toolbar');
  if(page){page.style.width='100%';page.style.height='calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))';page.style.minHeight='0';page.style.padding='4px';page.style.borderRadius='0';page.style.overflow='hidden'}
  if(toolbar){toolbar.style.position='sticky';toolbar.style.top='0';toolbar.style.zIndex='100';toolbar.style.flex='0 0 auto';toolbar.style.width='100%';toolbar.style.maxWidth='100%';toolbar.style.overflowX='auto';toolbar.style.overflowY='hidden';toolbar.style.background='linear-gradient(#fff,#edf9ff)'}
  if(area){area.style.width='100%';area.style.flex='1 1 auto';area.style.height='auto';area.style.minHeight='0';area.style.marginTop='4px';area.style.borderRadius='12px'}
  if(view){view.style.width='100%';view.style.height='100%'}
  if(layer){layer.style.width='100%';layer.style.height='100%';layer.style.display='flex';layer.style.alignItems='center';layer.style.justifyContent='center'}
 });
 syncSelectedColor();
}
function fitInitialCanvas(id,viewportId){
 const c=$(id),v=$(viewportId);if(!c||!v||c.dataset.fitted==='1')return;
 const r=v.getBoundingClientRect();if(r.width<50||r.height<50)return;
 const old=c.width&&c.height?c.toDataURL('image/png'):null,d=Math.min(devicePixelRatio||1,2);
 c.style.width=r.width+'px';c.style.height=r.height+'px';c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);c.dataset.fitted='1';
 if(old){const img=new Image();img.onload=()=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height)};img.src=old}
}
function fitAfterShow(){sync();requestAnimationFrame(()=>{sync();fitInitialCanvas('drawCanvas','drawViewport');fitInitialCanvas('colorCanvas','colorViewport')})}
function hookColorPicker(){
 if(typeof window.pickColor==='function'&&!window.pickColor.__wadfunV6){const old=window.pickColor;const wrapped=function(c){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV6=true;window.pickColor=wrapped}
 if(typeof window.setHue==='function'&&!window.setHue.__wadfunV6){const old=window.setHue;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV6=true;window.setHue=wrapped}
 if(typeof window.setShade==='function'&&!window.setShade.__wadfunV6){const old=window.setShade;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV6=true;window.setShade=wrapped}
}
window.addEventListener('resize',()=>{clearTimeout(window.__wadResize);window.__wadResize=setTimeout(sync,80)},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(sync,180),{passive:true});
window.addEventListener('pageshow',fitAfterShow,{passive:true});
const obs=new MutationObserver(()=>{sync();requestAnimationFrame(()=>{fitInitialCanvas('drawCanvas','drawViewport');fitInitialCanvas('colorCanvas','colorViewport')})});
obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
setInterval(()=>{hookColorPicker();syncSelectedColor()},150);
setTimeout(fitAfterShow,0);setTimeout(fitAfterShow,250);
window.wadfunResponsiveV6={sync,fitAfterShow,syncSelectedColor};
})();