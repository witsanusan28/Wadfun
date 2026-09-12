/* Wadfun Color Library Fix V6 — repair navigation display + make saved color restore resilient */
(function(){
'use strict';
if(window.__wadfunColorLibraryV6)return;
window.__wadfunColorLibraryV6=true;

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
 * Color restore can race with canvas/template initialization and responsive
 * resizing.  Keep the original restore API, but retry it after the canvas is
 * ready and once more after layout settles.  This does not alter drawing,
 * filling, undo/redo, or Start New behavior.
 */
function installRestoreGuard(){
  const fn=window.wadfunColorRestoreState;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunRestoreV6)return true;
  const wrapped=function(state,done){
    let finished=false,attempts=0,timer=null;
    const complete=()=>{if(finished)return;finished=true;if(timer)clearTimeout(timer);if(done)done()};
    const attempt=()=>{
      attempts++;
      let ok=false;
      try{ok=!!fn(state,()=>{complete();setTimeout(()=>retry(),90);setTimeout(()=>retry(),280);})}catch(e){console.error('[Wadfun] color restore guard failed',e)}
      if(ok)return true;
      if(attempts<12){timer=setTimeout(attempt,80);return true}
      complete();
      return false
    };
    const retry=()=>{
      if(!state||finished)return;
      try{fn(state,()=>{})}catch(e){console.error('[Wadfun] color restore retry failed',e)}
    };
    return attempt();
  };
  wrapped.__wadfunRestoreV6=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}

let n=0;
const guardTimer=setInterval(()=>{
  if(installRestoreGuard()||++n>120)clearInterval(guardTimer);
},100);
installRestoreGuard();
})();
