/* Wadfun Color Library Fix V7 — repair navigation display + harden color resume */
(function(){
'use strict';
if(window.__wadfunColorLibraryV7)return;
window.__wadfunColorLibraryV7=true;

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
 * Resume can race with canvas initialization/resizing.  Retry the same saved
 * paint/ink layers after layout settles, then call the caller callback once.
 */
function installRestoreGuard(){
  const fn=window.wadfunColorRestoreState;
  if(typeof fn!=='function')return false;
  if(fn.__wadfunRestoreV7)return true;
  const wrapped=function(state,done){
    let completed=false;
    const run=()=>{try{fn(state,()=>{});}catch(e){console.error('[Wadfun] color restore retry failed',e)}};
    try{fn(state,()=>{});}catch(e){console.error('[Wadfun] color restore failed',e)}
    setTimeout(run,90);
    setTimeout(run,280);
    setTimeout(run,650);
    setTimeout(()=>{if(!completed){completed=true;if(done)done()}},720);
    return true;
  };
  wrapped.__wadfunRestoreV7=true;
  window.wadfunColorRestoreState=wrapped;
  return true;
}

let n=0;
const guardTimer=setInterval(()=>{
  if(installRestoreGuard()||++n>120)clearInterval(guardTimer);
},100);
installRestoreGuard();
})();
