/* Wadfun Color History V1 — Undo / Redo for Color mode */
(function(){
'use strict';
const MAX=30;
let undo=[],redo=[],restoring=false;
window.colorUndo=undo;
window.colorRedo=redo;
function canvas(){return document.getElementById('colorCanvas')}
function active(){return document.getElementById('color')?.classList.contains('active')}
function snap(){const c=canvas();return c?.toDataURL()||null}
function same(a,b){return a===b}
function pushUndoState(data){if(!data)return;if(!same(undo[undo.length-1],data)){undo.push(data);if(undo.length>MAX)undo.shift()}}
function clearRedo(){if(!restoring)redo.length=0}
function load(data){return new Promise(resolve=>{const c=canvas();if(!c||!data){resolve(false);return}const img=new Image();img.onload=()=>{const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);window.wadfunColorHistoryRestored?.();resolve(true)};img.onerror=()=>resolve(false);img.src=data})}
async function undoAction(){if(!active()||!undo.length)return;const current=snap(),previous=undo.pop();if(current)redo.push(current);restoring=true;await load(previous);restoring=false;window.wadfunColorHistoryRestored?.();update()}
async function redoAction(){if(!active()||!redo.length)return;const current=snap(),next=redo.pop();if(current)pushUndoState(current);restoring=true;await load(next);restoring=false;window.wadfunColorHistoryRestored?.();update()}
function update(){const u=document.getElementById('wadfunColorUndo'),r=document.getElementById('wadfunColorRedo');if(u){u.disabled=!active()||undo.length===0;u.style.opacity=u.disabled?.45:1}if(r){r.disabled=!active()||redo.length===0;r.style.opacity=r.disabled?.45:1}}
function addButtons(){if(document.getElementById('wadfunColorHistory'))return;const toolbar=document.querySelector('#color.active .toolbar')||document.querySelector('#color .toolbar');if(!toolbar)return;const wrap=document.createElement('div');wrap.id='wadfunColorHistory';wrap.style.cssText='display:flex;gap:7px;align-items:center;margin-left:2px;flex:none';wrap.innerHTML='<button id="wadfunColorUndo" type="button" class="tb" aria-label="ย้อนกลับ">↩️<span>ย้อนกลับ</span></button><button id="wadfunColorRedo" type="button" class="tb" aria-label="ทำซ้ำ">↪️<span>ทำซ้ำ</span></button>';toolbar.appendChild(wrap);document.getElementById('wadfunColorUndo').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();undoAction()});document.getElementById('wadfunColorRedo').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();redoAction()});update()}
function onRestart(){if(!active())return;undo.length=0;redo.length=0;setTimeout(()=>{const s=snap();if(s)pushUndoState(s);update()},0)}
function install(){
 addButtons();
 const c=canvas();if(!c||c.dataset.historyV1)return false;c.dataset.historyV1='1';
 c.addEventListener('pointerdown',clearRedo,{capture:false});
 c.addEventListener('touchstart',clearRedo,{capture:false,passive:true});
 c.addEventListener('touchend',clearRedo,{capture:false,passive:true});
 c.addEventListener('pointerup',()=>{update()},{capture:false});
 c.addEventListener('touchend',()=>{update()},{capture:false,passive:true});
 window.addEventListener('wadfun-work-loaded',()=>{if(active()){undo.length=0;redo.length=0;const s=snap();if(s)pushUndoState(s);update()} });
 update();return true
}
window.wadfunColorHistoryRestored=()=>{try{document.getElementById('colorCanvas')?.dispatchEvent(new Event('wadfun-history-restored'))}catch(e){}update()};
window.wadfunResetColorHistory=onRestart;
setInterval(()=>{addButtons();install()},250);
})();
