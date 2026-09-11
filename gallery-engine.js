/* Wadfun Gallery Engine V11 — save Color canvas before navigation */
(function(){
'use strict';
const STORAGE_SRC='wadfun-storage.js';
let editingId=null,editingMode=null,storagePromise=null,finishWrapped=false,colorFinishInstalled=false;
function loadStorage(){
  if(window.wadfunStorage)return Promise.resolve(window.wadfunStorage);
  if(storagePromise)return storagePromise;
  storagePromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=STORAGE_SRC;s.onload=()=>window.wadfunStorage?resolve(window.wadfunStorage):reject(new Error('Wadfun storage unavailable'));s.onerror=()=>reject(new Error('Cannot load wadfun-storage.js'));document.head.appendChild(s)});
  return storagePromise;
}
async function works(){try{await loadStorage();return await window.wadfunStorage.getAllArtworks()}catch(e){console.error('[Wadfun] gallery read failed',e);return[]}}
async function get(id){try{await loadStorage();return await window.wadfunStorage.getArtwork(id)}catch(e){console.error('[Wadfun] artwork read failed',e);return null}}
function imageOf(w){return w?.imageData||w?.img||''}
function esc(s){return String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]))}
function activeCanvas(){return document.querySelector('.screen.active canvas.canvas')||document.querySelector('.screen.active canvas')}
function colorCanvas(){return document.getElementById('colorCanvas')}
function loadImageIntoActiveCanvas(w){return new Promise(resolve=>{const canvas=activeCanvas();if(!canvas){resolve(false);return}const img=new Image();img.onload=()=>{try{const r=canvas.getBoundingClientRect(),W=Math.max(1,Math.round(r.width||canvas.width||img.naturalWidth)),H=Math.max(1,Math.round(r.height||canvas.height||img.naturalHeight));canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,W,H);ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);const scale=Math.min(W/img.naturalWidth,H/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.drawImage(img,(W-dw)/2,(H-dh)/2,dw,dh);canvas.dispatchEvent(new Event('wadfun-work-loaded'));resolve(true)}catch(e){console.error('[Wadfun] load edit failed',e);resolve(false)}};img.onerror=()=>resolve(false);img.src=imageOf(w)})}
async function editWork(id){const w=await get(id);if(!w)return;editingId=String(id);editingMode=w.mode==='color'?'color':'draw';closeViewer();try{if(typeof window.show==='function')window.show(editingMode)}catch(e){}setTimeout(()=>loadImageIntoActiveCanvas(w),220)}
async function openWork(id){const w=await get(id),src=imageOf(w);if(!src)return;ensureViewer();const v=document.getElementById('wadfunViewer');v.dataset.id=String(id);document.getElementById('wadfunViewerImg').src=src;v.classList.add('open');document.body.classList.add('wadfun-viewer-open')}
function closeViewer(){const v=document.getElementById('wadfunViewer');if(v){v.classList.remove('open');document.body.classList.remove('wadfun-viewer-open')}}
function currentId(){return document.getElementById('wadfunViewer')?.dataset.id}
function closeWorkViewer(){closeViewer()}
function editWorkViewer(){const id=currentId();if(id)editWork(id)}
function shareWorkViewer(){const id=currentId();if(id)shareWork(id)}
async function shareWork(id){const w=await get(id),src=imageOf(w);if(!src)return;try{if(navigator.share){let file=null;try{const r=await fetch(src),b=await r.blob();file=new File([b],'Wadfun.png',{type:b.type||'image/png'})}catch(e){}if(file&&navigator.canShare?.({files:[file]}))await navigator.share({title:'ผลงานจาก Wadfun',text:'ผลงานของฉัน',files:[file]});else await navigator.share({title:'ผลงานจาก Wadfun',text:'ผลงานของฉัน'})}}catch(e){if(e?.name!=='AbortError')console.error('[Wadfun] share failed',e)}}
function ensureViewer(){if(document.getElementById('wadfunViewer'))return;const s=document.createElement('style');s.textContent='.wadfun-viewer-open{overflow:hidden}.wadfun-viewer{display:none;position:fixed;inset:0;z-index:99999;background:rgba(20,43,57,.94);padding:12px;align-items:center;justify-content:center}.wadfun-viewer.open{display:flex}.wadfun-viewer-card{width:min(960px,100%);height:min(94dvh,900px);background:#fff;border-radius:28px;padding:14px;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3)}.wadfun-viewer-head{display:flex;justify-content:flex-end;padding:2px 2px 10px}.wadfun-viewer-close{width:44px;height:44px;border-radius:50%;background:#ffe6e8;font-size:24px;font-weight:1000}.wadfun-viewer-stage{flex:1;min-height:0;border-radius:20px;background:#f5fbff;display:flex;align-items:center;justify-content:center;overflow:hidden}.wadfun-viewer-stage img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}.wadfun-viewer-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding-top:10px}.wadfun-viewer-actions button{min-width:130px}.wadfun-share{background:#e8f7ff;border:2px solid #bfe6f7;border-radius:16px;padding:11px 15px;font-weight:1000}.wadfun-edit{background:#fff4cf;border:2px solid #e6c56a;border-radius:16px;padding:11px 15px;font-weight:1000}@media(max-width:600px){.wadfun-viewer{padding:6px}.wadfun-viewer-card{height:calc(100dvh - 12px);border-radius:22px;padding:9px}.wadfun-viewer-actions button{flex:1;min-width:0}.wadfun-viewer-stage{border-radius:16px}}';document.head.appendChild(s);const v=document.createElement('div');v.id='wadfunViewer';v.className='wadfun-viewer';v.innerHTML='<div class="wadfun-viewer-card" role="dialog" aria-modal="true"><div class="wadfun-viewer-head"><button class="wadfun-viewer-close" type="button" onclick="closeWorkViewer()">×</button></div><div class="wadfun-viewer-stage"><img id="wadfunViewerImg" alt="ผลงานของฉัน"></div><div class="wadfun-viewer-actions"><button class="primary" type="button" onclick="editWorkViewer()">✏️ แก้ไขต่อ</button><button class="wadfun-share" type="button" onclick="shareWorkViewer()">📤 แชร์</button></div></div>';v.addEventListener('click',e=>{if(e.target===v)closeViewer()});document.body.appendChild(v)}
function injectGalleryStyle(){if(document.getElementById('wadfun-gallery-v9'))return;const s=document.createElement('style');s.id='wadfun-gallery-v9';s.textContent='.wadfun-gallery-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding:14px 16px;border-radius:22px;background:linear-gradient(135deg,#e5f8ff,#fff1f8);border:2px solid #dceef6}.wadfun-gallery-head h1{margin:0;font-size:28px}.wadfun-gallery-count{background:#fff;border:2px solid #d9edf7;border-radius:99px;padding:8px 13px;font-weight:1000;white-space:nowrap}.wadfun-gallery-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.wadfun-gallery-card{background:#fff;border:2px solid #e2edf2;border-radius:24px;padding:9px;box-shadow:0 8px 22px rgba(43,93,112,.09);overflow:hidden}.wadfun-gallery-thumb{display:block;width:100%;aspect-ratio:1;padding:0;border-radius:18px;background:#f7fbfd;overflow:hidden;border:0}.wadfun-gallery-thumb img{width:100%;height:100%;object-fit:contain;display:block}.wadfun-gallery-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.wadfun-gallery-actions button{padding:10px 5px}.wadfun-gallery-edit{grid-column:1/-1;background:#fff4cf;border:2px solid #e6c56a;border-radius:16px;padding:10px 6px;font-weight:1000}.wadfun-gallery-empty{grid-column:1/-1;text-align:center;padding:42px 18px;background:#fffdf0;border:2px dashed #efd47a;border-radius:24px;font-weight:900;font-size:18px}@media(max-width:950px){.wadfun-gallery-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:650px){.wadfun-gallery-head{padding:11px 12px}.wadfun-gallery-head h1{font-size:22px}.wadfun-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.wadfun-gallery-card{border-radius:18px;padding:7px}.wadfun-gallery-thumb{border-radius:14px}.wadfun-gallery-actions button{font-size:12px;padding:8px 4px}}';document.head.appendChild(s)}
async function render(){const g=document.getElementById('galleryGrid');if(!g)return;injectGalleryStyle();const a=await works();g.classList.add('wadfun-gallery-grid');if(!a.length){g.innerHTML='<div class="wadfun-gallery-empty"><div style="font-size:52px">🎨✨</div>ยังไม่มีผลงานเลย<br><small>ลองวาดหรือระบายสีสักรูปนะ!</small></div>';return}g.innerHTML='<div class="wadfun-gallery-head" style="grid-column:1/-1"><h1>🖼️ ผลงานของฉัน</h1><span class="wadfun-gallery-count">'+a.length+' รูป ✨</span></div>'+a.map(w=>{const src=esc(imageOf(w)),id=esc(w.id);return `<article class="wadfun-gallery-card"><button type="button" class="wadfun-gallery-thumb" aria-label="เปิดผลงาน" onclick="openWork('${id}')"><img src="${src}" alt="ผลงานของฉัน" loading="lazy"></button><div class="wadfun-gallery-actions"><button class="primary" onclick="openWork('${id}')">👀 ดู</button><button class="wadfun-share" onclick="shareWork('${id}')">📤 แชร์</button><button class="wadfun-gallery-edit" onclick="editWork('${id}')">✏️ แก้ไขต่อ</button></div><button class="danger" style="width:100%;margin-top:6px" onclick="deleteWork('${id}')">🗑️ ลบ</button></article>`}).join('')}
async function saveCurrentArtwork(id){
  await loadStorage();
  const activeScreen=document.querySelector('.screen.active')?.id;
  const isColor=activeScreen==='color'||id==='colorCanvas';
  const c=isColor?colorCanvas():(id?document.getElementById(id):activeCanvas());
  if(!c||typeof c.toDataURL!=='function')throw new Error(isColor?'Color canvas not found':'No active drawing canvas found');
  const existing=editingId?await get(editingId):null;
  const imageData=c.toDataURL('image/png');
  if(!imageData||imageData.length<100)throw new Error('Canvas image is empty');
  const record={id:existing?.id,name:'ผลงานของฉัน',category:isColor?(window.wadfunActiveColorTemplate?.category||''):'',mode:isColor?'color':'draw',imageData,thumbnail:imageData,createdAt:existing?.createdAt||Date.now()};
  const saved=await window.wadfunStorage.saveArtwork(record);
  if(!saved?.id)throw new Error('Artwork was not saved');
  editingId=null;editingMode=null;
  console.log('[Wadfun] artwork saved',saved.id,record.mode);
  return saved;
}
async function handleFinish(id){
  const isColor=id==='colorCanvas'||document.querySelector('.screen.active')?.id==='color';
  const c=isColor?colorCanvas():(id?document.getElementById(id):activeCanvas());
  try{
    const saved=await saveCurrentArtwork(isColor?'colorCanvas':id);
    const out=document.getElementById('finishImg');
    if(out)out.src=(c&&c.toDataURL)?c.toDataURL('image/png'):imageOf(saved);
    if(typeof window.show==='function')window.show('finish');
    return saved;
  }catch(e){console.error('[Wadfun] save failed',e);throw e}
}
function installFinishHook(){
  if(finishWrapped)return true;
  const fn=window.finishCanvas;
  if(typeof fn!=='function')return false;
  const wrapped=async function(){try{return await handleFinish(...arguments)}catch(e){console.error('[Wadfun] gallery save hook failed',e);return fn.apply(this,arguments)}};
  window.finishCanvas=wrapped;finishWrapped=true;console.log('[Wadfun] finishCanvas save hook installed');return true;
}
function installColorFinishButton(){
  if(colorFinishInstalled)return true;
  const root=document.getElementById('color');if(!root)return false;
  const buttons=[...root.querySelectorAll('button')];
  const b=buttons.find(x=>{const t=(x.textContent||'').replace(/\s+/g,' ').trim().toLowerCase(),id=(x.id||'').toLowerCase();return /เสร็จ|finish|บันทึกผลงาน/.test(t)||/finish|colorfinish/.test(id)});
  if(!b)return false;
  b.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();try{await handleFinish('colorCanvas')}catch(err){console.error('[Wadfun] color finish save failed',err);alert('บันทึกผลงานไม่สำเร็จ ลองอีกครั้งนะ')}} ,true);
  colorFinishInstalled=true;console.log('[Wadfun] color finish button save hook installed');return true;
}
function watchFinishHook(){let n=0;const t=setInterval(()=>{n++;const a=installFinishHook(),b=installColorFinishButton();if(a&&b||n>200)clearInterval(t)},100)}
async function deleteWork(id){const w=await get(id);if(!w)return;if(!confirm('ลบผลงานนี้ใช่ไหม?'))return;await window.wadfunStorage.deleteArtwork(id);await render()}
const originalGallery=window.gallery;window.gallery=async function(){try{await loadStorage();await migrateLegacy();await render()}catch(e){console.error('[Wadfun] gallery failed',e);if(typeof originalGallery==='function')originalGallery()}};
async function migrateLegacy(){if(localStorage.getItem('wadfunIndexedDBMigrated')==='1')return;let old=[];try{old=JSON.parse(localStorage.getItem('wadfunWorks')||'[]')}catch(e){}if(!Array.isArray(old)||!old.length){localStorage.setItem('wadfunIndexedDBMigrated','1');return}for(const w of old){try{if(w?.img)await window.wadfunStorage.saveArtwork({id:String(w.id),name:'ผลงานของฉัน',mode:w.mode||'draw',imageData:w.img,thumbnail:w.img,createdAt:w.createdAt||Date.now()})}catch(e){console.error('[Wadfun] legacy migration failed',e)}}localStorage.setItem('wadfunIndexedDBMigrated','1')}
function cleanHomeMenu(){const menu=document.querySelector('.sideMenu');if(!menu)return;[...menu.querySelectorAll('.woodBtn')].forEach(b=>{const t=b.textContent||'';if(t.includes('ผลงานของหนู')||t.includes('วิธีใช้งาน'))b.remove()})}
function boot(){cleanHomeMenu();loadStorage().then(migrateLegacy).then(render).catch(e=>console.error('[Wadfun] storage boot failed',e));watchFinishHook()}
window.editWork=editWork;window.openWork=openWork;window.shareWork=shareWork;window.closeWorkViewer=closeWorkViewer;window.editWorkViewer=editWorkViewer;window.shareWorkViewer=shareWorkViewer;window.deleteWork=deleteWork;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
