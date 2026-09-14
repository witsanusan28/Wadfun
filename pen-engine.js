/* Wadfun pen rendering engine V13 — material-first brush engine */
(function(){
'use strict';
const strokeState=new WeakMap();
function color(){return(typeof selectedColor==='string'&&selectedColor)||'#e53935'}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function noise(n){const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)}
function reset(c){strokeState.delete(c)}
function seg(ctx,a,b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
function dab(ctx,p,r,a){ctx.globalAlpha=a;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill()}
function drawMaterial(c,ctx,p){
 const s=strokeState.get(c)||{p:{x:p.x,y:p.y},dist:0,seed:Math.random()*1e5};
 const a=s.p,dx=p.x-a.x,dy=p.y-a.y,len=Math.max(.001,Math.hypot(dx,dy));
 const scale=Math.min(devicePixelRatio||1,2),base=(drawMode==='eraser'?eraserSize:drawSize)*scale;
 const eventPressure=typeof p.pressure==='number'&&p.pressure>0?p.pressure:.5;
 const speed=Math.min(1,len/Math.max(1,base*2));
 const pressure=clamp(.55+eventPressure*.45-speed*.18,.35,1);
 const nX=-dy/len,nY=dx/len,shade=color();
 ctx.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
 ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash([]);ctx.globalAlpha=1;ctx.fillStyle=shade;ctx.strokeStyle=shade;
 if(drawMode==='pencil'){
   const w=Math.max(1.1,base*.58*(.72+.45*pressure));
   ctx.lineWidth=w;ctx.globalAlpha=.42+.18*pressure;seg(ctx,a,p);
   const passes=3;
   for(let k=0;k<passes;k++){
     const off=(noise(s.seed+s.dist+k*19)-.5)*w*.9;
     ctx.lineWidth=Math.max(.45,w*(.10+.04*noise(s.seed+k*7)));
     ctx.globalAlpha=.07+.08*noise(s.seed+s.dist+k*3);
     ctx.beginPath();ctx.moveTo(a.x+nX*off,a.y+nY*off);ctx.lineTo(p.x+nX*off,p.y+nY*off);ctx.stroke();
   }
 }else if(drawMode==='crayon'){
   const w=Math.max(2,base*1.08*(.9+.12*pressure));
   ctx.lineWidth=w;ctx.globalAlpha=.34+.12*pressure;seg(ctx,a,p);
   for(let k=0;k<5;k++){
     const off=(noise(s.seed+s.dist+k*11)-.5)*w*.9;
     const jitter=(noise(s.seed+s.dist+k*17)-.5)*w*.22;
     ctx.lineWidth=Math.max(.8,w*(.08+.07*noise(s.seed+k)));ctx.globalAlpha=.045+.045*noise(s.seed+s.dist+k);
     ctx.beginPath();ctx.moveTo(a.x+nX*off+dx*.08,a.y+nY*off+dy*.08);ctx.lineTo(p.x+nX*off+jitter,p.y+nY*off+jitter);ctx.stroke();
   }
 }else if(drawMode==='brush'){
   const w=Math.max(2,base*(.68+.55*pressure));
   ctx.lineWidth=w;ctx.globalAlpha=.62+.18*pressure;seg(ctx,a,p);
   for(let k=-4;k<=4;k++){
     const t=k/4,off=t*w*.34,wig=(noise(s.seed+s.dist+k*23)-.5)*w*.12;
     ctx.lineWidth=Math.max(.55,w*(.035+.045*(1-Math.abs(t))));ctx.globalAlpha=.045+.055*(1-Math.abs(t));
     ctx.beginPath();ctx.moveTo(a.x+nX*off+dx*.03,a.y+nY*off+dy*.03);ctx.lineTo(p.x+nX*(off+wig),p.y+nY*(off+wig));ctx.stroke();
   }
 }else if(drawMode==='marker'){
   const w=Math.max(3,base*1.16);
   ctx.lineWidth=w*1.16;ctx.globalAlpha=.10;seg(ctx,a,p);
   ctx.lineWidth=w;ctx.globalAlpha=.88;seg(ctx,a,p);
   ctx.lineWidth=Math.max(1,w*.10);ctx.globalAlpha=.10;ctx.strokeStyle='#fff';
   ctx.beginPath();ctx.moveTo(a.x+nX*w*.20,a.y+nY*w*.20);ctx.lineTo(p.x+nX*w*.20,p.y+nY*w*.20);ctx.stroke();
 }else if(drawMode==='sparkle'){
   const w=Math.max(2,base*.72);ctx.lineWidth=w;ctx.globalAlpha=.72;seg(ctx,a,p);
   const every=Math.max(70,base*7),from=s.dist,to=s.dist+len;
   if(Math.floor(to/every)>Math.floor(from/every)){
     const d=(Math.floor(to/every)+.5)*every, t=clamp((d-from)/len,0,1),px=a.x+dx*t,py=a.y+dy*t,sx=base*.34;
     ctx.strokeStyle='#fff';ctx.globalAlpha=.88;ctx.lineWidth=Math.max(1,base*.075);ctx.beginPath();ctx.moveTo(px-sx,py);ctx.lineTo(px+sx,py);ctx.moveTo(px,py-sx);ctx.lineTo(px,py+sx);ctx.stroke();
     ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(px,py,base*.16,0,Math.PI*2);ctx.fill();
   }
 }else{
   ctx.lineWidth=base;ctx.globalAlpha=1;seg(ctx,a,p);
 }
 s.p={x:p.x,y:p.y};s.dist+=len;strokeState.set(c,s);
 ctx.globalAlpha=1;ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalCompositeOperation='source-over';
}
function bindDraw(c,ctx){
 if(!c||c.dataset.wadfunPenBound==='1')return;c.dataset.wadfunPenBound='1';
 const end=e=>{if(e&&e.pointerId!=null&&c.hasPointerCapture?.(e.pointerId)){try{c.releasePointerCapture(e.pointerId)}catch(_){}}isDrawing=false;reset(c)};
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){const st=typeof pinchMap!=='undefined'&&pinchMap.get(document.getElementById('drawViewport'));if(st&&st.touches&&st.touches.size)return}e.preventDefault();isDrawing=true;saveDrawState();try{c.setPointerCapture(e.pointerId)}catch(_){}const q=pos(c,e);q.pressure=e.pressure;reset(c);drawMaterial(c,ctx,q)},{passive:false});
 c.addEventListener('pointermove',e=>{if(!isDrawing)return;e.preventDefault();const q=pos(c,e);q.pressure=e.pressure;drawMaterial(c,ctx,q)},{passive:false});
 c.addEventListener('pointerup',end,{passive:false});c.addEventListener('pointercancel',end,{passive:false});c.addEventListener('lostpointercapture',end,{passive:true});window.addEventListener('blur',()=>end(),{passive:true});
}
window.wadfunStrokePoint=drawMaterial;window.wadfunResetStrokeState=reset;window.bindDraw=bindDraw;
})();
