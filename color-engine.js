/* Wadfun Color Engine V6 — ใช้ฐาน interaction เดียวกับ Draw
   Color ไม่สร้างระบบ touch/zoom แยกเองแล้ว
   ใช้ native touch/gesture แบบเดียวกับ Pen Engine V7
   ส่วนที่ต่างมีเพียง "แตะ 1 ครั้ง = เทสี"
*/
(function(){
'use strict';

const EDGE_LUMA=205;
const MIN_ALPHA=18;

function corePoint(c,x,y){
  return window.WadfunCanvasCore?.pointFromClient(c,x,y)||(()=>{const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}})();
}
function rgb(hex){
  let h=(hex||'#e53935').replace('#','');
  if(h.length===3)h=h.split('').map(x=>x+x).join('');
  return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];
}
function cssRgb(s){const m=(s||'').match(/\d+(?:\.\d+)?/g);return m?[+m[0],+m[1],+m[2]]:null}
function luma(r,g,b){return .299*r+.587*g+.114*b}
function isEdge(r,g,b,a){return a>=MIN_ALPHA&&luma(r,g,b)<EDGE_LUMA}

/* Boundary-only fill: เส้นเข้มทำหน้าที่เป็นกำแพง */
function fillRegion(c,x,y,hex){
  const ctx=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;
  if(!w||!h)return false;
  x=Math.max(0,Math.min(w-1,Math.floor(x)));y=Math.max(0,Math.min(h-1,Math.floor(y)));
  const im=ctx.getImageData(0,0,w,h),d=im.data,start=(y*w+x)*4;
  if(isEdge(d[start],d[start+1],d[start+2],d[start+3]))return false;
  const paint=rgb(hex),seen=new Uint8Array(w*h),stack=new Int32Array(Math.min(w*h,1500000));
  let top=0;stack[top++]=y*w+x;
  while(top){
    const seed=stack[--top],sy=(seed/w)|0,sx=seed-sy*w;
    if(sx<0||sx>=w||sy<0||sy>=h)continue;
    const si=sy*w+sx;if(seen[si])continue;
    let k=si*4;if(isEdge(d[k],d[k+1],d[k+2],d[k+3]))continue;
    let left=sx,right=sx;
    while(left>0){const ni=sy*w+left-1,nk=ni*4;if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3]))break;left--}
    while(right<w-1){const ni=sy*w+right+1,nk=ni*4;if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3]))break;right++}
    let up=false,down=false;
    for(let xx=left;xx<=right;xx++){
      const i=sy*w+xx,kk=i*4;if(seen[i])continue;seen[i]=1;
      d[kk]=paint[0];d[kk+1]=paint[1];d[kk+2]=paint[2];d[kk+3]=255;
      if(sy>0){const ni=(sy-1)*w+xx,nk=ni*4,ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3]);if(ok&&!up){if(top<stack.length)stack[top++]=ni;up=true}else if(!ok)up=false}
      if(sy<h-1){const ni=(sy+1)*w+xx,nk=ni*4,ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3]);if(ok&&!down){if(top<stack.length)stack[top++]=ni;down=true}else if(!ok)down=false}
    }
  }
  ctx.putImageData(im,0,0);return true;
}

function currentColor(){
  const d=document.getElementById('colorDot');
  const r=d?cssRgb(getComputedStyle(d).backgroundColor):null;
  return r?'#'+r.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''):'#e53935';
}

function install(){
  const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport');
  if(!c||!v||c.dataset.colorV6)return;
  c.dataset.colorV6='1';

  let touchMoved=false;
  let touchStartTime=0;
  let touchCount=0;

  /* ใช้ gesture base เดียวกับ Draw/pen-engine.js */
  if(typeof window.pinchZoom==='function'){
    const z=document.getElementById('colorZoom');
    if(z)window.pinchZoom(v,z,'color');
  }

  function doFill(clientX,clientY){
    if(document.getElementById('bucketBtn')&&!document.getElementById('bucketBtn').classList.contains('on'))return;
    const p=corePoint(c,clientX,clientY);
    const before=c.toDataURL();
    if(fillRegion(c,p.x,p.y,currentColor())){
      history.push(before);
      if(history.length>30)history.shift();
    }
  }

  /* Finger: เหมือน Draw — native touch, 1 นิ้วเท่านั้น
     เรารอ touchend แล้วค่อยตัดสินว่าเป็น tap หรือ pinch */
  c.addEventListener('touchstart',e=>{
    touchCount=e.touches.length;
    touchMoved=false;
    touchStartTime=Date.now();
    if(touchCount!==1)return;
    e.preventDefault();
  },{passive:false});
  c.addEventListener('touchmove',e=>{
    if(e.touches.length!==1){touchMoved=true;return;}
    touchMoved=true;
  },{passive:false});
  c.addEventListener('touchend',e=>{
    const t=e.changedTouches[0];
    const duration=Date.now()-touchStartTime;
    const isTap=touchCount===1&&!touchMoved&&duration<=500;
    touchCount=e.touches.length;
    if(isTap&&t)doFill(t.clientX,t.clientY);
  },{passive:false});
  c.addEventListener('touchcancel',()=>{touchCount=0;touchMoved=true},{passive:false});

  /* Mouse / Apple Pencil: pointer แบบเดียวกับ Draw */
  c.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch')return;
    if(!document.getElementById('bucketBtn')?.classList.contains('on'))return;
    e.preventDefault();e.stopImmediatePropagation();doFill(e.clientX,e.clientY);
  },true);

  const b=document.querySelector('[onclick="undoColor()"]');
  if(b)b.addEventListener('click',e=>{
    e.preventDefault();e.stopImmediatePropagation();
    if(!history.length)return;
    const im=new Image();
    im.onload=()=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height)};
    im.src=history.pop();
  },true);
}

let history=[];
const timer=setInterval(()=>{
  if(document.getElementById('colorCanvas')){install();clearInterval(timer)}
},100);
window.wadfunFillRegionV6=fillRegion;
})();
