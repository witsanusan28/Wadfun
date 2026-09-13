/* Wadfun Color Library Fix V21 — single canonical restore owner */
(function(){
'use strict';
if(window.__wadfunColorLibraryV21)return;window.__wadfunColorLibraryV21=true;
function normalizeScreens(){const a=document.querySelector('.screen.active');if(!a)return;document.querySelectorAll('.screen').forEach(s=>s.style.removeProperty('display'))}
const obs=new MutationObserver(()=>requestAnimationFrame(normalizeScreens));obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});setInterval(normalizeScreens,250);normalizeScreens();
function keyInfo(){const st=window.wadfunColorLibraryState||{},cat=st.category||window.wadfunActiveColorTemplate?.category||'',idx=Number.isInteger(st.index)?st.index:'',item=window.wadfunColorLibraryData?.[cat]?.items?.[idx],name=item?.[0]||window.wadfunActiveColorTemplate?.name||'';return{cat,idx,key:`${cat}:${idx}:${name}`}}
function newest(a){a.sort((x,y)=>(Number(y.updatedAt)||Number(y.createdAt)||0)-(Number(x.updatedAt)||Number(x.createdAt)||0));return a[0]||null}
function currentKey(){return keyInfo().key}
async function findSaved(expected){try{const s=window.wadfunStorage;if(!s||typeof s.getAllArtworks!=='function')return null;const {key}=keyInfo();if(expected&&key!==expected)return null;const all=await s.getAllArtworks();if(expected&&currentKey()!==expected)return null;let a=all.filter(x=>x?.mode==='color'&&x?.draft===true&&x?.templateKey===key&&x?.editorState?.paint&&x?.editorState?.ink);if(a.length)return newest(a);a=all.filter(x=>x?.mode==='color'&&x?.draft!==true&&x?.templateKey===key&&x?.editorState?.paint&&x?.editorState?.ink);return a.length?newest(a):null}catch(e){console.error('[Wadfun] saved lookup failed',e);return null}}
function installRestoreGuard(){const fn=window.wadfunColorRestoreState;if(typeof fn!=='function'||fn.__wadfunGuarded)return;const guarded=function(state,done){if(window.__wadfunCanonicalRestore===true)return fn.call(this,state,done);console.warn('[Wadfun] blocked duplicate color restore');return false};guarded.__wadfunGuarded=true;guarded.__wadfunOriginal=fn;window.wadfunColorRestoreState=guarded}
setInterval(installRestoreGuard,25);installRestoreGuard();
async function applySaved(expected){const saved=await findSaved(expected);if(!saved||currentKey()!==expected)return false;const restore=window.wadfunColorRestoreState;if(typeof restore!=='function')return false;let ok=false;window.__wadfunCanonicalRestore=true;try{await new Promise(r=>{try{const z=restore(saved.editorState,()=>{ok=true;r()});if(z!==true)r()}catch(e){r()}setTimeout(r,1800)});return currentKey()===expected&&ok}catch(e){console.error('[Wadfun] restore failed',e);return false}finally{window.__wadfunCanonicalRestore=false}}
let last='',busy=false;
async function resume(){if(!document.getElementById('color')?.classList.contains('active')){last='';return}const k=currentKey(),c=document.getElementById('colorCanvas');if(!k||k==='::'||k===last||busy||!c?.width||!c?.height)return;busy=true;try{if(await applySaved(k))last=k}catch(e){console.error('[Wadfun] resume failed',e)}finally{busy=false}}
function loadAutosave(){if(window.__wadfunColorAutosaveLoader)return;window.__wadfunColorAutosaveLoader=true;const s=document.createElement('script');s.src='color-autosave.js';s.onload=()=>console.log('[Wadfun] color autosave ready');s.onerror=e=>console.error('[Wadfun] color autosave load failed',e);document.head.appendChild(s)}
setInterval(resume,250);setTimeout(loadAutosave,0);
})();
