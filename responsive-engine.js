/* Wadfun Responsive Workspace V5 — true edge-to-edge on first open */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function workspaceOn(){return $('draw')?.classList.contains('active')||$('color')?.classList.contains('active')}
function sync(){
 const on=workspaceOn();
 document.documentElement.classList.toggle('wadfun-workspace',on);
 document.body.classList.toggle('wadfun-workspace',on);
 const top=document.querySelector('.top');
 if(top) top.style.display=on?'none':'';
 const app=document.querySelector('.app');
 if(app){app.style.maxWidth=on?'none':'';app.style.width=on?'100vw':'';app.style.padding=on?'0':'';app.style.margin=on?'0':''}
 ['draw','color'].forEach(id=>{
  const s=$(id); if(!s||!s.classList.contains('active'))return;
  const page=s.querySelector('.drawPage'),area=s.querySelector('.canvasArea'),view=s.querySelector('.canvasViewport'),layer=s.querySelector('.zoomLayer');
  if(page){page.style.width='100%';page.style.height='calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))';page.style.minHeight='0';page.style.padding='4px';page.style.borderRadius='0'}
  if(area){area.style.width='100%';area.style.flex='1 1 auto';area.style.height='auto';area.style.minHeight='0';area.style.marginTop='4px';area.style.borderRadius='12px'}
  if(view){view.style.width='100%';view.style.height='100%'}
  if(layer){layer.style.width='100%';layer.style.height='100%';layer.style.display='flex';layer.style.alignItems='center';layer.style.justifyContent='center'}
 });
}
function fitInitialCanvas(id,viewportId){
 const c=$(id),v=$(viewportId);if(!c||!v||c.dataset.fitted==='1')return;
 const r=v.getBoundingClientRect();if(r.width<50||r.height<50)return;
 const old=c.width&&c.height?c.toDataURL('image/png'):null;
 const d=Math.min(devicePixelRatio||1,2);
 c.style.width=r.width+'px';c.style.height=r.height+'px';
 c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);
 c.dataset.fitted='1';
 if(old){const img=new Image();img.onload=()=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height)};img.src=old}
}
function fitAfterShow(){
 sync();
 requestAnimationFrame(()=>{
  sync();
  fitInitialCanvas('drawCanvas','drawViewport');
  fitInitialCanvas('colorCanvas','colorViewport');
 });
}
window.addEventListener('resize',()=>{clearTimeout(window.__wadResize);window.__wadResize=setTimeout(sync,80)},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(sync,180),{passive:true});
window.addEventListener('pageshow',fitAfterShow,{passive:true});
const obs=new MutationObserver(()=>{sync();requestAnimationFrame(()=>{fitInitialCanvas('drawCanvas','drawViewport');fitInitialCanvas('colorCanvas','colorViewport')})});
obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
const timer=setInterval(()=>{if($('draw')||$('color')){fitAfterShow();clearInterval(timer)}},100);
window.wadfunResponsiveV5={sync,fitAfterShow};
})();
