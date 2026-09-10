/* Wadfun Gallery Engine V1 — local作品 gallery helpers */
(function(){
'use strict';
const KEY='wadfunWorks';
function works(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(a){localStorage.setItem(KEY,JSON.stringify(a))}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function downloadWork(id){const w=works().find(x=>x.id===id);if(!w?.img)return;const a=document.createElement('a');a.href=w.img;a.download='Wadfun-'+String(w.name||'ผลงาน').replace(/[^\u0E00-\u0E7Fa-zA-Z0-9_-]+/g,'_')+'.png';document.body.appendChild(a);a.click();a.remove()}
function openWork(id){const w=works().find(x=>x.id===id);if(!w?.img)return;const img=document.getElementById('finishImg');if(img)img.src=w.img;if(typeof show==='function')show('finish')}
function render(){const g=document.getElementById('galleryGrid');if(!g)return;const a=works();g.innerHTML=a.length?a.map(w=>`<div class="work"><img src="${w.img}" alt="${esc(w.name||'ผลงาน')}" loading="lazy"><b>${esc(w.name||'ผลงานของฉัน')}</b><small>${esc(w.date||'')}</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px"><button class="primary" style="padding:9px 6px" onclick="openWork(${w.id})">ดูรูป</button><button class="roundBtn" style="padding:9px 6px" onclick="downloadWork(${w.id})">บันทึก</button></div><button class="danger" style="width:100%;margin-top:6px" onclick="deleteWork(${w.id})">ลบ</button></div>`).join(''):'<div class="help" style="grid-column:1/-1;text-align:center">ยังไม่มีผลงานเลย ✨<br>ลองวาดหรือระบายสีสักรูปนะ</div>'}
window.downloadWork=downloadWork;window.openWork=openWork;
const oldGallery=window.gallery;window.gallery=function(){if(typeof oldGallery==='function')oldGallery();render()};
const oldDelete=window.deleteWork;window.deleteWork=function(id){if(!works().some(w=>w.id===id))return;if(!confirm('ลบผลงานนี้ใช่ไหม?'))return;const a=works().filter(w=>w.id!==id);save(a);render();if(typeof parent==='function')parent()};
function boot(){render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
