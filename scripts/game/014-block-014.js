

/* UI-only extension: does not alter the tractor/seeder/harvester mechanics. */
(()=>{
 const menu=document.getElementById('fv38Submenu');
 const arrowMulti=document.getElementById('fv38MultiArrow');
 const arrowPlow=document.getElementById('fv38PlowArrow');
 if(!menu||!arrowMulti||!arrowPlow)return;
 let opened=null;
 function shut(){menu.hidden=true;opened=null;arrowMulti.setAttribute('aria-expanded','false');arrowPlow.setAttribute('aria-expanded','false');arrowMulti.textContent='▴';arrowPlow.textContent='▴'}
 const opts={
  multi:[['↖ Select','multi',false],['✋ Move','move',false],['🌱 Seeder','seeder',true],['🌾 Harvester','harvester',true]],
  plow:[['🪓 Plow','plow',false],['🚜 Tractor','tractor',true]]
 };
 function showMenu(type){
  if(opened===type){shut();return}
  opened=type;menu.replaceChildren();
  const heading=document.createElement('strong');heading.textContent=type==='multi'?'Select · Tools':'Plow · Tools';menu.appendChild(heading);
  for(const [label,value,locked] of opts[type]){
   const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.disabled=locked;
   if(locked){btn.title='Ο μηχανισμός μηχανημάτων δεν έχει ολοκληρωθεί';const hint=document.createElement('small');hint.textContent='Σύντομα';btn.appendChild(hint)}
   else btn.addEventListener('click',()=>{document.getElementById(value==='multi'?'fvMulti':value==='move'?'fvMove':'fvPlow').click();shut()});
   menu.appendChild(btn)
  }
  menu.hidden=false;
  arrowMulti.setAttribute('aria-expanded',String(type==='multi'));
  arrowPlow.setAttribute('aria-expanded',String(type==='plow'));
  arrowMulti.textContent=type==='multi'?'▾':'▴';
  arrowPlow.textContent=type==='plow'?'▾':'▴';
 }
 arrowMulti.addEventListener('click',e=>{e.stopPropagation();showMenu('multi')});
 arrowPlow.addEventListener('click',e=>{e.stopPropagation();showMenu('plow')});
 document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target)&&e.target!==arrowMulti&&e.target!==arrowPlow)shut()},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
})();

