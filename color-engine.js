/* Wadfun Color Engine V2
   - One bucket tap fills the complete connected region.
   - Scanline flood-fill avoids the old pixel-count cap/patchy fill.
   - Dark line art is treated as a boundary and remains untouched.
   - Two-finger touch is reserved for pinch zoom; it never paints/fills.
*/
(function(){
  'use strict';

  const isDarkBoundary = (r,g,b,a) => a > 20 && r < 125 && g < 125 && b < 125;
  const nearSame = (r,g,b,t) => {
    const d = Math.abs(r-t[0]) + Math.abs(g-t[1]) + Math.abs(b-t[2]);
    return d <= 72;
  };

  function rgb(hex){
    hex=(hex||'#000').replace('#','');
    if(hex.length===3) hex=hex.split('').map(x=>x+x).join('');
    return [parseInt(hex.slice(0,2),16)||0,parseInt(hex.slice(2,4),16)||0,parseInt(hex.slice(4,6),16)||0];
  }

  function fillRegion(canvas, x, y, hex){
    const ctx=canvas.getContext('2d');
    const w=canvas.width, h=canvas.height;
    if(!w||!h) return;
    x=Math.max(0,Math.min(w-1,Math.floor(x)));
    y=Math.max(0,Math.min(h-1,Math.floor(y)));
    const img=ctx.getImageData(0,0,w,h), d=img.data;
    const start=(y*w+x)*4;
    const target=[d[start],d[start+1],d[start+2],d[start+3]];
    if(isDarkBoundary(...target)) return;
    const paint=rgb(hex);
    if(Math.abs(target[0]-paint[0])+Math.abs(target[1]-paint[1])+Math.abs(target[2]-paint[2])<3) return;

    // Scanline flood fill: much faster and complete on large canvas regions.
    const stack=[[x,y]];
    const seen=new Uint8Array(w*h);
    while(stack.length){
      const p=stack.pop(), sx=p[0], sy=p[1];
      if(sx<0||sx>=w||sy<0||sy>=h) continue;
      let idx=sy*w+sx;
      if(seen[idx]) continue;
      let px=idx*4;
      if(isDarkBoundary(d[px],d[px+1],d[px+2],d[px+3]) || !nearSame(d[px],d[px+1],d[px+2],target)) continue;

      let left=sx;
      while(left>=0){
        idx=sy*w+left; px=idx*4;
        if(seen[idx] || isDarkBoundary(d[px],d[px+1],d[px+2],d[px+3]) || !nearSame(d[px],d[px+1],d[px+2],target)) break;
        left--;
      }
      left++;
      let right=sx;
      while(right<w){
        idx=sy*w+right; px=idx*4;
        if(seen[idx] || isDarkBoundary(d[px],d[px+1],d[px+2],d[px+3]) || !nearSame(d[px],d[px+1],d[px+2],target)) break;
        right++;
      }
      right--;

      let spanUp=false, spanDown=false;
      for(let xx=left;xx<=right;xx++){
        idx=sy*w+xx; px=idx*4;
        if(seen[idx]) continue;
        seen[idx]=1;
        d[px]=paint[0]; d[px+1]=paint[1]; d[px+2]=paint[2]; d[px+3]=255;

        if(sy>0){
          const ni=(sy-1)*w+xx, np=ni*4;
          const ok=!seen[ni]&&!isDarkBoundary(d[np],d[np+1],d[np+2],d[np+3])&&nearSame(d[np],d[np+1],d[np+2],target);
          if(ok&&!spanUp){stack.push([xx,sy-1]);spanUp=true;} else if(!ok) spanUp=false;
        }
        if(sy<h-1){
          const ni=(sy+1)*w+xx, np=ni*4;
          const ok=!seen[ni]&&!isDarkBoundary(d[np],d[np+1],d[np+2],d[np+3])&&nearSame(d[np],d[np+1],d[np+2],target);
          if(ok&&!spanDown){stack.push([xx,sy+1]);spanDown=true;} else if(!ok) spanDown=false;
        }
      }
    }
    ctx.putImageData(img,0,0);
  }

  function install(){
    const c=document.getElementById('colorCanvas');
    const view=document.getElementById('colorViewport');
    if(!c||!view||c.dataset.colorEngineV2) return;
    c.dataset.colorEngineV2='installed';

    // Capture phase prevents the old bucket handler from running, while leaving
    // pen/eraser behavior intact when the selected tool is not the bucket.
    c.addEventListener('pointerdown',function(e){
      const st=window.pinchMap && window.pinchMap.get ? window.pinchMap.get(view) : null;
      if(e.pointerType==='touch' && st && st.touches && st.touches.size) return;
      if(typeof window.colorMode==='string' && window.colorMode!=='bucket') return;
      if(e.pointerType==='touch' && view.querySelector && view.querySelector('.dummy')) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const r=c.getBoundingClientRect();
      const x=(e.clientX-r.left)*c.width/r.width;
      const y=(e.clientY-r.top)*c.height/r.height;
      const color=window.selectedColor || '#e53935';
      if(window.colorUndo && Array.isArray(window.colorUndo)){
        window.colorUndo.push(c.toDataURL());
        if(window.colorUndo.length>30) window.colorUndo.shift();
      }
      fillRegion(c,x,y,color);
    },true);
  }

  // The inline app initializes the canvas when the Color screen opens.
  const timer=setInterval(()=>{
    if(document.getElementById('colorCanvas')){ install(); clearInterval(timer); }
  },100);
  window.wadfunFillRegionV2=fillRegion;
})();
