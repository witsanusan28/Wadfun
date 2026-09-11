/* Wadfun Color Library V7 — reliable picture selection + persistent picker state */
(function(){
'use strict';
if(window.__wadfunColorLibraryV7)return;
window.__wadfunColorLibraryV7=true;

const data={
 animals:{name:'สัตว์ 🐾',icon:'🐾',items:[
  ['แมว','🐱','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M105 190L120 70l90 75q40-20 80 0l90-75 15 120q35 45 15 120-35 105-160 105T90 310q-20-75 15-120z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/><path d="M235 285q15 15 30 0M250 300v35" fill="none"/></g></svg>'],
  ['สุนัข','🐶','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M115 175Q70 80 150 105l55 55q45-20 90 0l55-55q80-25 35 70 35 55 15 125-35 105-150 105T100 300q-20-70 15-125z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/></g></svg>'],
  ['ปลา','🐟','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M80 250Q190 105 360 205l70-65v220l-70-65Q190 395 80 250z"/><circle cx="325" cy="230" r="13"/></g></svg>'],
  ['ผีเสื้อ','🦋','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M250 250Q155 90 80 130q-45 100 95 175Q35 290 90 400q100 20 160-105M250 250Q345 90 420 130q45 100-95 175 140-15 85 95-100 20-160-105M250 155v220" fill="none"/></g></svg>']
 ]},
 food:{name:'อาหาร 🍎',icon:'🍎',items:[
  ['แอปเปิล','🍎','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 165Q130 105 85 230q-25 150 165 205 190-55 165-205-45-125-165-65z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
  ['แตงโม','🍉','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M70 180h360q-10 190-180 190T70 180z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
  ['ไอศกรีม','🍦','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M135 210q0-100 115-100t115 100H135zM140 210h220L250 420z" fill="white" stroke="#111" stroke-width="12"/></svg>']
 ]},
 vehicles:{name:'ยานพาหนะ 🚗',icon:'🚗',items:[
  ['รถยนต์','🚗','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M90 300l45-105h230l45 105v90H90z" fill="white" stroke="#111" stroke-width="12"/><circle cx="155" cy="390" r="35" fill="white" stroke="#111" stroke-width="12"/><circle cx="345" cy="390" r="35" fill="white" stroke="#111" stroke-width="12"/></svg>'],
  ['จรวด','🚀','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 60q100 80 100 220l-45 80h-110l-45-80Q150 140 250 60z" fill="white" stroke="#111" stroke-width="12"/><circle cx="250" cy="190" r="32" fill="white" stroke="#111" stroke-width="12"/></svg>'],
  ['เครื่องบิน','✈️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M70 245l150-20 80-120h55l-30 115 100 15q45 8 0 30l-100 15 30 115h-55l-80-120-150-20q-45-5 0-10z" fill="white" stroke="#111" stroke-width="12"/></svg>']
 ]},
 nature:{name:'ธรรมชาติ 🌈',icon:'🌈',items:[
  ['ดอกไม้','🌸','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250" cy="220" r="45" fill="white" stroke="#111" stroke-width="12"/><circle cx="180" cy="175" r="55" fill="white" stroke="#111" stroke-width="12"/><circle cx="320" cy="175" r="55" fill="white" stroke="#111" stroke-width="12"/><path d="M250 255v180" fill="none" stroke="#111" stroke-width="12"/></svg>'],
  ['ดวงอาทิตย์','☀️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250" cy="250" r="90" fill="white" stroke="#111" stroke-width="12"/><path d="M250 55v70M250 375v70M55 250h70M375 250h70" stroke="#111" stroke-width="12"/></svg>'],
  ['เมฆ','☁️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M100 330q0-80 80-80 20-90 105-65 55 10 60 70 75-10 75 75 0 55-65 55H165q-65 0-65-55z" fill="white" stroke="#111" stroke-width="12"/></svg>']
 ]},
 fantasy:{name:'แฟนตาซี 🦖',icon:'🦖',items:[
  ['ไดโนเสาร์','🦖','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M110 360q-25-115 55-175 60-45 145-5l55-75 65 55-75 55q15 65-25 110l45 55H280l-25-65-45 65z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
  ['จรวดอวกาศ','🌟','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 75q75 70 75 170v95H175v-95q0-100 75-170z" fill="white" stroke="#111" stroke-width="12"/><circle cx="250" cy="205" r="30" fill="white" stroke="#111" stroke-width="12"/></svg>']
 ]}
};
window.wadfunColorLibraryData=data;
let activeCategory=window.wadfunColorLibraryState?.category||'animals';
let selectedIndex=Number.isInteger(window.wadfunColorLibraryState?.index)?window.wadfunColorLibraryState.index:null;
const $=id=>document.getElementById(id);
const grid=()=> $('categoriesGrid');
const pgrid=()=> $('pickerGrid');
function scrollTop(){try{window.scrollTo({top:0,behavior:'instant'})}catch(e){window.scrollTo(0,0)}}
function ensureState(){window.wadfunColorLibraryState={category:activeCategory,index:selectedIndex}}
function renderCategories(){const g=grid();if(!g)return false;g.innerHTML=Object.entries(data).map(([id,c])=>`<button type="button" class="cat" data-cat="${id}" aria-label="เลือกหมวด ${c.name}"><div class="catImg">${c.icon}</div><b>${c.name}</b><small>${c.items.length} รูป</small></button>`).join('');return !!g.children.length}
function renderPictures(){const g=pgrid(),c=data[activeCategory];if(!g||!c)return false;g.innerHTML=c.items.map((it,i)=>`<button type="button" class="template${selectedIndex===i?' selected':''}" data-index="${i}" data-cat="${activeCategory}" aria-label="เลือกรูป ${it[0]}"><div class="templateImg">${it[2]}</div><b>${it[0]}${selectedIndex===i?' ✓':''}</b></button>`).join('');g.dataset.wadfunCategory=activeCategory;const p=$('picker');const t=p?.querySelector('#pickerTitle');const s=p?.querySelector('#pickerSub');if(t)t.textContent=`${c.icon} ${c.name}`;if(s)s.textContent=`เลือกจาก ${c.items.length} รูป แล้วแตะรูปเพื่อเริ่มระบายสี ✨`;ensureState();return !!g.children.length}
function showCategories(){const c=$('categories'),p=$('picker');if(!c||!p)return false;c.classList.add('active');p.classList.remove('active');c.style.setProperty('display','block','important');p.style.setProperty('display','none','important');grid()?.style.setProperty('display','grid','important');scrollTop();return true}
function showPicker(){const c=$('categories'),p=$('picker');if(!c||!p)return false;c.classList.remove('active');p.classList.add('active');c.style.setProperty('display','none','important');p.style.setProperty('display','block','important');pgrid()?.style.setProperty('display','grid','important');renderPictures();scrollTop();return true}
function selectedItem(){return data[activeCategory]?.items[selectedIndex]}
function directColorScreen(){const color=$('color');if(!color)return false;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s===color));document.querySelectorAll('.screen').forEach(s=>s.style.removeProperty('display'));color.style.setProperty('display','block','important');try{window.initColor?.()}catch(e){console.warn('[Wadfun] initColor failed',e)}return true}
function renderSelected(){const item=selectedItem(),canvas=$('colorCanvas');if(!item||!canvas)return false;const vp=$('colorViewport')||canvas.parentElement;const r=vp?.getBoundingClientRect();if(!r||r.width<20||r.height<20)return false;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(50,Math.round(r.width*dpr));canvas.height=Math.max(50,Math.round(r.height*dpr));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';const ctx=canvas.getContext('2d');const img=new Image();img.onload=()=>{ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);const pad=Math.min(canvas.width,canvas.height)*.08,scale=Math.min((canvas.width-pad*2)/500,(canvas.height-pad*2)/500),size=500*scale;ctx.drawImage(img,(canvas.width-size)/2,(canvas.height-size)/2,size,size);try{window.wadfunColorResetV24?.()}catch(e){}try{window.wadfunResetColorMask?.()}catch(e){}try{window.wadfunColorTemplateChanged?.()}catch(e){}try{window.wadfunColorHistoryReset?.()}catch(e){}try{window.wadfunEnsureColorLineOverlay?.()}catch(e){}};img.onerror=()=>console.error('[Wadfun] selected SVG failed');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item[2]);return true}
function choosePicture(i){const c=data[activeCategory];if(!c?.items[i])return false;selectedIndex=i;ensureState();window.wadfunActiveColorTemplate={category:activeCategory,name:c.items[i][0]};window.wadfunColorTemplatePending=true;window.currentTemplate=c.items[i][1]+' '+c.items[i][0];window.currentName='🖍️ '+c.items[i][0];directColorScreen();let n=0;(function wait(){if(renderSelected()||n++>=50){window.wadfunColorTemplatePending=false;if(n>=50)console.error('[Wadfun] color canvas not ready');return}setTimeout(wait,60)})();return true}
function changePicture(){showPicker()}
function addChangeButton(){const bar=$('#color .toolbar');if(!bar||$('wadfunChangePicture'))return;const b=document.createElement('button');b.type='button';b.id='wadfunChangePicture';b.className='tb';b.innerHTML='<i>🖼️</i><span>เปลี่ยนรูป</span>';bar.insertBefore(b,bar.firstChild)}
function install(){if(window.__wadfunColorLibraryV7Installed)return;window.__wadfunColorLibraryV7Installed=true;document.addEventListener('click',e=>{const cat=e.target.closest?.('#categoriesGrid .cat');if(cat){e.preventDefault();e.stopImmediatePropagation();activeCategory=cat.dataset.cat||'animals';selectedIndex=null;ensureState();renderPictures();showPicker();return}const pic=e.target.closest?.('#pickerGrid .template');if(pic){e.preventDefault();e.stopImmediatePropagation();choosePicture(Number(pic.dataset.index));return}if(e.target.closest?.('#wadfunColorCategoryBack')){e.preventDefault();e.stopImmediatePropagation();showCategories();return}if(e.target.closest?.('#wadfunChangePicture')){e.preventDefault();e.stopImmediatePropagation();changePicture();return}},true);addChangeButton()}
function boot(){if(!$('categories')||!$('picker')||!pgrid()||!$('color'))return false;renderCategories();renderPictures();install();addChangeButton();return true}
const timer=setInterval(()=>{if(boot())clearInterval(timer)},100);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('resize',()=>{if($('color')?.classList.contains('active')&&selectedItem())setTimeout(renderSelected,0)});
})();