/* Wadfun Pen Engine V11
   1 นิ้ว = วาด / 2 นิ้ว = ซูม
   ใช้ viewport เป็นตัวรับ touch เพื่อไม่ให้ canvas/overlay แย่ง event กัน
*/
(function(){
'use strict';

function point(c,x,y){
 const r=c.getBoundingClientRect();
 return {x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height};
}
function color(){
 const el=document.getElementById('drawDot')||document.getElementById('colorDot');
 const m=el&&getComputedStyle(el).backgroundColor.match(/\d+(?:\.\d+)?/g);
 return m&&m.length>=3?'#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join(''):'#e53935';
}
function stroke(ctx,p){
 const mode=typeof drawMode!=='undefined'?drawMode:'pencil';
 const size=mode==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof drawSize!=='undefined'?drawSize:8);
 const base=size*Math.min(devicePixelRatio||1,2);
 ctx.globalCompositeOperation=mode==='eraser'?'destination-out':'source-over';
 ctx.globalAlpha=mode==='pencil'?.72:mode==='crayon'?.55:mode==='brush'?.9:mode==='marker'?.96:mode==='sparkle'?.7:1;
 ctx.strokeStyle=color();
 ctx.lineWidth=Math.max(1.5,base*(mode==='crayon'?1.05:mode==='brush'?.9:mode==='marker'?1.18:.72));
 ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();
}
function finish(ctx){ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.setLineDash([])}

function installDraw(){
 const c=document.getElementById('drawCanvas'),v=document.getElementById('drawViewport'),z=document.getElementById('drawZoom');
 if(!c||!v||!z||c.dataset.penV11)return false;
 c.dataset.penV11='1';
 const ctx=c.getContext('2d');
 let drawing=false,last=null,touchId=null;
 function begin(x,y){
  if(typeof saveDrawState==='function')saveDrawState();
  drawing=true;last=point(c,x,y);ctx.beginPath();ctx.moveTo(last.x,last.y);
 }
 function move(x,y){if(!drawing)return;const p=point(c,x,y);stroke(ctx,p);last=p}
 function end(){if(!drawing)return;drawing=false;last=null;touchId=null;finish(ctx)}

 // Finger drawing is handled on the viewport, not the canvas itself.
 v.addEventListener('touchstart',e=>{
  if(e.touches.length!==1){end();return}
  const t=e.touches[0];touchId=t.identifier;e.preventDefault();begin(t.clientX,t.clientY);
 },{passive:false,capture:true});
 v.addEventListener('touchmove',e=>{
  if(e.touches.length!==1||touchId===null){if(e.touches.length>1)end();return}
  const t=[...e.touches].find(x=>x.identifier===touchId);if(!t)return;
  e.preventDefault();move(t.clientX,t.clientY);
 },{passive:false,capture:true});
 v.addEventListener('touchend',e=>{e.preventDefault();end()},{passive:false,capture:true});
 v.addEventListener('touchcancel',end,{passive:false,capture:true});

 // Mouse / Apple Pencil / stylus use Pointer Events.
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();begin(e.clientX,e.clientY)},true);
 c.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!drawing)return;e.preventDefault();move(e.clientX,e.clientY)},{passive:false});
 c.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')end()});
 c.addEventListener('pointercancel',e=>{if(e.pointerType!=='touch')end()});
 installPinch(v,z,'draw');
 return true;
}

function installPinch(view,layer,type){
 if(!view||!layer||view.dataset.pinchV11)return;
 view.dataset.pinchV11='1';
 let scale=type==='draw'?(Number(window.scaleDraw)||1):(Number(window.scaleColor)||1);
 let startDist=0,startScale=scale,active=false;
 const touches=[];
 function sync(e){touches.length=0;for(const t of e.touches)touches.push({x:t.clientX,y:t.clientY})}
 function dist(){return touches.length<2?0:Math.hypot(touches[0].x-touches[1].x,touches[0].y-touches[1].y)}
 function apply(s){scale=Math.max(1,Math.min(3,s));layer.style.transform=`scale(${scale})`;if(type==='draw')window.scaleDraw=scale;else window.scaleColor=scale;window.wadfunZoomUI?.update(type,scale)}
 view.addEventListener('touchstart',e=>{sync(e);if(touches.length===2){startDist=dist();startScale=scale;active=true;e.preventDefault()}},{passive:false});
 view.addEventListener('touchmove',e=>{sync(e);if(touches.length===2&&active&&startDist){const d=dist();if(d){apply(startScale*d/startDist);e.preventDefault()}}},{passive:false});
 function end(e){sync(e);if(touches.length<2){startDist=0;active=false}}
 view.addEventListener('touchend',end,{passive:false});view.addEventListener('touchcancel',end,{passive:false});
}
window.pinchZoom=installPinch;

window.wadfunBindTapCanvas=function(c,view,layer,type,onTap){
 if(!c||!view||!layer||c.dataset.wadfunTapV11)return;
 c.dataset.wadfunTapV11='1';
 installPinch(view,layer,type);
 let sx=0,sy=0,active=false,multi=false;
 c.addEventListener('touchstart',e=>{if(e.touches.length!==1){active=false;multi=true;return}const t=e.touches[0];sx=t.clientX;sy=t.clientY;active=true;multi=false;e.preventDefault()},{passive:false});
 c.addEventListener('touchmove',e=>{if(e.touches.length!==1){active=false;multi=true;return}const t=e.touches[0];if(Math.hypot(t.clientX-sx,t.clientY-sy)>12)active=false},{passive:false});
 c.addEventListener('touchend',e=>{const t=e.changedTouches[0];const ok=active&&!multi&&t&&Math.hypot(t.clientX-sx,t.clientY-sy)<=12;active=false;if(ok)onTap(t.clientX,t.clientY)},{passive:false});
 c.addEventListener('touchcancel',()=>{active=false;multi=true},{passive:false});
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();onTap(e.clientX,e.clientY)},true);
};

const timer=setInterval(()=>{if(installDraw())clearInterval(timer)},100);
})();
