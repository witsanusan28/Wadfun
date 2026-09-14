/* Wadfun Disable Pinch V3 — UI-only Home bridge; never touches Draw/Color engines. */
(function(){
'use strict';
window.pinchZoom=function(){};
window.wadfunDisablePinch=true;
function loadScript(src,attr){if(document.querySelector('script['+attr+']'))return;const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(attr,'1');document.body?document.body.appendChild(s):document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(s),{once:true})}
loadScript('wadfun-ui-icons.js','data-wadfun-ui-icons');
loadScript('home-art.js','data-wadfun-home-art');
loadScript('home-scene.js','data-wadfun-home-scene');
loadScript('home-master.js','data-wadfun-home-master');
function homeBridge(){
 const h=document.getElementById('home');if(!h||h.dataset.wadfunHomeBridge)return;
 h.dataset.wadfunHomeBridge='1';
}
function boot(){homeBridge()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
