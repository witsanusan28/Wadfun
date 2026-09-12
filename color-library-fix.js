/* Wadfun Color Library Fix V8 — deterministic saved-color restore after canvas initialization */
(function(){
'use strict';
if(window.__wadfunColorLibraryV8)return;
window.__wadfunColorLibraryV8=true;

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
 * The color engine exposes paint/ink layers.  Returning to a template can
 * initialize or resize the canvas immediately after restore starts.  V7's
 * guard could stop its later retries too early; V8 always reapplies the saved
 * layers after the canvas has settled, without touching drawing/fill logic.
 */
function installRestoreGuard(){
  const fn=window.wadfunColorRestoreState;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunRestoreV8)return true;
  const wrapped=function(state,done){
    if(!state||!state.paint&&!state.ink){if(done)done();return false}
    let finished=false;
    const apply=()=>{
      try{fn(state,()=>{})}catch(e){console.error('[Wadfun] saved color restore failed',e)}
    };
    apply();
    setTimeout(apply,80);
    setTimeout(apply,220);
    setTimeout(apply,500);
    setTimeout(apply,900);
    setTimeout(()=>{if(!finished){finished=true;if(done)done()}},1050);
    return true;
  };
  wrapped.__wadfunRestoreV8=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}

let n=0;
const guardTimer=setInterval(()=>{
  if(installRestoreGuard()||++n>120)clearInterval(guardTimer);
},100);
installRestoreGuard();
})();
