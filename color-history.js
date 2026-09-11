/* Wadfun Color History V2 — keep the existing Color Undo button; no duplicate UI */
(function(){
'use strict';
function active(){return document.getElementById('color')?.classList.contains('active')}
function sync(){
  try{
    if(typeof colorUndo!=='undefined') window.colorUndo=colorUndo;
  }catch(e){}
}
function reset(){
  try{
    if(typeof colorUndo!=='undefined') colorUndo=[];
    window.colorUndo=typeof colorUndo!=='undefined'?colorUndo:[];
  }catch(e){}
}
function install(){
  sync();
  if(window.__wadfunColorHistoryV2)return true;
  window.__wadfunColorHistoryV2=true;
  const oldLoad=window.loadTemplate;
  if(typeof oldLoad==='function'){
    window.loadTemplate=function(){
      const r=oldLoad.apply(this,arguments);
      sync();
      return r;
    };
  }
  const oldReset=window.resetColor;
  if(typeof oldReset==='function'){
    window.resetColor=function(){
      const r=oldReset.apply(this,arguments);
      sync();
      return r;
    };
  }
  window.addEventListener('wadfun-work-loaded',()=>{if(active())sync()});
  return true;
}
setInterval(install,250);
install();
})();
