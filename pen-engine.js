/* Wadfun pen rendering engine V11 — physical material brush engine */
(function(){
'use strict';
function wadfunCurrentDrawColor(){return (typeof selectedColor==='string'&&selectedColor)||'#e53935'}
const strokeState=new WeakMap();
function reset(c){strokeState.delete(c)}
function seg(x,a,b){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}
function wadfunStrokePoint(c,x,p){const prev=strokeState.get(c)||p;const dx=p.x-prev.x,dy=p.y-prev.y,len=Math.max(1,Math.hypot(dx,dy));const base=(drawMode==='eraser'?eraserSize:drawSize)*Math.min(devicePixelRatio||1,2);const speed=Math.min(1,len/Math.max(1,base*1.6));const pressure=1-speed*.38;const shade=wadfunCurrentDrawColor();x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';x.lineCap='round';x.lineJoin='round';x.setLineDash([]);x.globalAlpha=1;
if(drawMode==='pencil'){const w=Math.max(1.2,base*.62*pressure);x.strokeStyle=shade;x.globalAlpha=.36;x.lineWidth=w;seg(x,prev,p);x.globalAlpha=.16;x.lineWidth=Math.max(1,w*.28);for(let i=0;i<2;i++){x.setLineDash([1.5,4+i]);seg(x,prev,p)}}
else if(drawMode==='crayon'){const w=Math.max(2,base*1.08);x.strokeStyle=shade;x.globalAlpha=.46;x.lineWidth=w;seg(x,prev,p);x.globalAlpha=.18;x.lineWidth=Math.max(1,w*.22);x.setLineDash([2,3]);seg(x,prev,p)}
else if(drawMode==='brush'){const w=Math.max(2,base*.82*(.78+.42*pressure));x.strokeStyle=shade;x.globalAlpha=.72;x.lineWidth=w;seg(x,prev,p);for(let i=-3;i<=3;i++){x.globalAlpha=.10;x.lineWidth=Math.max(.7,w*.10);x.beginPath();x.moveTo(prev.x-i,prev.y+i);x.lineTo(p.x-i,p.y+i);x.stroke()}}
else if(drawMode==='marker'){const w=Math.max(3,base*1.18);x.strokeStyle=shade;x.globalAlpha=.16;x.lineWidth=w*1.22;seg(x,prev,p);x.globalAlpha=.94;x.lineWidth=w;seg(x,prev,p);x.globalAlpha=.12;x.strokeStyle='#fff';x.lineWidth=Math.max(1,w*.12);seg(x,prev,p)}
else if(drawMode==='sparkle'){const w=Math.max(2,base*.72);x.strokeStyle=shade;x.globalAlpha=.62;x.lineWidth=w;seg(x,prev,p);const count=Math.max(1,Math.ceil(len/Math.max(4,base*.5)));for(let i=0;i<count;i++){const t=(i+.5)/count,px=prev.x+dx*t,py=prev.y+dy*t;if(Math.random()<.45){x.fillStyle=shade;x.globalAlpha=.48;x.beginPath();x.arc(px,py,Math.max(.8,base*.10),0,Math.PI*2);x.fill()}if(Math.random()<.12){x.strokeStyle='#fff';x.globalAlpha=.8;x.lineWidth=Math.max(1,base*.08);x.beginPath();x.moveTo(px-base*.22,py);x.lineTo(px+base*.22,py);x.moveTo(px,py-base*.22);x.lineTo(px,py+base*.22);x.stroke()}}}
else{x.strokeStyle=shade;x.lineWidth=base;seg(x,prev,p)}
strokeState.set(c,p);x.globalAlpha=1;x.setLineDash([]);x.globalCompositeOperation='source-over'}
function bindDraw(c,x){if(c.dataset.wadfunPenBound==='1')return;c.dataset.wadfunPenBound='1';c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){const st=typeof pinchMap!=='undefined'&&pinchMap.get(document.getElementById('drawViewport'));if(st&&st.touches&&st.touches.size)return}e.preventDefault();isDrawing=true;saveDrawState();c.setPointerCapture?.(e.pointerId);const p=pos(c,e);reset(c);wadfunStrokePoint(c,x,p)},{passive:false});c.addEventListener('pointermove',e=>{if(!isDrawing)return;e.preventDefault();wadfunStrokePoint(c,x,pos(c,e))},{passive:false});['pointerup','pointercancel','pointerleave'].forEach(t=>c.addEventListener(t,()=>{isDrawing=false;reset(c)}))}
window.wadfunStrokePoint=wadfunStrokePoint;window.wadfunResetStrokeState=reset;window.bindDraw=bindDraw;
})();
