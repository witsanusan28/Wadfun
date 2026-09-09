/* Wadfun Color Engine V9 — reusable fill regions with persistent line mask */
(function(){
'use strict';
const EDGE_LUMA=205,MIN_ALPHA=18;
function luma(r,g,b){return .299*r+.587*g+.114*b}
function wall(d,i){return d[i+3]<MIN_ALPHA||luma(d[i],d[i+1],d[i+2])<EDGE_LUMA}
function rgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}

// Build the wall map from the clean line-art before the first fill.
let wallMask=null,maskW=0,maskH=0;
function ensureMask(c,src){
 if(wallMask&&maskW===c.width&&maskH===c.height)return;
 const n=c.width*c.height;wallMask=new Uint8Array(n);maskW=c.width;maskH=c.height;
 for(let q=0,i=0;q<n;q++,i+=4)wallMask[q]=wall(src,i)?1:0;
}
function resetMask(){wallMask=null;maskW=maskH=0}

function fill(c,x,y,hex){
 const ctx=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;if(!w||!h)return false;
 x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));
 const im=ctx.getImageData(0,0,w,h),d=im.data;
 ensureMask(c,d);
 const start=y*w+x;if(wallMask[start])return false;
 const p=rgb(hex),seen=new Uint8Array(w*h),stack=[start];let changed=false;
 while(stack.length){const q=stack.pop();if(q<0||q>=w*h||seen[q]||wallMask[q])continue;seen[q]=1;const i=q*4;
  if(d[i]!==p[0]||d[i+1]!==p[1]||d[i+2]!==p[2]||d[i+3]!==255)changed=true;
  d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;
  const qx=q%w;
  if(qx)stack.push(q-1);if(qx<w-1)stack.push(q+1);if(q>=w)stack.push(q-w);if(q<w*(h-1))stack.push(q+w);
 }
 if(changed)ctx.putImageData(im,0,0);return changed;
}
function color(){const e=document.getElementById('colorDot'),m=(e?getComputedStyle(e).backgroundColor:'').match(/\d+(?:\.\d+)?/g);return m&&m.length>=3?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
let history=[];
function install(){
 const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');
 if(!c||!v||!z||c.dataset.colorV9)return false;if(!window.wadfunBindTapCanvas)return false;c.dataset.colorV9='1';
 const tap=(x,y)=>{
  if(document.getElementById('bucketBtn')&&!document.getElementById('bucketBtn').classList.contains('on'))return;
  const before=c.toDataURL();
  const p=window.WadfunCanvasCore?.pointFromClient(c,x,y)||(()=>{const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}})();
  if(fill(c,p.x,p.y,color())){history.push(before);if(history.length>30)history.shift()}
 };
 window.wadfunBindTapCanvas(c,v,z,'color',tap);return true;
}
const t=setInterval(()=>{if(install())clearInterval(t)},100);
window.wadfunFillRegionV9=fill;
window.wadfunResetColorMask=resetMask;
})();
