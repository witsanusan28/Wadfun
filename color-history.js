/* Wadfun Color History V3 — existing Undo button + optional existing Redo button; no duplicate UI */
(function(){
'use strict';
function active(){return document.getElementById('color')?.classList.contains('active')}
function canvas(){return document.getElementById('colorCanvas')}
let undo=[],redo=[],busy=false,lastState=null;
function snap(){const c=canvas();return c?c.toDataURL('image/png'):null}
function same(a,b){return a===b}
function restore(data){if(!data)return false;const c=canvas(),ctx=c?.getContext('2d');if(!c||!ctx)return false;const im=new Image();im.onload=()=>{if(!active())return;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);window.wadfunResetColorMask?.();window.wadfunColorTemplateChanged?.();};im.src=data;return true}
function reset(){undo=[];redo=[];lastState=snap();sync()}
function record(before){const now=snap();if(!now||same(before,now))return;undo.push(before);if(undo.length>30)undo.shift();redo=[];lastState=now;sync()}
function doUndo(){if(busy||!active()||!undo.length)return false;const current=snap(),target=undo.pop();if(!current||!target)return false;redo.push(current);if(redo.length>30)redo.shift();busy=true;const c=canvas(),ctx=c?.getContext('2d'),im=new Image();im.onload=()=>{ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);window.wadfunResetColorMask?.();window.wadfunColorTemplateChanged?.();lastState=target;busy=false;sync()};im.src=target;return true}
function doRedo(){if(busy||!active()||!redo.length)return false;const current=snap(),target=redo.pop();if(!current||!target)return false;undo.push(current);if(undo.length>30)undo.shift();busy=true;const c=canvas(),ctx=c?.getContext('2d'),im=new Image();im.onload=()=>{ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(im,0,0,c.width,c.height);window.wadfunResetColorMask?.();window.wadfunColorTemplateChanged?.();lastState=target;busy=false;sync()};im.src=target;return true}
function sync(){window.wadfunColorUndo=doUndo;window.wadfunColorRedo=doRedo;window.wadfunColorHistoryState=()=>({undo:undo.length,redo:redo.length});window.colorUndo=undo;window.colorRedo=redo;}
function findButton(kind){const ids=kind==='undo'?['colorUndoBtn','undoColorBtn','undoBtn']:['colorRedoBtn','redoColorBtn','redoBtn'];for(const id of ids){const e=document.getElementById(id);if(e)return e}const els=[...document.querySelectorAll('button')];return els.find(e=>{const t=(e.textContent||'').trim().toLowerCase();return kind==='undo'?t.includes('ย้อนกลับ')||t==='undo':t.includes('ทำซ้ำ')||t.includes('redo')})}
function wire(){sync();const u=findButton('undo'),r=findButton('redo');if(u&&!u.dataset.wadfunHistoryV3){u.dataset.wadfunHistoryV3='1';u.addEventListener('click',e=>{if(active()){e.preventDefault();e.stopImmediatePropagation();doUndo()}},true)}if(r&&!r.dataset.wadfunHistoryV3){r.dataset.wadfunHistoryV3='1';r.addEventListener('click',e=>{if(active()){e.preventDefault();e.stopImmediatePropagation();doRedo()}},true)}}
function install(){if(window.__wadfunColorHistoryV3)return true;window.__wadfunColorHistoryV3=true;const oldReset=window.resetColor;if(typeof oldReset==='function')window.resetColor=function(){const r=oldReset.apply(this,arguments);reset();return r};window.addEventListener('wadfun-work-loaded',()=>{if(active())reset()});wire();return true}
window.wadfunColorHistoryRecord=record;window.wadfunColorHistoryReset=reset;setInterval(wire,250);install();
})();
