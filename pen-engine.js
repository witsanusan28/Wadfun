/* Wadfun pen rendering engine V6
   ใช้ touch events สำหรับนิ้วโดยตรงบน iPad/iPhone
   pointer events ยังใช้สำหรับ mouse / Apple Pencil
   pinch zoom ใช้ touch events แยกจากการวาด */
function wadfunCurrentDrawColor(){
  const el=document.getElementById('drawDot')||document.getElementById('colorDot');
  const m=el&&getComputedStyle(el).backgroundColor.match(/\d+(?:\.\d+)?/g);
  return m&&m.length>=3?'#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join(''):(typeof selectedColor!=='undefined'?selectedColor:'#e53935');
}
function wadfunStrokePoint(c,x,p){
  const shade=wadfunCurrentDrawColor();
  const base=(drawMode==='eraser'?eraserSize:drawSize)*Math.min(devicePixelRatio||1,2);
  x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  x.lineCap='round';x.lineJoin='round';x.setLineDash([]);x.globalAlpha=1;
  if(drawMode==='pencil'){x.strokeStyle=shade;x.globalAlpha=.72;x.lineWidth=Math.max(1.5,base*.72);x.lineTo(p.x,p.y);x.stroke()}
  else if(drawMode==='crayon'){x.strokeStyle=shade;x.globalAlpha=.55;x.lineWidth=Math.max(2,base*1.05);x.lineTo(p.x,p.y);x.stroke()}
  else if(drawMode==='brush'){x.strokeStyle=shade;x.globalAlpha=.9;x.lineWidth=Math.max(2,base*.9);x.lineTo(p.x,p.y);x.stroke()}
  else if(drawMode==='marker'){x.strokeStyle=shade;x.globalAlpha=.96;x.lineWidth=Math.max(3,base*1.18);x.lineTo(p.x,p.y);x.stroke()}
  else if(drawMode==='sparkle'){x.strokeStyle=shade;x.globalAlpha=.7;x.lineWidth=Math.max(2,base*.72);x.lineTo(p.x,p.y);x.stroke()}
  else{x.strokeStyle=shade;x.lineWidth=base;x.lineTo(p.x,p.y);x.stroke()}
}
function wadfunTouchPos(c,t){const r=c.getBoundingClientRect();return{x:(t.clientX-r.left)*c.width/r.width,y:(t.clientY-r.top)*c.height/r.height}}
function bindDraw(c,x){
  /* Mouse / Apple Pencil */
  c.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch')return;
    e.preventDefault();isDrawing=true;saveDrawState();c.setPointerCapture?.(e.pointerId);
    x.beginPath();x.moveTo(pos(c,e).x,pos(c,e).y);x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  });
  c.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||!isDrawing)return;
    e.preventDefault();wadfunStrokePoint(c,x,pos(c,e));
  },{passive:false});
  ['pointerup','pointercancel'].forEach(t=>c.addEventListener(t,e=>{if(e.pointerType==='touch')return;isDrawing=false;x.globalAlpha=1;x.setLineDash([]);x.globalCompositeOperation='source-over'}));

  /* Finger drawing: native touch events, deliberately independent from pointer events. */
  c.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){isDrawing=false;return;}
    e.preventDefault();
    isDrawing=true;saveDrawState();
    const p=wadfunTouchPos(c,e.touches[0]);x.beginPath();x.moveTo(p.x,p.y);
    x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  },{passive:false});
  c.addEventListener('touchmove',e=>{
    if(e.touches.length!==1||!isDrawing)return;
    e.preventDefault();
    wadfunStrokePoint(c,x,wadfunTouchPos(c,e.touches[0]));
  },{passive:false});
  ['touchend','touchcancel'].forEach(t=>c.addEventListener(t,e=>{
    isDrawing=false;x.globalAlpha=1;x.setLineDash([]);x.globalCompositeOperation='source-over';
  },{passive:false}));
}

/* Pinch zoom: native touch events. No pointer capture is used. */
window.pinchZoom=function(view,layer,type){
  const st={touches:new Map(),startDist:0,startScale:1,scale:1};
  pinchMap.set(view,st);
  window.wadfunPinchStates=window.wadfunPinchStates||{};
  window.wadfunPinchStates[type]=st;
  const syncTouches=e=>{
    st.touches.clear();
    for(const t of e.touches)st.touches.set(t.identifier,{x:t.clientX,y:t.clientY});
  };
  view.addEventListener('touchstart',e=>{
    syncTouches(e);
    if(st.touches.size===2){
      isDrawing=false;
      st.startDist=dist([...st.touches.values()]);
      st.startScale=st.scale;
      window.wadfunZoomUI?.update(type,st.scale);
    }
    e.preventDefault();
  },{passive:false});
  view.addEventListener('touchmove',e=>{
    syncTouches(e);
    if(st.touches.size<2){return;}
    e.preventDefault();
    const d=dist([...st.touches.values()]);
    if(st.startDist){
      st.scale=Math.max(1,Math.min(3,st.startScale*d/st.startDist));
      layer.style.transform=`scale(${st.scale})`;
      window.wadfunZoomUI?.update(type,st.scale);
    }
  },{passive:false});
  ['touchend','touchcancel'].forEach(t=>view.addEventListener(t,e=>{
    syncTouches(e);
    if(st.touches.size<2)st.startDist=0;
  },{passive:false}));
};