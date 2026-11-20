/* Only Crops CP20.13 — UI buttons simple editor.
 * Reuses the original V106 HUD/UI item picker, numeric controls and persistence.
 * Does not create new saves, alter gameplay button handlers, or modify farm state. */
(()=>{'use strict';
let attempts=0;
function mount(){
 const panel=document.getElementById('gm106-panel');
 const nav=document.getElementById('gm20-section');
 const hud=document.getElementById('oc212-simple-hud');
 const edit=hud?.parentElement;
 const picker=edit?.querySelector(':scope > select');
 const tabs=panel?.querySelector(':scope > .tabs');
 if(!panel||!nav||!hud||!edit||!picker||!tabs){
  if(++attempts<100)setTimeout(mount,200);return;
 }
 if(document.getElementById('oc213-simple-ui'))return;
 const create=(tag,parent,content)=>{
  const el=document.createElement(tag);if(content!==undefined)el.textContent=content;parent.append(el);return el;
 };
 const card=create('section',edit);card.id='oc213-simple-ui';card.setAttribute('aria-label','Εύκολη επεξεργασία κουμπιών UI');
 hud.after(card);
 create('h2',card,'🧰 Κουμπιά — Εύκολη επεξεργασία');
 create('p',card,'Επίλεξε κουμπί και άλλαξε τη θέση του. Η λειτουργία του στο παιχνίδι δεν αλλάζει.');
 const label=create('label',card,'Ποιο κουμπί θέλεις;');
 const item=create('select',label);item.id='oc213-ui-item';item.setAttribute('aria-label','Επιλογή κουμπιού παιχνιδιού');
 const pos=create('p',card);pos.id='oc213-ui-position';pos.setAttribute('aria-live','polite');
 const pad=create('div',card);pad.className='oc213-pad';
 const dir={};
 for(const [key,txt,aria] of [['up','↑','Πάνω'],['left','←','Αριστερά'],['right','→','Δεξιά'],['down','↓','Κάτω']]){
  const b=create('button',pad,txt);b.type='button';b.className='oc213-'+key;b.setAttribute('aria-label',aria);dir[key]=b;
 }
 const stepLabel=create('label',card,'Βήμα μετακίνησης');
 const step=create('select',stepLabel);step.id='oc213-ui-step';
 for(const n of [1,5,10,20]){const opt=create('option',step,n+' px');opt.value=String(n)}step.value='5';
 const controls=create('div',card);controls.className='oc213-actions';
 const reset=create('button',controls,'↺ Επαναφορά θέσης');reset.type='button';
 const advanced=create('button',controls,'⚙️ Προηγμένες ρυθμίσεις');advanced.type='button';advanced.setAttribute('aria-expanded','false');
 const status=create('p',card);status.id='oc213-ui-status';status.setAttribute('role','status');
 let showAdvanced=false;
 function input(axis){
  const labelName=axis==='x'?'Θέση X':'Θέση Y';
  return [...edit.querySelectorAll('label')].find(x=>x.textContent.trim().startsWith(labelName)&&x.querySelector('input[type="number"]'))?.querySelector('input[type="number"]')||null;
 }
 function navigateOriginal(){
  if(![...picker.options].some(o=>o.value===item.value))tabs.querySelector('button[data-tab="UI"]')?.click();
  if(picker.value!==item.value){
   picker.value=item.value;
   picker.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }
 function populate(){
  const desired=item.value||picker.value||'#fvMulti';
  const options=[...picker.options].filter(o=>o.value);
  item.replaceChildren();
  for(const o of options){const n=create('option',item,o.textContent);n.value=o.value}
  item.value=options.some(o=>o.value===desired)?desired:options.some(o=>o.value==='#fvMulti')?'#fvMulti':options[0]?.value||'';
 }
 function update(){
  const x=input('x'),y=input('y');
  pos.textContent='Θέση: X '+(Number(x?.value)||0)+' px · Y '+(Number(y?.value)||0)+' px';
  const enabled=!!(item.value&&document.querySelector(item.value)&&x&&y);
  Object.values(dir).forEach(btn=>btn.disabled=!enabled);reset.disabled=!enabled;
  if(!enabled)status.textContent='⚠ Δεν βρέθηκε το κουμπί ή τα χειριστήρια θέσης';
 }
 function advance(){
  const open=nav.value==='ui';
  panel.classList.toggle('oc213-ui-active',open);
  card.hidden=!open;
  if(!open){panel.classList.remove('oc213-ui-advanced');return}
  if(![...picker.options].some(o=>o.value==='#fvMulti'))tabs.querySelector('button[data-tab="UI"]')?.click();
  populate();navigateOriginal();
  setAdvanced(showAdvanced);update();
 }
 function setAdvanced(on){
  showAdvanced=on;
  panel.classList.toggle('oc213-ui-advanced',on&&nav.value==='ui');
  advanced.setAttribute('aria-expanded',String(on));
  advanced.textContent=on?'✕ Κλείσιμο ρυθμίσεων':'⚙️ Προηγμένες ρυθμίσεις';
  for(const child of edit.children){
   if(child===card||child===hud)continue;
   child.classList.toggle('oc213-ui-legacy-hidden',!on);
  }
 }
 function move(axis,sign){
  navigateOriginal();
  const ctl=input(axis);
  if(!ctl){status.textContent='⚠ Δεν βρέθηκε το χειριστήριο θέσης';return}
  const old=Number(ctl.value)||0,desired=Math.max(-400,Math.min(400,old+sign*(Number(step.value)||5)));
  if(old===desired){status.textContent='Έφτασες στο όριο μετακίνησης';return}
  ctl.value=String(desired);
  ctl.dispatchEvent(new Event('change',{bubbles:true}));
  update();
  const originalFeedback=panel.querySelector(':scope > .note')?.textContent||'';
  status.textContent=originalFeedback.includes('⚠')?'⚠ Η αποθήκευση απέτυχε':Number(ctl.value)===desired?'✓ Η θέση εφαρμόστηκε':'⚠ Η μετακίνηση δεν εφαρμόστηκε';
 }
 dir.up.onclick=()=>move('y',-1);dir.down.onclick=()=>move('y',1);
 dir.left.onclick=()=>move('x',-1);dir.right.onclick=()=>move('x',1);
 item.onchange=()=>{navigateOriginal();update();status.textContent='✓ Επιλέχθηκε: '+(item.selectedOptions[0]?.textContent||'')};
 reset.onclick=()=>{
  navigateOriginal();
  for(const axis of ['x','y']){
   const ctl=input(axis);if(!ctl)continue;
   ctl.value='0';ctl.dispatchEvent(new Event('change',{bubbles:true}));
  }
  update();
  const result=panel.querySelector(':scope > .note')?.textContent||'';
  status.textContent=result.includes('⚠')?'⚠ Δεν ολοκληρώθηκε η αποθήκευση':'✓ Η θέση επανήλθε στο 0, 0';
 };
 advanced.onclick=()=>{setAdvanced(!showAdvanced);if(showAdvanced)navigateOriginal()};
 nav.addEventListener('change',()=>requestAnimationFrame(advance));
 const observer=new MutationObserver(()=>{if(card.hidden===(nav.value==='ui'))advance()});
 observer.observe(nav,{attributes:true,attributeFilter:['value']});
 advance();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
