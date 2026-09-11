/* Wadfun Color Picker Reset V1 — authoritative picker state */
(function(){
'use strict';
if(window.__wadfunColorPickerResetV1)return;window.__wadfunColorPickerResetV1=true;
const CATS='.categoriesGrid', PICS='.pickerGrid';
function cg(){return document.querySelector(CATS)}
function pg(){return document.querySelector(PICS)}
function card(el){return el?.closest?.('.pageCard')||null}
function setDisplay(el,v){if(el)el.style.setProperty('display',v,'important')}
function reset(){
  const c=cg(),p=pg(); if(!c||!p)return false;
  const cc=card(c),pc=card(p);
  if(cc) setDisplay(cc,'block');
  if(pc&&pc!==cc) setDisplay(pc,'none');
  setDisplay(c,'grid'); setDisplay(p,'none');
  window.wadfunColorPickerPage='categories';
  window.wadfunActiveColorTemplate=null;
  window.wadfunColorTemplatePending=false;
  return true;
}
function templates(cat){
  const c=cg(),p=pg(); if(!c||!p)return false;
  const cc=card(c),pc=card(p);
  if(cc) setDisplay(cc,cc===pc?'block':'none');
  if(pc) setDisplay(pc,'block');
  setDisplay(c,'none'); setDisplay(p,'grid');
  window.wadfunColorPickerPage='templates';
  window.wadfunActiveColorCategory=cat||window.wadfunActiveColorCategory||'animals';
  return true;
}
function intercept(){
  const c=cg(); if(!c)return;
  c.querySelectorAll('.cat').forEach(b=>{
    if(b.dataset.wadfunResetBound)return; b.dataset.wadfunResetBound='1';
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopImmediatePropagation();
      window.wadfunActiveColorCategory=b.dataset.cat||'animals';
      if(typeof window.wadfunColorLibrarySelectCategory==='function') window.wadfunColorLibrarySelectCategory(window.wadfunActiveColorCategory);
      else templates(window.wadfunActiveColorCategory);
    },true);
  });
}
function wrapShow(){
  if(typeof window.show!=='function'||window.__wadfunColorPickerShowV1)return;
  window.__wadfunColorPickerShowV1=true;
  const old=window.show;
  window.show=function(mode){
    const r=old.apply(this,arguments);
    if(mode==='color'){
      setTimeout(reset,0);setTimeout(reset,40);setTimeout(reset,180);setTimeout(intercept,220);
    }
    return r;
  };
}
function boot(){wrapShow();if(reset())intercept()}
const mo=new MutationObserver(()=>{if(document.getElementById('color')?.classList.contains('active')){if(window.wadfunColorPickerPage!=='templates')reset();intercept()}});
mo.observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('DOMContentLoaded',boot,{once:true});
setTimeout(boot,50);setTimeout(boot,300);setTimeout(boot,1000);
window.addEventListener('pageshow',boot);
})();
