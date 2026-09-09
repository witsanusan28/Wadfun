/* Wadfun pen rendering engine V2
   ใช้ร่วมกับ bindDraw เดิม โดยไม่แตะ UI และยังรองรับขนาดเส้น/ยางลบเดิม */
function bindDraw(c,x){
  c.addEventListener('pointerdown',e=>{
    const st=pinchMap.get(document.getElementById('drawViewport'));
    if(e.pointerType==='touch'&&st.touches.size)return;
    e.preventDefault();
    isDrawing=true;
    saveDrawState();
    c.setPointerCapture?.(e.pointerId);
    const p=pos(c,e);
    x.beginPath();
    x.moveTo(p.x,p.y);
    x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
  });

  c.addEventListener('pointermove',e=>{
    if(!isDrawing)return;
    e.preventDefault();
    const p=pos(c,e), shade=selectedColor;
    const base=(drawMode==='eraser'?eraserSize:drawSize)*Math.min(devicePixelRatio||1,2);
    const pressure=(typeof e.pressure==='number'&&e.pressure>0)?e.pressure:.5;
    const jitter=(Math.random()-.5)*Math.max(1,base*.045);

    x.globalCompositeOperation=drawMode==='eraser'?'destination-out':'source-over';
    x.lineCap='round';
    x.lineJoin='round';
    x.setLineDash([]);
    x.globalAlpha=1;

    if(drawMode==='pencil'){
      // ดินสอ: เส้นบาง คม และมี texture เบาๆ
      x.strokeStyle=shade;
      x.globalAlpha=.72;
      x.lineWidth=Math.max(1.5,base*(.55+pressure*.35));
      x.lineTo(p.x+jitter,p.y+jitter);
      x.stroke();
      if(Math.random()<.18){
        x.globalAlpha=.13;
        x.lineWidth=Math.max(1,base*.22);
        x.lineTo(p.x-jitter*1.8,p.y+jitter*1.8);
        x.stroke();
      }
    }else if(drawMode==='crayon'){
      // สีเทียน: หนา นุ่ม โปร่งเล็กน้อย และมีรอยซ้อนแบบสีเทียน
      x.strokeStyle=shade;
      x.globalAlpha=.55;
      x.lineWidth=Math.max(2,base*1.05);
      x.lineTo(p.x+jitter*2,p.y+jitter*2);
      x.stroke();
      x.globalAlpha=.22;
      x.lineWidth=Math.max(1,base*.42);
      x.lineTo(p.x-jitter*3,p.y+jitter*2);
      x.stroke();
    }else if(drawMode==='brush'){
      // พู่กัน: รองรับ pressure ของ Apple Pencil
      x.strokeStyle=shade;
      x.globalAlpha=.9;
      x.lineWidth=Math.max(2,base*(.45+pressure*1.15));
      x.lineTo(p.x,p.y);
      x.stroke();
    }else if(drawMode==='marker'){
      // เมจิก: สีทึบ เส้นเต็ม สม่ำเสมอ
      x.strokeStyle=shade;
      x.globalAlpha=.96;
      x.lineWidth=Math.max(3,base*1.18);
      x.lineTo(p.x,p.y);
      x.stroke();
    }else if(drawMode==='sparkle'){
      // ประกาย: เส้น + ดาววิบวับเป็นช่วงๆ
      x.strokeStyle=shade;
      x.globalAlpha=.7;
      x.lineWidth=Math.max(2,base*.72);
      x.lineTo(p.x,p.y);
      x.stroke();
      if(Math.random()<.16){
        const r=Math.max(2.5,base*.28);
        x.save();
        x.globalAlpha=.95;
        x.fillStyle=shade;
        x.beginPath();
        x.moveTo(p.x,p.y-r*2.2);
        x.lineTo(p.x+r*.55,p.y-r*.55);
        x.lineTo(p.x+r*2.2,p.y);
        x.lineTo(p.x+r*.55,p.y+r*.55);
        x.lineTo(p.x,p.y+r*2.2);
        x.lineTo(p.x-r*.55,p.y+r*.55);
        x.lineTo(p.x-r*2.2,p.y);
        x.lineTo(p.x-r*.55,p.y-r*.55);
        x.closePath();
        x.fill();
        x.restore();
      }
    }else{
      x.strokeStyle=shade;
      x.lineWidth=base;
      x.lineTo(p.x,p.y);
      x.stroke();
    }
  },{passive:false});

  ['pointerup','pointercancel','pointerleave'].forEach(t=>c.addEventListener(t,()=>{
    isDrawing=false;
    x.globalAlpha=1;
    x.setLineDash([]);
    x.globalCompositeOperation='source-over';
  }));
}
