/* Wadfun Pen Engine V10
   ระบบสัมผัสใหม่: 1 นิ้ว = วาด, 2 นิ้ว = ซูม
   ไม่มี pointer capture สำหรับนิ้ว และไม่มี dependency จากตัวแปรภายนอกที่ทำให้ engine ล้ม
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
 const base=((mode==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof drawSize!=='undefined'?drawSize:8)))*Math.min(devicePixelRatio||1,2);
 ctx.globalCompositeOperation=mode==='eraser'?'destination-out':'source-over';
 ctx.globalAlpha=mode==='pencil'?.72:mode==='crayon'?.55:mode==='brush'?.9:mode==='marker'?.96:mode==='sparkle'?.7:1;
 ctx.strokeStyle=color();
 ctx.lineWidth=Math.max(1.5,base*(mode==='crayon'?1.05:mode==='brush'?.9:mode==='marker'?1.18:.72));
 ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();
}
function finish(ctx){ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.setLineDash([])}

function installDraw(){
 const c=document.getElementById('drawCanvas'),v=document.getElementById('drawViewport'),z=document.getElementById('drawZoom');
 if(!c||!v||!z||c.dataset.penV10)return false;c.dataset.penV10='1';
 const ctx=c.getContext('2d');let drawing=false,lastTouch=null;
 function begin(x,y){
  if(typeof saveDrawState==='function')saveDrawState();
  drawing=true;lastTouch=point(c,x,y);ctx.beginPath();ctx.moveTo(lastTouch.x,lastTouch.y);
 }
 function move(x,y){if(!drawing)return;const p=point(c,x,y);stroke(ctx,p);lastTouch=p}
 function end(){if(!drawing)return;drawing=false;lastTouch=null;finish(ctx)}
 c.addEventListener('touchstart',e=>{
  if(e.touches.length!==1){end();return}
  const t=e.touches[0];e.preventDefault();begin(t.clientX,t.clientY);
 },{passive:false});
 c.addEventListener('touchmove',e=>{
  if(e.touches.length!==1){end();return}
  const t=e.touches[0];e.preventDefault();move(t.clientX,t.clientY);
 },{passive:false});
 c.addEventListener('touchend',e=>{e.preventDefault();end()},{passive:false});
 c.addEventListener('touchcancel',end,{passive:false});
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();begin(e.clientX,e.clientY)},true);
 c.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;if(drawing){e.preventDefault();move(e.clientX,e.clientY)}},{passive:false});
 c.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')end()});
 c.addEventListener('pointercancel',e=>{if(e.pointerType!=='touch')end()});
 installPinch(v,z,'draw');
 return true;
}

function installPinch(view,layer,type){
 if(!view||!layer||view.dataset.pinchV10)return;view.dataset.pinchV10='1';
 let scale=1,startDist=0,startScale=1,active=false;
 const distance=()=>{const a=[...activeTouches];return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
 const activeTouches=[];
 const sync=e=>{activeTouches.length=0;for(const t of e.touches)activeTouches.push({x:t.clientX,y:t.clientY})};
 const apply=s=>{scale=Math.max(1,Math.min(3,s));layer.style.transform=`scale(${scale})`;if(type==='draw')window.scaleDraw=scale;else window.scaleColor=scale;window.wadfunZoomUI?.update(type,scale)};
 view.addEventListener('touchstart',e=>{sync(e);if(activeTouches.length===2){startDist=distance();startScale=scale;active=true;e.preventDefault()}},{passive:false});
 view.addEventListener('touchmove',e=>{sync(e);if(activeTouches.length===2&&active&&startDist){const d=distance();if(d){apply(startScale*d/startDist);e.preventDefault()}}},{passive:false});
 const end=e=>{sync(e);if(activeTouches.length<2){startDist=0;active=false}};
 view.addEventListener('touchend',end,{passive:false});view.addEventListener('touchcancel',end,{passive:false});
}

window.pinchZoom=installPinch;
window.wadfunBindTapCanvas=function(c,view,layer,type,onTap){
 if(!c||!view||!layer||c.dataset.wadfunTapV10)return;c.dataset.wadfunTapV10='1';
 installPinch(view,layer,type);
 let sx=0,sy=0,active=false,multi=false;
 c.addEventListener('touchstart',e=>{if(e.touches.length!==1){active=false;multi=true;return}const t=e.touches[0];sx=t.clientX;sy=t.clientY;active=true;multi=false;e.preventDefault()},{passive:false});
 c.addEventListener('touchmove',e=>{if(e.touches.length!==1){active=false;multi=true;return}const t=e.touches[0];if(Math.hypot(t.clientX-sx,t.clientY-sy)>12)active=false},{passive:false});
 c.addEventListener('touchend',e=>{const t=e.changedTouches[0];const ok=active&&!multi&&t&&Math.hypot(t.clientX-sx,t.clientY-sy)<=12;active=false;if(ok)onTap(t.clientX,t.clientY)},{passive:false});
 c.addEventListener('touchcancel',()=>{active=false;multi=true},{passive:false});
 c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();onTap(e.clientX,e.clientY)},true);
};

const timer=setInterval(()=>{if(document.getElementById('drawCanvas')&&installDraw())clearInterval(timer)},100);
})();
