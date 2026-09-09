/* Wadfun Canvas Core V1
   แกนกลางร่วมของโหมดวาดรูปและระบายสี
   จุดประสงค์: รวมการคำนวณตำแหน่ง + touch/pointer + pinch zoom
   โดยไม่เปลี่ยนพฤติกรรมของ Draw V6 ที่ใช้งานได้แล้ว */
(function(){
'use strict';

function pointFromClient(canvas,clientX,clientY){
  const r=canvas.getBoundingClientRect();
  return {x:(clientX-r.left)*canvas.width/r.width,y:(clientY-r.top)*canvas.height/r.height};
}

function touchDistance(touches){
  if(!touches||touches.length<2)return 0;
  return Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
}

function clampZoom(v){return Math.max(1,Math.min(3,v));}

window.WadfunCanvasCore={
  pointFromClient,
  touchDistance,
  clampZoom,
  version:'1.0.0'
};
})();