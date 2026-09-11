/* Wadfun Color Library Fix V3 — separate picker cards + hard reset on Color entry */
(function(){
'use strict';
if(window.__wadfunColorLibraryFixV3)return;window.__wadfunColorLibraryFixV3=true;

const DATA=()=>window.wadfunColorLibraryData||{};
let active='animals';

function grids(){return {cg:document.querySelector('.categoriesGrid'),pg:document.querySelector('.pickerGrid')}}
function catCard(){const {cg}=grids();return cg?.closest('.pageCard')||null}
function tplCard(){const {pg}=grids();return pg?.closest('.pageCard')||null}
function force(el,prop,val){if(el)el.style.setProperty(prop,val,'important')}
function setVisible(el,yes){force(el,'display',yes?'block':'none')}
function header(mode){
  const p=mode==='cat'?catCard():tplCard();if(!p)return;
  const h=p.querySelector('.pageTitle h1');
  if(h)h.textContent=mode==='cat'?'🖍️ เลือกหมวดภาพระบายสี':'✨ เลือกรูปที่จะระบายสี';
  const st=p.querySelector('.wadfun-picker-step');
  if(st)st.innerHTML=mode==='cat'?'1️⃣ <span>เลือกหมวดที่อยากวาด</span>':'2️⃣ <span>เลือกรูปที่ชอบ</span>';
  const tip=p.querySelector('.wadfun-picker-tip');
  if(tip)tip.textContent=mode==='cat'?'เลือกจากรูปใหญ่ ๆ ได้เลย 🎨 ไม่ต้องอ่านก็เลือกได้':'แตะรูปหนึ่งครั้ง แล้วไปเริ่มระบายสีได้เลย ✨';
  const pr=p.querySelector('.wadfun-picker-progress');
  if(pr)pr.innerHTML=mode==='cat'?'<i>1</i> จาก 2':'<i>2</i> จาก 2';
}
function ensureBack(){
  const card=tplCard(),pg=grids().pg;if(!card||!pg||document.getElementById('wadfunColorCategoryBack'))return;
  const b=document.createElement('button');
  b.id='wadfunColorCategoryBack';b.type='button';b.className='back';
  b.textContent='← กลับเลือกหมวด';b.style.marginBottom='10px';
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();showCategories()});
  card.insertBefore(b,pg);
}
function buildCategories(){
  const {cg}=grids(),data=DATA();if(!cg||!Object.keys(data).length)return false;
  cg.innerHTML=Object.entries(data).map(([id,c])=>`<button type="button" class="cat" data-cat="${id}"><div class="catImg">${c.icon}</div><b>${c.name}</b><small>${c.items.length} รูป</small></button>`).join('');
  return true;
}
function buildTemplates(){
  const {pg}=grids(),data=DATA(),c=data[active];if(!pg||!c)return false;
  pg.innerHTML=c.items.map((x,i)=>`<button type="button" class="template" data-index="${i}"><div class="templateImg">${x[1]}</div><b>${x[0]}</b></button>`).join('');
  return true;
}
function showCategories(){
  const {cg,pg}=grids();if(!cg||!pg)return false;
  const cc=catCard(),tc=tplCard();
  setVisible(cc,true);setVisible(tc,false);
  force(cg,'display','grid');force(pg,'display','grid');
  const b=document.getElementById('wadfunColorCategoryBack');if(b)force(b,'display','none');
  header('cat');return true;
}
function showTemplates(){
  const {cg,pg}=grids();if(!cg||!pg)return false;
  const cc=catCard(),tc=tplCard();
  setVisible(cc,false);setVisible(tc,true);
  force(cg,'display','grid');force(pg,'display','grid');
  ensureBack();const b=document.getElementById('wadfunColorCategoryBack');if(b)force(b,'display','inline-block');
  header('tpl');return true;
}
function resetPicker(){
  active='animals';
  window.wadfunClearActiveColorTemplate?.();
  buildCategories();
  buildTemplates();
  showCategories();
}
function chooseTemplate(){
  const {pg}=grids(),data=DATA(),c=data[active];if(!pg||!c)return;
  const b=event?.target?.closest?.('.template');
  if(!b)return;
  const item=c.items[Number(b.dataset.index)];if(!item)return;
  window.wadfunColorTemplatePending=true;
  window.wadfunActiveColorTemplate={category:active,name:item[0]};
  if(typeof window.show==='function')window.show('color');
  let n=0;const tick=()=>{if(window.wadfunRenderActiveColorTemplate?.()||n++>10){window.wadfunColorTemplatePending=false;return}setTimeout(tick,80)};tick();
}
function wrapShow(){
  if(window.__wadfunColorLibraryShowWrappedV3||typeof window.show!=='function')return false;
  window.__wadfunColorLibraryShowWrappedV3=true;
  const oldShow=window.show;
  window.show=function(mode){
    const r=oldShow.apply(this,arguments);
    if(mode==='color'&&!window.wadfunColorTemplatePending){
      setTimeout(resetPicker,0);
      setTimeout(resetPicker,120);
    }
    return r;
  };
  return true;
}

const boot=setInterval(function(){
  const {cg,pg}=grids();
  if(!cg||!pg)return;
  wrapShow();
  if(!cg.querySelector('.cat'))buildCategories();
  if(!pg.querySelector('.template'))buildTemplates();
  if(document.getElementById('color')?.classList.contains('active')&&!window.wadfunColorTemplatePending){
    const cc=catCard(),tc=tplCard();
    if(cc&&tc&&getComputedStyle(cc).display==='none'&&getComputedStyle(tc).display==='none')showCategories();
  }
},150);

document.addEventListener('click',function(e){
  const cat=e.target.closest?.('.categoriesGrid .cat');
  if(cat){
    e.preventDefault();e.stopImmediatePropagation();
    active=cat.dataset.cat||'animals';buildTemplates();showTemplates();return;
  }
  const back=e.target.closest?.('#wadfunColorCategoryBack');
  if(back){e.preventDefault();e.stopImmediatePropagation();showCategories();return;}
  const tpl=e.target.closest?.('.pickerGrid .template');
  if(tpl){
    e.preventDefault();e.stopImmediatePropagation();
    const data=DATA(),c=data[active],item=c?.items[Number(tpl.dataset.index)];if(!item)return;
    window.wadfunColorTemplatePending=true;
    window.wadfunActiveColorTemplate={category:active,name:item[0]};
    if(typeof window.show==='function')window.show('color');
    let n=0;const tick=()=>{if(window.wadfunRenderActiveColorTemplate?.()||n++>10){window.wadfunColorTemplatePending=false;return}setTimeout(tick,80)};tick();
  }
},true);

document.addEventListener('wadfun-work-loaded',function(){setTimeout(resetPicker,0)},false);
window.addEventListener('pageshow',function(){setTimeout(wrapShow,0)},false);
})();
