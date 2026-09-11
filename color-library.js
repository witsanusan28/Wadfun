/* Wadfun Color Library V1 — child-friendly built-in coloring templates */
(function(){
'use strict';
if(window.__wadfunColorLibraryV1)return;window.__wadfunColorLibraryV1=true;
const data={
 animals:{name:'สัตว์ 🐾',icon:'🐾',items:[
  ['แมว','🐱',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M105 190L120 70l90 75q45-20 80 0l90-75 15 120q35 45 15 120-35 105-160 105T90 310q-20-75 15-120z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/><path d="M235 285q15 15 30 0M250 300v35M170 285l-75-10M170 300l-75 15M330 285l75-10M330 300l75 15" fill="none"/></g></svg>`],
  ['สุนัข','🐶',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M115 175Q70 80 150 105l55 55q45-20 90 0l55-55q80-25 35 70 35 55 15 125-35 105-150 105T100 300q-20-70 15-125z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/><path d="M235 285q15 15 30 0M250 300v35M205 350q45 30 90 0" fill="none"/></g></svg>`],
  ['ปลา','🐟',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M80 250Q190 105 360 205l70-65v220l-70-65Q190 395 80 250z"/><circle cx="325" cy="230" r="13"/><path d="M165 180q45 70 0 140M225 155q45 95 0 190" fill="none"/></g></svg>`],
  ['ผีเสื้อ','🦋',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M250 250Q155 90 80 130q-45 100 95 175Q35 290 90 400q100 20 160-105"/><path d="M250 250Q345 90 420 130q45 100-95 175 140-15 85 95-100 20-160-105"/><path d="M250 155v220" fill="none"/><circle cx="235" cy="145" r="5" fill="#111"/><circle cx="265" cy="145" r="5" fill="#111"/></g></svg>`]
 ]},
 food:{name:'อาหาร 🍎',icon:'🍎',items:[
  ['แอปเปิล','🍎',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M250 165Q130 105 85 230q-25 150 165 205 190-55 165-205-45-125-165-65z"/><path d="M250 165q-5-70 55-105M275 90q55-25 95 15-60 35-95-15z" fill="white"/><path d="M210 240q40-35 80 0" fill="none"/></g></svg>`],
  ['แตงโม','🍉',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M70 180h360q-10 190-180 190T70 180z"/><path d="M70 180h360" fill="none"/><ellipse cx="170" cy="255" rx="10" ry="20"/><ellipse cx="250" cy="300" rx="10" ry="20"/><ellipse cx="330" cy="255" rx="10" ry="20"/></g></svg>`],
  ['ไอศกรีม','🍦',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M135 210q0-100 115-100t115 100H135z"/><path d="M140 210h220L250 420z"/><path d="M180 145q35-55 70 0M250 145q35-55 70 0" fill="none"/><path d="M190 250l30 25 30-25 30 25 30-25" fill="none"/></g></svg>`]
 ]},
 vehicles:{name:'ยานพาหนะ 🚗',icon:'🚗',items:[
  ['รถยนต์','🚗',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M90 300l45-105h230l45 105v90H90z"/><path d="M150 205l35-55h130l35 55z"/><circle cx="155" cy="390" r="35"/><circle cx="345" cy="390" r="35"/><path d="M120 300h260M210 205v95" fill="none"/></g></svg>`],
  ['จรวด','🚀',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M250 60q100 80 100 220l-45 80h-110l-45-80Q150 140 250 60z"/><path d="M150 260l-65 35 55 45M350 260l65 35-55 45"/><circle cx="250" cy="190" r="32"/><path d="M210 360l-25 75 65-45 65 45-25-75"/></g></svg>`],
  ['เครื่องบิน','✈️',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M70 245l150-20 80-120h55l-30 115 100 15q45 8 0 30l-100 15 30 115h-55l-80-120-150-20q-45-5 0-10z"/></g></svg>`]
 ]},
 nature:{name:'ธรรมชาติ 🌈',icon:'🌈',items:[
  ['ดอกไม้','🌸',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M250 255v180M250 345q-75-60-120 10 70 35 120 0M250 365q75-60 120 10-70 35-120 0" fill="none"/><circle cx="250" cy="220" r="45"/><circle cx="180" cy="175" r="55"/><circle cx="320" cy="175" r="55"/><circle cx="185" cy="285" r="55"/><circle cx="315" cy="285" r="55"/></g></svg>`],
  ['ดวงอาทิตย์','☀️',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><circle cx="250" cy="250" r="90"/><path d="M250 55v70M250 375v70M55 250h70M375 250h70M112 112l50 50M338 338l50 50M388 112l-50 50M162 338l-50 50" fill="none"/></g></svg>`],
  ['เมฆ','☁️',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M100 330q0-80 80-80 20-90 105-65 55 10 60 70 75-10 75 75 0 55-65 55H165q-65 0-65-55z"/></g></svg>`]
 ]},
 fantasy:{name:'แฟนตาซี 🦖',icon:'🦖',items:[
  ['ไดโนเสาร์','🦖',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M110 360q-25-115 55-175 60-45 145-5l55-75 65 55-75 55q15 65-25 110l45 55H280l-25-65-45 65z"/><circle cx="275" cy="190" r="8" fill="#111"/><path d="M135 330l-65 35M155 350l-50 55M350 345l70 35" fill="none"/></g></svg>`],
  ['จรวดอวกาศ','🌟',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12" stroke-linejoin="round"><path d="M250 75q75 70 75 170v95H175v-95q0-100 75-170z"/><circle cx="250" cy="205" r="30"/><path d="M175 270l-70 45 70 5M325 270l70 45-70 5M210 340l40 70 40-70" fill="none"/></g></svg>`]
 ]}
};
let active='animals';
const esc=s=>String(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
function catGrid(){return document.querySelector('.categoriesGrid')}
function pickGrid(){return document.querySelector('.pickerGrid')}
function cards(){const g=catGrid();if(!g)return;g.innerHTML=Object.entries(data).map(([id,c],i)=>`<button type="button" class="cat" data-cat="${id}"><div class="catImg">${c.icon}</div><b>${c.name}</b><small>${c.items.length} รูป</small></button>`).join('');g.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.cat;showTemplates()}));}
function showTemplates(){const g=pickGrid();if(!g)return;const c=data[active];g.innerHTML=c.items.map((x,i)=>`<button type="button" class="template" data-index="${i}"><div class="templateImg">${x[1]}</div><b>${esc(x[0])}</b></button>`).join('');g.querySelectorAll('.template').forEach(b=>b.addEventListener('click',()=>selectTemplate(Number(b.dataset.index))));const cg=catGrid();if(cg)cg.closest('.pageCard').style.display='none';g.closest('.pageCard').style.display='block';}
function showCategories(){const cg=catGrid(),pg=pickGrid();if(cg){cg.closest('.pageCard').style.display='block'}if(pg){pg.closest('.pageCard').style.display='none'}cards();}
function sizeCanvas(c){const p=c.parentElement,r=p?.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);if(r&&r.width>10&&r.height>10){c.style.width=r.width+'px';c.style.height=r.height+'px';c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}}
function renderTemplate(item){const c=document.getElementById('colorCanvas');if(!c||!document.getElementById('color')?.classList.contains('active'))return false;sizeCanvas(c);const ctx=c.getContext('2d');if(!ctx)return false;const im=new Image();im.onload=()=>{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);const pad=Math.min(c.width,c.height)*.10,scale=Math.min((c.width-pad*2)/500,(c.height-pad*2)/500),w=500*scale,h=500*scale;ctx.drawImage(im,(c.width-w)/2,(c.height-h)/2,w,h);window.wadfunResetColorMask?.();window.wadfunColorTemplateChanged?.();window.wadfunColorHistoryReset?.();};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item[2]);return true}
function selectTemplate(i){const item=data[active]?.items[i];if(!item)return;window.wadfunColorTemplatePending=true;window.wadfunActiveColorTemplate={category:active,name:item[0]};if(typeof window.show==='function')window.show('color');let n=0;const tick=()=>{if(renderTemplate(item)||n++>8){window.wadfunColorTemplatePending=false;return}setTimeout(tick,80)};tick();}
window.wadfunRenderActiveColorTemplate=()=>{const t=window.wadfunActiveColorTemplate;if(!t)return false;const item=data[t.category]?.items.find(x=>x[0]===t.name);return !!item&&renderTemplate(item)};
window.wadfunClearActiveColorTemplate=()=>{window.wadfunActiveColorTemplate=null;window.wadfunColorTemplatePending=false};
function install(){
  if(!catGrid()||!pickGrid())return false;
  cards();showCategories();
  const pg=pickGrid();if(pg)pg.closest('.pageCard').style.display='none';
  const cg=catGrid();if(cg)cg.closest('.pageCard').style.display='block';
  const oldEdit=window.editWork;if(typeof oldEdit==='function'&&!window.__wadfunGalleryEditWrapped){window.__wadfunGalleryEditWrapped=true;window.editWork=function(){window.wadfunClearActiveColorTemplate();return oldEdit.apply(this,arguments)}}
  return true;
}
setInterval(()=>{if(!install()){}},500);
})();
