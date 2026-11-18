
(()=>{'use strict';
/* Checkpoint 20: presentation-only navigation for the existing Game Maker.
   Never replaces engine state, editors, saved files or action handlers. */
let attempt=0;
function install(){
 const panel=document.getElementById('gm106-panel');
 const nav=document.getElementById('gm18-navigation');
 const studio=document.getElementById('gm19-studio');
 const home=document.getElementById('gm18-home');
 const homeCards=document.getElementById('gm18-cards');
 if(!panel||!nav||!studio||!home||!homeCards||!document.getElementById('gm19-nav')){
  if(++attempt<75)setTimeout(install,200);return;
 }
 if(panel.dataset.gm20Installed)return;
 panel.dataset.gm20Installed='yes';
 const windowTitle=panel.querySelector(':scope > .head > strong');
 if(windowTitle)windowTitle.textContent='🎮 Only Crops · Game Maker';
 const sectionDefs=[
  ['home','🏡 Αρχική'],['hud','🪙 HUD'],['ui','🧰 Κουμπιά'],
  ['assets','🌳 Sprites / Εικόνες'],['studio','🎞️ Animation Studio'],
  ['systems','⚙️ Μηχανισμοί'],['objects','🧱 Στοιχεία HUD'],
  ['gametools','🎮 Εργαλεία'],['files','💾 Αρχεία / Backup']
 ];
 const navOriginal=[...nav.querySelectorAll(':scope > button')];
 const byText={home:'Αρχική',hud:'HUD',ui:'Κουμπιά',assets:'Εικόνες',systems:'Μηχανισμοί',objects:'Στοιχεία',gametools:'Εργαλεία',files:'Αρχεία'};
 const originalBtns={};
 for(const [key,needle] of Object.entries(byText))originalBtns[key]=navOriginal.find(btn=>btn.textContent.includes(needle));
 originalBtns.studio=document.getElementById('gm19-nav');
 if(sectionDefs.some(([key])=>!originalBtns[key])){
  panel.dataset.gm20Installed='no';return;
 }
 const bar=document.createElement('div');bar.id='gm20-bar';
 const mainLabel=document.createElement('label');mainLabel.htmlFor='gm20-section';mainLabel.textContent='ΕΝΟΤΗΤΑ';
 const main=document.createElement('select');main.id='gm20-section';main.setAttribute('aria-label','Επιλογή ενότητας Game Maker');
 for(const [value,txt] of sectionDefs){const opt=new Option(txt,value);main.add(opt);}
 const subBox=document.createElement('div');subBox.id='gm20-subbox';subBox.hidden=true;
 const subLabel=document.createElement('label');subLabel.htmlFor='gm20-subsection';subLabel.textContent='ΕΡΓΑΛΕΙΟ';
 const sub=document.createElement('select');sub.id='gm20-subsection';sub.setAttribute('aria-label','Επιλογή εργαλείου ενότητας');
 subBox.append(subLabel,sub);bar.append(mainLabel,main,subBox);
 nav.prepend(bar);nav.classList.add('gm20-compact-nav');
 const assetsNav=document.getElementById('gm18-asset-nav');
 const systemsNav=document.getElementById('gm18-system-nav');
 const originalSub={assets:[...assetsNav.querySelectorAll(':scope > button')],systems:[...systemsNav.querySelectorAll(':scope > button')],studio:[...studio.querySelectorAll('.gm19-tabs > button[data-screen]')]};
 const subDefs={
  assets:[['catalog','🗂️ Κατάλογος αντικειμένων'],['single','🖼️ Αλλαγή PNG'],['bulk','📦 Μαζική εισαγωγή'],['tune','📐 Μέγεθος & θέση'],['backup','💾 Backup sprites']],
  systems:[['Mechanics','⚙️ Grid / Tools'],['Crops','🌾 Καλλιέργειες'],['Production','🐄 Ζώα & δέντρα'],['Economy','🪙 Οικονομία'],['Progression','⭐ XP / Levels']],
  studio:[['library','🗂️ Βιβλιοθήκη Studio'],['edit','🎨 Εισαγωγή / Animation'],['link','🔗 Σύνδεση με φάρμα'],['files','💾 Αρχεία Studio']]
 };
 const hints={home:'Επίλεξε μία κατηγορία για να ανοίξεις τα εργαλεία της.',hud:'Το HUD συνδέεται με τα πραγματικά Coins, NF Cash και XP.',ui:'Αλλάζεις την εικόνα των κουμπιών, όχι τη λειτουργία τους.',assets:'Βρες αντικείμενο, διάλεξε PNG και έλεγξε την προεπισκόπηση.',studio:'Η Βιβλιοθήκη Studio αποθηκεύεται ξεχωριστά από τα sprites της φάρμας.',systems:'Οι μηχανισμοί αλλάζουν μόνο από τα υπάρχοντα εργαλεία Εφαρμογή.',objects:'Τα στοιχεία εδώ είναι HUD/UI, όχι το grid της φάρμας.',gametools:'Εδώ βρίσκονται οι υπάρχουσες εντολές παιχνιδιού.',files:'Χρειάζονται διαφορετικά backups για HUD/UI, sprites και Studio.'};
 const micro=document.createElement('div');micro.id='gm20-note';micro.setAttribute('aria-live','polite');nav.after(micro);
 const currentOriginal=()=>navOriginal.find(btn=>btn.getAttribute('aria-current')==='page');
 const currentKey=()=>{
  if(panel.classList.contains('gm19-studio-open'))return 'studio';
  const active=currentOriginal();
  return Object.keys(originalBtns).find(k=>originalBtns[k]===active)||'home';
 };
 function setSub(key){
  const def=subDefs[key];subBox.hidden=!def;
  if(!def){sub.replaceChildren();return;}
  const previous=key===main.dataset.lastSection?sub.value:'';
  sub.replaceChildren();for(const [value,txt] of def){const o=new Option(txt,value);sub.add(o)}
  const original=originalSub[key];
  let active=def[0][0];
  original.forEach((b,i)=>{if(b.getAttribute('aria-current')==='page'&&def[i])active=def[i][0]});
  if(previous&&def.some(x=>x[0]===previous))active=previous;
  sub.value=active;
 }
 function sync(){
  const key=currentKey();
  // Legacy Market/XP tabs can set hidden on the organizer's Home section.
  // Restore only Home when it is active; do not modify game/editor panels.
  if(key==='home'&&home.hidden)home.hidden=false;
  main.value=key;
  if(main.dataset.lastSection!==key){main.dataset.lastSection=key;setSub(key)}
  else if(subDefs[key]){
    const def=subDefs[key],buttons=originalSub[key];
    buttons.forEach((btn,i)=>{if(btn.getAttribute('aria-current')==='page'&&def[i])sub.value=def[i][0]});
  }
  micro.textContent=hints[key]||'';
  micro.hidden=key==='home';
 }
 function activate(key){
  if(!originalBtns[key])return false;
  const currently=currentKey();
  if(currently==='studio'&&key!=='studio'){
   if(!window.confirm('Αποθήκευσες τις αλλαγές στο Animation Studio; Μη αποθηκευμένες αλλαγές μπορεί να χαθούν όταν αλλάξεις ενότητα.'))return false;
  }
  if(currently!==key)originalBtns[key].click();
  sync();return true;
 }
 main.addEventListener('change',()=>{
  const wanted=main.value;
  if(!activate(wanted)){sync();return;}
  panel.scrollTop=0;
 });
 sub.addEventListener('change',()=>{
  const key=currentKey();const def=subDefs[key];if(!def)return;
  const i=def.findIndex(x=>x[0]===sub.value);
  if(i>=0&&originalSub[key][i]){originalSub[key][i].click();sync();panel.scrollTop=0;}
 });
 // Replace the noisy 12-card home dashboard with six clear choices.
 const quick=document.createElement('div');quick.id='gm20-home-quick';
 const quicks=[
  ['🌳 Εικόνες / Sprites','Ζώα, φυτά, κτίρια, μέγεθος', 'assets'],
  ['🎞️ Animation Studio','Sprite sheets και animations','studio'],
  ['🪙 HUD / UI','Coins, XP, κουμπιά','hud'],
  ['⚙️ Μηχανισμοί','Grid, καλλιέργειες, οικονομία','systems'],
  ['🎮 Εργαλεία','Select, Plow, Market, Sprite Editor','gametools'],
  ['💾 Αρχεία','Backups και εισαγωγές','files']
 ];
 for(const [title,desc,key] of quicks){
  const btn=document.createElement('button');btn.type='button';btn.className='gm20-quick-card';
  const t=document.createElement('strong');t.textContent=title;
  const d=document.createElement('span');d.textContent=desc;
  btn.append(t,d);btn.addEventListener('click',()=>activate(key));quick.append(btn);
 }
 homeCards.before(quick);homeCards.classList.add('gm20-old-cards');
 const heading=home.querySelector('h2');if(heading)heading.textContent='Διάλεξε τι θέλεις να φτιάξεις 🌾';
 const intro=home.querySelector(':scope > p');if(intro)intro.textContent='Έξι βασικές επιλογές. Τα παλιά εργαλεία παραμένουν συνδεδεμένα με την ίδια φάρμα.';
 // Reflect navigation initiated by other existing editor controls, including Studio links.
 nav.addEventListener('click',e=>{if(e.target.closest(':scope > button'))requestAnimationFrame(sync)});
 homeCards.addEventListener('click',()=>requestAnimationFrame(sync));
 const observer=new MutationObserver(sync);
 observer.observe(panel,{attributes:true,attributeFilter:['class']});
 for(const b of navOriginal)observer.observe(b,{attributes:true,attributeFilter:['aria-current']});
 for(const arr of Object.values(originalSub))for(const b of arr)observer.observe(b,{attributes:true,attributeFilter:['aria-current']});
 sync();
 panel.dataset.creatorUi='20';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();

