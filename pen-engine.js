/* Wadfun pen rendering engine V5
   ปากกาวาดด้วย 1 นิ้ว / Apple Pencil ได้ต่อเนื่อง
   2 นิ้วสงวนไว้สำหรับ pinch zoom เท่านั้น
   แก้จุดสำคัญ: pinch layer ห้ามแย่ง pointer capture จาก canvas */
function wadfunCurrentDrawColor(){
  const el=document.getElementById('drawDot')||document.getElementById('colorDot');
  const m=el&&getComputedStyle(el).backgroundColor.match(/\d+(?:\.\d+)?/g);
  return m&&m.length>=3?'#'+m.slice(0,3).map(v=>Math.round(+v).toString(16).padStart(2,'0')).join(''):(typeof selectedColor!=='undefined'?selectedColor:'#e53935');
}
function wadfunDrawHasTwoTouches(){
  try{
    const view=document.getElementById('drawViewport');
    const st=view&&pinchMap.get(view);
    return !!(st&&st.touches&&st.touches.size>=2);
  }catch(_){return false}
}
function bindDraw(c,x){
  c.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'&&wadfunDrawHasTwoTouches())return;
    e.preventDefault();isDrawing=true;saveDrawState();c.setPointerCapture?.(e.pointerId);const p=pos(c,e);x.beginPath();x.moveTo(p.x,p.y);x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  });
  c.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'&&wadfunDrawHasTwoTouches()){isDrawing=false;return}
    if(!isDrawing)return;e.preventDefault();const p=pos(c,e),shade=wadfunCurrentDrawColor();
    const base=(drawMode==='eraser'?eraserSize:drawSize)*Math.min(devicePixelRatio||1,2),pressure=(typeof e.pressure==='number'&&e.pressure>0)?e.pressure:.5,jitter=(Math.random()-.5)*Math.max(1,base*.045);
    x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';x.lineCap='round';x.lineJoin='round';x.setLineDash([]);x.globalAlpha=1;
    if(drawMode==='pencil'){x.strokeStyle=shade;x.globalAlpha=.72;x.lineWidth=Math.max(1.5,base*(.55+pressure*.35));x.lineTo(p.x+jitter,p.y+jitter);x.stroke();if(Math.random()<.18){x.globalAlpha=.13;x.lineWidth=Math.max(1,base*.22);x.lineTo(p.x-jitter*1.8,p.y+jitter*1.8);x.stroke()}}
    else if(drawMode==='crayon'){x.strokeStyle=shade;x.globalAlpha=.55;x.lineWidth=Math.max(2,base*1.05);x.lineTo(p.x+jitter*2,p.y+jitter*2);x.stroke();x.globalAlpha=.22;x.lineWidth=Math.max(1,base*.42);x.lineTo(p.x-jitter*3,p.y+jitter*2);x.stroke()}
    else if(drawMode==='brush'){x.strokeStyle=shade;x.globalAlpha=.9;x.lineWidth=Math.max(2,base*(.45+pressure*1.15));x.lineTo(p.x,p.y);x.stroke()}
    else if(drawMode==='marker'){x.strokeStyle=shade;x.globalAlpha=.96;x.lineWidth=Math.max(3,base*1.18);x.lineTo(p.x,p.y);x.stroke()}
    else if(drawMode==='sparkle'){x.strokeStyle=shade;x.globalAlpha=.7;x.lineWidth=Math.max(2,base*.72);x.lineTo(p.x,p.y);x.stroke();if(Math.random()<.16){const r=Math.max(2.5,base*.28);x.save();x.globalAlpha=.95;x.fillStyle=shade;x.beginPath();x.moveTo(p.x,p.y-r*2.2);x.lineTo(p.x+r*.55,p.y-r*.55);x.lineTo(p.x+r*2.2,p.y);x.lineTo(p.x+r*.55,p.y+r*.55);x.lineTo(p.x,p.y+r*2.2);x.lineTo(p.x-r*.55,p.y+r*.55);x.lineTo(p.x-r*2.2,p.y);x.lineTo(p.x-r*.55,p.y-r*.55);x.closePath();x.fill();x.restore()}
    }else{x.strokeStyle=shade;x.lineWidth=base;x.lineTo(p.x,p.y);x.stroke()}
  },{passive:false});
  ['pointerup','pointercancel'].forEach(t=>c.addEventListener(t,()=>{isDrawing=false;x.globalAlpha=1;x.setLineDash([]);x.globalCompositeOperation='source-over'}));
}

/* V5: override the inline pinch handler before initDraw() is ever called.
   The viewport must observe the touch, but must NOT call setPointerCapture,
   because that steals the finger stream from the canvas that is drawing. */
window.pinchZoom=function(view,layer,type){
  const st={touches:new Map(),startDist:0,startScale:1,scale:1};
  pinchMap.set(view,st);
  window.wadfunPinchStates=window.wadfunPinchStates||{};
  window.wadfunPinchStates[type]=st;
  view.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='touch')return;
    st.touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(st.touches.size===2){
      isDrawing=false;
      st.startDist=dist([...st.touches.values()]);
      st.startScale=st.scale;
      window.wadfunZoomUI?.update(type,st.scale);
    }
  });
  view.addEventListener('pointermove',e=>{
    if(e.pointerType!=='touch'||!st.touches.has(e.pointerId)||st.touches.size<2)return;
    e.preventDefault();
    st.touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const d=dist([...st.touches.values()]);
    if(st.startDist){
      st.scale=Math.max(1,Math.min(3,st.startScale*d/st.startDist));
      layer.style.transform=`scale(${st.scale})`;
      window.wadfunZoomUI?.update(type,st.scale);
    }
  },{passive:false});
  ['pointerup','pointercancel'].forEach(t=>view.addEventListener(t,e=>{
    if(e.pointerType==='touch'){
      st.touches.delete(e.pointerId);
      if(st.touches.size<2)st.startDist=0;
    }
  }));
};