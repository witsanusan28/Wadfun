/* Wadfun Color Engine V15 — smooth freehand paint, non-destructive bucket fill, resize-safe zoom. Draw mode untouched. */
(function(){
'use strict';
const LINE_LUMA=248,MIN_ALPHA=18,PAINT_ALPHA=12;
function luma(r,g,b){return .299*r+.587*g+.114*b}
function rgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function mode(){if(document.getElementById('colorPenBtn')?.classList.contains('on'))return'pen';if(document.getElementById('colorEraseBtn')?.classList.contains('on'))return'eraser';return'bucket'}
function selectedColor(){const e=document.getElementById('colorDot'),m=(e?getComputedStyle(e).backgroundColor:'').match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
let lineCanvas=null,lineCtx=null,paintCanvas=null,paintCtx=null,allowCanvas=null,allowCtx=null,mask=null,mw=0,mh=0,ready=false,strokeCanvas=null,strokeCtx=null,renderQueued=false,dirty=null,resizing=false;
function point(c,x,y,rect){const r=rect||c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}}
function isLine(d,i){return d[i+3]>=MIN_ALPHA&&luma(d[i],d[i+1],d[i+2])<LINE_LUMA}
function rebuildMask(){if(!lineCanvas)return;const w=mw,h=mh,n=w*h,src=lineCtx.getImageData(0,0,w,h),d=src.data;mask=new Uint8Array(n);const ad=allowCtx.createImageData(w,h);for(let q=0,i=0;q<n;q++,i+=4){if(isLine(d,i))mask[q]=1;else ad.data[i+3]=255}allowCtx.clearRect(0,0,w,h);allowCtx.putImageData(ad,0,0)}
function build(c){
 if(!c.width||!c.height)return false;
 const w=c.width,h=c.height,n=w*h,src=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h);
 mw=w;mh=h;mask=new Uint8Array(n);
 lineCanvas=document.createElement('canvas');lineCanvas.width=w;lineCanvas.height=h;lineCtx=lineCanvas.getContext('2d');
 allowCanvas=document.createElement('canvas');allowCanvas.width=w;allowCanvas.height=h;allowCtx=allowCanvas.getContext('2d');
 const ld=lineCtx.createImageData(w,h),ad=allowCtx.createImageData(w,h);
 for(let q=0,i=0;q<n;q++,i+=4){if(isLine(src.data,i)){mask[q]=1;ld.data[i]=src.data[i];ld.data[i+1]=src.data[i+1];ld.data[i+2]=src.data[i+2];ld.data[i+3]=src.data[i+3]}else ad.data[i+3]=255}
 lineCtx.putImageData(ld,0,0);allowCtx.putImageData(ad,0,0);
 paintCanvas=document.createElement('canvas');paintCanvas.width=w;paintCanvas.height=h;paintCtx=paintCanvas.getContext('2d');
 strokeCanvas=document.createElement('canvas');strokeCanvas.width=w;strokeCanvas.height=h;strokeCtx=strokeCanvas.getContext('2d');
 ready=true;dirty=null;render(c);return true
}
function scaled(src,w,h){const n=document.createElement('canvas');n.width=w;n.height=h;n.getContext('2d').drawImage(src,0,0,w,h);return n}
function resizeInternal(c,w,h){if(!ready||resizing||w<1||h<1)return false;if(w===mw&&h===mh)return true;resizing=true;const oldPaint=paintCanvas,oldLine=lineCanvas;paintCanvas=scaled(oldPaint,w,h);paintCtx=paintCanvas.getContext('2d');lineCanvas=scaled(oldLine,w,h);lineCtx=lineCanvas.getContext('2d');mw=w;mh=h;allowCanvas=document.createElement('canvas');allowCanvas.width=w;allowCanvas.height=h;allowCtx=allowCanvas.getContext('2d');strokeCanvas=document.createElement('canvas');strokeCanvas.width=w;strokeCanvas.height=h;strokeCtx=strokeCanvas.getContext('2d');rebuildMask();dirty=null;render(c);resizing=false;return true}
function syncToViewport(){const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport');if(!c||!v||!ready||resizing)return false;const r=v.getBoundingClientRect(),cssW=Math.max(50,Math.round(r.width)),cssH=Math.max(50,Math.round(r.height)),d=Math.min(devicePixelRatio||1,2),w=Math.round(cssW*d),h=Math.round(cssH*d);c.style.width=cssW+'px';c.style.height=cssH+'px';if(c.width!==w||c.height!==h){c.width=w;c.height=h;resizeInternal(c,w,h)}return true}
function render(c){if(!ready)return;const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.clearRect(0,0,c.width,c.height);x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(paintCanvas,0,0);x.drawImage(lineCanvas,0,0)}
function renderDirty(c,r){if(!ready||!r)return;const x=c.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.clearRect(r.x,r.y,r.w,r.h);x.fillStyle='#fff';x.fillRect(r.x,r.y,r.w,r.h);x.drawImage(paintCanvas,r.x,r.y,r.w,r.h,r.x,r.y,r.w,r.h);x.drawImage(lineCanvas,r.x,r.y,r.w,r.h,r.x,r.y,r.w,r.h);x.restore()}
function requestRender(c,sx,sy,sw,sh){const r={x:Math.max(0,Math.floor(sx)),y:Math.max(0,Math.floor(sy)),w:Math.max(1,Math.ceil(sw)),h:Math.max(1,Math.ceil(sh))};if(!dirty)dirty=r;else{const x=Math.min(dirty.x,r.x),y=Math.min(dirty.y,r.y),ex=Math.max(dirty.x+dirty.w,r.x+r.w),ey=Math.max(dirty.y+dirty.h,r.y+r.h);dirty={x,y,w:ex-x,h:ey-y}}if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;const d=dirty;dirty=null;if(d)renderDirty(c,d)})}
function clipStroke(sx,sy,sw,sh){strokeCtx.save();strokeCtx.globalCompositeOperation='destination-in';strokeCtx.drawImage(allowCanvas,sx,sy,sw,sh,sx,sy,sw,sh);strokeCtx.restore()}
function samePaint(d,i,p,base){const a=d[i+3];if(base)return a<=PAINT_ALPHA;if(a<=PAINT_ALPHA)return false;return Math.abs(d[i]-p[0])<=3&&Math.abs(d[i+1]-p[1])<=3&&Math.abs(d[i+2]-p[2])<=3}
function fillRegion(x,y,hex){
 const w=mw,h=mh;if(!paintCtx||!mask)return false;x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const start=y*w+x;if(mask[start])return false;
 const im=paintCtx.getImageData(0,0,w,h),d=im.data,si=start*4,base=d[si+3]<=PAINT_ALPHA,p=[d[si],d[si+1],d[si+2]],target=rgb(hex),seen=new Uint8Array(w*h),stack=[start];let changed=false;
 while(stack.length){const q=stack.pop();if(q<0||q>=w*h||seen[q]||mask[q])continue;seen[q]=1;const i=q*4;if(!samePaint(d,i,p,base))continue;if(d[i]!==target[0]||d[i+1]!==target[1]||d[i+2]!==target[2]||d[i+3]!==255)changed=true;d[i]=target[0];d[i+1]=target[1];d[i+2]=target[2];d[i+3]=255;const qx=q%w;if(qx)stack.push(q-1);if(qx<w-1)stack.push(q+1);if(q>=w)stack.push(q-w);if(q<w*(h-1))stack.push(q+w)}
 if(changed){paintCtx.putImageData(im,0,0);render(document.getElementById('colorCanvas'))}return changed
}
let undo=[];
function saveUndo(){if(!paintCanvas)return;undo.push(paintCanvas.toDataURL());if(undo.length>30)undo.shift()}
function restoreUndo(){if(!paintCanvas||!undo.length)return;const src=undo.pop(),im=new Image();im.onload=()=>{paintCtx.clearRect(0,0,mw,mh);paintCtx.drawImage(im,0,0);render(document.getElementById('colorCanvas'))};im.src=src}
function templateChanged(){const c=document.getElementById('colorCanvas');if(!c)return;ready=false;undo=[];build(c);syncToViewport()}
function drawSegment(a,b,m,c){
 const size=((m==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof colorBrushSize!=='undefined'?colorBrushSize:22))*Math.min(devicePixelRatio||1,2));
 const pad=size/2+3,sx=Math.max(0,Math.floor(Math.min(a.x,b.x)-pad)),sy=Math.max(0,Math.floor(Math.min(a.y,b.y)-pad)),ex=Math.min(c.width,Math.ceil(Math.max(a.x,b.x)+pad)),ey=Math.min(c.height,Math.ceil(Math.max(a.y,b.y)+pad)),sw=Math.max(1,ex-sx),sh=Math.max(1,ey-sy);
 strokeCtx.clearRect(sx,sy,sw,sh);strokeCtx.save();strokeCtx.globalCompositeOperation='source-over';strokeCtx.globalAlpha=1;strokeCtx.strokeStyle=m==='eraser'?'#000':selectedColor();strokeCtx.fillStyle=strokeCtx.strokeStyle;strokeCtx.lineWidth=size;strokeCtx.lineCap='round';strokeCtx.lineJoin='round';strokeCtx.beginPath();strokeCtx.moveTo(a.x,a.y);strokeCtx.lineTo(b.x,b.y);strokeCtx.stroke();if(a.x===b.x&&a.y===b.y){strokeCtx.beginPath();strokeCtx.arc(a.x,a.y,size/2,0,Math.PI*2);strokeCtx.fill()}strokeCtx.restore();clipStroke(sx,sy,sw,sh);
 paintCtx.save();paintCtx.globalCompositeOperation=m==='eraser'?'destination-out':'source-over';paintCtx.drawImage(strokeCanvas,sx,sy,sw,sh,sx,sy,sw,sh);paintCtx.restore();requestRender(c,sx,sy,sw,sh)
}
function install(){
 const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');
 if(!c||!v||!z||c.dataset.colorV15)return false;c.dataset.colorV15='1';templateChanged();window.wadfunColorTemplateChanged=templateChanged;window.wadfunColorResizeToViewport=syncToViewport;
 if(typeof window.undoColor!=='function'||!window.__wadfunUndoColorV15){window.__wadfunUndoColorV15=true;window.undoColor=restoreUndo}
 const tap=(x,y)=>{if(mode()!=='bucket')return;saveUndo();const p=point(c,x,y);if(!fillRegion(p.x,p.y,selectedColor())&&undo.length)undo.pop()};
 if(window.wadfunBindTapCanvas)window.wadfunBindTapCanvas(c,v,z,'color',tap);
 let active=false,pid=null,last=null,rect=null,queue=[],raf=0;
 function flush(){raf=0;if(!active||!queue.length)return;const m=mode();let prev=last;for(const q of queue){const p=point(c,q.x,q.y,rect);drawSegment(prev,p,m,c);prev=p}queue=[];last=prev}
 function schedule(){if(!raf)raf=requestAnimationFrame(flush)}
 function start(x,y,id){if(mode()==='bucket')return false;saveUndo();rect=c.getBoundingClientRect();last=point(c,x,y,rect);queue=[];active=true;pid=id;drawSegment(last,last,mode(),c);return true}
 function move(x,y){if(!active||pid===null)return;queue.push({x,y});schedule()}
 function end(){if(!active)return;flush();active=false;pid=null;rect=null;queue=[]}
 v.addEventListener('pointerdown',e=>{if(mode()==='bucket'||active)return;e.preventDefault();e.stopImmediatePropagation();start(e.clientX,e.clientY,e.pointerId)},true);
 v.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pid)return;e.preventDefault();e.stopImmediatePropagation();const es=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const q of es)move(q.clientX,q.clientY)},{passive:false,capture:true});
 v.addEventListener('pointerup',e=>{if(e.pointerId===pid){e.preventDefault();e.stopPropagation();end()}},{capture:true});
 v.addEventListener('pointercancel',e=>{if(e.pointerId===pid)end()},{capture:true});
 if(window.ResizeObserver&&!window.__wadfunColorResizeObserverV15){window.__wadfunColorResizeObserverV15=true;const ro=new ResizeObserver(()=>{if(document.getElementById('color')?.classList.contains('active')){clearTimeout(window.__wadfunColorResizeTimerV15);window.__wadfunColorResizeTimerV15=setTimeout(syncToViewport,30)}});ro.observe(v)}
 const wrap=window.loadTemplate;if(typeof wrap==='function'&&!window.__wadfunColorLoadWrapV15){window.__wadfunColorLoadWrapV15=true;window.loadTemplate=function(){const r=wrap.apply(this,arguments);setTimeout(templateChanged,0);return r}}
 return true
}
const timer=setInterval(()=>{if(install())clearInterval(timer)},100);
window.wadfunFillRegionV15=fillRegion;window.wadfunResetColorV15=templateChanged;
})();
