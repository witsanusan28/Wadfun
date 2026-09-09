/* Wadfun Color Engine V11 — Color mode freehand on viewport; Draw mode untouched */
(function(){
'use strict';
const EDGE_LUMA=205,MIN_ALPHA=18;
function luma(r,g,b){return .299*r+.587*g+.114*b}
function wall(d,i){return d[i+3]<MIN_ALPHA||luma(d[i],d[i+1],d[i+2])<EDGE_LUMA}
function rgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function point(c,x,y){const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}}
let wallMask=null,maskW=0,maskH=0;
function resetMask(){wallMask=null;maskW=maskH=0}
function ensureMask(c,src){if(wallMask&&maskW===c.width&&maskH===c.height)return;const n=c.width*c.height;wallMask=new Uint8Array(n);maskW=c.width;maskH=c.height;for(let q=0,i=0;q<n;q++,i+=4)wallMask[q]=wall(src,i)?1:0}
function fill(c,x,y,hex){const ctx=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;if(!w||!h)return false;x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const im=ctx.getImageData(0,0,w,h),d=im.data;ensureMask(c,d);const start=y*w+x;if(wallMask[start])return false;const p=rgb(hex),seen=new Uint8Array(w*h),stack=[start];let changed=false;while(stack.length){const q=stack.pop();if(q<0||q>=w*h||seen[q]||wallMask[q])continue;seen[q]=1;const i=q*4;if(d[i]!==p[0]||d[i+1]!==p[1]||d[i+2]!==p[2]||d[i+3]!==255)changed=true;d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;const qx=q%w;if(qx)stack.push(q-1);if(qx<w-1)stack.push(q+1);if(q>=w)stack.push(q-w);if(q<w*(h-1))stack.push(q+w)}if(changed)ctx.putImageData(im,0,0);return changed}
function selectedColor(){const e=document.getElementById('colorDot'),m=(e?getComputedStyle(e).backgroundColor:'').match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
function mode(){if(document.getElementById('colorPenBtn')?.classList.contains('on'))return'pen';if(document.getElementById('colorEraseBtn')?.classList.contains('on'))return'eraser';return'bucket'}
function saveUndo(c){if(typeof colorUndo!=='undefined'){colorUndo.push(c.toDataURL());if(colorUndo.length>30)colorUndo.shift()}}
function install(){
 const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');
 if(!c||!v||!z||c.dataset.colorV11)return false;
 c.dataset.colorV11='1';
 if(window.wadfunBindTapCanvas)window.wadfunBindTapCanvas(c,v,z,'color',(x,y)=>{if(mode()!=='bucket')return;const before=c.toDataURL(),p=point(c,x,y);if(fill(c,p.x,p.y,selectedColor())&&typeof colorUndo!=='undefined'){colorUndo.push(before);if(colorUndo.length>30)colorUndo.shift()}});
 let active=false,id=null,ctx=null;
 function start(x,y,pointerId){if(mode()==='bucket')return false;ctx=ctx||c.getContext('2d');saveUndo(c);const p=point(c,x,y),m=mode(),size=m==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof colorBrushSize!=='undefined'?colorBrushSize:22);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.strokeStyle=m==='eraser'?'#fff':selectedColor();ctx.lineWidth=size*Math.min(devicePixelRatio||1,2);ctx.fillStyle=ctx.strokeStyle;ctx.arc(p.x,p.y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(p.x,p.y);active=true;id=pointerId}
 function move(x,y){if(!active||!ctx)return;const p=point(c,x,y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y)}
 function end(){if(!active)return;active=false;id=null;if(ctx){ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
 v.addEventListener('pointerdown',e=>{if(mode()==='bucket')return;if(active)return;e.preventDefault();e.stopPropagation();start(e.clientX,e.clientY,e.pointerId)},true);
 v.addEventListener('pointermove',e=>{if(!active||e.pointerId!==id)return;e.preventDefault();e.stopPropagation();move(e.clientX,e.clientY)},true);
 v.addEventListener('pointerup',e=>{if(e.pointerId===id){e.preventDefault();e.stopPropagation();end()}},true);
 v.addEventListener('pointercancel',e=>{if(e.pointerId===id)end()},true);
 v.addEventListener('pointerdown',e=>{if(mode()!=='bucket'&&active&&e.pointerId!==id)end()},true);
 return true;
}
const timer=setInterval(()=>{if(install())clearInterval(timer)},100);
window.wadfunFillRegionV11=fill;
window.wadfunResetColorMask=resetMask;
})();
