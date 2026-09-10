/* Wadfun Picker UI V1 — child-friendly category/template selection only */
(function(){
  'use strict';
  if(window.__WADF_PICKER_UI_V1__) return;
  window.__WADF_PICKER_UI_V1__=true;

  const STYLE_ID='wadfun-picker-ui-v1-style';
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    /* Child-friendly image selection */
    .pageCard:has(.categoriesGrid),.pageCard:has(.pickerGrid){
      border-radius:30px;
      padding:clamp(14px,2.2vw,26px);
    }
    .pageCard:has(.categoriesGrid) .pageTitle,
    .pageCard:has(.pickerGrid) .pageTitle{margin-bottom:4px}
    .wadfun-picker-step{
      display:inline-flex;align-items:center;gap:7px;margin-top:4px;
      padding:7px 12px;border-radius:999px;background:#eaf8ff;
      color:#23779e;font-weight:1000;font-size:13px;
      border:2px solid #ccecf9;
    }
    .wadfun-picker-tip{
      margin:8px 0 0;color:#657d8b;font-size:14px;font-weight:800;
    }
    .categoriesGrid{
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:18px !important;
      margin-top:18px !important;
    }
    .cat,.template{
      position:relative;cursor:pointer;touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
      user-select:none;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;
    }
    .cat{min-height:205px;padding:10px !important;border-width:3px !important}
    .catImg{height:145px !important;font-size:82px !important}
    .cat b{font-size:19px !important}
    .cat small{font-size:12px}
    .cat:active,.template:active{transform:scale(.975)}
    .cat:hover,.template:hover{transform:translateY(-3px);box-shadow:0 12px 24px #4b78901c}
    .cat.wadfun-tapped,.template.wadfun-tapped{
      border-color:#55bce9 !important;box-shadow:0 0 0 4px #bcecff,0 12px 26px #3e99bf24;
    }
    .cat.wadfun-tapped:after,.template.wadfun-tapped:after{
      content:'✓';position:absolute;top:8px;right:8px;width:30px;height:30px;
      display:flex;align-items:center;justify-content:center;border-radius:50%;
      background:#39b978;color:#fff;font-size:18px;font-weight:1000;
      box-shadow:0 3px 8px #2c8c5b55;
    }
    .pickerGrid{
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:18px !important;margin-top:18px !important;
    }
    .template{padding:10px !important;border-width:3px !important;min-height:0}
    .templateImg{border-radius:20px !important;border-width:2px !important;font-size:clamp(80px,9vw,130px) !important}
    .template b{font-size:18px;padding:9px 5px 5px !important}
    .wadfun-pick-label{
      display:block;margin:0 4px 7px;padding:6px 9px;border-radius:12px;
      background:#fff7d7;color:#7b6724;font-size:11px;font-weight:1000;
    }
    @media(max-width:950px){
      .categoriesGrid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
      .pickerGrid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
    }
    @media(max-width:650px){
      .pageCard:has(.categoriesGrid),.pageCard:has(.pickerGrid){padding:12px}
      .categoriesGrid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:11px !important}
      .cat{min-height:184px;padding:7px !important;border-radius:22px !important}
      .catImg{height:112px !important;font-size:64px !important;border-radius:17px !important}
      .cat b{font-size:16px !important;margin-top:7px !important}
      .pickerGrid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:11px !important}
      .template{border-radius:20px !important;padding:7px !important}
      .templateImg{border-radius:16px !important}
      .template b{font-size:15px;padding:7px 3px 4px !important}
      .wadfun-picker-tip{font-size:12px}
      .wadfun-picker-step{font-size:12px}
      .wadfun-pick-label{font-size:10px;padding:5px 7px}
    }
  `;
  document.head.appendChild(style);

  function decorate(){
    const catGrid=document.querySelector('.categoriesGrid');
    if(catGrid){
      const card=catGrid.closest('.pageCard');
      if(card){
        if(!card.querySelector('.wadfun-picker-step')){
          const title=card.querySelector('.pageTitle');
          const step=document.createElement('div');
          step.className='wadfun-picker-step';
          step.textContent='1️⃣ เลือกหมวดที่อยากวาด';
          const tip=document.createElement('div');
          tip.className='wadfun-picker-tip';
          tip.textContent='แตะรูปใหญ่ ๆ ได้เลย เดี๋ยวเราไปเลือกรูปกันต่อ 🎨';
          (title||catGrid).insertAdjacentElement('afterend',step);
          step.insertAdjacentElement('afterend',tip);
        }
      }
      catGrid.querySelectorAll('.cat').forEach((el)=>{
        el.setAttribute('role','button');
        const name=el.querySelector('b')?.textContent?.trim();
        if(name) el.setAttribute('aria-label','เลือกหมวด '+name);
      });
    }

    const pickGrid=document.querySelector('.pickerGrid');
    if(pickGrid){
      const card=pickGrid.closest('.pageCard');
      if(card){
        if(!card.querySelector('.wadfun-picker-step')){
          const title=card.querySelector('.pageTitle');
          const step=document.createElement('div');
          step.className='wadfun-picker-step';
          step.textContent='2️⃣ เลือกรูปที่ชอบ';
          const tip=document.createElement('div');
          tip.className='wadfun-picker-tip';
          tip.textContent='แตะรูปหนึ่งครั้ง แล้วเริ่มวาดหรือระบายสีได้เลย ✨';
          (title||pickGrid).insertAdjacentElement('afterend',step);
          step.insertAdjacentElement('afterend',tip);
        }
      }
      pickGrid.querySelectorAll('.template').forEach((el)=>{
        el.setAttribute('role','button');
        const name=el.querySelector('b')?.textContent?.trim();
        if(name) el.setAttribute('aria-label','เลือกรูป '+name);
        if(!el.querySelector('.wadfun-pick-label')){
          const label=document.createElement('span');
          label.className='wadfun-pick-label';
          label.textContent='แตะเพื่อเริ่ม ✨';
          const b=el.querySelector('b');
          if(b) b.insertAdjacentElement('beforebegin',label); else el.appendChild(label);
        }
      });
    }
  }

  document.addEventListener('click',function(e){
    const target=e.target.closest?.('.cat,.template');
    if(!target) return;
    target.classList.add('wadfun-tapped');
    setTimeout(()=>target.classList.remove('wadfun-tapped'),260);
  },false);

  const mo=new MutationObserver(()=>decorate());
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',decorate,{once:true});
  setTimeout(decorate,50);setTimeout(decorate,300);setTimeout(decorate,1000);
})();
