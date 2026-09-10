/* Wadfun Color Engine V24 — native touch drawing + immutable line mask + selected color. Draw mode untouched. */
(function(){
'use strict';
const $=id=>document.getElementById(id), MAX_DPR=1.5, LINE_LUMA=248, MIN_ALPHA=18;
const rgb=h=>{h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]};
const lum=(r,g,b)=>.299*r+.587*g+.114*b;
function color(){const s=window.wadfunSelectedColor;if(/^#[0-9a-f]{6}$/i.test(s||''))return s;const e=$('colorDot');const m=e&&getComputedStyle(e).backgroundColor.match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
function mode(){if($('colorPenBtn')?.classList.contains('on'))return'pen';if($('colorEraseBtn')?.classList.contains('on'))return'eraser';return'bucket'}
let c,v,paint,line,pc,lc,mask,w=0,h=0,ready=false,undo=[];
function pt(x,y){const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}}
function render(){if(!ready)return;const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.clearRect(0,0,c.width,c.height);x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(paint,0,0);x.drawImage(line,0,0)}
function build(){w=c.width;h=c.height;const src=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h),n=w*h;mask=new Uint8Array(n);line=document.createElement('canvas');line.width=w;line.height=h;lc=line.getContext('2d');const ld=lc.createImageData(w,h);for(let q=0,i=0;q<n;q++,i+=4){if(src.data[i+3]>=MIN_ALPHA&&lum(src.data[i],src.data[i+1],src.data[i+2])<LINE_LUMA){mask[q]=1;ld.data[i]=src.data[i];ld.data[i+1]=src.data[i+1];ld.data[i+2]=src.data[i+2];ld.data[i+3]=src.data[i+3]}}lc.putImageData(ld,0,0);paint=document.createElement('canvas');paint.width=w;paint.height=h;pc=paint.getContext('2d');ready=true;render()}
function sync(){if(!c||!v||!ready)return;const r=v.getBoundingClientRect(),cw=Math.max(50,Math.round(r.width)),ch=Math.max(50,Math.round(r.height)),d=Math.min(devicePixelRatio||1,MAX_DPR),nw=Math.round(cw*d),nh=Math.round(ch*d);if(c.width!==nw||c.height!==nh){c.width=nw;c.height=nh;build()}c.style.width=cw+'px';c.style.height=ch+'px';render()}
function snap(){undo.push(paint.toDataURL());if(undo.length>20)undo.shift()}
function eraseDraw(a,b,m){const s=(m==='eraser'?(typeof eraserSize!=='undefined'?eraserSize:30):(typeof colorBrushSize!=='undefined'?colorBrushSize:22))*Math.min(devicePixelRatio||1,MAX_DPR);pc.save();pc.globalCompositeOperation=m==='eraser'?'destination-out':'source-over';pc.strokeStyle=m==='eraser'?'#000':color();pc.lineWidth=s;pc.lineCap='round';pc.lineJoin='round';pc.beginPath();pc.moveTo(a.x,a.y);pc.lineTo(b.x,b.y);pc.stroke();pc.restore();render()}
function fill(x,y){x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const start=y*w+x;if(mask[start])return false;const im=pc.getImageData(0,0,w,h),d=im.data,n=w*h,seen=new Uint8Array(n),stack=[start],t=rgb(color());const s=start*4,base=d[s+3]<20,p=[d[s],d[s+1],d[s+2]];let changed=false;const same=i=>{if(mask[i]||seen[i])return false;const k=i*4;if(base)return d[k+3]<20;return d[k+3]>=20&&Math.abs(d[k]-p[0])<=3&&Math.abs(d[k+1]-p[1])<=3&&Math.abs(d[k+2]-p[2])<=3};
while(stack.length){const q=stack.pop();if(!same(q))continue;seen[q]=1;const k=q*4;d[k]=t[0];d[k+1]=t[1];d[k+2]=t[2];d[k+3]=255;changed=true;if(q%w)stack.push(q-1);if(q%w<w-1)stack.push(q+1);if(q>=w)stack.push(q-w);if(q<n-w)stack.push(q+w)}
if(changed){pc.putImageData(im,0,0);render()}return changed}
function undoFn(){if(!undo.length)return;const im=new Image(),s=undo.pop();im.onload=()=>{pc.clearRect(0,0,w,h);pc.drawImage(im,0,0);render()};im.src=s}
function reset(){if(!c)return;undo=[];build();sync()}
function block(e){e.preventDefault();e.stopImmediatePropagation()}
function install(){if(!c||!v||c.dataset.v24)return;c.dataset.v24='1';reset();window.undoColor=undoFn;window.wadfunColorResizeToViewport=sync;window.wadfunColorResetV24=reset;
let active=false,last=null,touches=new Map(),pinching=false;
function ts(e){if(mode()==='bucket'){if(touches.size)return;touches.set(e.changedTouches[0].identifier,true);fillAt(e.changedTouches[0]);e.preventDefault();e.stopPropagation();return}for(const t of e.changedTouches)touches.set(t.identifier,true);if(touches.size>1){active=false;pinching=true;return}const t=e.changedTouches[0];snap();last=pt(t.clientX,t.clientY);active=true;e.preventDefault();e.stopPropagation()}
function tm(e){if(touches.size!==1||pinching)return;const t=e.touches[0];if(!t)return;const p=pt(t.clientX,t.clientY);eraseDraw(last,p,mode());last=p;e.preventDefault();e.stopPropagation()}
function te(e){for(const t of e.changedTouches)touches.delete(t.identifier);if(touches.size===0){active=false;last=null;pinching=false}e.preventDefault();e.stopPropagation()}
function fillAt(t){snap();const p=pt(t.clientX,t.clientY);if(!fill(p.x,p.y))undo.pop()}
c.addEventListener('touchstart',ts,{capture:true,passive:false});c.addEventListener('touchmove',tm,{capture:true,passive:false});c.addEventListener('touchend',te,{capture:true,passive:false});c.addEventListener('touchcancel',te,{capture:true,passive:false});
['pointerdown','pointermove','pointerup','pointercancel'].forEach(t=>c.addEventListener(t,block,{capture:true,passive:false}));
v.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&mode()==='bucket'){const p=pt(e.clientX,e.clientY);snap();if(!fill(p.x,p.y))undo.pop();e.preventDefault();e.stopImmediatePropagation()}},{capture:true,passive:false});
let mouse=false,lastM=null;function pd(e){if(e.pointerType==='touch'||mode()==='bucket')return;block(e);snap();lastM=pt(e.clientX,e.clientY);mouse=true}function pm(e){if(!mouse)return;block(e);const p=pt(e.clientX,e.clientY);eraseDraw(lastM,p,mode());lastM=p}function pu(e){if(!mouse)return;block(e);mouse=false;lastM=null}
v.addEventListener('pointerdown',pd,{capture:true,passive:false});v.addEventListener('pointermove',pm,{capture:true,passive:false});v.addEventListener('pointerup',pu,{capture:true,passive:false});v.addEventListener('pointercancel',pu,{capture:true,passive:false});
if(window.ResizeObserver&&!window.__wadfunV24RO){window.__wadfunV24RO=true;new ResizeObserver(()=>{if($('color')?.classList.contains('active'))sync()}).observe(v)}
const old=window.loadTemplate;if(typeof old==='function'&&!window.__wadfunV24Load){window.__wadfunV24Load=true;window.loadTemplate=function(){const r=old.apply(this,arguments);setTimeout(reset,0);return r}}
}
const timer=setInterval(()=>{c=$('colorCanvas');v=$('colorViewport');if(c&&v){install();clearInterval(timer)}},100);
})();