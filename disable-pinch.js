/* Wadfun Disable Pinch V1 — permanently disables legacy two-finger zoom without touching Draw/Color engines. */
(function(){
'use strict';
window.pinchZoom=function(){};
window.wadfunDisablePinch=true;
/* UI icon system is presentation-only and loads after DOM is ready. */
function loadUIIcons(){if(document.querySelector('script[data-wadfun-ui-icons]'))return;const s=document.createElement('script');s.src='wadfun-ui-icons.js';s.async=false;s.dataset.wadfunUiIcons='1';document.body?document.body.appendChild(s):document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(s),{once:true})}
loadUIIcons();
})();
