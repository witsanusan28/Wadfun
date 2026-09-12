/* Wadfun Color Library Fix V10 — deterministic restore after template initialization */
(function(){
'use strict';
if(window.__wadfunColorLibraryV10)return;
window.__wadfunColorLibraryV10=true;

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

/* Keep the original color engine intact. We only make its restore call repeat
 * after the template has finished initializing, because the template loader
 * can rebuild the paint/ink canvases immediately after an earlier restore. */
function installRestoreGuard(){
  const fn=window.wadfunColorRestoreState;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunRestoreV10)return true;
  const wrapped=function(state,done){
    if(!state||(!state.paint&&!state.ink)){if(done)done();return false}
    const apply=()=>{
      try{fn(state,()=>{})}catch(e){console.error('[Wadfun] saved color restore failed',e)}
    };
    apply();
    [80,220,500,900,1400].forEach(ms=>setTimeout(apply,ms));
    setTimeout(()=>{if(done)done()},1500);
    return true;
  };
  wrapped.__wadfunRestoreV10=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}

/* A second, independent restore pass is tied to templateReady itself. This
 * is deliberately read-only: it never creates, deletes, or changes artwork
 * records. Completed saved artwork is preferred over drafts. */
function installTemplateReadyGuard(){
  const fn=window.wadfunColorTemplateReady;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunTemplateReadyV10)return true;
  const wrapped=function(){
    let out;
    try{out=fn.apply(this,arguments)}catch(e){console.error('[Wadfun] template ready failed',e)}
    setTimeout(()=>restoreCurrent(),60);
    setTimeout(()=>restoreCurrent(),250);
    setTimeout(()=>restoreCurrent(),700);
    setTimeout(()=>restoreCurrent(),1400);
    return out;
  };
  wrapped.__wadfunTemplateReadyV10=true;
  window.wadfunColorTemplateReady=wrapped;
  return true;
}

function currentKey(){
  const st=window.wadfunColorLibraryState||{};
  const cat=st.category||window.wadfunActiveColorTemplate?.category||'';
  const idx=Number.isInteger(st.index)?st.index:'';
  const name=window.wadfunActiveColorTemplate?.name||'';
  return `${cat}:${idx}:${name}`;
}
async function restoreCurrent(){
  try{
    const s=window.wadfunStorage;
    const restore=window.wadfunColorRestoreState;
    if(!s||typeof s.getAllArtworks!=='function'||typeof restore!=='function')return false;
    const key=currentKey();
    if(!key||key==='::')return false;
    const all=await s.getAllArtworks();
    const matches=all.filter(x=>x?.mode==='color'&&x?.templateKey===key&&x?.editorState&&(x.editorState.paint||x.editorState.ink));
    if(!matches.length)return false;
    const finals=matches.filter(x=>x.draft!==true);
    const pool=finals.length?finals:matches;
    pool.sort((a,b)=>(Number(b.updatedAt)||0)-(Number(a.updatedAt)||0));
    const saved=pool[0];
    window.wadfunColorResumeId=saved.id;
    restore(saved.editorState,()=>{});
    return true;
  }catch(e){console.error('[Wadfun] post-template color restore failed',e);return false}
}

let n=0;
const timer=setInterval(()=>{
  const restore=installRestoreGuard();
  const ready=installTemplateReadyGuard();
  if((restore||typeof window.wadfunColorRestoreState==='function')&&(ready||typeof window.wadfunColorTemplateReady==='function')||++n>180)clearInterval(timer);
},100);
installRestoreGuard();
installTemplateReadyGuard();
})();