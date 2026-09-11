/* Wadfun Circle Test Template — Color mode only */
(function(){
  'use strict';
  function drawCircleTemplate(){
    const c=document.getElementById('colorCanvas');
    if(!c || !document.getElementById('color')?.classList.contains('active')) return;
    const parent=c.parentElement;
    if(parent){
      const r=parent.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
      if(r.width>10&&r.height>10){
        c.style.width=r.width+'px';
        c.style.height=r.height+'px';
        c.width=Math.round(r.width*d);
        c.height=Math.round(r.height*d);
      }
    }
    const x=c.getContext('2d');if(!x||!c.width||!c.height)return;
    x.setTransform(1,0,0,1,0,0);
    x.globalAlpha=1;
    x.globalCompositeOperation='source-over';
    x.clearRect(0,0,c.width,c.height);
    x.fillStyle='#fff';
    x.fillRect(0,0,c.width,c.height);
    const pad=Math.min(c.width,c.height)*0.13,cx=c.width/2,cy=c.height/2,radius=Math.max(20,Math.min(c.width,c.height)/2-pad);
    x.beginPath();
    x.arc(cx,cy,radius,0,Math.PI*2);
    x.strokeStyle='#111';
    x.lineWidth=Math.max(6,Math.min(c.width,c.height)*0.012);
    x.lineCap='round';
    x.stroke();
    window.wadfunResetColorMask?.();
    window.wadfunColorTemplateChanged?.();
  }
  function isRestartTarget(el){
    if(!el)return false;
    const b=el.closest('button,[role="button"]');
    if(!b)return false;
    const text=(b.textContent||'').replace(/\s+/g,'').trim();
    return text.includes('เริ่มใหม่')||text.includes('เริ่มต้นใหม่')||text.includes('เริ่มใหม่อีกครั้ง');
  }
  function redrawAfterRestart(){
    // Redraw immediately first so the old sample image can never flash.
    drawCircleTemplate();
    // Keep a couple of delayed redraws for any layout/canvas resize caused by the original UI.
    [60,180,400].forEach(ms=>setTimeout(drawCircleTemplate,ms));
  }
  function install(){
    if(window.__wadfunCircleTemplateInstalled)return;
    window.__wadfunCircleTemplateInstalled=true;
    const wrap=name=>{
      const original=window[name];
      if(typeof original!=='function')return false;
      window[name]=function(){
        const result=original.apply(this,arguments);
        if(name==='show'&&arguments[0]==='color')redrawAfterRestart();
        return result;
      };
      return true;
    };
    wrap('show');
    wrap('initColor');

    // Color reset is handled synchronously to prevent the old template from flashing.
    const originalReset=window.resetColor;
    if(typeof originalReset==='function'){
      window.resetColor=function(){
        if(document.getElementById('color')?.classList.contains('active')){
          redrawAfterRestart();
          return;
        }
        return originalReset.apply(this,arguments);
      };
    }

    document.addEventListener('click',function(e){
      if(isRestartTarget(e.target))redrawAfterRestart();
    },true);

    const color=document.getElementById('color');
    if(color)new MutationObserver(()=>{
      if(color.classList.contains('active'))drawCircleTemplate();
    }).observe(color,{attributes:true,attributeFilter:['class']});

    window.addEventListener('resize',()=>{
      if(document.getElementById('color')?.classList.contains('active'))setTimeout(drawCircleTemplate,80);
    },{passive:true});
    window.wadfunDrawCircleTemplate=drawCircleTemplate;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
