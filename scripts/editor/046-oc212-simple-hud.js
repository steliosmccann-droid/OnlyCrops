/* Only Crops CP20.12 — Simple HUD editor, adapter to existing V106 inputs.
   No new save keys, no second state, no changes to the real HUD or farm mechanics. */
(()=>{'use strict';
 let attempt=0;
 function install(){
  const panel=document.getElementById('gm106-panel');
  const nav=document.getElementById('gm20-section');
  const edit=document.getElementById('oc210-coins-position')?.parentElement;
  const pick=edit?.querySelector(':scope > select');
  const tabs=panel?.querySelector(':scope > .tabs');
  if(!panel||!nav||!edit||!pick||!tabs){if(++attempt<80)setTimeout(install,200);return}
  if(document.getElementById('oc212-simple-hud'))return;
  const label=(tag,parent,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;parent.append(e);return e};
  const card=label('section',edit);card.id='oc212-simple-hud';card.setAttribute('aria-label','Απλή επεξεργασία HUD');
  edit.insertBefore(card,edit.firstChild);
  label('h2',card,'🪙 HUD — Εύκολη επεξεργασία');
  label('p',card,'1. Διάλεξε στοιχείο. 2. Μετακίνησέ το. Αποθηκεύεται αυτόματα.');
  const itemLabel=label('label',card,'Τι θέλεις να αλλάξεις;');
  const item=label('select',itemLabel);item.id='oc212-item';item.setAttribute('aria-label','Στοιχείο HUD');
  const moveTitle=label('strong',card,'Μετακίνηση στη φάρμα');
  const coords=label('p',card);coords.id='oc212-coordinates';coords.setAttribute('aria-live','polite');
  const pad=label('div',card);pad.className='oc212-pad';
  const arrows={};
  for(const [name,txt] of [['up','↑'],['left','←'],['right','→'],['down','↓']]){
   const b=label('button',pad,txt);b.type='button';b.className='oc212-'+name;b.setAttribute('aria-label',({up:'Πάνω',left:'Αριστερά',right:'Δεξιά',down:'Κάτω'})[name]);arrows[name]=b;
  }
  const stepLabel=label('label',card,'Βήμα μετακίνησης');
  const step=label('select',stepLabel);step.id='oc212-step';for(const n of [1,5,10,20]){const o=label('option',step,n+' px');o.value=String(n)}step.value='5';
  const actions=label('div',card);actions.className='oc212-actions';
  const reset=label('button',actions,'↺ Αρχική θέση');reset.type='button';
  const picture=label('button',actions,'🖼️ Αλλαγή εικόνας');picture.type='button';
  const more=label('button',card,'⚙️ Περισσότερες ρυθμίσεις');more.type='button';more.id='oc212-advanced';
  more.setAttribute('aria-expanded','false');
  const feedback=label('p',card);feedback.id='oc212-feedback';feedback.setAttribute('role','status');
  let advanced=false;
  function numberFor(axis){
   const title=axis==='x'?'Θέση X':'Θέση Y';
   const l=[...edit.querySelectorAll('label')].find(el=>el.textContent.trim().startsWith(title)&&el.querySelector('input[type="number"]'));
   return l?.querySelector('input[type="number"]')||null;
  }
  function activeHud(){
   return nav.value==='hud';
  }
  function makeList(){
   const entries=[...pick.options].filter(o=>o.value);
   const before=item.value||pick.value||'.fv90-coin';
   item.replaceChildren();
   for(const entry of entries){const o=label('option',item,entry.textContent);o.value=entry.value}
   item.value=entries.some(o=>o.value===before)?before:entries.some(o=>o.value==='.fv90-coin')?'.fv90-coin':entries[0]?.value||'';
  }
  function select(){
   if(![...pick.options].some(o=>o.value===item.value)){
    const hud=tabs.querySelector('button[data-tab="HUD"]');
    hud?.click();
   }
   if(pick.value!==item.value){pick.value=item.value;pick.dispatchEvent(new Event('change',{bubbles:true}))}
  }
  function sync(){
   const x=numberFor('x'),y=numberFor('y');
   const found=item.value&&!!document.querySelector(item.value);
   const xv=Number(x?.value||0),yv=Number(y?.value||0);
   coords.textContent='Θέση: X '+xv+' px · Y '+yv+' px';
   for(const b of Object.values(arrows))b.disabled=!found||!x||!y;
   reset.disabled=!found||!x||!y;
  }
  function move(dx,dy){
   select();
   const x=numberFor('x'),y=numberFor('y');
   const axis=dx?'x':'y',input=dx?x:y,delta=dx||dy;
   if(!input){feedback.textContent='⚠ Το εργαλείο θέσης δεν είναι διαθέσιμο';return}
   const current=Number(input.value)||0,desired=Math.max(-400,Math.min(400,current+delta*Number(step.value)));
   if(current===desired){feedback.textContent='Έφτασες στο όριο μετακίνησης';return}
   input.value=String(desired);
   // Invoke the ORIGINAL V106 editor callback: validates, persists and updates the farm.
   input.dispatchEvent(new Event('change',{bubbles:true}));
   const result=Number(input.value);
   sync();
   feedback.textContent=result===desired?'✓ Η νέα θέση εφαρμόστηκε και ελέγχθηκε από τον Game Maker':'⚠ Η μετακίνηση δεν ολοκληρώθηκε';
  }
  arrows.up.onclick=()=>move(0,-1);arrows.down.onclick=()=>move(0,1);
  arrows.left.onclick=()=>move(-1,0);arrows.right.onclick=()=>move(1,0);
  item.onchange=()=>{select();sync();feedback.textContent='✓ Επιλεγμένο: '+item.selectedOptions[0]?.textContent};
  reset.onclick=()=>{
   select();const x=numberFor('x'),y=numberFor('y');
   if(!x||!y)return;
   x.value='0';x.dispatchEvent(new Event('change',{bubbles:true}));
   y.value='0';y.dispatchEvent(new Event('change',{bubbles:true}));
   sync();feedback.textContent='✓ Η θέση επανήλθε στο 0, 0';
  };
  function showAdvanced(on){
   advanced=on;more.setAttribute('aria-expanded',String(on));
   more.textContent=on?'✕ Κλείσιμο προηγμένων ρυθμίσεων':'⚙️ Περισσότερες ρυθμίσεις';
   for(const child of edit.children)if(child!==card)child.classList.toggle('oc212-legacy-hidden',!on);
  }
  more.onclick=()=>{showAdvanced(!advanced);if(advanced){select();card.scrollIntoView({block:'start'})}};
  picture.onclick=()=>{
   showAdvanced(true);select();
   const sel=item.value;
   const target=sel==='.fv90-coin'?'gm106-coins-asset-card':sel==='.fv90-logo'?'gm106-logo-asset-card':sel==='.fv90-name'?'gm106-name-asset-card':'gm106-generic-replace-card';
   const pane=document.getElementById(target);
   if(pane&&getComputedStyle(pane).display!=='none'){pane.scrollIntoView({behavior:'smooth',block:'start'});feedback.textContent='Εδώ μπορείς να επιλέξεις PNG για το στοιχείο'}
   else{feedback.textContent='Οι επιλογές εικόνας βρίσκονται στις προηγμένες ρυθμίσεις';}
  };
  function refresh(){
   const hud=activeHud();
   panel.classList.toggle('oc212-hud-active',hud);
   card.hidden=!hud;
   if(!hud)return;
   if(![...pick.options].some(o=>o.value==='.fv90-coin'))tabs.querySelector('button[data-tab="HUD"]')?.click();
   makeList();
   select();
   showAdvanced(advanced);
   sync();
  }
  // Reflect the existing navigation; never intercept navigation events or alter data.
  nav.addEventListener('change',()=>requestAnimationFrame(refresh));
  panel.addEventListener('click',e=>{if(!card.contains(e.target))requestAnimationFrame(()=>{if(activeHud())sync()})});
  const observe=new MutationObserver(()=>{const hud=activeHud();if(card.hidden===hud)refresh()});
  observe.observe(nav,{attributes:true,attributeFilter:['value']});
  refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
