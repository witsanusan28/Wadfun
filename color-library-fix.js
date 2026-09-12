/* Wadfun Color Library Fix V9 — deterministic restore + saved artwork wins over drafts */
(function(){
'use strict';
if(window.__wadfunColorLibraryV9)return;
window.__wadfunColorLibraryV9=true;

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

/*
 * Returning to a template can initialize or resize the canvas after restore.
 * Reapply the saved paint/ink layers after the canvas has settled.
 */
function installRestoreGuard(){
  const fn=window.wadfunColorRestoreState;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunRestoreV9)return true;
  const wrapped=function(state,done){
    if(!state||!state.paint&&!state.ink){if(done)done();return false}
    const apply=()=>{
      try{fn(state,()=>{})}catch(e){console.error('[Wadfun] saved color restore failed',e)}
    };
    apply();
    setTimeout(apply,80);
    setTimeout(apply,220);
    setTimeout(apply,500);
    setTimeout(apply,900);
    setTimeout(()=>{if(done)done()},1050);
    return true;
  };
  wrapped.__wadfunRestoreV9=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}

/*
 * Important data-flow guard:
 * color-library resume uses the first matching record. Gallery autosave may
 * have created a newer draft, sometimes blank, for the same template. That
 * draft must never mask a completed saved artwork. We only reorder reads; no
 * records are created, deleted, or modified here.
 */
function installStorageOrder(){
  const s=window.wadfunStorage;
  if(!s||s.__wadfunColorOrderV9)return false;
  if(typeof s.getAllArtworks!=='function')return false;
  const old=s.getAllArtworks.bind(s);
  const hasState=x=>!!(x&&x.editorState&&(x.editorState.paint||x.editorState.ink));
  const hasImage=x=>typeof x?.imageData==='string'&&x.imageData.length>100;
  s.getAllArtworks=async function(){
    const all=await old();
    return all.slice().sort((a,b)=>{
      const colorA=a?.mode==='color',colorB=b?.mode==='color';
      if(colorA!==colorB)return 0;
      if(colorA){
        const score=x=>(x?.draft?0:8)+(hasState(x)?4:0)+(hasImage(x)?2:0);
        const d=score(b)-score(a);
        if(d)return d;
      }
      return (Number(b?.updatedAt)||0)-(Number(a?.updatedAt)||0);
    });
  };
  s.__wadfunColorOrderV9=true;
  return true;
}

let n=0;
const timer=setInterval(()=>{
  const restore=installRestoreGuard();
  const order=installStorageOrder();
  if((restore||typeof window.wadfunColorRestoreState==='function')&&(order||window.wadfunStorage?.__wadfunColorOrderV9)||++n>180)clearInterval(timer);
},100);
installRestoreGuard();
installStorageOrder();
})();
