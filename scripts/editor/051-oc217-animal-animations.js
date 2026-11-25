/* Only Crops CP20.17 — Animal Animation workflow built on the SAME GM19 Studio.
 * Each action/direction is a separate native Studio asset (same IndexedDB & JSON export).
 * Current farm renderer supports only one active sprite per animal: no automatic state switching. */
(()=>{'use strict';
let attempts=0;
function mount(){
 const panel=document.getElementById('gm106-panel'),nav=document.getElementById('gm20-section');
 const studio=document.getElementById('gm19-studio'),tabs=studio?.querySelector('.gm19-tabs');
 const home=document.getElementById('oc214-choices');
 const newAsset=studio?.querySelector('#gm19-new');
 const edit=studio?.querySelector('.gm19-screen[data-page="edit"]');
 if(!panel||!nav||!studio||!tabs||!home||!newAsset||!edit){
  if(++attempts<100)setTimeout(mount,220);return;
 }
 if(document.getElementById('oc217-animal-tab'))return;
 const make=(tag,parent,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;parent.append(e);return e};
 const catalog=window.FarmGridCatalog?.ROWS||[];
 const animalRows=(catalog.find(([group])=>group==='Ζώα')?.[1]||[]);
 const engine=window.FV83Assets;
 const animals=animalRows.filter(([id])=>engine?.allowed?.includes(id)).map(([id,name])=>({id,name}));
 const animalIds=new Set(animals.map(a=>a.id));
 const actions=[['idle','Ήρεμο / Idle'],['walk','Περπάτημα / Walk'],['eat','Τρώει / Eat'],['produce','Παραγωγή / Harvest']];
 const directions=[['front','Μπροστά'],['back','Πίσω'],['left','Αριστερά'],['right','Δεξιά']];
 const choice=make('button',home);choice.type='button';choice.dataset.oc214Screen='animals';choice.id='oc217-animal-choice';
 make('span',choice,'🐄').className='oc214-icon';
 const copy=make('span',choice);make('strong',copy,'Animations ζώων');make('small',copy,'Idle, περπάτημα, παραγωγή');
 const tab=make('button',tabs,'🐄 Ζώα');tab.type='button';tab.dataset.screen='animals';tab.id='oc217-animal-tab';
 const page=make('section',studio);page.className='gm19-screen';page.dataset.page='animals';page.id='oc217-animal-editor';page.hidden=true;
 make('h3',page,'🐄 Animal Animation Editor');
 make('p',page,'Δημιούργησε ξεχωριστό animation για κάθε ζώο, κίνηση και κατεύθυνση. Εισάγεις sprite sheet και χρησιμοποιείς την υπάρχουσα προεπισκόπηση και αποθήκευση του Animation Studio.');
 const speciesLabel=make('label',page,'1. Ζώο');
 const species=make('select',speciesLabel);species.id='oc217-species';
 for(const a of animals){const o=make('option',species,a.name);o.value=a.id}
 make('p',page,'Η στοίχιση γίνεται πάνω στον ρόμβο στην προεπισκόπηση του sprite sheet.');
 const actionLabel=make('label',page,'2. Κίνηση');
 const action=make('select',actionLabel);action.id='oc217-action';
 for(const [id,name] of actions){const o=make('option',action,name);o.value=id}
 const directionLabel=make('label',page,'3. Κατεύθυνση');
 const direction=make('select',directionLabel);direction.id='oc217-direction';
 for(const [id,name] of directions){const o=make('option',direction,name);o.value=id}
 const opts=make('div',page);opts.className='oc217-grid';
 const colsLabel=make('label',opts,'Στήλες sprite sheet');
 const cols=make('input',colsLabel);cols.type='number';cols.min='1';cols.max='32';cols.value='2';cols.inputMode='numeric';
 const rowsLabel=make('label',opts,'Σειρές');
 const rows=make('input',rowsLabel);rows.type='number';rows.min='1';rows.max='16';rows.value='2';rows.inputMode='numeric';
 const framesLabel=make('label',opts,'Καρέ animation');
 const frames=make('input',framesLabel);frames.type='number';frames.min='1';frames.max='128';frames.value='4';frames.inputMode='numeric';
 const fpsLabel=make('label',opts,'Ταχύτητα FPS');
 const fps=make('input',fpsLabel);fps.type='number';fps.min='1';fps.max='30';fps.value='4';fps.inputMode='numeric';
 const summary=make('p',page);summary.className='oc217-summary';summary.id='oc217-summary';
 const libraryTitle=make('strong',page,'Αποθηκευμένες κινήσεις του ζώου');
 const library=make('div',page);library.id='oc219-clip-status';library.setAttribute('aria-live','polite');
 const recheck=make('button',page,'↻ Ανανέωση βιβλιοθήκης');recheck.type='button';
 function inspectClips(){
  const api=window.OnlyCropsAnimalMotion;
  const keys=new Set(api?.status?.().clips||[]);
  library.replaceChildren();
  if(!api){library.textContent='Η σύνδεση animations δεν έχει φορτωθεί.';return}
  let count=0;
  for(const [state,stateLabel] of actions){
   const line=make('div',library);line.className='oc219-status-row';
   const heading=make('strong',line,stateLabel);
   const detail=make('span',line);
   detail.textContent=directions.map(([dir,label])=>{
    const has=keys.has(species.value+'/'+state+'/'+dir);
    if(has)count++;
    return (has?'✓ ':'— ')+label;
   }).join(' · ');
  }
  const note=make('p',library,'Βρέθηκαν '+count+'/16 συνδυασμοί. Το Eat αποθηκεύεται, αλλά δεν ενεργοποιείται ακόμη από τη φάρμα.');
  note.className='oc219-status-note';
 }
 recheck.onclick=async()=>{
  recheck.disabled=true;
  try{await window.OnlyCropsAnimalMotion?.refresh();inspectClips()}
  finally{recheck.disabled=false}
 };
 species.addEventListener('change',inspectClips);

 const start=make('button',page,'🎞️ Δημιουργία animation');start.type='button';start.id='oc217-start';
 const desc=make('p',page,'Στην επόμενη οθόνη θα επιλέξεις PNG/Sprite Sheet, θα δεις τα καρέ σε κίνηση και θα πατήσεις «Αποθήκευση στο Studio». Κάθε συνδυασμός κίνησης/κατεύθυνσης αποθηκεύεται χωριστά.');
 const status=make('p',page);status.id='oc217-status';status.setAttribute('role','status');
 // Companion strip on the EXISTING edit view. It does not duplicate file picker or persistence.
 const companion=make('section',edit);companion.id='oc217-edit-help';edit.prepend(companion);companion.hidden=true;
 const headline=make('strong',companion,'🐄 Animal Animation — Οδηγός');
 const caption=make('p',companion,'Διάλεξε PNG από το υπάρχον πεδίο. Μετά πάτησε «Εφαρμογή ρυθμίσεων» και «Αποθήκευση στο Studio».');
 const apply=make('button',companion,'✓ Εφαρμογή ρυθμίσεων κίνησης');apply.type='button';apply.id='oc217-apply-preset';
 const returnTo=make('button',companion,'← Επιλογή άλλης κίνησης');returnTo.type='button';
 const result=make('p',companion);result.setAttribute('role','status');
 let preset=null;
 function validate(){
  const c=Number(cols.value),r=Number(rows.value),f=Number(frames.value),speed=Number(fps.value);
  if(!Number.isInteger(c)||c<1||c>32||!Number.isInteger(r)||r<1||r>16||!Number.isInteger(f)||f<1||f>Math.min(128,c*r)||!Number.isInteger(speed)||speed<1||speed>30)
   throw Error('Έλεγξε στήλες, σειρές, καρέ (≤ στήλες × σειρές) και FPS 1–30.');
  if(!animalIds.has(species.value))throw Error('Το ζώο δεν είναι διαθέσιμο στο ενεργό παιχνίδι.');
  return {animal:species.value,action:action.value,direction:direction.value,cols:c,rows:r,count:f,fps:speed};
 }
 function name(p){return 'Animal '+p.animal+' '+p.action+' '+p.direction}
 function refreshSummary(){
  try{const p=validate();summary.textContent=name(p)+' · '+p.count+' καρέ · '+p.fps+' FPS';start.disabled=false;status.textContent='';}
  catch(e){summary.textContent=e.message;start.disabled=true}
 }
 [species,action,direction,cols,rows,frames,fps].forEach(c=>c.addEventListener('input',refreshSummary));
 function setPage(name){
  // Switch using the studio's own tab handler if available; it owns the animation player.
  const base=studio.querySelector('.gm19-tabs > button[data-screen="'+name+'"]');
  if(base&&name!=='animals')base.click();
  else{
   for(const section of studio.querySelectorAll('.gm19-screen'))section.hidden=section.dataset.page!==name;
   for(const b of tabs.querySelectorAll('button[data-screen]'))b.setAttribute('aria-current',String(b.dataset.screen===name));
  }
  companion.hidden=name!=='edit'||!preset;
  panel.scrollTop=0;
 }
 function openAnimals(){
  if(nav.value!=='studio'){
   nav.value='studio';nav.dispatchEvent(new Event('change',{bubbles:true}));
  }
  const launch=document.getElementById('gm19-nav');
  if(!panel.classList.contains('gm19-studio-open'))launch?.click();
  studio.hidden=false;setPage('animals');refreshSummary();
 }
 function fillStudio(){
  if(!preset)return;
  const ids={name:'gm19-name',category:'gm19-category',cols:'gm19-cols',rows:'gm19-rows',count:'gm19-count',fps:'gm19-fps',margin:'gm19-margin',spacing:'gm19-spacing'};
  const values={name:name(preset),category:'animals',cols:preset.cols,rows:preset.rows,count:preset.count,fps:preset.fps,margin:0,spacing:0};
  for(const [key,id] of Object.entries(ids)){
   const target=studio.querySelector('#'+id);if(target){target.value=String(values[key]);target.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  const loop=studio.querySelector('#gm19-loop');if(loop){loop.checked=true;loop.dispatchEvent(new Event('change',{bubbles:true}))}
  const geometry=studio.querySelector('#gm19-geometry');
  if(geometry?.classList.contains('gm19-error')){
   result.textContent=geometry.textContent;return;
  }
  result.textContent='✓ Προετοιμάστηκε: '+name(preset)+'. Δοκίμασε ▶ Αναπαραγωγή και πάτησε 💾 Αποθήκευση στο Studio.';
 }
 start.onclick=()=>{
  try{preset=validate()}catch(e){status.textContent='⚠ '+e.message;return}
  // Calls the original new-draft handler. It also warns before discarding unsaved work.
  newAsset.click();
  if(studio.querySelector('.gm19-screen[data-page="edit"]')?.hidden){status.textContent='⚠ Αποθήκευσε πρώτα την προηγούμενη εργασία.';return}
  companion.hidden=false;
  headline.textContent='🐄 '+name(preset);
  result.textContent='1. Πρώτα διάλεξε PNG/Sprite Sheet στο πεδίο παρακάτω. 2. Μετά πάτησε «Εφαρμογή ρυθμίσεων».';
  panel.scrollTop=0;
 };
 apply.onclick=fillStudio;
 returnTo.onclick=openAnimals;
 tab.addEventListener('click',openAnimals);
 choice.addEventListener('click',openAnimals);
 for(const b of tabs.querySelectorAll('button[data-screen]:not(#oc217-animal-tab)'))b.addEventListener('click',()=>{companion.hidden=true;});
 const input=studio.querySelector('#gm19-file');
 // The native GM19 uploader may set default columns/asset name after decoding.
 // Only apply the preset on explicit creator action after their upload completes.
 if(input)input.addEventListener('change',()=>{if(preset&&!companion.hidden)result.textContent='Η εικόνα φορτώνεται. Μόλις εμφανιστεί, πάτησε «Εφαρμογή ρυθμίσεων».'});
 refreshSummary();inspectClips();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
