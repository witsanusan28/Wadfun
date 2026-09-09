/* Wadfun Color Engine V2 */
(function(){
'use strict';
const dark=(r,g,b,a)=>a>20&&r<125&&g<125&&b<125;
const near=(r,g,b,t)=>Math.abs(r-t[0])+Math.abs(g-t[1])+Math.abs(b-t[2])<=72;
const rgb=h=>{h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]};
const cssRgb=s=>{const m=(s||'').match(/\d+(?:\.\d+)?/g);return m?[+m[0],+m[1],+m[2]]:null};
function fillRegion(c,x,y,hex){
 const ctx=c.getContext('2d'),w=c.width,h=c.height;if(!w||!h)return;
 x=Math.max(0,Math.min(w-1,Math.floor(x)));y=Math.max(0,Math.min(h-1,Math.floor(y)));
 const im=ctx.getImageData(0,0,w,h),d=im.data,s=(y*w+x)*4,t=[d[s],d[s+1],d[s+2],d[s+3]],p=rgb(hex);
 if(dark(...t))return;const seen=new Uint8Array(w*h),stack=[[x,y]];
 while(stack.length){const q=stack.pop(),sx=q[0],sy=q[1];if(sx<0||sx>=w||sy<0||sy>=h)continue;let i=sy*w+sx,k=i*4;
  if(seen[i]||dark(d[k],d[k+1],d[k+2],d[k+3])||!near(d[k],d[k+1],d[k+2],t))continue;
  let l=sx,r=sx;while(l>=0){i=sy*w+l;k=i*4;if(seen[i]||dark(d[k],d[k+1],d[k+2],d[k+3])||!near(d[k],d[k+1],d[k+2],t))break;l--}l++;
  while(r<w){i=sy*w+r;k=i*4;if(seen[i]||dark(d[k],d[k+1],d[k+2],d[k+3])||!near(d[k],d[k+1],d[k+2],t))break;r++}r--;
  let up=false,down=false;
  for(let xx=l;xx<=r;xx++){i=sy*w+xx;k=i*4;if(seen[i])continue;seen[i]=1;d[k]=p[0];d[k+1]=p[1];d[k+2]=p[2];d[k+3]=255;
   if(sy>0){let n=(sy-1)*w+xx,z=n*4,ok=!seen[n]&&!dark(d[z],d[z+1],d[z+2],d[z+3])&&near(d[z],d[z+1],d[z+2],t);if(ok&&!up){stack.push([xx,sy-1]);up=true}else if(!ok)up=false}
   if(sy<h-1){let n=(sy+1)*w+xx,z=n*4,ok=!seen[n]&&!dark(d[z],d[z+1],d[z+2],d[z+3])&&near(d[z],d[z+1],d[z+2],t);if(ok&&!down){stack.push([xx,sy+1]);down=true}else if(!ok)down=false}
  }
 }
 ctx.putImageData(im,0,0);
}
let history=[];
function color(){const d=document.getElementById('colorDot'),r=d?cssRgb(getComputedStyle(d).backgroundColor):null;return r?'#'+r.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''):'#e53935'}
function install(){
 const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport');if(!c||!v||c.dataset.colorV2)return;c.dataset.colorV2='1';
 const touches=new Map(),zoom={scale:1,startDist:0,startScale:1};let pending=null;
 const dist=()=>{const a=[...touches.values()];return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
 v.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size===2){if(pending){clearTimeout(pending);pending=null}zoom.startDist=dist();zoom.startScale=zoom.scale}},true);
 v.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'||!touches.has(e.pointerId)||touches.size<2)return;e.preventDefault();touches.set(e.pointerId,{x:e.clientX,y:e.clientY});const d=dist();if(zoom.startDist){zoom.scale=Math.max(1,Math.min(3,zoom.startScale*d/zoom.startDist));const z=document.getElementById('colorZoom');if(z)z.style.transform=`scale(${zoom.scale})`}},true);
 ['pointerup','pointercancel','pointerleave'].forEach(t=>v.addEventListener(t,e=>{if(e.pointerType==='touch'){touches.delete(e.pointerId);if(touches.size<2)zoom.startDist=0}},true));
 c.addEventListener('pointerdown',e=>{
  if(!document.getElementById('bucketBtn')?.classList.contains('on'))return;
  e.preventDefault();e.stopImmediatePropagation();
  const r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;
  const run=()=>{history.push(c.toDataURL());if(history.length>30)history.shift();fillRegion(c,x,y,color())};
  if(e.pointerType==='touch')pending=setTimeout(()=>{pending=null;if(touches.size===1)run()},140);else run();
 },true);
 const b=document.querySelector('[onclick="undoColor()"]');if(b)b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(!history.length)return;const im=new Image();im.onload=()=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height)};im.src=history.pop()},true);
}
const timer=setInterval(()=>{if(document.getElementById('colorCanvas')){install();clearInterval(timer)}},100);
window.wadfunFillRegionV2=fillRegion;
})();
