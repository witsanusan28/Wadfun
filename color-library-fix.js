/* Wadfun Color Library Fix V11 — single deterministic resume guard */
(function(){
'use strict';
if(window.__wadfunColorLibraryV11)return;
window.__wadfunColorLibraryV11=true;

/* Keep screen normalization only. Do not wrap the Color Engine restore API:
 * the library now owns the single resume operation and the engine owns the
 * actual paint/ink layers. Multiple restore wrappers were racing each other. */
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
})();