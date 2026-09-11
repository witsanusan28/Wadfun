/* Wadfun Color Picker Reset V1 — deterministic picker state */
(function(){
'use strict';
if(window.__WADF_COLOR_PICKER_RESET_V1__)return;
window.__WADF_COLOR_PICKER_RESET_V1__=true;
const grids=()=>({c:document.querySelector('.categoriesGrid'),p:document.querySelector('.pickerGrid')});
const card=el=>el?.closest?.('.pageCard');
const set=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
function cat(){const {c,p}=grids();if(!c||!p)return false;set(card(c),'display','block');set(c,'display','grid');set(p,'display','none');const b=document.getElementById('wadfunColorCategoryBack');if(b)set(b,'display','none');return true}
function tpl(){const {c,p}=grids();if(!c||!p)return false;set(card(c),'display','block');set(c,'display','none');set(p,'display','grid');let b=document.getElementById('wadfunColorCategoryBack');if(!b){b=document.createElement('button');b.id='wadfunColorCategoryBack';b.type='button';b.className='back';b.textContent='← กลับเลือกหมวด';b.style.marginBottom='10px';b.onclick=e=>{e.preventDefault();e.stopPropagation();cat()};p.parentElement.insertBefore(b,p)}set(b,'display','inline-block');return true}
function wrap(){if(window.__WADF_COLOR_SHOW_WRAP_V1__||typeof window.show!=='function')return;window.__WADF_COLOR_SHOW_WRAP_V1__=true;const old=window.show;window.show=function(mode){const r=old.apply(this,arguments);if(mode==='color'){setTimeout(cat,0);setTimeout(cat,120);setTimeout(cat,350)}return r}}
function boot(){wrap();const {c,p}=grids();if(c&&p)cat()}
document.addEventListener('DOMContentLoaded',boot);setInterval(boot,250);
})();
