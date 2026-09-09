/* Wadfun Color Engine V8 — boundary fill on immutable source pixels */
(function(){
'use strict';
const EDGE_LUMA=205,MIN_ALPHA=18;
function luma(r,g,b){return .299*r+.587*g+.114*b}
function wall(d,i){return d[i+3]<MIN_ALPHA||luma(d[i],d[i+1],d[i+2])<EDGE_LUMA}
function rgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function fill(c,x,y,hex){const ctx=c.getContext('2d',{willReadFrequently:true}),w=c.width,h=c.height;if(!w||!h)return false;x=Math.max(0,Math.min(w-1,x|0));y=Math.max(0,Math.min(h-1,y|0));const im=ctx.getImageData(0,0,w,h),src=new Uint8ClampedArray(im.data),out=im.data,si=(y*w+x)*4;if(wall(src,si))return false;const p=rgb(hex),seen=new Uint8Array(w*h),stack=[y*w+x];let changed=false;while(stack.length){const q=stack.pop(),qy=(q/w)|0,qx=q-qy*w;if(qx<0||qx>=w||qy<0||qy>=h||seen[q])continue;seen[q]=1;const i=q*4;if(wall(src,i))continue;out[i]=p[0];out[i+1]=p[1];out[i+2]=p[2];out[i+3]=255;changed=true;if(qx)stack.push(q-1);if(qx<w-1)stack.push(q+1);if(qy)stack.push(q-w);if(qy<h-1)stack.push(q+w)}if(changed)ctx.putImageData(im,0,0);return changed}
function color(){const e=document.getElementById('colorDot'),m=(e?getComputedStyle(e).backgroundColor:'').match(/\d+(?:\.\d+)?/g);return m?'#'+m.slice(0,3).map(v=>(+v|0).toString(16).padStart(2,'0')).join(''):'#e53935'}
let history=[];
function install(){const c=document.getElementById('colorCanvas'),v=document.getElementById('colorViewport'),z=document.getElementById('colorZoom');if(!c||!v||!z||c.dataset.colorV8)return false;if(!window.wadfunBindTapCanvas)return false;c.dataset.colorV8='1';const tap=(x,y)=>{if(document.getElementById('bucketBtn')&&!document.getElementById('bucketBtn').classList.contains('on'))return;const before=c.toDataURL(),p=window.WadfunCanvasCore?.pointFromClient(c,x,y)||(()=>{const r=c.getBoundingClientRect();return{x:(x-r.left)*c.width/r.width,y:(y-r.top)*c.height/r.height}})();if(fill(c,p.x,p.y,color())){history.push(before);if(history.length>30)history.shift()}};window.wadfunBindTapCanvas(c,v,z,'color',tap);return true}
const t=setInterval(()=>{if(document.getElementById('colorCanvas')&&install())clearInterval(t)},100);window.wadfunFillRegionV8=fill;
})();
