/* Wadfun Color Library Fix V12 — restore exact saved colors without touching editor engine */
(function(){
'use strict';
if(window.__wadfunColorLibraryV12)return;
window.__wadfunColorLibraryV12=true;

function normalizeScreens(){
  const active=document.querySelector('.screen.active');
  if(!active)return;
  document.querySelectorAll('.screen').forEach(s=>s.style.removeProperty('display'));
}
function repair(){normalizeScreens()}
const obs=new MutationObserver(()=>requestAnimationFrame(repair));
obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
setInterval(repair,250);
repair();

/* The saved PNG is the authoritative visual result. If the layer state is
 * incomplete or the engine rebuilds its layers, turn that PNG into a paint
 * layer while removing only the template's black line pixels. The Color
 * Engine remains untouched; its own line layer is still rendered on top. */
function findSaved(){
  try{
    const s=window.wadfunStorage,st=window.wadfunColorLibraryState||{};
    if(!s||typeof s.getAllArtworks!=='function')return Promise.resolve(null);
    const cat=st.category||window.wadfunActiveColorTemplate?.category||'';
    const idx=Number.isInteger(st.index)?st.index:'';
    const item=window.wadfunColorLibraryData?.[cat]?.items?.[idx];
    const name=item?.[0]||window.wadfunActiveColorTemplate?.name||'';
    const key=`${cat}:${idx}:${name}`;
    return s.getAllArtworks().then(all=>{
      let a=all.filter(x=>x?.mode==='color'&&x?.templateKey===key&&x?.imageData);
      if(!a.length)a=all.filter(x=>x?.mode==='color'&&typeof x.templateKey==='string'&&x.templateKey.startsWith(`${cat}:${idx}:`)&&x?.imageData);
      const finals=a.filter(x=>x.draft!==true),pool=finals.length?finals:a;
      pool.sort((x,y)=>(Number(y.updatedAt)||0)-(Number(x.updatedAt)||0));
      return pool[0]||null;
    });
  }catch(e){return Promise.resolve(null)}
}
function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src})}
async function flattenedPaint(saved){
  const c=document.getElementById('colorCanvas');
  const st=window.wadfunColorLibraryState||{},cat=st.category||window.wadfunActiveColorTemplate?.category||'',idx=Number.isInteger(st.index)?st.index:null;
  const item=window.wadfunColorLibraryData?.[cat]?.items?.[idx];
  if(!c||!c.width||!saved?.imageData||!item)return null;
  const out=document.createElement('canvas');out.width=c.width;out.height=c.height;
  const ox=out.getContext('2d',{willReadFrequently:true});
  const savedImg=await loadImage(saved.imageData);
  ox.drawImage(savedImg,0,0,out.width,out.height);
  const line=document.createElement('canvas');line.width=c.width;line.height=c.height;
  const lx=line.getContext('2d',{willReadFrequently:true});
  const lineImg=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item[2]));
  const pad=Math.min(line.width,line.height)*.08,scale=Math.min((line.width-pad*2)/500,(line.height-pad*2)/500),size=500*scale;
  lx.drawImage(lineImg,(line.width-size)/2,(line.height-size)/2,size,size);
  const od=ox.getImageData(0,0,out.width,out.height),ld=lx.getImageData(0,0,line.width,line.height);
  for(let i=0;i<od.data.length;i+=4){
    const lr=ld.data[i],lg=ld.data[i+1],lb=ld.data[i+2],la=ld.data[i+3];
    if(la>=18&&(.299*lr+.587*lg+.114*lb)<205)od.data[i+3]=0;
  }
  ox.putImageData(od,0,0);
  return out.toDataURL('image/png');
}

function installRestoreFallback(){
  const original=window.wadfunColorRestoreState;
  if(typeof original!=='function'||original.__wadfunV12)return false;
  if(original.__wadfunV12Wrapped)return true;
  const wrapped=function(state,done){
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;if(done)done()};
    const fallback=async()=>{
      try{
        const saved=await findSaved();
        if(!saved)return finish();
        const paint=await flattenedPaint(saved);
        if(paint)original({paint,ink:''},finish);
        else finish();
      }catch(e){console.error('[Wadfun] flattened color fallback failed',e);finish()}
    };
    try{
      if(original(state,()=>fallback())!==true)fallback();
    }catch(e){console.error('[Wadfun] saved color restore failed',e);fallback()}
    return true;
  };
  wrapped.__wadfunV12=true;
  wrapped.__wadfunV12Wrapped=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}
let n=0;
const timer=setInterval(()=>{if(installRestoreFallback()||++n>180)clearInterval(timer)},100);
installRestoreFallback();
})();