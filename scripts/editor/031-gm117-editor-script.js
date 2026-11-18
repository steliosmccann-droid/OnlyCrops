

(()=>{'use strict';function init(){
 const gm=document.getElementById('gm106-panel'),tabs=gm?.querySelector('.tabs'),host=document.getElementById('gm116-editor-host'),P=window.FarmProduction;
 if(!gm||!tabs||!host||!P)return;
 const button=document.createElement('button');button.textContent='🐄 Ζώα / Δέντρα';button.dataset.tab='Production';tabs.append(button);
 const pane=document.createElement('section');pane.id='gm117-editor';pane.hidden=true;host.append(pane);
 const add=(tag,parent,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;parent.append(el);return el};
 add('h3',pane,'🐄 Παραγωγή ζώων & δέντρων');add('p',pane,'Επεξεργασία πραγματικών χρόνων παραγωγής και Coins. Οι αλλαγές ισχύουν για τους επόμενους κύκλους.');
 const filter=add('select',pane);for(const [value,label] of [['all','Όλα'],['animal','🐄 Ζώα'],['tree','🌳 Δέντρα']]){const o=add('option',filter,label);o.value=value}
 const species=add('select',pane);const kindLabel=add('label',pane,'Αντικείμενο');kindLabel.append(species);
 const timeLabel=add('label',pane,'Χρόνος παραγωγής (ώρες)');const hours=add('input',timeLabel);hours.type='number';hours.min='.05';hours.max='8760';hours.step='.25';hours.inputMode='decimal';
 const coinsLabel=add('label',pane,'Coins συλλογής');const coins=add('input',coinsLabel);coins.type='number';coins.min='0';coins.max='1000000';coins.step='1';coins.inputMode='numeric';
 const info=add('p',pane);const msg=add('p',pane);msg.setAttribute('aria-live','polite');
 const actions=add('div',pane);actions.className='buttons';
 const act=(label,fn)=>{const b=add('button',actions,label);b.onclick=fn;return b};
 const names={cow:'Αγελάδα',chicken:'Κότα',sheep:'Πρόβατο',pig:'Γουρούνι',rabbit:'Κουνέλι',duck:'Πάπια',goat:'Κατσίκα',apple:'Μηλιά',cherry:'Κερασιά',orange:'Πορτοκαλιά',fig:'Συκιά',avocado:'Αβοκάντο',lychee:'Λίτσι',maple:'Σφένδαμος'};
 function refreshList(){const old=species.value;species.replaceChildren();for(const [k,v] of Object.entries(P.CATALOG)){if(filter.value!=='all'&&v.type!==filter.value)continue;const o=add('option',species,(names[k]||k)+' — '+k);o.value=k}if([...species.options].some(o=>o.value===old))species.value=old;refresh()}
 function refresh(){const v=P.definition(species.value);if(!v)return;hours.value=v.hours;coins.value=v.coins;info.textContent='Παραγωγή: '+v.product+' · '+(v.type==='animal'?'Ζώο':'Δέντρο')}
 filter.onchange=refreshList;species.onchange=refresh;
 act('✓ Εφαρμογή & αποθήκευση',()=>{const k=species.value,previous=P.definition(k);if(!previous){msg.textContent='⚠ Δεν βρέθηκε είδος';return}const before={hours:previous.hours,coins:previous.coins};if(!P.apply(k,{hours:hours.value,coins:coins.value})){msg.textContent='⚠ Έλεγξε τις τιμές';return}if(!P.save()){P.apply(k,before);msg.textContent='⚠ Η αποθήκευση απέτυχε · επανήλθαν οι προηγούμενες τιμές';refresh();return}msg.textContent='✓ Αποθηκεύτηκε στο iPhone';refresh()});
 act('↺ Επαναφορά είδους',()=>{if(!confirm('Επαναφορά αρχικών τιμών για '+species.value+';'))return;const d=P.definition(species.value),before=d?{hours:d.hours,coins:d.coins}:null;const ok=P.resetOne(species.value);if(!ok&&before)P.apply(species.value,before);msg.textContent=ok?'✓ Επαναφέρθηκε':'⚠ Σφάλμα αποθήκευσης · επανήλθαν οι προηγούμενες τιμές';refresh()});
 act('⬇ Export JSON',()=>{const data={schema:'FarmVille3026-production-v117',items:{}};for(const [k,v] of Object.entries(P.CATALOG))data.items[k]={hours:v.hours,coins:v.coins};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FarmVille3026_Animals_Trees.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)});
 const file=add('input',pane);file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','Import JSON παραγωγής');file.onchange=async()=>{
 const before=Object.fromEntries(Object.entries(P.CATALOG).map(([k,v])=>[k,{hours:v.hours,coins:v.coins}]));
 try{
  const chosen=file.files?.[0];if(!chosen)return;
  const data=JSON.parse(await chosen.text());
  if(data.schema!=='FarmVille3026-production-v117'||!data.items||typeof data.items!=='object'||Array.isArray(data.items))throw Error('Μη συμβατό JSON');
  const entries=Object.entries(data.items);if(!entries.length)throw Error('Το αρχείο δεν περιέχει εγγραφές');
  for(const [k,v] of entries){if(!P.definition(k)||!v||!Number.isFinite(Number(v.hours))||Number(v.hours)<0.05||Number(v.hours)>8760||!Number.isInteger(Number(v.coins))||Number(v.coins)<0||Number(v.coins)>1000000)throw Error('Μη έγκυρη εγγραφή: '+k)}
  for(const [k,v] of entries)if(!P.apply(k,v))throw Error('Απέτυχε η εγγραφή: '+k);
  if(!P.save())throw Error('Δεν αποθηκεύτηκαν οι αλλαγές');
  msg.textContent='✓ Εισήχθησαν και αποθηκεύτηκαν '+entries.length+' είδη';refresh();
 }catch(e){
  for(const [k,v] of Object.entries(before))P.apply(k,v);
  msg.textContent='⚠ '+e.message+' · επανήλθαν οι προηγούμενες τιμές';refresh();
 }finally{file.value=''}
};
 const otherTabs=[...tabs.querySelectorAll('button')].filter(b=>b!==button);
 button.onclick=()=>{host.hidden=false;for(const child of host.children)child.hidden=child!==pane;for(const child of gm.children){if(child===host||child===tabs||child.classList.contains('head'))continue;if(child.tagName==='SECTION')child.hidden=true;else if(child.tagName==='P'||child.tagName==='LABEL'||child.classList.contains('actions'))child.classList.add('gm116-hide')}for(const b of tabs.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===button));gm.scrollTop=0};
 for(const b of otherTabs)b.addEventListener('click',()=>{pane.hidden=true});
 refreshList();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,20),{once:true});else setTimeout(init,20);
})();

