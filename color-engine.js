/* Wadfun Color Engine V3 — clean flood fill for coloring pages */
(function(){
'use strict';

/*
  หลักการ V3
  - แยก "เส้นขอบ" ออกจาก "พื้นที่สี" ชัดเจนขึ้น
  - รองรับเส้น anti-alias / เทาอ่อนของภาพวาด
  - เติมพื้นที่ต่อเนื่องทั้งห้อง ลดอาการสีเป็นช่องๆ
  - ไม่แตะระบบปากกา V6 และไม่ยุ่งกับ pinch zoom
*/

const EDGE_LUMA = 185;
const COLOR_TOLERANCE = 105;
const MIN_ALPHA = 18;

function rgb(hex){
  let h=(hex||'#e53935').replace('#','');
  if(h.length===3)h=h.split('').map(x=>x+x).join('');
  return [parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];
}

function cssRgb(s){
  const m=(s||'').match(/\d+(?:\.\d+)?/g);
  return m?[+m[0],+m[1],+m[2]]:null;
}

function luma(r,g,b){return 0.299*r+0.587*g+0.114*b}

function isEdge(r,g,b,a){
  if(a<MIN_ALPHA)return false;
  return luma(r,g,b)<EDGE_LUMA;
}

function similar(r,g,b,t){
  return Math.abs(r-t[0])+Math.abs(g-t[1])+Math.abs(b-t[2])<=COLOR_TOLERANCE;
}

function fillRegion(c,x,y,hex){
  const ctx=c.getContext('2d',{willReadFrequently:true});
  const w=c.width,h=c.height;
  if(!w||!h)return;

  x=Math.max(0,Math.min(w-1,Math.floor(x)));
  y=Math.max(0,Math.min(h-1,Math.floor(y)));

  const im=ctx.getImageData(0,0,w,h);
  const d=im.data;
  const start=(y*w+x)*4;
  const target=[d[start],d[start+1],d[start+2],d[start+3]];
  const paint=rgb(hex);

  /* แตะโดนเส้น = ไม่เทสี */
  if(isEdge(target[0],target[1],target[2],target[3]))return;

  /* ถ้าพื้นที่นี้เป็นสีเดียวกับสีที่จะเทอยู่แล้ว ไม่ต้องทำงาน */
  if(Math.abs(target[0]-paint[0])+Math.abs(target[1]-paint[1])+Math.abs(target[2]-paint[2])<6)return;

  const seen=new Uint8Array(w*h);
  const stack=new Int32Array(Math.min(w*h,800000));
  let top=0;
  stack[top++]=y*w+x;

  while(top){
    const seed=stack[--top];
    const sy=(seed/w)|0;
    const sx=seed-sy*w;

    if(sx<0||sx>=w||sy<0||sy>=h)continue;
    const si=sy*w+sx;
    if(seen[si])continue;

    let k=si*4;
    let r=d[k],g=d[k+1],b=d[k+2],a=d[k+3];
    if(isEdge(r,g,b,a)||!similar(r,g,b,target))continue;

    /* ขยายซ้าย */
    let left=sx;
    while(left>0){
      const ni=sy*w+(left-1),nk=ni*4;
      if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])||!similar(d[nk],d[nk+1],d[nk+2],target))break;
      left--;
    }

    /* ขยายขวา */
    let right=sx;
    while(right<w-1){
      const ni=sy*w+(right+1),nk=ni*4;
      if(seen[ni]||isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])||!similar(d[nk],d[nk+1],d[nk+2],target))break;
      right++;
    }

    let scanUp=false,scanDown=false;

    for(let xx=left;xx<=right;xx++){
      const i=sy*w+xx,kk=i*4;
      if(seen[i])continue;
      seen[i]=1;

      d[kk]=paint[0];
      d[kk+1]=paint[1];
      d[kk+2]=paint[2];
      d[kk+3]=255;

      if(sy>0){
        const ni=(sy-1)*w+xx,nk=ni*4;
        const ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])&&similar(d[nk],d[nk+1],d[nk+2],target);
        if(ok&&!scanUp){if(top<stack.length)stack[top++]=ni;scanUp=true}
        else if(!ok)scanUp=false;
      }

      if(sy<h-1){
        const ni=(sy+1)*w+xx,nk=ni*4;
        const ok=!seen[ni]&&!isEdge(d[nk],d[nk+1],d[nk+2],d[nk+3])&&similar(d[nk],d[nk+1],d[nk+2],target);
        if(ok&&!scanDown){if(top<stack.length)stack[top++]=ni;scanDown=true}
        else if(!ok)scanDown=false;
      }
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
  const c=document.getElementById('colorCanvas');
  const v=document.getElementById('colorViewport');
  if(!c||!v||c.dataset.colorV3)return;
  c.dataset.colorV3='1';

  const touches=new Map();
  const zoom={scale:1,startDist:0,startScale:1};
  let pending=null;

  const dist=()=>{
    const a=[...touches.values()];
    return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
  };

  /* 2 นิ้ว = ซูม, 1 นิ้ว = แตะเทสี */
  v.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='touch')return;
    touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(touches.size===2){
      if(pending){clearTimeout(pending);pending=null}
      zoom.startDist=dist();
      zoom.startScale=zoom.scale;
    }
  },true);

  v.addEventListener('pointermove',e=>{
    if(e.pointerType!=='touch'||!touches.has(e.pointerId)||touches.size<2)return;
    e.preventDefault();
    touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const dd=dist();
    if(zoom.startDist){
      zoom.scale=Math.max(1,Math.min(3,zoom.startScale*dd/zoom.startDist));
      const z=document.getElementById('colorZoom');
      if(z)z.style.transform=`scale(${zoom.scale})`;
    }
  },true);

  ['pointerup','pointercancel','pointerleave'].forEach(type=>v.addEventListener(type,e=>{
    if(e.pointerType==='touch'){
      touches.delete(e.pointerId);
      if(touches.size<2)zoom.startDist=0;
    }
  },true));

  c.addEventListener('pointerdown',e=>{
    if(!document.getElementById('bucketBtn')?.classList.contains('on'))return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const r=c.getBoundingClientRect();
    const x=(e.clientX-r.left)*c.width/r.width;
    const y=(e.clientY-r.top)*c.height/r.height;

    const run=()=>{
      history.push(c.toDataURL());
      if(history.length>30)history.shift();
      fillRegion(c,x,y,color());
    };

    if(e.pointerType==='touch'){
      pending=setTimeout(()=>{
        pending=null;
        if(touches.size===1)run();
      },140);
    }else run();
  },true);

  const b=document.querySelector('[onclick="undoColor()"]');
  if(b)b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!history.length)return;
    const im=new Image();
    im.onload=()=>{
      const x=c.getContext('2d');
      x.clearRect(0,0,c.width,c.height);
      x.drawImage(im,0,0,c.width,c.height);
    };
    im.src=history.pop();
  },true);
}

const timer=setInterval(()=>{
  if(document.getElementById('colorCanvas')){
    install();
    clearInterval(timer);
  }
},100);

window.wadfunFillRegionV3=fillRegion;
})();
