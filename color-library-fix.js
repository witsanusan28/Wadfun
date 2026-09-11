/* Wadfun Color Library Fix V2 — own the picker state and reset on every Color entry */
(function(){
'use strict';
if(window.__wadfunColorLibraryFixV2)return;window.__wadfunColorLibraryFixV2=true;

const DATA=()=>window.wadfunColorLibraryData||{};
let active='animals';
let internalShow=false;

function grids(){return {cg:document.querySelector('.categoriesGrid'),pg:document.querySelector('.pickerGrid')}}
function card(){const {cg,pg}=grids();return (cg&&cg.closest('.pageCard'))||(pg&&pg.closest('.pageCard'))}
function force(el,prop,val){if(el)el.style.setProperty(prop,val,'important')}
function header(mode){
  const p=card();if(!p)return;
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
  const {pg}=grids();if(!pg||document.getElementById('wadfunColorCategoryBack'))return;
  const b=document.createElement('button');
  b.id='wadfunColorCategoryBack';b.type='button';b.className='back';
  b.textContent='← กลับเลือกหมวด';b.style.marginBottom='10px';
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();showCategories()});
  pg.parentElement?.insertBefore(b,pg);
}
function buildCategories(){
  const {cg}=grids();const data=DATA();if(!cg||!Object.keys(data).length)return false;
  cg.innerHTML=Object.entries(data).map(([id,c])=>`<button type="button" class="cat" data-cat="${id}"><div class="catImg">${c.icon}</div><b>${c.name}</b><small>${c.items.length} รูป</small></button>`).join('');
  cg.querySelectorAll('.cat').forEach((b,i)=>{
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();active=b.dataset.cat||'animals';buildTemplates();showTemplates()});
  });
  return true;
}
function buildTemplates(){
  const {pg}=grids();const data=DATA();const c=data[active];if(!pg||!c)return false;
  pg.innerHTML=c.items.map((x,i)=>`<button type="button" class="template" data-index="${i}"><div class="templateImg">${x[1]}</div><b>${x[0]}</b></button>`).join('');
  pg.querySelectorAll('.template').forEach((b)=>{
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      const item=c.items[Number(b.dataset.index)];
      if(!item)return;
      window.wadfunColorTemplatePending=true;
      window.wadfunActiveColorTemplate={category:active,name:item[0]};
      if(typeof window.show==='function')window.show('color');
      let n=0;const tick=()=>{if(window.wadfunRenderActiveColorTemplate?.()||n++>10){window.wadfunColorTemplatePending=false;return}setTimeout(tick,80)};tick();
    });
  });
  return true;
}
function showCategories(){
  const {cg,pg}=grids();if(!cg||!pg)return false;
  const p=card();force(p,'display','block');
  force(cg,'display','grid');force(pg,'display','none');
  const b=document.getElementById('wadfunColorCategoryBack');if(b)force(b,'display','none');
  header('cat');return true;
}
function showTemplates(){
  const {cg,pg}=grids();if(!cg||!pg)return false;
  const p=card();force(p,'display','block');
  force(cg,'display','none');force(pg,'display','grid');
  ensureBack();const b=document.getElementById('wadfunColorCategoryBack');if(b)force(b,'display','inline-block');
  header('tpl');return true;
}
function resetPicker(){
  active='animals';
  buildCategories();
  buildTemplates();
  showCategories();
}

function wrapShow(){
  if(window.__wadfunColorLibraryShowWrappedV2||typeof window.show!=='function')return false;
  window.__wadfunColorLibraryShowWrappedV2=true;
  const oldShow=window.show;
  window.show=function(mode){
    const r=oldShow.apply(this,arguments);
    if(mode==='color'&&!window.wadfunColorTemplatePending){
      setTimeout(resetPicker,0);
      setTimeout(resetPicker,80);
    }
    return r;
  };
  return true;
}

const boot=setInterval(function(){
  const {cg,pg}=grids();
  if(cg&&pg){
    wrapShow();
    if(!cg.querySelector('.cat'))buildCategories();
    if(!pg.querySelector('.template'))buildTemplates();
    if(document.getElementById('color')?.classList.contains('active')&&!window.wadfunColorTemplatePending){
      const pickerVisible=pg.getBoundingClientRect().height>0&&getComputedStyle(pg).display!=='none';
      if(!pickerVisible&&cg.getBoundingClientRect().height===0)showCategories();
    }
  }
},120);

// Capture phase wins over the older picker listeners so the category click cannot blank the card.
document.addEventListener('click',function(e){
  const cat=e.target.closest?.('.categoriesGrid .cat');
  if(cat){
    e.preventDefault();e.stopImmediatePropagation();
    active=cat.dataset.cat||'animals';buildTemplates();showTemplates();return;
  }
  const back=e.target.closest?.('#wadfunColorCategoryBack');
  if(back){e.preventDefault();e.stopImmediatePropagation();showCategories();return;}
},true);

document.addEventListener('wadfun-work-loaded',function(){setTimeout(resetPicker,0)},false);
window.addEventListener('pageshow',function(){setTimeout(wrapShow,0)},false);
})();
