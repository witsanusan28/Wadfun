/* Wadfun Color Line Lock V2 — keep original template walls in the actual saved canvas */
(function(){
'use strict';
let snap=null,w=0,h=0;
function capture(){
  const c=document.getElementById('colorCanvas');
  if(!c||!c.width||!c.height)return;
  const ctx=c.getContext('2d',{willReadFrequently:true});
  const im=ctx.getImageData(0,0,c.width,c.height);
  const d=im.data;
  snap=im;w=c.width;h=c.height;
}
function restore(){
  const c=document.getElementById('colorCanvas');
  if(!c||!snap||w!==c.width||h!==c.height)return;
  const ctx=c.getContext('2d',{willReadFrequently:true});
  const cur=ctx.getImageData(0,0,w,h),d=cur.data,s=snap.data;
  for(let i=0,q=0;i<d.length;i+=4,q++){
    const lum=.299*s[i]+.587*s[i+1]+.114*s[i+2];
    if(s[i+3]>=18&&lum<205){d[i]=s[i];d[i+1]=s[i+1];d[i+2]=s[i+2];d[i+3]=s[i+3]}
  }
  ctx.putImageData(cur,0,0);
}
window.wadfunColorTemplateChanged=capture;
window.wadfunRestoreColorTemplateWalls=restore;
window.wadfunGetColorTemplateSnapshot=function(){return snap};
function patch(){
  if(window.__wadfunColorLineLock)return;
  window.__wadfunColorLineLock=true;
  const oldFinish=window.finishCanvas;
  if(typeof oldFinish==='function'){
    window.finishCanvas=function(){
      restore();
      return oldFinish.apply(this,arguments);
    };
  }
  const oldSave=window.saveCanvas;
  if(typeof oldSave==='function'){
    window.saveCanvas=function(id,icon,name){
      if(id==='colorCanvas')restore();
      return oldSave.apply(this,arguments);
    };
  }
}
function boot(){
  patch();
  const timer=setInterval(()=>{
    patch();
    const c=document.getElementById('colorCanvas');
    if(c&&document.getElementById('color')?.classList.contains('active')&&!snap){capture()}
    if(window.__wadfunColorLineLock&&snap)clearInterval(timer);
  },100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pointerup',()=>{if(document.getElementById('color')?.classList.contains('active'))setTimeout(restore,0)},{capture:true});
window.addEventListener('touchend',()=>{if(document.getElementById('color')?.classList.contains('active'))setTimeout(restore,0)},{capture:true,passive:true});
})();
