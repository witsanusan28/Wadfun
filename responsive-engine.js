/* Wadfun Responsive Workspace V4 — true edge-to-edge drawing */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function workspaceOn(){return $('draw')?.classList.contains('active')||$('color')?.classList.contains('active')}
function sync(){
 const on=workspaceOn();
 document.documentElement.classList.toggle('wadfun-workspace',on);
 document.body.classList.toggle('wadfun-workspace',on);
 const top=document.querySelector('.top');if(top)top.style.display=on?'none':'';
 const app=document.querySelector('.app');if(app){app.style.maxWidth=on?'none':'';app.style.width=on?'100%':'';app.style.padding=on?'0':'';app.style.margin=on?'0':''}
 ['draw','color'].forEach(id=>{
  const s=$(id);if(!s||!s.classList.contains('active'))return;
  s.style.position='fixed';s.style.inset='0';s.style.width='100vw';s.style.height='100dvh';s.style.minHeight='0';s.style.margin='0';s.style.padding='0';s.style.zIndex='10';s.style.overflow='hidden';
  const page=s.querySelector('.drawPage'),area=s.querySelector('.canvasArea'),view=s.querySelector('.canvasViewport');
  if(page){page.style.width='100%';page.style.height='100%';page.style.minHeight='0';page.style.display='flex';page.style.flexDirection='column';page.style.padding='max(4px,env(safe-area-inset-top)) max(4px,env(safe-area-inset-right)) max(4px,env(safe-area-inset-bottom)) max(4px,env(safe-area-inset-left))';page.style.borderRadius='0'}
  if(area){area.style.width='100%';area.style.flex='1 1 auto';area.style.height='auto';area.style.minHeight='0';area.style.marginTop='4px'}
  if(view){view.style.width='100%';view.style.height='100%'}
 });
}
function resizeCanvases(){['drawCanvas','colorCanvas'].forEach(id=>{const c=$(id);if(c){c.style.maxWidth='100%';c.style.maxHeight='100%'}});sync()}
const obs=new MutationObserver(sync);obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
window.addEventListener('resize',()=>{clearTimeout(window.__wadResize);window.__wadResize=setTimeout(resizeCanvases,50)},{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(resizeCanvases,120),{passive:true});
window.addEventListener('pageshow',sync,{passive:true});
const timer=setInterval(()=>{if($('draw')||$('color')){sync();clearInterval(timer)}},80);
window.wadfunResponsiveV4={sync,resizeCanvases};
})();
