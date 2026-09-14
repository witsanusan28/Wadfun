/* Wadfun Disable Pinch V1 — permanently disables legacy two-finger zoom without touching Draw/Color engines. */
(function(){
'use strict';
window.pinchZoom=function(){};
window.wadfunDisablePinch=true;
function loadScript(src,attr){if(document.querySelector('script['+attr+']'))return;const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(attr,'1');document.body?document.body.appendChild(s):document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(s),{once:true})}
loadScript('wadfun-ui-icons.js','data-wadfun-ui-icons');
loadScript('home-art.js','data-wadfun-home-art');
})();
