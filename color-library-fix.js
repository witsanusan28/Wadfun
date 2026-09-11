/* Wadfun Color Library Fix V5 — repair navigation display state */
(function(){
'use strict';
if(window.__wadfunColorLibraryV5)return;
window.__wadfunColorLibraryV5=true;
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
