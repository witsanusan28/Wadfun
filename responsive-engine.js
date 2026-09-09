/* Wadfun Responsive Workspace V3 */
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
 if(app) app.style.padding=on?'0':'';
 ['draw','color'].forEach(id=>{
  const s=$(id); if(!s||!s.classList.contains('active'))return;
  const page=s.querySelector('.drawPage'), area=s.querySelector('.canvasArea'), view=s.querySelector('.canvasViewport');
  if(page) page.style.height='calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))';
  if(area) area.style.flex='1 1 auto';
  if(view) view.style.width='100%';
 });
}
function resizeCanvases(){
 ['drawCanvas','colorCanvas'].forEach(id=>{
  const c=$(id);if(!c)return;
  const r=c.parentElement?.getBoundingClientRect();if(!r||r.width<10||r.height<10)return;
  /* Keep the visible canvas fluid; do not rewrite backing pixels while artwork is active. */
  c.style.maxWidth='100%';c.style.maxHeight='100%';
 });
 sync();
}
const obs=new MutationObserver(sync);obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
window.addEventListener('resize',()=>{clearTimeout(window.__wadResize);window.__wadResize=setTimeout(resizeCanvases,80)},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(resizeCanvases,180),{passive:true});
window.addEventListener('pageshow',sync,{passive:true});
const timer=setInterval(()=>{if($('draw')||$('color')){sync();clearInterval(timer)}},100);
window.wadfunResponsiveV3={sync,resizeCanvases};
})();
