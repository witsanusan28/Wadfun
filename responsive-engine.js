/* Wadfun Responsive Workspace V13 — fit toolbar from actual viewport width without touching drawing engine */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function workspaceOn(){return $('draw')?.classList.contains('active')||$('color')?.classList.contains('active')}
function readColor(){
 const els=[$('drawDot'),$('colorDot')].filter(Boolean);
 for(const el of els){const bg=getComputedStyle(el).backgroundColor,m=(bg||'').match(/\d+(?:\.\d+)?/g);if(m&&m.length>=3)return '#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join('').toUpperCase()}
 return window.wadfunSelectedColor||'#E53935';
}
function syncSelectedColor(){
 const c=readColor();window.wadfunSelectedColor=c;
 [$('drawDot'),$('colorDot')].forEach(el=>{if(el){el.style.setProperty('background-color',c,'important');el.style.setProperty('background',c,'important');el.dataset.selectedColor=c;el.title='สีที่เลือก '+c}});
 document.querySelectorAll('.colorMini').forEach(el=>{el.style.setProperty('background-color',c,'important');el.style.setProperty('background',c,'important')});
 const btn=$('drawDot')?.closest('button');if(btn){btn.dataset.selectedColor=c;btn.setAttribute('aria-label','สีที่เลือก '+c)}
}
function cleanHint(){document.querySelectorAll('.floatHint').forEach(el=>el.style.display='none')}
function zoomLayer(type){return $(type==='draw'?'drawZoom':'colorZoom')}
function setZoom(type,scale){scale=Math.max(1,Math.min(3,Number(scale)||1));const layer=zoomLayer(type);if(layer)layer.style.transform=`scale(${scale})`;const hud=document.querySelector(`.wadfunZoomHud[data-zoom-type="${type}"]`),pct=hud?.querySelector('.wadfunZoomPct');if(pct)pct.textContent=Math.round(scale*100)+'%'}
function resetZoom(type){setZoom(type,1)}
function ensureZoomHud(type){if(!workspaceOn())return;let hud=document.querySelector(`.wadfunZoomHud[data-zoom-type="${type}"]`);if(!hud){hud=document.createElement('div');hud.className='wadfunZoomHud';hud.dataset.zoomType=type;hud.innerHTML='<span class="wadfunZoomPct">100%</span><button type="button" class="wadfunZoomReset">100%</button>';document.body.appendChild(hud);hud.querySelector('.wadfunZoomReset').addEventListener('click',e=>{e.stopPropagation();resetZoom(type)})}}
function fitToolbarForViewport(toolbar){
 if(!toolbar)return;
 const viewport=Math.max(1,document.documentElement.clientWidth||window.innerWidth||1);
 const available=Math.max(1,viewport-8);
 toolbar.style.width='max-content';
 toolbar.style.maxWidth='none';
 toolbar.style.overflowX='hidden';
 toolbar.style.overflowY='hidden';
 toolbar.style.justifyContent='center';
 toolbar.style.transformOrigin='top center';
 toolbar.style.gap='7px';
 toolbar.style.padding='8px';
 toolbar.querySelectorAll('.tb').forEach(b=>{
   b.style.minWidth='58px';
   b.style.width='';
   b.style.height='58px';
   b.style.flex='0 0 auto';
 });
 toolbar.querySelectorAll('.tb i').forEach(i=>i.style.fontSize='24px');
 toolbar.querySelectorAll('.tb span').forEach(s=>s.style.fontSize='10px');
 toolbar.querySelectorAll('.sizeBox').forEach(b=>{
   b.style.minWidth='190px';
   b.style.width='';
   b.style.padding='0 9px';
   b.style.gap='7px';
   const input=b.querySelector('input');if(input)input.style.width='100px';
 });
 const natural=Math.max(toolbar.scrollWidth,toolbar.getBoundingClientRect().width,1);
 const scale=Math.min(1,available/natural);
 toolbar.style.transform=`translateX(-50%) scale(${scale})`;
 toolbar.dataset.fitScale=String(scale);
 toolbar.dataset.fitViewport=String(viewport);
}
function lockToolbar(section){const page=section.querySelector('.drawPage'),area=section.querySelector('.canvasArea'),toolbar=section.querySelector('.toolbar');if(!page||!toolbar)return;page.style.width='100%';page.style.height='calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))';page.style.minHeight='0';page.style.padding='4px';page.style.paddingTop=(toolbar.getBoundingClientRect().height+8)+'px';page.style.borderRadius='0';page.style.overflow='hidden';page.style.display='flex';page.style.flexDirection='column';toolbar.style.position='fixed';toolbar.style.left='50%';toolbar.style.right='auto';toolbar.style.top='env(safe-area-inset-top)';toolbar.style.zIndex='2000';toolbar.style.flex='none';toolbar.style.touchAction='manipulation';toolbar.style.webkitUserSelect='none';toolbar.style.userSelect='none';toolbar.style.background='linear-gradient(#fff,#edf9ff)';toolbar.style.boxSizing='border-box';fitToolbarForViewport(toolbar);if(area){area.style.width='100%';area.style.flex='1 1 auto';area.style.height='auto';area.style.minHeight='0';area.style.marginTop='4px';area.style.borderRadius='12px';area.style.overflow='hidden'}const view=section.querySelector('.canvasViewport'),layer=section.querySelector('.zoomLayer');if(view){view.style.width='100%';view.style.height='100%';view.style.touchAction='none'}if(layer){layer.style.width='100%';layer.style.height='100%';layer.style.display='flex';layer.style.alignItems='center';layer.style.justifyContent='center';layer.style.transformOrigin='center center';layer.style.willChange='transform';layer.style.touchAction='none'}ensureZoomHud(section.id==='draw'?'draw':'color')}
function sync(){const on=workspaceOn();document.documentElement.classList.toggle('wadfun-workspace',on);document.body.classList.toggle('wadfun-workspace',on);const top=document.querySelector('.top');if(top)top.style.display=on?'none':'';const app=document.querySelector('.app');if(app){app.style.maxWidth=on?'none':'';app.style.width=on?'100vw':'';app.style.padding=on?'0':'';app.style.margin=on?'0':''}['draw','color'].forEach(id=>{const s=$(id);if(!s||!s.classList.contains('active'))return;lockToolbar(s)});cleanHint();syncSelectedColor()}
function fitCanvasToViewport(id,viewportId){const c=$(id),v=$(viewportId);if(!c||!v)return false;if(c.dataset.ready)return false;const r=v.getBoundingClientRect();const w=Math.max(50,Math.round(r.width)),h=Math.max(50,Math.round(r.height));const d=Math.min(devicePixelRatio||1,2);c.style.width=w+'px';c.style.height=h+'px';c.width=Math.round(w*d);c.height=Math.round(h*d);c._wadW=w;c._wadH=h;return true}
function fitAfterShow(){sync();requestAnimationFrame(()=>{sync();fitCanvasToViewport('drawCanvas','drawViewport');fitCanvasToViewport('colorCanvas','colorViewport')})}
function hookColorPicker(){if(typeof window.pickColor==='function'&&!window.pickColor.__wadfunV11){const old=window.pickColor;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV11=true;window.pickColor=wrapped}if(typeof window.setHue==='function'&&!window.setHue.__wadfunV11){const old=window.setHue;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV11=true;window.setHue=wrapped}if(typeof window.setShade==='function'&&!window.setShade.__wadfunV11){const old=window.setShade;const wrapped=function(){const r=old.apply(this,arguments);setTimeout(syncSelectedColor,0);return r};wrapped.__wadfunV11=true;window.setShade=wrapped}}
const style=document.createElement('style');style.textContent=`.wadfunZoomHud{position:fixed;right:12px;bottom:12px;z-index:2100;display:flex;align-items:center;gap:6px;padding:5px 6px 5px 10px;background:#fff;border:2px solid #d6eaf3;border-radius:16px;box-shadow:0 7px 20px #24566a22;font-weight:1000;user-select:none;-webkit-user-select:none;touch-action:manipulation}.wadfunZoomPct{min-width:48px;text-align:center;font-size:13px}.wadfunZoomReset{min-width:48px;height:34px;border-radius:11px;background:#eaf8ff;border:2px solid #bfe2f3;font-weight:1000;font-size:12px;touch-action:manipulation}.toolbar,.toolbar *,.popup,.popup *{touch-action:manipulation}`;document.head.appendChild(style);window.wadfunZoomUI={set:setZoom,reset:resetZoom,update:setZoom};function scheduleFit(){clearTimeout(window.__wadFitTimer);window.__wadFitTimer=setTimeout(fitAfterShow,120)}window.addEventListener('resize',()=>{clearTimeout(window.__wadResize);window.__wadResize=setTimeout(()=>{sync();scheduleFit()},80)},{passive:true});window.addEventListener('orientationchange',()=>setTimeout(fitAfterShow,220),{passive:true});window.addEventListener('pageshow',fitAfterShow,{passive:true});const obs=new MutationObserver(()=>{sync();requestAnimationFrame(()=>{fitCanvasToViewport('drawCanvas','drawViewport');fitCanvasToViewport('colorCanvas','colorViewport')})});obs.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});setInterval(()=>{hookColorPicker();syncSelectedColor();cleanHint()},150);setTimeout(fitAfterShow,0);setTimeout(fitAfterShow,250);window.wadfunResponsiveV13={sync,fitAfterShow,syncSelectedColor,resetZoom,setZoom,fitCanvasToViewport,fitToolbarForViewport};})();

