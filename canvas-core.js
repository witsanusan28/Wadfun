/* Wadfun Canvas Core V2
   แกนกลางร่วมของโหมดวาดรูปและระบายสี
   ไม่เปลี่ยนพฤติกรรมของเครื่องมือเดิม
*/
(function(){
'use strict';

function pointFromClient(canvas,clientX,clientY){
  const r=canvas.getBoundingClientRect();
  return {x:(clientX-r.left)*canvas.width/r.width,y:(clientY-r.top)*canvas.height/r.height};
}

function pointFromEvent(canvas,e){
  if(e.touches&&e.touches.length)return pointFromClient(canvas,e.touches[0].clientX,e.touches[0].clientY);
  return pointFromClient(canvas,e.clientX,e.clientY);
}

function touchDistance(touches){
  if(!touches||touches.length<2)return 0;
  return Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
}

function distancePoints(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function clampZoom(v){return Math.max(1,Math.min(3,v));}

window.WadfunCanvasCore={
  pointFromClient,
  pointFromEvent,
  touchDistance,
  distancePoints,
  clampZoom,
  version:'2.0.0'
};
})();