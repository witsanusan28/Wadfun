/* Wadfun Circle Test Template — retired; real Color templates own the canvas. */
(function(){
  'use strict';

  // Kept as a compatibility shim because older code may still call this function.
  // The old test circle must never draw over or flash before a real template.
  function drawCircleTemplate(){ return; }

  window.wadfunDrawCircleTemplate=drawCircleTemplate;
})();
