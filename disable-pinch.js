/* Wadfun Disable Pinch V2 — UI-only Home interaction bridge; never touches Draw/Color engines. */
(function(){
'use strict';
window.pinchZoom=function(){};
window.wadfunDisablePinch=true;
function loadScript(src,attr){if(document.querySelector('script['+attr+']'))return;const s=document.createElement('script');s.src=src;s.async=false;s.setAttribute(attr,'1');document.body?document.body.appendChild(s):document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(s),{once:true})}
loadScript('wadfun-ui-icons.js','data-wadfun-ui-icons');
loadScript('home-art.js','data-wadfun-home-art');
loadScript('home-scene.js','data-wadfun-home-scene');
function homeBridge(){
 const h=document.getElementById('home');if(!h||h.dataset.wadfunHomeBridge)return;
 h.dataset.wadfunHomeBridge='1';
 const css=document.createElement('style');css.dataset.wadfunHomeBridge='1';css.textContent='.home .m1,.home .m2{z-index:12;cursor:pointer}.home .m1{left:15%;top:26%;bottom:auto}.home .m2{right:14%;top:28%;bottom:auto}.home .choice.draw,.home .choice.color{cursor:pointer}.home .choice.draw:active,.home .choice.color:active,.home .m1:active,.home .m2:active{transform:scale(.985)}';document.head.appendChild(css);
 const wire=(el,go)=>{if(!el||el.dataset.wired)return;el.dataset.wired='1';el.setAttribute('role','button');el.setAttribute('tabindex','0');el.addEventListener('click',e=>{if(e.target.closest('.go'))return;go?.click()});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go?.click()}})};
 const refresh=()=>{const d=h.querySelector('.choice.draw'),c=h.querySelector('.choice.color');wire(d,d?.querySelector('.go'));wire(c,c?.querySelector('.go'));wire(h.querySelector('.m1'),d?.querySelector('.go'));wire(h.querySelector('.m2'),c?.querySelector('.go'))};
 refresh();new MutationObserver(refresh).observe(h,{childList:true,subtree:true});
}
function boot(){homeBridge();setTimeout(homeBridge,100);setTimeout(homeBridge,500)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
