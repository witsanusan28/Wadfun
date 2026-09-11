/* Wadfun Color Picker Controller V1 — final state owner */
(function(){
'use strict';
if(window.__WADF_COLOR_PICKER_CONTROLLER_V1__)return;
window.__WADF_COLOR_PICKER_CONTROLLER_V1__=true;
let mode='categories';
let applying=false;
const grids=()=>({c:document.querySelector('.categoriesGrid'),p:document.querySelector('.pickerGrid')});
const card=el=>el?.closest?.('.pageCard');
const set=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
function apply(){
 if(applying)return;
 const {c,p}=grids();if(!c||!p)return;
 applying=true;
 const box=card(c);set(box,'display','block');
 if(mode==='templates'){
  set(c,'display','none');set(p,'display','grid');
  const b=document.getElementById('wadfunColorCategoryBack');if(b)set(b,'display','inline-block');
 }else{
  set(c,'display','grid');set(p,'display','none');
  const b=document.getElementById('wadfunColorCategoryBack');if(b)set(b,'display','none');
 }
 applying=false;
}
function wrapShow(){
 if(window.__WADF_COLOR_PICKER_SHOW_WRAP_V1__||typeof window.show!=='function')return;
 window.__WADF_COLOR_PICKER_SHOW_WRAP_V1__=true;
 const old=window.show;
 window.show=function(name){
  const r=old.apply(this,arguments);
  if(name==='color'){mode='categories';setTimeout(apply,0);setTimeout(apply,120);setTimeout(apply,400)}
  return r;
 };
}
document.addEventListener('click',function(e){
 const cat=e.target.closest?.('.categoriesGrid .cat');
 if(cat){mode='templates';setTimeout(apply,0);setTimeout(apply,30);return;}
 const back=e.target.closest?.('#wadfunColorCategoryBack');
 if(back){mode='categories';setTimeout(apply,0);return;}
},true);
const mo=new MutationObserver(function(){
 if(applying)return;
 if(!document.getElementById('color')?.classList.contains('active'))return;
 const {c,p}=grids();if(!c||!p)return;
 const wantTpl=mode==='templates';
 const wrong=wantTpl?(getComputedStyle(c).display!=='none'||getComputedStyle(p).display==='none'):(getComputedStyle(c).display==='none'||getComputedStyle(p).display!=='none');
 if(wrong)requestAnimationFrame(apply);
});
function boot(){wrapShow();const {c,p}=grids();if(c&&p){apply();mo.observe(c,{attributes:true,attributeFilter:['style']});mo.observe(p,{attributes:true,attributeFilter:['style']})}}
document.addEventListener('DOMContentLoaded',boot);
setInterval(wrapShow,250);
})();
