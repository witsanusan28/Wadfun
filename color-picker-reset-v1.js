/* Wadfun Color Picker Reset V2 — reset only when entering Color */
(function(){
'use strict';
if(window.__WADF_COLOR_PICKER_RESET_V2__)return;
window.__WADF_COLOR_PICKER_RESET_V2__=true;
const grids=()=>({c:document.querySelector('.categoriesGrid'),p:document.querySelector('.pickerGrid')});
const card=el=>el?.closest?.('.pageCard');
const set=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
function cat(){const {c,p}=grids();if(!c||!p)return false;set(card(c),'display','block');set(c,'display','grid');set(p,'display','none');const b=document.getElementById('wadfunColorCategoryBack');if(b)set(b,'display','none');return true}
function wrap(){if(window.__WADF_COLOR_SHOW_WRAP_V2__||typeof window.show!=='function')return;window.__WADF_COLOR_SHOW_WRAP_V2__=true;const old=window.show;window.show=function(mode){const r=old.apply(this,arguments);if(mode==='color'){setTimeout(cat,0);setTimeout(cat,120);setTimeout(cat,350)}return r}}
function boot(){wrap()}
document.addEventListener('DOMContentLoaded',boot);setInterval(boot,250);
})();
