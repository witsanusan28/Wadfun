/* Wadfun Color Library Fix V13 — deterministic visual resume from the saved artwork */
(function(){
'use strict';
if(window.__wadfunColorLibraryV13)return;
window.__wadfunColorLibraryV13=true;

function normalizeScreens(){
  const active=document.querySelector('.screen.active');
  if(!active)return;
  document.querySelectorAll('.screen').forEach(s=>s.style.removeProperty('display'));
}
const obs=new MutationObserver(()=>requestAnimationFrame(normalizeScreens));
obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
setInterval(normalizeScreens,250);
normalizeScreens();

function currentKey(){
  const st=window.wadfunColorLibraryState||{};
  const cat=st.category||window.wadfunActiveColorTemplate?.category||'';
  const idx=Number.isInteger(st.index)?st.index:'';
  const item=window.wadfunColorLibraryData?.[cat]?.items?.[idx];
  const name=item?.[0]||window.wadfunActiveColorTemplate?.name||'';
  return {cat,idx,name,key:`${cat}:${idx}:${name}`};
}

async function findSaved(){
  try{
    const s=window.wadfunStorage;
    if(!s||typeof s.getAllArtworks!=='function')return null;
    const {cat,idx,key}=currentKey();
    const all=await s.getAllArtworks();
    let a=all.filter(x=>x?.mode==='color'&&x?.templateKey===key&&x?.imageData);
    if(!a.length)a=all.filter(x=>x?.mode==='color'&&typeof x.templateKey==='string'&&x.templateKey.startsWith(`${cat}:${idx}:`)&&x?.imageData);
    if(!a.length&&window.currentName)a=all.filter(x=>x?.mode==='color'&&x?.name===window.currentName&&x?.imageData);
    if(!a.length)return null;
    const finals=a.filter(x=>x.draft!==true),pool=finals.length?finals:a;
    pool.sort((x,y)=>(Number(y.updatedAt)||0)-(Number(x.updatedAt)||0));
    return pool[0]||null;
  }catch(e){console.error('[Wadfun] find saved color failed',e);return null}
}
function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src})}

async function makePaint(saved){
  const c=document.getElementById('colorCanvas');
  const {cat,idx}=currentKey();
  const item=window.wadfunColorLibraryData?.[cat]?.items?.[idx];
  if(!c?.width||!c?.height||!saved?.imageData||!item)return null;
  const out=document.createElement('canvas');out.width=c.width;out.height=c.height;
  const ox=out.getContext('2d',{willReadFrequently:true});
  const img=await loadImage(saved.imageData);
  ox.drawImage(img,0,0,out.width,out.height);

  const line=document.createElement('canvas');line.width=c.width;line.height=c.height;
  const lx=line.getContext('2d',{willReadFrequently:true});
  const lineImg=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item[2]));
  const pad=Math.min(line.width,line.height)*.08;
  const scale=Math.min((line.width-pad*2)/500,(line.height-pad*2)/500);
  const size=500*scale;
  lx.drawImage(lineImg,(line.width-size)/2,(line.height-size)/2,size,size);

  const od=ox.getImageData(0,0,out.width,out.height);
  const ld=lx.getImageData(0,0,line.width,line.height);
  for(let i=0;i<od.data.length;i+=4){
    const lr=ld.data[i],lg=ld.data[i+1],lb=ld.data[i+2],la=ld.data[i+3];
    const white=od.data[i]>248&&od.data[i+1]>248&&od.data[i+2]>248;
    if(white)od.data[i+3]=0;
    if(la>=18&&(.299*lr+.587*lg+.114*lb)<205)od.data[i+3]=0;
  }
  ox.putImageData(od,0,0);
  return out.toDataURL('image/png');
}

function nativeRestore(){return window.wadfunColorRestoreState}
async function applySavedVisual(saved){
  try{
    const restore=nativeRestore();
    if(typeof restore!=='function'||restore.__wadfunColorV13Wrapped)return false;
    const paint=await makePaint(saved);
    if(!paint)return false;
    restore({paint,ink:''},()=>{});
    return true;
  }catch(e){console.error('[Wadfun] V13 visual resume failed',e);return false}
}

function install(){
  const restore=window.wadfunColorRestoreState;
  if(typeof restore!=='function')return false;
  if(restore.__wadfunColorV13Wrapped)return true;
  const wrapped=function(state,done){
    let ended=false;
    const finish=()=>{if(ended)return;ended=true;if(done)done()};
    (async()=>{
      const saved=await findSaved();
      if(!saved){finish();return}
      /* Prefer the exact saved layer state when it is present. */
      try{
        if(state?.paint||state?.ink){
          const p=state.paint||'';
          const i=state.ink||'';
          restore({paint:p,ink:i},async()=>{
            await applySavedVisual(saved);
            setTimeout(()=>applySavedVisual(saved),250);
            setTimeout(()=>applySavedVisual(saved),900);
            setTimeout(()=>applySavedVisual(saved),1800);
            finish();
          });
          return;
        }
      }catch(e){console.error('[Wadfun] exact color restore failed',e)}
      await applySavedVisual(saved);
      setTimeout(()=>applySavedVisual(saved),250);
      setTimeout(()=>applySavedVisual(saved),900);
      setTimeout(()=>applySavedVisual(saved),1800);
      finish();
    })().catch(e=>{console.error('[Wadfun] V13 resume failed',e);finish()});
    return true;
  };
  wrapped.__wadfunColorV13Wrapped=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}
let n=0;
const timer=setInterval(()=>{if(install()||++n>180)clearInterval(timer)},100);
install();
})();