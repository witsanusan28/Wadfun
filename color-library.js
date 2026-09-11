/* Wadfun Color Library V6 — single owner for category -> picture -> color */
(function () {
  'use strict';

  if (window.__wadfunColorLibraryV6) return;
  window.__wadfunColorLibraryV6 = true;

  const data = {
    animals: {
      name: 'สัตว์ 🐾', icon: '🐾', items: [
        ['แมว','🐱','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M105 190L120 70l90 75q40-20 80 0l90-75 15 120q35 45 15 120-35 105-160 105T90 310q-20-75 15-120z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/><path d="M235 285q15 15 30 0M250 300v35" fill="none"/></g></svg>'],
        ['สุนัข','🐶','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M115 175Q70 80 150 105l55 55q45-20 90 0l55-55q80-25 35 70 35 55 15 125-35 105-150 105T100 300q-20-70 15-125z"/><circle cx="190" cy="245" r="13"/><circle cx="310" cy="245" r="13"/></g></svg>'],
        ['ปลา','🐟','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M80 250Q190 105 360 205l70-65v220l-70-65Q190 395 80 250z"/><circle cx="325" cy="230" r="13"/></g></svg>'],
        ['ผีเสื้อ','🦋','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="white" stroke="#111" stroke-width="12"><path d="M250 250Q155 90 80 130q-45 100 95 175Q35 290 90 400q100 20 160-105M250 250Q345 90 420 130q45 100-95 175 140-15 85 95-100 20-160-105M250 155v220" fill="none"/></g></svg>']
      ]
    },
    food: {
      name: 'อาหาร 🍎', icon: '🍎', items: [
        ['แอปเปิล','🍎','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 165Q130 105 85 230q-25 150 165 205 190-55 165-205-45-125-165-65z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
        ['แตงโม','🍉','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M70 180h360q-10 190-180 190T70 180z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
        ['ไอศกรีม','🍦','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M135 210q0-100 115-100t115 100H135zM140 210h220L250 420z" fill="white" stroke="#111" stroke-width="12"/></svg>']
      ]
    },
    vehicles: {
      name: 'ยานพาหนะ 🚗', icon: '🚗', items: [
        ['รถยนต์','🚗','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M90 300l45-105h230l45 105v90H90z" fill="white" stroke="#111" stroke-width="12"/><circle cx="155" cy="390" r="35" fill="white" stroke="#111" stroke-width="12"/><circle cx="345" cy="390" r="35" fill="white" stroke="#111" stroke-width="12"/></svg>'],
        ['จรวด','🚀','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 60q100 80 100 220l-45 80h-110l-45-80Q150 140 250 60z" fill="white" stroke="#111" stroke-width="12"/><circle cx="250" cy="190" r="32" fill="white" stroke="#111" stroke-width="12"/></svg>'],
        ['เครื่องบิน','✈️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M70 245l150-20 80-120h55l-30 115 100 15q45 8 0 30l-100 15 30 115h-55l-80-120-150-20q-45-5 0-10z" fill="white" stroke="#111" stroke-width="12"/></svg>']
      ]
    },
    nature: {
      name: 'ธรรมชาติ 🌈', icon: '🌈', items: [
        ['ดอกไม้','🌸','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250" cy="220" r="45" fill="white" stroke="#111" stroke-width="12"/><circle cx="180" cy="175" r="55" fill="white" stroke="#111" stroke-width="12"/><circle cx="320" cy="175" r="55" fill="white" stroke="#111" stroke-width="12"/><path d="M250 255v180" fill="none" stroke="#111" stroke-width="12"/></svg>'],
        ['ดวงอาทิตย์','☀️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><circle cx="250" cy="250" r="90" fill="white" stroke="#111" stroke-width="12"/><path d="M250 55v70M250 375v70M55 250h70M375 250h70" stroke="#111" stroke-width="12"/></svg>'],
        ['เมฆ','☁️','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M100 330q0-80 80-80 20-90 105-65 55 10 60 70 75-10 75 75 0 55-65 55H165q-65 0-65-55z" fill="white" stroke="#111" stroke-width="12"/></svg>']
      ]
    },
    fantasy: {
      name: 'แฟนตาซี 🦖', icon: '🦖', items: [
        ['ไดโนเสาร์','🦖','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M110 360q-25-115 55-175 60-45 145-5l55-75 65 55-75 55q15 65-25 110l45 55H280l-25-65-45 65z" fill="white" stroke="#111" stroke-width="12"/></svg>'],
        ['จรวดอวกาศ','🌟','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 75q75 70 75 170v95H175v-95q0-100 75-170z" fill="white" stroke="#111" stroke-width="12"/><circle cx="250" cy="205" r="30" fill="white" stroke="#111" stroke-width="12"/></svg>']
      ]
    }
  };

  window.wadfunColorLibraryData = data;

  let activeCategory = 'animals';
  let booted = false;

  const el = id => document.getElementById(id);
  const categoriesGrid = () => el('categoriesGrid');
  const pickerGrid = () => el('pickerGrid');

  function setVisible(node, visible, display) {
    if (!node) return;
    if (visible) node.style.setProperty('display', display || 'block', 'important');
    else node.style.setProperty('display', 'none', 'important');
  }

  function scrollTop() {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); }
    catch (_) { window.scrollTo(0, 0); }
  }

  function renderCategories() {
    const grid = categoriesGrid();
    if (!grid) return false;
    grid.innerHTML = Object.entries(data).map(([id, category]) => `
      <button type="button" class="cat" data-cat="${id}" aria-label="เลือกหมวด ${category.name}">
        <div class="catImg">${category.icon}</div>
        <b>${category.name}</b>
        <small>${category.items.length} รูป</small>
      </button>
    `).join('');
    return grid.children.length > 0;
  }

  function renderPictures() {
    const grid = pickerGrid();
    const category = data[activeCategory];
    if (!grid || !category) return false;

    grid.innerHTML = category.items.map((item, index) => `
      <button type="button" class="template" data-index="${index}" data-cat="${activeCategory}" aria-label="เลือกรูป ${item[0]}">
        <div class="templateImg">${item[2]}</div>
        <b>${item[0]}</b>
      </button>
    `).join('');

    grid.dataset.wadfunCategory = activeCategory;
    const picker = el('picker');
    const title = picker && picker.querySelector('#pickerTitle');
    const sub = picker && picker.querySelector('#pickerSub');
    if (title) title.textContent = `${category.icon} ${category.name}`;
    if (sub) sub.textContent = `เลือกจาก ${category.items.length} รูป แล้วแตะรูปเพื่อเริ่มระบายสี ✨`;
    return grid.children.length === category.items.length && grid.children.length > 0;
  }

  function showCategories() {
    const categories = el('categories');
    const picker = el('picker');
    if (!categories || !picker) return false;
    setVisible(categories, true, 'block');
    setVisible(picker, false);
    setVisible(categoriesGrid(), true, 'grid');
    scrollTop();
    return true;
  }

  function showPicker() {
    const categories = el('categories');
    const picker = el('picker');
    if (!categories || !picker) return false;
    setVisible(categories, false);
    setVisible(picker, true, 'block');
    setVisible(pickerGrid(), true, 'grid');
    scrollTop();
    return true;
  }

  function renderSelectedPicture(item) {
    const canvas = el('colorCanvas');
    if (!canvas || !el('color')?.classList.contains('active')) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const box = canvas.parentElement?.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (box && box.width > 10 && box.height > 10) {
      canvas.style.width = box.width + 'px';
      canvas.style.height = box.height + 'px';
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
    }

    const image = new Image();
    image.onload = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const pad = Math.min(canvas.width, canvas.height) * 0.08;
      const scale = Math.min((canvas.width - pad * 2) / 500, (canvas.height - pad * 2) / 500);
      const size = 500 * scale;
      ctx.drawImage(image, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
      window.wadfunResetColorMask?.();
      window.wadfunColorTemplateChanged?.();
      window.wadfunColorHistoryReset?.();
      window.wadfunEnsureColorLineOverlay?.();
    };
    image.onerror = () => console.error('[Wadfun] Could not render selected SVG');
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(item[2]);
    return true;
  }

  function choosePicture(index) {
    const item = data[activeCategory]?.items[index];
    if (!item) return false;

    window.wadfunActiveColorTemplate = { category: activeCategory, name: item[0] };
    window.wadfunColorTemplatePending = true;
    window.currentTemplate = item[1] + ' ' + item[0];
    window.currentName = '🖍️ ' + item[0];

    if (typeof window.show === 'function') window.show('color');

    let attempts = 0;
    const waitForCanvas = () => {
      if (renderSelectedPicture(item) || attempts++ >= 40) {
        window.wadfunColorTemplatePending = false;
        if (attempts >= 40) console.error('[Wadfun] colorCanvas was not ready');
        return;
      }
      setTimeout(waitForCanvas, 60);
    };
    waitForCanvas();
    return true;
  }

  function installNavigation() {
    if (window.__wadfunColorLibraryNavigationV6) return;
    window.__wadfunColorLibraryNavigationV6 = true;

    document.addEventListener('click', event => {
      const categoryButton = event.target.closest?.('#categoriesGrid .cat');
      if (categoryButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        activeCategory = categoryButton.dataset.cat || 'animals';
        renderPictures();
        showPicker();
        return;
      }

      const backButton = event.target.closest?.('#wadfunColorCategoryBack');
      if (backButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showCategories();
        return;
      }

      const pictureButton = event.target.closest?.('#pickerGrid .template');
      if (pictureButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        choosePicture(Number(pictureButton.dataset.index));
      }
    }, true);
  }

  function installBackButton() {
    const picker = el('picker');
    const grid = pickerGrid();
    if (!picker || !grid) return;
    let button = el('wadfunColorCategoryBack');
    if (!button) {
      button = document.createElement('button');
      button.id = 'wadfunColorCategoryBack';
      button.type = 'button';
      button.className = 'back';
      button.textContent = '← กลับเลือกหมวด';
      picker.insertBefore(button, picker.querySelector('.pageCard') || grid);
    }
  }

  function patchShow() {
    if (typeof window.show !== 'function' || window.__wadfunColorLibraryShowV6) return;
    window.__wadfunColorLibraryShowV6 = true;
    const originalShow = window.show;
    window.show = function (mode) {
      const result = originalShow.apply(this, arguments);
      if (mode === 'categories') {
        setTimeout(() => { renderCategories(); showCategories(); }, 0);
      } else if (mode === 'picker') {
        setTimeout(() => { renderPictures(); showPicker(); }, 0);
      } else if (mode === 'color') {
        setTimeout(() => {
          const selected = window.wadfunActiveColorTemplate;
          const item = data[selected?.category]?.items.find(x => x[0] === selected?.name);
          if (item) renderSelectedPicture(item);
        }, 0);
      }
      return result;
    };
  }

  window.wadfunColorLibraryResetPicker = () => {
    activeCategory = 'animals';
    renderCategories();
    renderPictures();
    showCategories();
  };

  window.wadfunRenderActiveColorTemplate = () => {
    const selected = window.wadfunActiveColorTemplate;
    const item = data[selected?.category]?.items.find(x => x[0] === selected?.name);
    return !!item && renderSelectedPicture(item);
  };

  function boot() {
    const required = el('categories') && el('picker') && categoriesGrid() && pickerGrid();
    if (!required) return false;
    patchShow();
    installBackButton();
    installNavigation();
    renderCategories();
    renderPictures();
    booted = true;
    return true;
  }

  const bootTimer = setInterval(() => {
    if (boot()) clearInterval(bootTimer);
  }, 100);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('pageshow', () => {
    if (!booted) boot();
    else {
      renderCategories();
      if (el('picker')?.classList.contains('active')) renderPictures();
    }
  });
})();
