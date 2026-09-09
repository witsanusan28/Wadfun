/* Wadfun Color Engine V4 — Canvas Core integration
   ระบบเติมสีแยกจากระบบสัมผัส/ซูม
   ใช้ Canvas Core เป็นฐานพิกัดและ pinch zoom ร่วมกับ Draw
*/
(function(){
'use strict';

const EDGE_LUMA=185;
const COLOR_TOLERANCE=105;
const MIN_ALPHA=18;

function rgb(hex){
  let h=(hex||'#e53935').replace('#','');
  if(h.length===3)h=h.split('').map(x=>x+x).join('');
  return [parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];
}
function cssRgb(s){const m=(s||'').match(/\d+(?:\.\d+)?/g);return m?[+m[0],+m[1],+m[2]]:null}
function luma(r,g,b){return .299*r+.587*g+.114*b}
function isEdge(r,g,b,a){return a<MIN_ALPHA?false:luma(r,g,b)<EDGE_LUMA}
function similar(r,g,b,t){return Math.abs(r-t[0])+Math.abs(g-t[1])+Math.abs(b-t[2])<=COLOR_TOLERANCE}

function fillRegion(c,x,y,hex){
  const ctx=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;
  if(!w||!h)return;
  x=Math.max(0,Math.min(w-1,Math.floor(x)));y=Math.max(0,Math.min(h-1,Math.floor(y)));
  const im=ctx.getImageData(0,0,w,h),d=im.data,start=(y*w+x)*4;
  const target=[d[start],d[start+1],d[start+2],d[start+3]],paint=rgb(hex);
  if(isEdge(...target)||Math.abs(target[0]-paint[0])+Math.abs(target[1]-paint[1])+Math.abs(target[2]-paint[2])<6)return;
  const seen=new Uint8Array(w*h),stack=new Int32Array(Math.min(w*h,800000));let top=0;stack[top++]=y*w+x;
  while(top){
    const seed=stack[--top],sy=(seed/w)|0,sx=seed-sy*w;
    if(sx<0||sx>=w||sy<0||sy>=h)continue;
    const si=sy*w+sx;if(seen[si])continue;let k=si*4;
    if(isEdge(d[k],d[k+1],d[k+2],d[k+3])||!similar(d[k],d[k+1],d[k+2],target))continue;
    let left=sx,right=sx;
    while(left>0){const ni=sy*w+left-1,nk=ni*4;if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])||!similar(d[nk],d[nk+1],d[nk+2],target))break;left--}
    while(right<w-1){const ni=sy*w+right+1,nk=ni*4;if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])||!similar(d[nk],d[nk+1],d[nk+2],target))break;right++}
    let up=false,down=false;
    for(let xx=left;xx<=right;xx++){
      const i=sy*w+xx,kk=i*4;if(seen[i])continue;seen[i]=1;
      d[kk]=paint[0];d[kk+1]=paint[1];d[kk+2]=paint[2];d[kk+3]=255;
      if(sy>0){const ni=(sy-1)*w+xx,nk=ni*4,ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])&&similar(d[nk],d[nk+1],d[nk+2],target);if(ok&&!up){if(top<stack.length)stack[top++]=ni;up=true}else if(!ok)up=false}
      if(sy<h-1){const ni=(sy+1)*w+xx,nk=ni*4,ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])&&similar(d[nk],d[nk+1],d[nk+2],target);if(ok&&!down){if(top<stack.length)stack[top++]=ni;down=true}else if(!ok)down=false}
    }
  }
  ctx.putImageData(im,0,0);
}

let history=[];
function color(){
  const d=document.getElementById('colorDot');
  const r=d?cssRgb(getComputedStyle(d).backgroundColor):null;
  return r?'#'+r.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''):'#e53935';
}

function install(){
  const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');
  if(!c||!v||!z||c.dataset.colorV4)return;
  c.dataset.colorV4='1';

  /* Canvas Core เป็นเจ้าของพิกัดร่วม */
  const core=window.WadfunCanvasCore;
  const point=(e)=>core?.pointFromEvent(c,e)||(()=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}})();

  let scale=1,startDist=0,startScale=1;
  let touches=new Map(),pending=null,moved=false;
  const dist=()=>{const a=[...touches.values()];return core?.touchDistance(a.map(t=>({clientX:t.x,clientY:t.y})))|| (a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y))};
  const applyZoom=()=>{scale=core?.clampZoom(scale)||Math.max(1,Math.min(3,scale));z.style.transform=`scale(${scale})`};

  /* 1 นิ้ว = ระบาย, 2 นิ้ว = pinch zoom แบบเดียวกับ Draw */
  v.addEventListener('touchstart',e=>{
    for(const t of e.changedTouches)touches.set(t.identifier,{x:t.clientX,y:t.clientY});
    if(touches.size===2){if(pending){clearTimeout(pending);pending=null}startDist=dist();startScale=scale;moved=true;e.preventDefault()}
  },{passive:false});
  v.addEventListener('touchmove',e=>{
    for(const t of e.changedTouches)if(touches.has(t.identifier))touches.set(t.identifier,{x:t.clientX,y:t.clientY});
    if(touches.size>=2&&startDist){scale=startScale*dist()/startDist;applyZoom();moved=true;e.preventDefault()}
  },{passive:false});
  v.addEventListener('touchend',e=>{for(const t of e.changedTouches)touches.delete(t.identifier);if(touches.size<2)startDist=0},{passive:false});
  v.addEventListener('touchcancel',e=>{for(const t of e.changedTouches)touches.delete(t.identifier);if(touches.size<2)startDist=0},{passive:false});

  c.addEventListener('touchstart',e=>{
    if(!document.getElementById('bucketBtn')?.classList.contains('on'))return;
    if(e.touches.length!==1)return;
    moved=false;const p=point(e);e.preventDefault();e.stopImmediatePropagation();
    pending=setTimeout(()=>{pending=null;if(touches.size===1&&!moved){history.push(c.toDataURL());if(history.length>30)history.shift();fillRegion(c,p.x,p.y,color())}},140);
  },{passive:false,capture:true});

  c.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'||!document.getElementById('bucketBtn')?.classList.contains('on'))return;
    e.preventDefault();e.stopImmediatePropagation();
    const p=point(e);history.push(c.toDataURL());if(history.length>30)history.shift();fillRegion(c,p.x,p.y,color());
  },true);

  const b=document.querySelector('[onclick="undoColor()"]');
  if(b)b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(!history.length)return;const im=new Image();im.onload=()=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height)};im.src=history.pop()},true);
}

const timer=setInterval(()=>{if(document.getElementById('colorCanvas')){install();clearInterval(timer)}},100);
window.wadfunFillRegionV3=fillRegion;
window.wadfunFillRegionV4=fillRegion;
})();