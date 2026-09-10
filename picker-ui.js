/* Wadfun Picker UI V2 — child-friendly category/template selection only */
(function(){
  'use strict';
  if(window.__WADF_PICKER_UI_V2__) return;
  window.__WADF_PICKER_UI_V2__=true;

  const STYLE_ID='wadfun-picker-ui-v2-style';
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    /* ===== Wadfun child-friendly picker ===== */
    .pageCard:has(.categoriesGrid),.pageCard:has(.pickerGrid){
      border-radius:30px;
      padding:clamp(14px,2.2vw,28px);
    }
    .pageCard:has(.categoriesGrid) .pageTitle,
    .pageCard:has(.pickerGrid) .pageTitle{margin-bottom:4px}

    .wadfun-picker-step{
      display:flex;align-items:center;gap:8px;width:max-content;max-width:100%;
      margin-top:5px;padding:8px 13px;border-radius:999px;
      background:#eaf8ff;color:#23779e;font-weight:1000;font-size:14px;
      border:2px solid #ccecf9;
    }
    .wadfun-picker-tip{
      margin:8px 0 0;color:#657d8b;font-size:14px;font-weight:800;line-height:1.45;
    }
    .wadfun-picker-progress{
      display:flex;align-items:center;gap:5px;margin-left:auto;
      font-size:12px;font-weight:1000;color:#6c8190;white-space:nowrap;
    }
    .wadfun-picker-progress i{
      display:inline-flex;align-items:center;justify-content:center;
      width:27px;height:27px;border-radius:50%;font-style:normal;
      background:#e8f7ff;color:#2584aa;border:2px solid #c7eaf8;
    }

    .categoriesGrid{
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:18px !important;margin-top:18px !important;
    }
    .pickerGrid{
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:18px !important;margin-top:18px !important;
    }

    .cat,.template{
      position:relative;cursor:pointer;touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;user-select:none;
      transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;
    }
    .cat{min-height:214px;padding:10px !important;border-width:3px !important}
    .catImg{height:145px !important;font-size:82px !important}
    .cat b{font-size:19px !important}
    .cat small{font-size:12px}
    .cat:hover,.template:hover{transform:translateY(-3px);box-shadow:0 12px 24px #4b78901c}
    .cat:active,.template:active{transform:scale(.975)}

    .cat:focus-visible,.template:focus-visible{
      outline:4px solid #8bd8f7;outline-offset:2px;
    }
    .cat.wadfun-tapped,.template.wadfun-tapped{
      border-color:#55bce9 !important;
      box-shadow:0 0 0 4px #bcecff,0 12px 26px #3e99bf24;
    }
    .cat.wadfun-tapped:after,.template.wadfun-tapped:after{
      content:'✓';position:absolute;top:8px;right:8px;width:31px;height:31px;
      display:flex;align-items:center;justify-content:center;border-radius:50%;
      background:#39b978;color:#fff;font-size:18px;font-weight:1000;
      box-shadow:0 3px 8px #2c8c5b55;
    }

    .wadfun-card-number{
      position:absolute;left:14px;top:14px;z-index:2;
      min-width:29px;height:29px;padding:0 8px;border-radius:999px;
      display:flex;align-items:center;justify-content:center;
      background:#fff;color:#4d7d91;border:2px solid #d9edf6;
      font-size:12px;font-weight:1000;box-shadow:0 3px 8px #4b789018;
    }
    .wadfun-pick-label{
      display:block;margin:0 4px 7px;padding:6px 9px;border-radius:12px;
      background:#fff7d7;color:#7b6724;font-size:11px;font-weight:1000;
    }
    .template{padding:10px !important;border-width:3px !important;min-height:0}
    .templateImg{
      border-radius:20px !important;border-width:2px !important;
      font-size:clamp(80px,9vw,130px) !important;
    }
    .template b{font-size:18px;padding:9px 5px 5px !important}
    .wadfun-template-go{
      display:block;margin:2px 4px 3px;padding:6px 8px;border-radius:11px;
      background:#eaf8ff;color:#2b85aa;font-size:11px;font-weight:1000;
    }

    @media(max-width:950px){
      .categoriesGrid,.pickerGrid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
    }
    @media(max-width:650px){
      .pageCard:has(.categoriesGrid),.pageCard:has(.pickerGrid){padding:12px}
      .pageCard:has(.categoriesGrid) .pageTitle h1,
      .pageCard:has(.pickerGrid) .pageTitle h1{font-size:25px}
      .wadfun-picker-progress{font-size:11px}
      .wadfun-picker-progress i{width:24px;height:24px}
      .wadfun-picker-step{font-size:12px;padding:7px 11px}
      .wadfun-picker-tip{font-size:12px}
      .categoriesGrid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:11px !important}
      .cat{min-height:188px;padding:7px !important;border-radius:22px !important}
      .catImg{height:112px !important;font-size:64px !important;border-radius:17px !important}
      .cat b{font-size:16px !important;margin-top:7px !important}
      .cat small{font-size:11px}
      .wadfun-card-number{left:9px;top:9px;min-width:25px;height:25px;font-size:10px}
      .pickerGrid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:11px !important}
      .template{border-radius:20px !important;padding:7px !important}
      .templateImg{border-radius:16px !important}
      .template b{font-size:15px;padding:7px 3px 4px !important}
      .wadfun-pick-label{font-size:10px;padding:5px 7px}
      .wadfun-template-go{font-size:10px;padding:5px 6px}
    }
  `;
  document.head.appendChild(style);

  function addCardNumber(el,n){
    if(el.querySelector('.wadfun-card-number')) return;
    const badge=document.createElement('span');
    badge.className='wadfun-card-number';
    badge.textContent=n;
    badge.setAttribute('aria-hidden','true');
    el.appendChild(badge);
  }

  function decorate(){
    const catGrid=document.querySelector('.categoriesGrid');
    if(catGrid){
      const card=catGrid.closest('.pageCard');
      if(card){
        if(!card.querySelector('.wadfun-picker-step')){
          const title=card.querySelector('.pageTitle');
          const step=document.createElement('div');
          step.className='wadfun-picker-step';
          step.innerHTML='1️⃣ <span>เลือกหมวดที่อยากวาด</span>';
          const tip=document.createElement('div');
          tip.className='wadfun-picker-tip';
          tip.textContent='เลือกจากรูปใหญ่ ๆ ได้เลย 🎨 ไม่ต้องอ่านก็เลือกได้';
          (title||catGrid).insertAdjacentElement('afterend',step);
          step.insertAdjacentElement('afterend',tip);
        }
        const title=card.querySelector('.pageTitle');
        if(title && !title.querySelector('.wadfun-picker-progress')){
          const progress=document.createElement('span');
          progress.className='wadfun-picker-progress';
          progress.innerHTML='<i>1</i> จาก 2';
          title.appendChild(progress);
        }
      }
      catGrid.querySelectorAll('.cat').forEach((el,i)=>{
        el.setAttribute('role','button');el.setAttribute('tabindex','0');
        const name=el.querySelector('b')?.textContent?.trim();
        if(name) el.setAttribute('aria-label','เลือกหมวด '+name);
        addCardNumber(el,i+1);
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
          step.innerHTML='2️⃣ <span>เลือกรูปที่ชอบ</span>';
          const tip=document.createElement('div');
          tip.className='wadfun-picker-tip';
          tip.textContent='แตะรูปหนึ่งครั้ง แล้วไปเริ่มระบายสีได้เลย ✨';
          (title||pickGrid).insertAdjacentElement('afterend',step);
          step.insertAdjacentElement('afterend',tip);
        }
        const title=card.querySelector('.pageTitle');
        if(title && !title.querySelector('.wadfun-picker-progress')){
          const progress=document.createElement('span');
          progress.className='wadfun-picker-progress';
          progress.innerHTML='<i>2</i> จาก 2';
          title.appendChild(progress);
        }
      }
      pickGrid.querySelectorAll('.template').forEach((el,i)=>{
        el.setAttribute('role','button');el.setAttribute('tabindex','0');
        const name=el.querySelector('b')?.textContent?.trim();
        if(name) el.setAttribute('aria-label','เลือกรูป '+name);
        addCardNumber(el,i+1);
        if(!el.querySelector('.wadfun-pick-label')){
          const label=document.createElement('span');
          label.className='wadfun-pick-label';
          label.textContent='แตะเพื่อเลือก ✨';
          const b=el.querySelector('b');
          if(b) b.insertAdjacentElement('beforebegin',label); else el.appendChild(label);
        }
        if(!el.querySelector('.wadfun-template-go')){
          const go=document.createElement('span');
          go.className='wadfun-template-go';
          go.textContent='เลือกภาพนี้ →';
          el.appendChild(go);
        }
      });
    }
  }

  function tapFeedback(target){
    target.classList.add('wadfun-tapped');
    setTimeout(()=>target.classList.remove('wadfun-tapped'),280);
  }

  document.addEventListener('click',function(e){
    const target=e.target.closest?.('.cat,.template');
    if(!target) return;
    tapFeedback(target);
  },false);

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter' && e.key!==' ') return;
    const target=e.target.closest?.('.cat,.template');
    if(!target) return;
    e.preventDefault();
    tapFeedback(target);
    target.click();
  },false);

  const mo=new MutationObserver(()=>decorate());
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',decorate,{once:true});
  setTimeout(decorate,50);setTimeout(decorate,300);setTimeout(decorate,1000);
})();
