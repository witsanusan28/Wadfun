/* Wadfun Color Picker V3 — visible selection markers */
(function(){
'use strict';
function hexToRgb(h){h=(h||'#e53935').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0]}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')}
function hslToHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min((n+h/30)%12-3,9-(n+h/30)%12,1));return rgbToHex(f(0)*255,f(8)*255,f(4)*255)}
function rgbToHsl(hex){const [r,g,b]=hexToRgb(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=60*((g-b)/d%6);else if(mx===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4)}const l=(mx+mn)/2,s=d?d/(1-Math.abs(2*l-1)):0;return[(h+360)%360,s*100,l*100]}
function getColor(){const el=document.getElementById('colorDot')||document.getElementById('drawDot');if(!el)return'#e53935';const c=getComputedStyle(el).backgroundColor.match(/\d+(?:\.\d+)?/g);return c?'#'+c.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join(''):'#e53935'}
function ensureUI(){
 const sq=document.querySelector('.colorSquare');if(!sq)return;
 sq.style.position='relative';
 let mark=sq.querySelector('.pickerMarker');
 if(!mark){mark=document.createElement('div');mark.className='pickerMarker';mark.setAttribute('aria-hidden','true');sq.appendChild(mark)}
 let preview=document.querySelector('.pickerSelectedPreview');
 if(!preview){preview=document.createElement('div');preview.className='pickerSelectedPreview';preview.innerHTML='<span class="pickerPreviewDot"></span><span class="pickerPreviewText">สีที่กำลังเลือก</span><strong class="pickerPreviewHex"></strong>';sq.parentElement.insertBefore(preview,sq)}
 let hue=document.querySelector('.colorPopup .hue');
 if(hue){hue.style.setProperty('--hueColor',getColor());let hm=hue.parentElement.querySelector('.pickerSliderMarker.hueMarker');if(!hm){hm=document.createElement('span');hm.className='pickerSliderMarker hueMarker';hue.parentElement.appendChild(hm)}}
 const shade=document.querySelector('.colorPopup .shade input');
 if(shade){let sm=shade.parentElement.querySelector('.pickerSliderMarker.shadeMarker');if(!sm){sm=document.createElement('span');sm.className='pickerSliderMarker shadeMarker';shade.parentElement.appendChild(sm)}}
 update();bindSquare(sq);bindSlider(hue);bindSlider(shade);
}
function update(){
 const color=getColor(),sq=document.querySelector('.colorSquare');
 const [h,s,l]=rgbToHsl(color);
 const mark=sq?.querySelector('.pickerMarker');
 if(mark){mark.style.left=Math.max(2,Math.min(98,s))+'%';mark.style.top=Math.max(2,Math.min(98,100-l))+'%';mark.style.background=color}
 const prev=document.querySelector('.pickerSelectedPreview');if(prev){const dot=prev.querySelector('.pickerPreviewDot');if(dot)dot.style.background=color;const tx=prev.querySelector('.pickerPreviewHex');if(tx)tx.textContent=color.toUpperCase()}
 const hue=document.querySelector('.colorPopup .hue');if(hue){const v=Number(hue.value)||h;const hm=hue.parentElement.querySelector('.hueMarker');if(hm)hm.style.left=(v/360*100)+'%'}
 const shade=document.querySelector('.colorPopup .shade input');if(shade){const sm=shade.parentElement.querySelector('.shadeMarker');if(sm){const min=Number(shade.min||0),max=Number(shade.max||100);sm.style.left=((Number(shade.value)-min)/(max-min)*100)+'%'}}
}
function pickSquare(e){const sq=document.querySelector('.colorSquare');if(!sq)return;const r=sq.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));const hue=document.querySelector('.colorPopup .hue'),h=Number(hue?.value)||rgbToHsl(getColor())[0];const s=x*100,l=(1-y)*100;const c=hslToHex(h,s,l);if(typeof window.pickColor==='function')window.pickColor(c);update()}
function bindSquare(sq){if(sq.dataset.v3)return;sq.dataset.v3='1';const handler=e=>{e.preventDefault();pickSquare(e)};sq.addEventListener('pointerdown',handler);sq.addEventListener('pointermove',e=>{if(e.buttons)handler(e)})}
function bindSlider(el){if(!el||el.dataset.v3)return;el.dataset.v3='1';el.addEventListener('input',update);el.addEventListener('change',update)}
const oldHue=window.setHue,oldShade=window.setShade;
if(typeof oldHue==='function')window.setHue=function(v){oldHue(v);setTimeout(update,0)};
if(typeof oldShade==='function')window.setShade=function(v){oldShade(v);setTimeout(update,0)};
const timer=setInterval(()=>{const p=document.querySelector('.colorPopup');if(p){ensureUI();if(p.classList.contains('open'))update()}},120);
window.wadfunColorPickerV3={update};
})();
