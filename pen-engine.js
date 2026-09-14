/* Wadfun pen rendering engine V12 — physical material brush engine */
(function(){
'use strict';

const strokeState=new WeakMap();

function wadfunCurrentDrawColor(){
  return (typeof selectedColor==='string'&&selectedColor)||'#e53935';
}

function resetStroke(c){
  strokeState.delete(c);
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

function hash01(n){
  const x=Math.sin(n*12.9898)*43758.5453;
  return x-Math.floor(x);
}

function segment(x,a,b){
  x.beginPath();
  x.moveTo(a.x,a.y);
  x.lineTo(b.x,b.y);
  x.stroke();
}

function dot(x,p,r,fill,alpha){
  x.fillStyle=fill;
  x.globalAlpha=alpha;
  x.beginPath();
  x.arc(p.x,p.y,r,0,Math.PI*2);
  x.fill();
}

function wadfunStrokePoint(c,x,p){
  const state=strokeState.get(c)||{p,dist:0,seed:Math.random()*100000};
  const prev=state.p;
  const dx=p.x-prev.x;
  const dy=p.y-prev.y;
  const len=Math.max(0.001,Math.hypot(dx,dy));
  const base=(drawMode==='eraser'?eraserSize:drawSize)*Math.min(devicePixelRatio||1,2);
  const speed=clamp(len/Math.max(1,base*1.6),0,1);
  const pressure=1-speed*.38;
  const shade=wadfunCurrentDrawColor();

  x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  x.lineCap='round';
  x.lineJoin='round';
  x.setLineDash([]);
  x.globalAlpha=1;

  if(drawMode==='pencil'){
    const w=Math.max(1.2,base*.62*pressure);
    x.strokeStyle=shade;
    x.globalAlpha=.36;
    x.lineWidth=w;
    segment(x,prev,p);

    // Continuous-looking graphite grain; dash phase follows the stroke distance.
    x.globalAlpha=.12;
    x.lineWidth=Math.max(.7,w*.20);
    x.setLineDash([1.2,4.2]);
    x.lineDashOffset=-state.dist;
    segment(x,prev,p);
  }
  else if(drawMode==='crayon'){
    const w=Math.max(2,base*1.08);
    x.strokeStyle=shade;
    x.globalAlpha=.46;
    x.lineWidth=w;
    segment(x,prev,p);

    // A sparse, deterministic pigment grain layer instead of hard repeating dashes.
    const nx=-dy/len,ny=dx/len;
    const grainCount=Math.max(1,Math.ceil(len/Math.max(5,base*.7)));
    for(let i=0;i<grainCount;i++){
      const t=(i+.37)/grainCount;
      const g=hash01(state.seed+state.dist+i*7.31);
      if(g<.55)continue;
      const px=prev.x+dx*t+nx*(g-.5)*w*.55;
      const py=prev.y+dy*t+ny*(g-.5)*w*.55;
      dot(x,{x:px,y:py},Math.max(.7,w*.07),shade,.12);
    }
  }
  else if(drawMode==='brush'){
    const w=Math.max(2,base*.82*(.78+.42*pressure));
    x.strokeStyle=shade;
    x.globalAlpha=.72;
    x.lineWidth=w;
    segment(x,prev,p);

    // Bristles are distributed perpendicular to the stroke direction.
    const nx=-dy/len,ny=dx/len;
    for(let i=-3;i<=3;i++){
      const offset=i*w*.12;
      x.globalAlpha=.075+(.025*(3-Math.abs(i)));
      x.lineWidth=Math.max(.65,w*.075);
      x.beginPath();
      x.moveTo(prev.x+nx*offset,prev.y+ny*offset);
      x.lineTo(p.x+nx*offset, p.y+ny*offset);
      x.stroke();
    }
  }
  else if(drawMode==='marker'){
    const w=Math.max(3,base*1.18);
    x.strokeStyle=shade;
    x.globalAlpha=.14;
    x.lineWidth=w*1.24;
    segment(x,prev,p);
    x.globalAlpha=.94;
    x.lineWidth=w;
    segment(x,prev,p);
    x.globalAlpha=.11;
    x.strokeStyle='#fff';
    x.lineWidth=Math.max(1,w*.11);
    segment(x,prev,p);
  }
  else if(drawMode==='sparkle'){
    const w=Math.max(2,base*.72);
    x.strokeStyle=shade;
    x.globalAlpha=.60;
    x.lineWidth=w;
    segment(x,prev,p);

    // Deterministic particles prevent the same stroke from flickering differently
    // when the browser emits pointer events at different rates.
    const count=Math.max(1,Math.ceil(len/Math.max(5,base*.55)));
    for(let i=0;i<count;i++){
      const t=(i+.5)/count;
      const px=prev.x+dx*t;
      const py=prev.y+dy*t;
      const r1=hash01(state.seed+state.dist+i*3.17);
      const r2=hash01(state.seed+state.dist+i*5.91);
      if(r1<.48)dot(x,{x:px+dx*.04*(r2-.5),y:py+dy*.04*(r2-.5)},Math.max(.7,base*.09),shade,.42);
      if(r2>.90){
        x.strokeStyle='#fff';
        x.globalAlpha=.78;
        x.lineWidth=Math.max(1,base*.07);
        const s=base*.20;
        x.beginPath();
        x.moveTo(px-s,py);x.lineTo(px+s,py);
        x.moveTo(px,py-s);x.lineTo(px,py+s);
        x.stroke();
      }
    }
  }
  else{
    x.strokeStyle=shade;
    x.lineWidth=base;
    segment(x,prev,p);
  }

  state.p={x:p.x,y:p.y};
  state.dist+=len;
  strokeState.set(c,state);
  x.globalAlpha=1;
  x.setLineDash([]);
  x.lineDashOffset=0;
  x.globalCompositeOperation='source-over';
}

function bindDraw(c,x){
  if(!c||c.dataset.wadfunPenBound==='1')return;
  c.dataset.wadfunPenBound='1';

  const endStroke=e=>{
    if(e&&e.pointerId!=null&&c.hasPointerCapture?.(e.pointerId)){
      try{c.releasePointerCapture(e.pointerId)}catch(_){ }
    }
    isDrawing=false;
    resetStroke(c);
  };

  c.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'){
      const st=typeof pinchMap!=='undefined'&&pinchMap.get(document.getElementById('drawViewport'));
      if(st&&st.touches&&st.touches.size)return;
    }
    e.preventDefault();
    isDrawing=true;
    saveDrawState();
    try{c.setPointerCapture(e.pointerId)}catch(_){ }
    const p=pos(c,e);
    resetStroke(c);
    wadfunStrokePoint(c,x,p);
  },{passive:false});

  c.addEventListener('pointermove',e=>{
    if(!isDrawing)return;
    e.preventDefault();
    wadfunStrokePoint(c,x,pos(c,e));
  },{passive:false});

  c.addEventListener('pointerup',endStroke,{passive:false});
  c.addEventListener('pointercancel',endStroke,{passive:false});
  c.addEventListener('lostpointercapture',endStroke,{passive:true});
  window.addEventListener('blur',()=>endStroke(),{passive:true});
}

window.wadfunStrokePoint=wadfunStrokePoint;
window.wadfunResetStrokeState=resetStroke;
window.bindDraw=bindDraw;
})();
