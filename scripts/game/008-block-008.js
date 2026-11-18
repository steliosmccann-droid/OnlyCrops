

// Independent manual plowing rules. No rendering, timeouts or storage.
(function(g){'use strict';
const COST=15, XP=1;
function plan({x,y,items,coins,grid,step=4}){
 if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(step)||step<=0)return {ok:false,reason:'Μη έγκυρες συντεταγμένες'};
 const a={x:Math.floor(x/step)*step,y:Math.floor(y/step)*step,w:step,h:step};
 const overlapping=items.filter(o=>grid.overlaps(a,grid.footprint(o)));
 // A fallow plot is an existing plot, not a new footprint.
 if(overlapping.length===1&&overlapping[0].kind==='plot'&&overlapping[0].x===a.x&&overlapping[0].y===a.y){
  if(overlapping[0].soil==='fallow')return coins>=COST?{ok:true,type:'replow',targetId:overlapping[0].id,area:a,cost:COST,xp:XP}:{ok:false,reason:'Δεν έχεις αρκετά Farm Coins',area:a};
  return {ok:false,reason:'Το χωράφι είναι ήδη οργωμένο',area:a};
 }
 const reason=grid.validatePlacement(a,'plot',null,items);
 if(reason)return{ok:false,reason,area:a};
 if(coins<COST)return {ok:false,reason:'Δεν έχεις αρκετά Farm Coins',area:a};
 return {ok:true,type:'create',area:a,cost:COST,xp:XP};
}
function apply(state,operation){
 if(!operation||!operation.ok)return false;
 if(!Number.isFinite(state.coins)||state.coins<operation.cost||!Number.isFinite(state.xp)||!Number.isFinite(operation.cost)||operation.cost!==COST||operation.xp!==XP)return false;
 if(operation.type==='replow'){
  const o=state.items.find(o=>o.id===operation.targetId&&o.kind==='plot'&&o.soil==='fallow');
  if(!o)return false;
  o.soil='ready';
 }else if(operation.type==='create'){
  if(!Number.isInteger(state.nextId))return false;
  state.items.push({id:state.nextId++,kind:'plot',x:operation.area.x,y:operation.area.y,soil:'ready'});
 }else return false;
 state.coins-=operation.cost;state.xp+=operation.xp;return true;
}
const api={COST,XP,plan,apply};g.FarmPlowing=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);


