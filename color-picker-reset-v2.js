/* Wadfun Color Picker Reset V2 — authoritative picker state */
(function(){
'use strict';
if(window.__wadfunColorPickerResetV2)return;window.__wadfunColorPickerResetV2=true;
const CATS='.categoriesGrid',PICS='.pickerGrid';
function cg(){return document.querySelector(CATS)} function pg(){return document.querySelector(PICS)}
function card(el){return el?.closest?.('.pageCard')||null}
function show(el,v){if(el)el.style.setProperty('display',v,'important')}
function data(){return window.wadfunColorLibraryData||{}}
function reset(){const c=cg(),p=pg();if(!c||!p)return false;const cc=card(c),pc=card(p);if(cc)show(cc,'block');if(pc&&pc!==cc)show(pc,'none');show(c,'grid');show(p,'none');window.wadfunColorPickerPage='categories';window.wadfunActiveColorTemplate=null;window.wadfunColorTemplatePending=false;return true}
function renderCategory(cat){const p=pg(),d=data(),items=d[cat]?.items;if(!p||!items)return false;p.innerHTML=items.map((x,i)=>`<button type="button" class="template" data-index="${i}"><div class="templateImg">${x[1]}</div><b>${x[0]}</b></button>`).join('');const c=cg(),cc=card(c),pc=card(p);if(cc&&cc!==pc)show(cc,'none');if(pc)show(pc,'block');show(c,'none');show(p,'grid');window.wadfunActiveColorCategory=cat;window.wadfunColorPickerPage='templates';p.querySelectorAll('.template').forEach(b=>b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();const item=items[Number(b.dataset.index)];if(!item)return;window.wadfunColorTemplatePending=true;window.wadfunActiveColorTemplate={category:cat,name:item[0]};if(typeof window.show==='function')window.show('color');let n=0;const tick=()=>{if((typeof window.wadfunRenderActiveColorTemplate==='function'&&window.wadfunRenderActiveColorTemplate())||n++>10){window.wadfunColorTemplatePending=false;return}setTimeout(tick,70)};tick()},true));return true}
function buildCategories(){const c=cg(),d=data();if(!c||!Object.keys(d).length)return false;c.innerHTML=Object.entries(d).map(([id,x])=>`<button type="button" class="cat" data-cat="${id}"><div class="catImg">${x.icon}</div><b>${x.name}</b><small>${x.items.length} รูป</small></button>`).join('');c.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();renderCategory(b.dataset.cat||'animals')},true));return true}
function backButton(){const p=pg();if(!p)return;let b=document.getElementById('wadfunColorCategoryBack');if(!b){b=document.createElement('button');b.id='wadfunColorCategoryBack';b.type='button';b.className='back';b.textContent='← กลับเลือกหมวด';p.parentElement?.insertBefore(b,p)}b.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();reset()};b.style.display='inline-block'}
function boot(){if(buildCategories()){reset();backButton()}}
function wrapShow(){if(typeof window.show!=='function'||window.__wadfunColorPickerShowV2)return;window.__wadfunColorPickerShowV2=true;const old=window.show;window.show=function(mode){const r=old.apply(this,arguments);if(mode==='color'&&!window.wadfunColorTemplatePending){setTimeout(boot,0);setTimeout(boot,80);setTimeout(boot,220)}return r}}
const mo=new MutationObserver(()=>{if(document.getElementById('color')?.classList.contains('active')){wrapShow();backButton()}});mo.observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('DOMContentLoaded',()=>{wrapShow();boot()},{once:true});setTimeout(()=>{wrapShow();boot()},50);setTimeout(()=>wrapShow(),300);window.addEventListener('pageshow',boot);
})();
