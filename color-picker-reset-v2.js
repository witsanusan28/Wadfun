/* Wadfun Color Picker Reset V4 — deterministic category state owner */
(function(){
'use strict';
if(window.__wadfunColorPickerResetV4)return;window.__wadfunColorPickerResetV4=true;
let page='categories';
let activeCategory='animals';
let applying=false;
const grids=()=>({c:document.querySelector('.categoriesGrid'),p:document.querySelector('.pickerGrid')});
const card=el=>el?.closest?.('.pageCard')||null;
const set=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
function ensureBack(){const {p}=grids();if(!p)return null;let b=document.getElementById('wadfunColorCategoryBack');if(!b){b=document.createElement('button');b.id='wadfunColorCategoryBack';b.type='button';b.className='back';b.textContent='← กลับเลือกหมวด';b.style.marginBottom='10px';p.parentElement?.insertBefore(b,p)}b.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();page='categories';apply()};return b}
function buildCategories(){const {c}=grids(),d=window.wadfunColorLibraryData||{};if(!c||!Object.keys(d).length)return false;c.innerHTML=Object.entries(d).map(([id,x])=>`<button type="button" class="cat" data-cat="${id}"><div class="catImg">${x.icon}</div><b>${x.name}</b><small>${x.items.length} รูป</small></button>`).join('');return true}
function renderTemplates(){const {p}=grids(),d=window.wadfunColorLibraryData||{},x=d[activeCategory];if(!p||!x)return false;p.innerHTML=x.items.map((it,i)=>`<button type="button" class="template" data-index="${i}"><div class="templateImg">${it[1]}</div><b>${it[0]}</b></button>`).join('');p.dataset.wadfunCategory=activeCategory;return true}
function apply(){if(applying)return;const {c,p}=grids();if(!c||!p)return;applying=true;const box=card(c);if(box)set(box,'display','block');if(page==='templates'){if(p.dataset.wadfunCategory!==activeCategory)renderTemplates();set(c,'display','none');set(p,'display','grid');const b=ensureBack();if(b)set(b,'display','inline-block')}else{set(c,'display','grid');set(p,'display','none');const b=document.getElementById('wadfunColorCategoryBack');if(b)set(b,'display','none')}applying=false}
function chooseCategory(id){if(!id)return;activeCategory=id;page='templates';window.wadfunActiveColorCategory=id;window.wadfunColorPickerPage='templates';renderTemplates();apply()}
function reset(){activeCategory='animals';page='categories';window.wadfunActiveColorCategory='animals';window.wadfunColorPickerPage='categories';window.wadfunActiveColorTemplate=null;window.wadfunColorTemplatePending=false;buildCategories();apply()}
function wrapShow(){if(typeof window.show!=='function'||window.__wadfunColorPickerShowV4)return;window.__wadfunColorPickerShowV4=true;const old=window.show;window.show=function(mode){const r=old.apply(this,arguments);if(mode==='color'&&!window.wadfunColorTemplatePending){setTimeout(reset,0);setTimeout(reset,120);setTimeout(reset,350)}return r}}
document.addEventListener('click',function(e){
 const cat=e.target.closest?.('.categoriesGrid .cat');
 if(cat){e.preventDefault();e.stopImmediatePropagation();chooseCategory(cat.dataset.cat||'animals');return}
 const back=e.target.closest?.('#wadfunColorCategoryBack');
 if(back){e.preventDefault();e.stopImmediatePropagation();page='categories';apply();return}
 const tpl=e.target.closest?.('.pickerGrid .template');
 if(tpl){const x=(window.wadfunColorLibraryData||{})[activeCategory]?.items[Number(tpl.dataset.index)];if(x){e.preventDefault();e.stopImmediatePropagation();window.wadfunColorTemplatePending=true;window.wadfunActiveColorTemplate={category:activeCategory,name:x[0]};if(typeof window.show==='function')window.show('color');let n=0;const tick=()=>{if(window.wadfunRenderActiveColorTemplate?.()||n++>12){window.wadfunColorTemplatePending=false;return}setTimeout(tick,70)};tick()}}
},true);
const mo=new MutationObserver(()=>{if(applying||!document.getElementById('color')?.classList.contains('active'))return;const {c,p}=grids();if(!c||!p)return;const wrong=page==='templates'?(getComputedStyle(c).display==='grid'||getComputedStyle(p).display==='none'||p.dataset.wadfunCategory!==activeCategory):(getComputedStyle(c).display==='none'||getComputedStyle(p).display!=='none');if(wrong){if(page==='templates')renderTemplates();apply()}});
function boot(){wrapShow();const {c,p}=grids();if(c&&p&&!window.__wadfunColorPickerObservedV4){window.__wadfunColorPickerObservedV4=true;mo.observe(c,{subtree:true,childList:true,attributes:true,attributeFilter:['style']});mo.observe(p,{subtree:true,childList:true,attributes:true,attributeFilter:['style']});reset()}}
document.addEventListener('DOMContentLoaded',boot,{once:true});setTimeout(boot,50);setInterval(wrapShow,250);window.addEventListener('pageshow',wrapShow);
})();