/* WADFUN HOME VISUAL POLISH V1 — isolated UI-only layer; no drawing/color logic changes */
(function(){
'use strict';
const style=document.createElement('style');
style.id='wadfun-home-polish-v1';
style.textContent=`
/* Home scene */
.app:has(#home.active){max-width:none;padding:0;}
.app:has(#home.active)>.top{position:absolute;top:max(14px,env(safe-area-inset-top));left:0;right:0;z-index:30;padding:0 22px;pointer-events:none;}
.app:has(#home.active)>.top .logo{display:none;}
.app:has(#home.active)>.topBtns{pointer-events:auto;justify-content:flex-end;gap:10px;}
.app:has(#home.active)>.topBtns .roundBtn{width:54px;height:54px;padding:0;border:3px solid rgba(255,255,255,.92);border-radius:50%;background:rgba(255,255,255,.9);box-shadow:0 7px 18px rgba(31,91,119,.18);font-size:0;display:grid;place-items:center;}
.app:has(#home.active)>.topBtns .roundBtn:first-child:after{content:'🌐';font-size:25px;}
.app:has(#home.active)>.topBtns .roundBtn:last-child:after{content:'⚙️';font-size:25px;}
.app:has(#home.active) .home{min-height:100dvh;height:100dvh;border-radius:0;padding:clamp(76px,8vw,108px) clamp(14px,4vw,56px) 30px;background:
 radial-gradient(circle at 84% 16%,#ffe86b 0 34px,transparent 35px),
 radial-gradient(circle at 82% 15%,rgba(255,255,255,.65) 0 64px,transparent 65px),
 radial-gradient(ellipse at 14% 78%,#6fbe55 0 19%,transparent 20%),
 linear-gradient(180deg,#58c9f7 0 52%,#bfe79a 70%,#72b958 100%);}
.app:has(#home.active) .home:before{content:'';position:absolute;inset:0;pointer-events:none;background:
 radial-gradient(ellipse at 7% 18%,rgba(255,255,255,.86) 0 55px,transparent 56px),
 radial-gradient(ellipse at 16% 16%,rgba(255,255,255,.8) 0 42px,transparent 43px),
 radial-gradient(ellipse at 91% 27%,rgba(255,255,255,.82) 0 48px,transparent 49px),
 linear-gradient(180deg,transparent 0 58%,rgba(255,255,255,.16) 58% 59%,transparent 59%);}
.app:has(#home.active) .home:after{content:'';position:absolute;left:-4%;right:-4%;bottom:-4%;height:28%;pointer-events:none;background:
 radial-gradient(ellipse at 10% 100%,#4f9e4b 0 18%,transparent 19%),
 radial-gradient(ellipse at 28% 100%,#64ad4f 0 21%,transparent 22%),
 radial-gradient(ellipse at 50% 100%,#72ba55 0 24%,transparent 25%),
 radial-gradient(ellipse at 73% 100%,#5ca84c 0 20%,transparent 21%),
 radial-gradient(ellipse at 92% 100%,#4c9747 0 18%,transparent 19%);}
.app:has(#home.active) .cloud{opacity:.55;filter:blur(.2px);}
.app:has(#home.active) .cloud.cA{top:13%;left:7%;transform:scale(.72);}
.app:has(#home.active) .cloud.cB{top:18%;right:8%;transform:scale(.58);}
.app:has(#home.active) .heroTitle{position:relative;z-index:4;margin:0 auto 18px;max-width:900px;text-shadow:0 4px 0 rgba(48,116,145,.24),0 9px 18px rgba(42,109,138,.2);}
.app:has(#home.active) .heroTitle h1{font-size:clamp(58px,8vw,100px);line-height:.9;color:#ff5f57;letter-spacing:-4px;text-shadow:4px 5px 0 #ffd34f,7px 9px 0 rgba(255,255,255,.7);}
.app:has(#home.active) .heroTitle p{font-size:clamp(17px,2.2vw,27px);margin:14px 0 0;color:#fff;font-weight:1000;letter-spacing:.2px;}
.app:has(#home.active) .mainChoices{width:min(100%,980px);gap:clamp(12px,2.2vw,26px);}
.app:has(#home.active) .choice{min-height:clamp(310px,39vw,470px);border:6px solid rgba(255,255,255,.94);border-radius:36px;padding:12px;background:rgba(255,255,255,.92);box-shadow:0 20px 35px rgba(47,112,86,.24),inset 0 0 0 2px rgba(255,255,255,.9);}
.app:has(#home.active) .choice.draw{background:linear-gradient(145deg,#ffc7df,#fff 72%);}
.app:has(#home.active) .choice.color{background:linear-gradient(145deg,#bde9ff,#fff 72%);}
.app:has(#home.active) .choiceArt{height:clamp(210px,25vw,310px);border-radius:28px;font-size:clamp(105px,13vw,180px);box-shadow:inset 0 -18px 35px rgba(255,255,255,.35);}
.app:has(#home.active) .draw .choiceArt{background:radial-gradient(circle at 50% 25%,#fff 0 22%,transparent 23%),linear-gradient(160deg,#ffd8e9,#fff0f7);}
.app:has(#home.active) .color .choiceArt{background:radial-gradient(circle at 72% 25%,#ffe05a 0 12%,transparent 13%),linear-gradient(160deg,#d7f4ff,#eefaff);}
.app:has(#home.active) .choice h2{font-size:clamp(25px,3vw,38px);margin:10px 8px 0;color:#173b56;}
.app:has(#home.active) .choice p{font-size:clamp(12px,1.5vw,17px);margin:0 8px;color:#557080;}
.app:has(#home.active) .go{width:clamp(44px,4.5vw,58px);height:clamp(44px,4.5vw,58px);font-size:clamp(23px,2.4vw,32px);box-shadow:0 5px 0 rgba(0,0,0,.12);}
.app:has(#home.active) .sideMenu{margin-top:18px;gap:10px;}
.app:has(#home.active) .woodBtn{position:relative;z-index:5;background:linear-gradient(#fff8db,#ffe9a9);border:3px solid #d8a75c;border-radius:16px;padding:11px 18px;color:#5d3e22;box-shadow:0 5px 0 #b9823d,0 10px 16px rgba(69,92,56,.16);}
.app:has(#home.active) .mascot{z-index:4;filter:drop-shadow(0 7px 7px rgba(41,76,48,.2));}
.app:has(#home.active) .m1{left:2%;bottom:7%;font-size:clamp(64px,8vw,105px);}
.app:has(#home.active) .m2{right:3%;bottom:12%;font-size:clamp(50px,6vw,82px);}
.app:has(#home.active) .m3{left:10%;bottom:-1%;font-size:clamp(56px,7vw,92px);}
.app:has(#home.active) .m4{right:12%;bottom:-1%;font-size:clamp(56px,7vw,92px);}
@media(max-width:650px){
 .app:has(#home.active)>.top{padding:0 12px;}
 .app:has(#home.active)>.top .roundBtn{width:46px;height:46px;}
 .app:has(#home.active) .home{padding:72px 10px 20px;}
 .app:has(#home.active) .heroTitle{margin-bottom:10px;}
 .app:has(#home.active) .heroTitle h1{font-size:clamp(48px,16vw,70px);letter-spacing:-3px;}
 .app:has(#home.active) .heroTitle p{font-size:13px;}
 .app:has(#home.active) .mainChoices{gap:8px;}
 .app:has(#home.active) .choice{min-height:240px;border-width:4px;border-radius:24px;padding:7px;}
 .app:has(#home.active) .choiceArt{height:150px;border-radius:19px;font-size:78px;}
 .app:has(#home.active) .choice h2{font-size:20px;margin-top:6px;}
 .app:has(#home.active) .choice p{font-size:10px;}
 .app:has(#home.active) .go{width:36px;height:36px;font-size:20px;}
 .app:has(#home.active) .sideMenu{margin-top:11px;gap:7px;}
 .app:has(#home.active) .woodBtn{padding:8px 10px;font-size:11px;border-width:2px;box-shadow:0 3px 0 #b9823d;}
 .app:has(#home.active) .m1,.app:has(#home.active) .m3{left:1%;}
 .app:has(#home.active) .m2,.app:has(#home.active) .m4{right:1%;}
}
`;
document.head.appendChild(style);
})();
