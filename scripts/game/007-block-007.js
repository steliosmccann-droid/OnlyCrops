

// FarmVille-style grid footprint module — extracted from the V13 placement rules.
// Small-cell coordinates, rectangular footprint, 4x4 plot alignment.
// Independent of browser, canvas, localStorage and game UI.
(function(global){
  'use strict';
  function create({defs,mapCells=72,openCells=48,plotId='plot',plotStep=4}) {
    const ROTATABLE_FENCES=new Set(defs.keys());
    const dims=o=>{const d=defs.get(o.kind);const ori=((Number(o.orientation)||0)%4+4)%4;return d&&(ori%2===1)&&ROTATABLE_FENCES.has(o.kind)?{...d,w:d.h,h:d.w}:d};
    function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
    function footprint(o){const d=dims(o);return{x:o.x,y:o.y,w:d.w,h:d.h};}
    function validate(a,except=null,inventory=[]){
      if(!a||!Number.isInteger(a.x)||!Number.isInteger(a.y)||!Number.isInteger(a.w)||!Number.isInteger(a.h)||a.w<=0||a.h<=0)return'Μη έγκυρη θέση';
      if(a.x<0||a.y<0||a.x+a.w>mapCells||a.y+a.h>mapCells)return'Εκτός χάρτη';
      if(a.x+a.w>openCells||a.y+a.h>openCells)return'Κλειδωμένη περιοχή (πέρα από 12×12)';
      if(inventory.some(o=>o.id!==except&&overlaps(a,footprint(o))))return'Κατειλημμένος χώρος';
      return'';
    }
    function validatePlacement(a,kind,except=null,inventory=[]){
      const why=validate(a,except,inventory);
      if(why)return why;
      if(kind===plotId&&(a.x%plotStep!==0||a.y%plotStep!==0))return'Το χωράφι απαιτεί ευθυγράμμιση 4×4';
      return'';
    }
    function anchor(p,id,offset={x:0,y:0}){
      if(!p||!defs.has(id))return null;
      const d=defs.get(id),px=p.x-offset.x,py=p.y-offset.y;
      const x=id===plotId?Math.floor(px/plotStep)*plotStep:px;
      const y=id===plotId?Math.floor(py/plotStep)*plotStep:py;
      return{x,y,w:d.w,h:d.h};
    }
    return {overlaps,footprint,validate,validatePlacement,anchor};
  }
  const api={create};
  global.FarmGridCore=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);


