

(()=>{'use strict';
function init(){
 const gm=document.getElementById('gm106-panel'),tabs=gm?.querySelector('.tabs'),host=document.getElementById('gm116-editor-host');
 const crops=window.FarmCrops?.SEEDS,econ=window.FV118Economy;
 if(!gm||!tabs||!host||!crops||!econ)return;
 const el=(tag,parent,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;parent.append(n);return n};
 const tab=el('button',tabs,'⭐ Πρόοδος');tab.dataset.tab='Progression';
 const panel=el('section',host);panel.id='gm119-progression';panel.hidden=true;
 el('strong',panel,'⭐ XP & Level Unlocks');
 const intro=el('p',panel,'Επεξεργασία πραγματικών XP σποράς και επιπέδων ξεκλειδώματος του Market. Δεν τροποποιεί ακόμη την καμπύλη XP ανά επίπεδο ή τα Ribbons.');
 intro.className='gm119-note';
 const mode=el('select',panel);
 for(const [v,t] of [['crops','🌾 XP καλλιεργειών'],['market','🔓 Ξεκλειδώματα Market']]){const o=el('option',mode,t);o.value=v}
 const search=el('input',panel);search.placeholder='🔎 Αναζήτηση';search.type='search';
 const select=el('select',panel);
 const label=el('label',panel,'XP σποράς');
 const value=el('input',label);value.type='number';value.min='0';value.max='100000';value.step='1';value.inputMode='numeric';
 const info=el('p',panel);info.className='gm119-note';info.setAttribute('aria-live','polite');
 const actions=el('div',panel);actions.className='actions';
 const button=(t,fn)=>{const b=el('button',actions,t);b.onclick=fn;return b};
 function current(){return mode.value==='crops'?crops[select.value]:econ.get(select.value)}
 function load(){const d=current();value.disabled=!d;if(!d){info.textContent='Δεν βρέθηκε αντικείμενο';return}
  value.value=mode.value==='crops'?d.xp:(d.level||1);
  info.textContent=mode.value==='crops'?'Το XP αποδίδεται στη σπορά. Αποθηκεύεται στον Crops Editor.':'Το επίπεδο επηρεάζει το ξεκλείδωμα στο Market. Αποθηκεύεται στον Market Editor.';
 }
 function options(){const old=select.value,q=search.value.trim().toLocaleLowerCase('el');select.replaceChildren();
  const entries=mode.value==='crops'?Object.entries(crops).map(([id,d])=>({id,name:d.name||id})):econ.items.filter(i=>i.price!==null).map(i=>({id:i.id,name:i.name||i.id}));
  for(const row of entries.filter(r=>(r.name+' '+r.id).toLocaleLowerCase('el').includes(q))){const o=el('option',select,row.name+' · '+row.id);o.value=row.id}
  if([...select.options].some(o=>o.value===old))select.value=old;load();
 }
 mode.onchange=()=>{label.firstChild.textContent=mode.value==='crops'?'XP σποράς':'Απαιτούμενο Level';value.max=mode.value==='crops'?'100000':'999';value.min=mode.value==='crops'?'0':'1';options()};
 search.oninput=options;select.onchange=load;
 // Reuse the established editors' buttons so all validations and persistence stay in one place.
 button('✎ Άνοιγμα αντίστοιχου Editor',()=>{
  const target=mode.value==='crops'?'#gm114-panel':'#gm118-economy';
  const t=mode.value==='crops'?'Crops':'Economy';
  const b=[...tabs.querySelectorAll('button')].find(b=>b.dataset.tab===t);
  if(b){b.click();const pane=document.querySelector(target);const choice=pane?.querySelector('select');if(choice){choice.value=select.value;choice.dispatchEvent(new Event('change'))}}
 });
 button('✓ Εφαρμογή & Αποθήκευση',()=>{
  const v=Number(value.value);
  if(!Number.isSafeInteger(v)||v<Number(value.min)||v>Number(value.max)){info.textContent='⚠ Μη έγκυρη τιμή';return}
  if(mode.value==='market'){
   const d=econ.get(select.value);
   if(!d){info.textContent='⚠ Δεν βρέθηκε αντικείμενο';return}
   info.textContent=econ.set(select.value,{price:d.price,level:v})?'✓ Εφαρμόστηκε και αποθηκεύτηκε στο Market':'⚠ Η αποθήκευση απέτυχε';
  }else{
   // Update the real crop definition, then persist with the exact V114 schema/key.
   const id=select.value,d=crops[id];
   if(!d){info.textContent='⚠ Η καλλιέργεια δεν βρέθηκε';return}
   const before=d.xp;
   d.xp=v;
   try{
    const key='FarmVille3026_V114_CropOverrides';
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    if(!saved||typeof saved!=='object'||Array.isArray(saved))throw Error('Μη έγκυρα δεδομένα');
    saved[id]={cost:d.cost,reward:d.reward,xp:d.xp,grow:d.grow};
    localStorage.setItem(key,JSON.stringify(saved));
    const verified=JSON.parse(localStorage.getItem(key)||'{}')[id]?.xp===v;
    if(!verified)throw Error('Απέτυχε η επαλήθευση');
    const seedPicker=document.getElementById('seedSelect');
    if(seedPicker){for(const opt of seedPicker.options){const crop=crops[opt.value];if(crop)opt.textContent=`${crop.icon} ${crop.name} · ${crop.cost} 🪙`;}
      seedPicker.dispatchEvent(new Event('change'))}
    const editor=document.getElementById('gm114-panel');
    const choice=editor?.querySelector('select');
    if(choice&&choice.value===id)choice.dispatchEvent(new Event('change'));
    info.textContent='✓ Αποθηκεύτηκε · '+d.name+' δίνει '+v+' XP στη νέα σπορά';
   }catch(e){d.xp=before;info.textContent='⚠ Δεν αποθηκεύτηκε: '+e.message}
  }
 });
 button('↻ Ανανέωση',options);
 const hint=el('p',panel,'Για αντίγραφα ασφαλείας χρησιμοποίησε τα Export JSON των καρτελών Crops και Market. Η πρόοδος του παίκτη και οι ανταμοιβές επιπέδων δεν επηρεάζονται από αυτή την καρτέλα.');
 hint.className='gm119-note';
 function show(){
  for(const child of host.children)child.hidden=child!==panel;
  host.hidden=false;
  for(const b of tabs.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===tab));
  for(const sec of gm.querySelectorAll(':scope > section'))if(sec!==host)sec.hidden=true;
  panel.hidden=false;gm.scrollTop=0;options();
 }
 tab.onclick=show;
 for(const b of [...tabs.querySelectorAll('button')].filter(b=>b!==tab))b.addEventListener('click',()=>panel.hidden=true);
 options();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,20),{once:true});else setTimeout(init,20);
})();

