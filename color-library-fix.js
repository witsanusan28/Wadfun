/* Wadfun Color Library Fix V5 — hide placeholder canvas while selected template loads */
(function(){
'use strict';
if(window.__wadfunColorLibraryV5)return;
window.__wadfunColorLibraryV5=true;

function canvas(){return document.getElementById('colorCanvas')}
function hideCanvas(){const c=canvas();if(c)c.style.opacity='0'}
function showCanvas(){const c=canvas();if(c)c.style.opacity='1'}

/* The base picker draws a temporary placeholder before the real SVG template
   finishes loading. Keep that placeholder invisible so users only see the
   selected coloring picture. */
const originalReady=window.wadfunColorTemplateReady;
window.wadfunColorTemplateReady=function(){
  try{if(typeof originalReady==='function')originalReady.apply(this,arguments)}catch(e){console.warn('[Wadfun] template ready hook failed',e)}
  showCanvas();
};

/* Hide immediately when a picture is tapped, before the library's async
   SVG render completes. This is presentation-only; coloring logic is untouched. */
document.addEventListener('click',function(e){
  const pic=e.target?.closest?.('#pickerGrid .template');
  if(pic)hideCanvas();
},true);

/* Also cover direct programmatic template selection. */
const observer=new MutationObserver(function(){
  const color=document.getElementById('color');
  if(color?.classList.contains('active') && window.wadfunColorLibraryState?.index!=null){
    const c=canvas();
    if(c && c.dataset.wadfunTemplateLoading==='1')return;
  }
});
observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});

/* When leaving the color screen, reset presentation state for the next entry. */
const originalShow=window.show;
if(typeof originalShow==='function'){
  window.show=function(id){
    const result=originalShow.apply(this,arguments);
    if(id!=='color')showCanvas();
    return result;
  };
}

})();
