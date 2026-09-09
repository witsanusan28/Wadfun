/* Wadfun Color Engine V12 — separate paint layer + protected original line art. Draw mode untouched. */
(function(){
'use strict';
const LINE_LUMA=248,MIN_ALPHA=18;
function luma(r,g,b){return .299*r+.587*g+.114*b}
function point(c,x,y){const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}}
function rgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function mode(){if(document.getElementById('colorPenBtn')?.classList.contains('on'))return'pen';if(document.getElementById('colorEraseBtn')?.classList.contains('on'))return'eraser';return'bucket'}
function selectedColor(){const e=document.getElementById('colorDot'),m=(e?getComputedStyle(e).backgroundColor:'').match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
let base=null,lineCanvas=null,lineCtx=null,paintCanvas=null,paintCtx=null,allowCanvas=null,allowCtx=null,mask=null,mw=0,mh=0,ready=false;
function isLine(d,i){return d[i+3]>=MIN_ALPHA&&luma(d[i],d[i+1],d[i+2])<LINE_LUMA}
function build(c){if(!c.width||!c.height)return false;const n=c.width*c.height,src=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,c.width,c.height);base=src;mw=c.width;mh=c.height;mask=new Uint8Array(n);lineCanvas=document.createElement('canvas');lineCanvas.width=c.width;lineCanvas.height=c.height;lineCtx=lineCanvas.getContext('2d');const ld=lineCtx.createImageData(c.width,c.height);const a=document.createElement('canvas');a.width=c.width;a.height=c.height;allowCanvas=a;allowCtx=a.getContext('2d');const ad=allowCtx.createImageData(c.width,c.height);for(let q=0,i=0;q<n;q++,i+=4){if(isLine(src.data,i)){mask[q]=1;ld.data[i]=src.data[i];ld.data[i+1]=src.data[i+1];ld.data[i+2]=src.data[i+2];ld.data[i+3]=src.data[i+3];ad.data[i+3]=0}else ad.data[i+3]=255}lineCtx.putImageData(ld,0,0);allowCtx.putImageData(ad,0,0);paintCanvas=document.createElement('canvas');paintCanvas.width=c.width;paintCanvas.height=c.height;paintCtx=paintCanvas.getContext('2d');ready=true;render(c);return true}
function render(c){if(!ready)return;const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.clearRect(0,0,c.width,c.height);x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(paintCanvas,0,0);x.drawImage(lineCanvas,0,0)}
function clipPaint(){if(!paintCtx)return;paintCtx.save();paintCtx.globalCompositeOperation='destination-in';paintCtx.drawImage(allowCanvas,0,0);paintCtx.restore()}
function fillRegion(x,y,hex){const w=mw,h=mh;if(!paintCtx||!mask)return false;x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const start=y*w+x;if(mask[start])return false;const p=rgb(hex),im=paintCtx.getImageData(0,0,w,h),d=im.data,seen=new Uint8Array(w*h),stack=[start];let changed=false;while(stack.length){const q=stack.pop();if(q<0||q>=w*h||seen[q]||mask[q])continue;seen[q]=1;const i=q*4;if(d[i]!==p[0]||d[i+1]!==p[1]||d[i+2]!==p[2]||d[i+3]!==255)changed=true;d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;const qx=q%w;if(qx)stack.push(q-1);if(qx<w-1)stack.push(q+1);if(q>=w)stack.push(q-w);if(q<w*(h-1))stack.push(q+w)}if(changed){paintCtx.putImageData(im,0,0);clipPaint()}return changed}
let undo=[];
function saveUndo(){if(!paintCanvas)return;undo.push(paintCanvas.toDataURL());if(undo.length>30)undo.shift()}
function restoreUndo(){if(!paintCanvas||!undo.length)return;const src=undo.pop(),im=new Image();im.onload=()=>{paintCtx.clearRect(0,0,mw,mh);paintCtx.drawImage(im,0,0);clipPaint();render(document.getElementById('colorCanvas'))};im.src=src}
function templateChanged(){const c=document.getElementById('colorCanvas');if(!c)return;ready=false;undo=[];build(c)}
function install(){const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');if(!c||!v||!z||c.dataset.colorV12)return false;c.dataset.colorV12='1';templateChanged();window.wadfunColorTemplateChanged=templateChanged;
if(typeof window.undoColor!=='function'||!window.__wadfunUndoColorV12){window.__wadfunUndoColorV12=true;window.undoColor=restoreUndo}
const tap=(x,y)=>{if(mode()!=='bucket')return;saveUndo();const p=point(c,x,y);if(!fillRegion(p.x,p.y,selectedColor())&&undo.length)undo.pop()};
if(window.wadfunBindTapCanvas)window.wadfunBindTapCanvas(c,v,z,'color',tap);
let active=false,pid=null,lastX=0,lastY=0;
function start(x,y,id){if(mode()==='bucket')return false;saveUndo();active=true;pid=id;lastX=x;lastY=y;drawDot(x,y);return true}
function drawDot(x,y){const p=point(c,x,y),m=mode(),size=(m==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof colorBrushSize!=='undefined'?colorBrushSize:22))*Math.min(devicePixelRatio||1,2);paintCtx.save();paintCtx.globalCompositeOperation=m==='eraser'?'destination-out':'source-over';paintCtx.globalAlpha=1;paintCtx.fillStyle=m==='eraser'?'#000':selectedColor();paintCtx.beginPath();paintCtx.arc(p.x,p.y,size/2,0,Math.PI*2);paintCtx.fill();paintCtx.restore();clipPaint();render(c)}
function move(x,y){if(!active)return;const a=point(c,lastX,lastY),b=point(c,x,y),m=mode(),size=(m==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof colorBrushSize!=='undefined'?colorBrushSize:22))*Math.min(devicePixelRatio||1,2);paintCtx.save();paintCtx.globalCompositeOperation=m==='eraser'?'destination-out':'source-over';paintCtx.globalAlpha=1;paintCtx.strokeStyle=m==='eraser'?'#000':selectedColor();paintCtx.lineWidth=size;paintCtx.lineCap='round';paintCtx.lineJoin='round';paintCtx.beginPath();paintCtx.moveTo(a.x,a.y);paintCtx.lineTo(b.x,b.y);paintCtx.stroke();paintCtx.restore();clipPaint();render(c);lastX=x;lastY=y}
function end(){active=false;pid=null}
v.addEventListener('pointerdown',e=>{if(mode()==='bucket')return;if(active)return;e.preventDefault();e.stopImmediatePropagation();start(e.clientX,e.clientY,e.pointerId)},true);
v.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pid)return;e.preventDefault();e.stopImmediatePropagation();move(e.clientX,e.clientY)},{passive:false,capture:true});
v.addEventListener('pointerup',e=>{if(e.pointerId===pid)end()},{capture:true});v.addEventListener('pointercancel',e=>{if(e.pointerId===pid)end()},{capture:true});
const wrap=window.loadTemplate;if(typeof wrap==='function'&&!window.__wadfunColorLoadWrapV12){window.__wadfunColorLoadWrapV12=true;window.loadTemplate=function(){const r=wrap.apply(this,arguments);setTimeout(templateChanged,0);return r}}
return true}
const timer=setInterval(()=>{if(install())clearInterval(timer)},100);window.wadfunFillRegionV12=fillRegion;window.wadfunResetColorV12=templateChanged;
})();
