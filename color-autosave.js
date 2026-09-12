/* Wadfun Color Autosave V1 — persist color/ink after every completed action */
(function(){
'use strict';
if(window.__wadfunColorAutosaveV1)return;window.__wadfunColorAutosaveV1=true;
let dirty=false,queue=Promise.resolve(),lastKey='',timer=null;
const active=()=>document.getElementById('color')?.classList.contains('active');
function key(){const st=window.wadfunColorLibraryState||{},cat=st.category||window.wadfunActiveColorTemplate?.category||'',idx=Number.isInteger(st.index)?st.index:'',name=window.wadfunActiveColorTemplate?.name||window.currentName||'';return `${cat}:${idx}:${name}`}
function snapshot(){try{const c=document.getElementById('colorCanvas'),get=window.wadfunColorGetState;if(!c||!get)return null;const imageData=c.toDataURL('image/png'),editorState=get();if(!imageData||imageData.length<100||!editorState)return null;return {imageData,editorState,templateKey:key()}}catch(e){console.error('[Wadfun] autosave snapshot failed',e);return null}}
async function storage(){if(window.wadfunStorage)return window.wadfunStorage;if(window.__wadfunAutosaveStoragePromise)return window.__wadfunAutosaveStoragePromise;window.__wadfunAutosaveStoragePromise=new Promise((res,rej)=>{const s=document.createElement('script');s.src='wadfun-storage.js';s.onload=()=>window.wadfunStorage?res(window.wadfunStorage):rej(Error('storage unavailable'));s.onerror=rej;document.head.appendChild(s)});return window.__wadfunAutosaveStoragePromise}
async function write(snap){if(!snap||!active())return false;const st=window.wadfunColorLibraryState||{},draftKey=snap.templateKey||'',store=await storage(),all=await store.getAllArtworks(),old=all.find(x=>x?.mode==='color'&&x?.draft===true&&x?.templateKey===draftKey);const rec={id:old?.id,name:window.currentName||'🖍️ ผลงานระบายสี',category:window.wadfunActiveColorTemplate?.category||st.category||'',mode:'color',imageData:snap.imageData,thumbnail:snap.imageData,templateKey:draftKey,editorState:snap.editorState,createdAt:old?.createdAt||Date.now(),draft:true,updatedAt:Date.now()};const out=await store.saveArtwork(rec);if(out?.id){lastKey=draftKey;return true}return false}
function flush(){if(!dirty||!active())return;dirty=false;const snap=snapshot();if(!snap)return;queue=queue.then(()=>write(snap)).catch(e=>console.error('[Wadfun] color autosave failed',e))}
function mark(){if(!active())return;dirty=true;clearTimeout(timer);timer=setTimeout(flush,700)}
function isStartNew(el){const b=el?.closest?.('button,[role="button"]');const t=(b?.textContent||'').replace(/\s+/g,'');return /เริ่มใหม่|StartNew/.test(t)}
function isHistory(el){const b=el?.closest?.('button,[role="button"]');return !!b&&(/colorUndoBtn|colorRedoBtn/.test(b.id||'')||/ย้อนกลับ|ทำซ้ำ|undo|redo/i.test(b.textContent||''))}
function down(e){if(!active()||e.target?.id!=='colorCanvas'||isStartNew(e.target))return;mark()}
function move(e){if(!active()||e.target?.id!=='colorCanvas')return;mark()}
function up(e){if(!active()||e.target?.id!=='colorCanvas')return;clearTimeout(timer);mark();setTimeout(flush,80)}
document.addEventListener('pointerdown',down,true);
document.addEventListener('pointermove',move,true);
document.addEventListener('pointerup',up,true);
document.addEventListener('pointercancel',up,true);
document.addEventListener('touchstart',e=>{if(active()&&e.target?.id==='colorCanvas')mark()},true);
document.addEventListener('touchmove',e=>{if(active()&&e.target?.id==='colorCanvas')mark()},true);
document.addEventListener('touchend',e=>{if(active()&&e.target?.id==='colorCanvas'){clearTimeout(timer);mark();setTimeout(flush,80)}},true);
document.addEventListener('click',e=>{if(!active()||!isHistory(e.target)||isStartNew(e.target))return;setTimeout(()=>{dirty=true;flush()},120)},true);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
window.wadfunColorAutosaveNow=()=>{dirty=true;flush()};
window.wadfunColorAutosaveState=()=>({dirty,lastKey});
})();
