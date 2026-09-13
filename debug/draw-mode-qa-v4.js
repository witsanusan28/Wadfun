/* WADFUN DEBUG — Popup -> drawMode -> Drawing Engine
   V4 — Runtime Trace
   DEBUG ONLY. Does NOT modify pen-engine.js behavior.
*/
(function () {
  'use strict';
  if (window.__wadfunDrawQA_v4) {
    console.warn('[Wadfun QA] V4 already loaded');
    return;
  }

  const MODES = [
    ['pencil', 'ดินสอ'],
    ['crayon', 'สีเทียน'],
    ['brush', 'พู่กัน'],
    ['marker', 'Marker'],
    ['sparkle', 'ประกาย']
  ];

  const stats = {};
  MODES.forEach(([mode, label]) => {
    stats[mode] = { label, selected: 0, drawCalls: 0, matching: 0, mismatch: 0, lastDrawMode: null };
  });

  let lastSelectedMode = null;

  function getDrawMode() {
    try { return drawMode; } catch (e) { return '[UNREADABLE]'; }
  }

  function getPopupMode(item) {
    const text = (item?.textContent || '').toLowerCase();
    if (text.includes('ดินสอ')) return 'pencil';
    if (text.includes('สีเทียน')) return 'crayon';
    if (text.includes('พู่กัน')) return 'brush';
    if (text.includes('เมจิก') || text.includes('marker')) return 'marker';
    if (text.includes('ประกาย') || text.includes('sparkle')) return 'sparkle';
    return null;
  }

  function summary() {
    console.log('%c\n========== WADFUN ENGINE TRACE ==========', 'color:#7b1fa2;font-weight:bold');
    let totalCalls = 0, totalMatch = 0, totalMismatch = 0;
    MODES.forEach(([mode]) => {
      const s = stats[mode];
      totalCalls += s.drawCalls;
      totalMatch += s.matching;
      totalMismatch += s.mismatch;
      const status = s.drawCalls === 0 ? 'NOT TESTED' : s.mismatch === 0 ? 'PASS' : 'FAIL';
      console.log(
        `${s.label.padEnd(10)} → ${mode.padEnd(8)} | Selected ${s.selected} | Draw ${s.drawCalls} | MATCH ${s.matching} | MISMATCH ${s.mismatch} | ${status}`,
        status === 'PASS' ? 'color:green;font-weight:bold' : status === 'FAIL' ? 'color:red;font-weight:bold' : 'color:#777'
      );
    });
    console.log('-----------------------------------------');
    console.log(
      `TOTAL | Draw ${totalCalls} | MATCH ${totalMatch} | MISMATCH ${totalMismatch}`,
      totalMismatch === 0 ? 'color:green;font-weight:bold' : 'color:red;font-weight:bold'
    );
    console.log('%c=========================================\n', 'color:#7b1fa2;font-weight:bold');
  }

  document.addEventListener('click', function (e) {
    const item = e.target?.closest?.('#draw .penItem');
    if (!item) return;
    setTimeout(() => {
      const mode = getPopupMode(item);
      if (!mode || !stats[mode]) return;
      lastSelectedMode = mode;
      stats[mode].selected++;
      console.log('%c[POPUP SELECT]', 'color:#1976d2;font-weight:bold', mode);
      console.log('[drawMode]', getDrawMode());
    }, 0);
  }, false);

  if (typeof window.wadfunStrokePoint === 'function') {
    const originalStrokePoint = window.wadfunStrokePoint;
    window.wadfunStrokePoint = function () {
      const modeBefore = getDrawMode();
      if (stats[modeBefore]) {
        stats[modeBefore].drawCalls++;
        stats[modeBefore].lastDrawMode = modeBefore;
        if (lastSelectedMode === modeBefore) stats[modeBefore].matching++;
        else stats[modeBefore].mismatch++;
      }
      console.log('%c[ENGINE DRAW]', 'color:#e65100;font-weight:bold', 'drawMode =', modeBefore, '| last Popup =', lastSelectedMode);
      if (lastSelectedMode && modeBefore !== lastSelectedMode) {
        console.error('%c!!! DRAW MODE MISMATCH !!!', 'color:red;font-size:15px;font-weight:bold', { popup: lastSelectedMode, engine: modeBefore });
      }
      return originalStrokePoint.apply(this, arguments);
    };
  } else {
    console.warn('[Wadfun QA] wadfunStrokePoint() ยังไม่พบตอนโหลด Debug — โหลดใหม่หลังเข้า Drawing');
  }

  window.wadfunEngineQA = {
    summary,
    reset() {
      MODES.forEach(([mode, label]) => { stats[mode] = { label, selected: 0, drawCalls: 0, matching: 0, mismatch: 0, lastDrawMode: null }; });
      lastSelectedMode = null;
      console.clear();
      console.log('%cWadfun Engine QA Reset ✓', 'color:green;font-weight:bold');
      summary();
    },
    getStats() { return JSON.parse(JSON.stringify(stats)); }
  };

  window.__wadfunDrawQA_v4 = true;
  console.log('%cWadfun Engine Trace V4 READY ✓', 'color:green;font-size:15px;font-weight:bold');
  console.log('เลือก Popup 1 ตัว → วาด 1 เส้น → เปลี่ยนตัวถัดไป → วาด');
  summary();
})();
