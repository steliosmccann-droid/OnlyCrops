

(()=>{'use strict';
const items={HUD:[['Coins εικόνα','.fv90-coin'],['Coins αριθμός','#fv90Coins'],['NF Cash εικόνα','.fv90-cash'],['NF Cash αριθμός','#fv90Cash'],['XP εικόνα','.fv90-xp'],['Level','#fv90Level'],['XP bar','.fv90-xp-track'],['XP κείμενο','#fv90XpText'],['Only Crops Logo','.fv90-logo'],['Πινακίδα','.fv90-name'],['Όνομα','#fv90Name']],UI:[['Εργαλειοθήκη','.classic-tools'],['Select','#fvMulti'],['Plow','#fvPlow'],['Recycle','#fvRecycle'],['Ribbons','#fv39Ribbons'],['Market','#fvMarket'],['Gifts','#fvGifts']]};
const KEY='FarmVille3026_V106_Maker';
const q=s=>document.querySelector(s);
function init(){
 const panel=q('#gm106-panel'),launch=q('#gm106-launch');if(!panel)return;
 const toggle=document.createElement('button');toggle.id='gm112-mode';toggle.type='button';toggle.textContent='✋ Επεξεργασία: OFF';document.body.append(toggle);
 const tip=document.createElement('div');tip.id='gm112-tip';tip.hidden=true;tip.textContent='Πάτα σε εικόνα HUD/UI για επιλογή • Σύρε για μετακίνηση • OFF για κανονικό παιχνίδι';document.body.append(tip);
 const info=document.createElement('p');info.className='note';info.textContent='✋ Άνοιξε την «Επεξεργασία» και πάτα απευθείας πάνω σε εικόνα της φάρμας. Δεν χρειάζεται ο κατάλογος.';
 const tabs=panel.querySelector('.tabs');if(tabs)tabs.after(info);else panel.prepend(info);
 let enabled=false,selected=null,drag=null,edited=false;
 function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
 function save(obj){try{localStorage.setItem(KEY,JSON.stringify(obj));return true}catch{return false}}
 function clear(){document.querySelectorAll('.gm112-highlight').forEach(n=>n.classList.remove('gm112-highlight'))}
 function highlight(sel){clear();const el=q(sel);if(el)el.classList.add('gm112-highlight')}
 function setMode(v){enabled=v;toggle.classList.toggle('active',v);toggle.textContent=v?'✋ Επεξεργασία: ON':'✋ Επεξεργασία: OFF';tip.hidden=!v;if(!v){clear();drag=null}}
 toggle.onclick=()=>setMode(!enabled);
 const gmButton=document.createElement('button');gmButton.type='button';gmButton.textContent='✋ Επιλογή πάνω στη φάρμα';gmButton.onclick=()=>{setMode(true);panel.hidden=true;launch.textContent='🎮 Άνοιγμα Game Maker'};
 if(tabs)tabs.after(gmButton);else panel.prepend(gmButton);
 function findItem(target){let best=null;for(const [group,entries] of Object.entries(items))for(const [label,sel] of entries){const node=q(sel);if(!node||!target||(node!==target&&!node.contains(target)))continue;let distance=0,p=target;while(p&&p!==node){distance++;p=p.parentElement}if(!best||distance<best.distance)best={group,label,sel,node,distance}}return best}
 function showSelected(hit){selected=hit.sel;highlight(selected);
  const tab=[...panel.querySelectorAll('.tabs button')].find(b=>b.dataset.tab===hit.group);if(tab)tab.click();
  const pick=panel.querySelector('section > select');if(pick){pick.value=hit.sel;pick.dispatchEvent(new Event('change',{bubbles:true}))}
  panel.hidden=false;launch.textContent='🎮 Game Maker';
  info.textContent='✓ Επιλεγμένο: '+hit.label+' — σύρε την εικόνα ή άλλαξε μέγεθος από τον slider.';
 }
 document.addEventListener('pointerdown',e=>{
  if(!enabled||e.target.closest('#gm106-panel,#gm106-launch,#gm112-mode,#gm112-tip,#gm108-box,#assetPanel'))return;
  const hit=findItem(e.target);if(!hit)return;
  e.preventDefault();e.stopImmediatePropagation();showSelected(hit);
  const v=state()[hit.sel]||{};drag={id:e.pointerId,sel:hit.sel,node:hit.node,startX:e.clientX,startY:e.clientY,x:Number(v.x)||0,y:Number(v.y)||0};edited=false;
 },true);
 document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;e.preventDefault();e.stopImmediatePropagation();
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)>3)edited=true;
  const x=Math.max(-400,Math.min(400,drag.x+dx)),y=Math.max(-400,Math.min(400,drag.y+dy));
  drag.node.style.setProperty('translate',x+'px '+y+'px','important');
 },true);
 function finish(e){if(!drag||e.pointerId!==drag.id)return;
  e.preventDefault();e.stopImmediatePropagation();const d=drag;drag=null;
  if(edited){const v=state();v[d.sel]??={};v[d.sel].x=Math.max(-400,Math.min(400,d.x+e.clientX-d.startX));v[d.sel].y=Math.max(-400,Math.min(400,d.y+e.clientY-d.startY));save(v);info.textContent='✓ Αποθηκεύτηκε η θέση — '+d.sel}
  const pick=panel.querySelector('section > select');if(pick)pick.dispatchEvent(new Event('change',{bubbles:true}));
 }
 document.addEventListener('pointerup',finish,true);document.addEventListener('pointercancel',finish,true);
 // Allow regular gameplay whenever the editor is not in direct-edit mode.
 const close=panel.querySelector('.head button:last-child');if(close)close.addEventListener('click',()=>setMode(false));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

