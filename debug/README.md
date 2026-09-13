# Wadfun Debug QA

Runtime-only debug scripts. These files are not part of the drawing engine.

## Draw Mode QA V4

On the Wadfun Drawing page, open the browser console and run:

```js
const s=document.createElement('script');s.src='/debug/draw-mode-qa-v4.js';document.head.appendChild(s);
```

Then select and draw with: pencil, crayon, brush, marker, sparkle.

The script reports Popup selection, current `drawMode`, calls to `wadfunStrokePoint`, MATCH/MISMATCH counts, and a final summary.

It does not modify `pen-engine.js`.
