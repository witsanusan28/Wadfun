/* Wadfun Color Touch Guard V1 — bucket taps wait for gesture decision; 2-finger pinch can never fill. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function bucket(){return !!$('bucketBtn')&&!$('colorPenBtn')?.classList.contains('on')&&!$('colorEraseBtn')?.classList.contains('on')}
let installed=false,ids=new Map(),pending=null,moved=false;
function install(){
 const c=$('colorCanvas'),v=$('colorViewport');
 if(!c||!v||installed)return false;
 installed=true;
 function clearPending(){pending=null;moved=false}
 v.addEventListener('pointerdown',e=>{
   if(e.pointerType!=='touch'||!bucket())return;
   ids.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(ids.size===1){pending={x:e.clientX,y:e.clientY,t:Date.now()};moved=false}else clearPending();
   e.preventDefault();e.stopPropagation();
 },{capture:true,passive:false});
 v.addEventListener('pointermove',e=>{
   if(e.pointerType!=='touch'||!bucket()||!ids.has(e.pointerId))return;
   ids.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(ids.size>1){clearPending();e.preventDefault();e.stopPropagation();return}
   if(pending&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>10){moved=true;pending=null}
   e.preventDefault();e.stopPropagation();
 },{capture:true,passive:false});
 v.addEventListener('pointerup',e=>{
   if(e.pointerType!=='touch'||!bucket())return;
   const p=pending;ids.delete(e.pointerId);
   if(ids.size===0&&p&&!moved&&Date.now()-p.t<700){const fn=window.wadfunColorBucketTapV23;if(fn)fn({clientX:p.x,clientY:p.y})}
   if(ids.size===0)clearPending();
   e.preventDefault();e.stopPropagation();
 },{capture:true,passive:false});
 v.addEventListener('pointercancel',e=>{
   if(e.pointerType!=='touch'||!bucket())return;
   ids.delete(e.pointerId);clearPending();e.preventDefault();e.stopPropagation();
 },{capture:true,passive:false});
 return true;
}
const timer=setInterval(()=>{if(install())clearInterval(timer)},100);
})();
