/* Wadfun Workspace Fix V5 — compact toolbar + reliable finish/save */
(function(){
'use strict';
const style=document.createElement('style');
style.textContent=`
@media(max-width:650px){
  #color.active .toolbar,#draw.active .toolbar{
    flex-wrap:wrap!important;justify-content:center!important;align-content:center!important;
    overflow-x:hidden!important;overflow-y:visible!important;white-space:normal!important;
    gap:5px!important;padding:5px!important;
  }
  #color.active .toolbar .tb,#draw.active .toolbar .tb{min-width:46px!important;width:46px!important;height:46px!important;flex:0 0 46px!important}
  #color.active .toolbar .tb span,#draw.active .toolbar .tb span{font-size:8px!important;line-height:9px!important;max-width:44px;overflow:hidden}
  #color.active .toolbar .tb i,#draw.active .toolbar .tb i{font-size:20px!important;line-height:20px!important}
  #color.active .toolbar .sizeBox,#draw.active .toolbar .sizeBox{min-width:122px!important;width:122px!important;height:46px!important;flex:0 0 122px!important;padding:0 5px!important;gap:4px!important}
  #color.active .toolbar .sizeBox label,#draw.active .toolbar .sizeBox label{font-size:9px!important}
  #color.active .toolbar .sizeBox input,#draw.active .toolbar .sizeBox input{width:58px!important}
  #color.active .toolbar .sizeVal,#draw.active .toolbar .sizeVal{font-size:9px!important;min-width:34px!important;padding:4px!important}
  #color.active .canvasArea,#draw.active .canvasArea{margin-top:5px!important}
}
@media(min-width:651px){#color.active .toolbar,#draw.active .toolbar{overflow-x:auto;overflow-y:hidden}}
`;
document.head.appendChild(style);
function exportImage(c){
  const max=900,s=Math.min(1,max/Math.max(c.width,c.height)),w=Math.max(1,Math.round(c.width*s)),h=Math.max(1,Math.round(c.height*s));
  const out=document.createElement('canvas');out.width=w;out.height=h;const x=out.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(c,0,0,w,h);
  return out.toDataURL('image/jpeg',.84);
}
function install(){
  if(window.__wadfunFinishFixV5)return;
  if(typeof window.finishCanvas!=='function'||typeof window.saveCanvas!=='function')return;
  window.__wadfunFinishFixV5=true;
  window.saveCanvas=function(id,icon,name){
    const c=document.getElementById(id);if(!c)return null;
    try{if(id==='colorCanvas')window.wadfunRestoreColorTemplateWalls?.()}catch(e){}
    const img=exportImage(c);let works=[];try{works=JSON.parse(localStorage.getItem('wadfunWorks')||'[]')}catch(e){}
    const item={id:Date.now(),name:name||'ผลงานของฉัน',icon:icon||'🎨',img,date:new Date().toLocaleDateString('th-TH')};
    works.unshift(item);let kept=works.slice(0,30);
    try{localStorage.setItem('wadfunWorks',JSON.stringify(kept))}catch(e){
      kept=kept.slice(0,10);try{localStorage.setItem('wadfunWorks',JSON.stringify(kept))}catch(e2){kept=kept.slice(0,3);try{localStorage.setItem('wadfunWorks',JSON.stringify(kept))}catch(e3){}}
    }
    return img;
  };
  window.finishCanvas=function(id,icon,name){
    const c=document.getElementById(id);if(!c)return;
    const img=window.saveCanvas(id,icon,name)||c.toDataURL('image/jpeg',.82);
    const f=document.getElementById('finishImg');if(f)f.src=img;
    try{window.show?.('finish')}catch(e){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById('finish')?.classList.add('active')}
    window.scrollTo?.(0,0);
  };
}
const timer=setInterval(()=>{if(typeof window.finishCanvas==='function'&&typeof window.saveCanvas==='function'){install();clearInterval(timer)}},100);
setTimeout(install,500);
})();
