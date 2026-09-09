/* Wadfun Selected Color UI V3 */
(function(){
'use strict';
const css=`
/* WADFUN SELECTED COLOR V3 */
.colorMini{display:block!important;width:30px!important;height:30px!important;border-radius:50%!important;border:3px solid #fff!important;box-shadow:0 0 0 2px #8aa0ad,0 2px 5px #0003!important;background:#e53935;flex:0 0 auto}
#draw .toolbar .tb:has(#drawDot),#color .toolbar .tb:has(#colorDot){min-width:82px!important}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function paint(c){
 const d=document.getElementById('drawDot'),q=document.getElementById('colorDot');
 [d,q].forEach(x=>{if(x){x.style.setProperty('background-color',c,'important');x.style.setProperty('background',c,'important');x.setAttribute('title','สีที่เลือก '+c)}});
 document.querySelectorAll('#draw .toolbar .tb,#color .toolbar .tb').forEach(b=>{
  const dot=b.querySelector('.colorMini'); if(dot){dot.style.setProperty('background-color',c,'important');}
 });
}
function hex(c){return /^#[0-9a-f]{6}$/i.test(c)?c:null}
window.pickColor=function(c){c=hex(c)||'#e53935';window.selectedColor=c;paint(c);if(typeof closePopups==='function')closePopups()};
window.setHue=function(v){const h=Number(v),s=85,l=50,c=window.hslHex(h,s,l);window.selectedColor=c;paint(c)};
window.setShade=function(v){const h=window.rgbToHsl(window.selectedColor||'#e53935'),c=window.hslHex(h[0],h[1],Number(v));window.selectedColor=c;paint(c)};
const t=setInterval(()=>{if(document.getElementById('drawDot')&&document.getElementById('colorDot')){paint(window.selectedColor||'#e53935');clearInterval(t)}},80);
})();
