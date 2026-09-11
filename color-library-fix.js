/* Wadfun Color Library Fix V1 — keep category/template grids in the same card visible */
(function(){
'use strict';
if(window.__wadfunColorLibraryFixV1)return;window.__wadfunColorLibraryFixV1=true;
function grids(){return {cg:document.querySelector('.categoriesGrid'),pg:document.querySelector('.pickerGrid')}}
function parentOf(el){return el?.closest?.('.pageCard')||null}
function showCategories(){
  const {cg,pg}=grids(); if(!cg||!pg)return false;
  const p=parentOf(cg)||parentOf(pg); if(p)p.style.display='block';
  cg.style.display='grid'; pg.style.display='none';
  return true;
}
function showTemplates(){
  const {cg,pg}=grids(); if(!cg||!pg)return false;
  const p=parentOf(cg)||parentOf(pg); if(p)p.style.display='block';
  cg.style.display='none'; pg.style.display='grid';
  return true;
}
function addBackButton(){
  const {pg}=grids(); if(!pg||document.getElementById('wadfunColorCategoryBack'))return;
  const b=document.createElement('button');
  b.id='wadfunColorCategoryBack'; b.type='button'; b.className='back';
  b.textContent='← กลับเลือกหมวด';
  b.style.marginBottom='10px';
  b.addEventListener('click',showCategories);
  pg.parentElement?.insertBefore(b,pg);
}
document.addEventListener('click',function(e){
  const cat=e.target.closest?.('.categoriesGrid .cat');
  if(cat){
    // The library's own handler runs first. Restore the shared card after it finishes.
    setTimeout(function(){showTemplates();addBackButton()},0);
    return;
  }
},false);
const timer=setInterval(function(){
  const {cg,pg}=grids();
  if(cg&&pg){
    addBackButton();
    // Do not fight the library while it is rendering; only repair a hidden shared parent.
    const p=parentOf(cg)||parentOf(pg);
    if(p&&getComputedStyle(p).display==='none'&&document.getElementById('color')?.classList.contains('active')){
      p.style.display='block';
      if(cg.style.display!=='none'&&pg.style.display!=='grid')showCategories();
    }
  }
},250);
window.addEventListener('wadfun-work-loaded',function(){showCategories()});
})();
