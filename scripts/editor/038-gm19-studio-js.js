
/* NostalgiaVille Checkpoint 19.2 — Animation & Asset Studio repair.
   Isolated editor UI + project DB; no changes to gameplay, placement, currency, or XP.
   Game connection uses the existing FV83Assets.set() API only. */
(()=>{'use strict';
const DB_NAME='NostalgiaVille_Studio_CP19', STORE='assets', MAX_FILE=8*1024*1024, MAX_IMAGE=4096;
let tries=0;
function install(){
 const panel=document.getElementById('gm106-panel');
 const nav=document.getElementById('gm18-navigation');
 const home=document.getElementById('gm18-cards');
 const engine=window.FV83Assets;
 if(!panel||!nav||!home||!engine){if(++tries<50)setTimeout(install,250);return;}
 if(document.getElementById('gm19-studio'))return;
 const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
 const studio=el('section','gm19-studio');studio.id='gm19-studio';studio.hidden=true;
 const navBtn=el('button',null,'🎞️ Animation Studio');navBtn.type='button';navBtn.id='gm19-nav';nav.append(navBtn);
 const homeBtn=el('button',null);homeBtn.type='button';homeBtn.append(el('strong',null,'🎞️ Animation & Asset Studio'),el('span',null,'PNG, sprite sheets, προεπισκόπηση, σύνδεση με τη φάρμα'));home.append(homeBtn);
 panel.append(studio);
 studio.innerHTML=`
  <div class="gm19-intro"><strong>🎞️ Animation & Asset Studio</strong><p>Εισαγωγή γραφικών, διαχωρισμός sprite sheet, προεπισκόπηση και σύνδεση με πραγματικό αντικείμενο. Χωρίς αλλαγή στο grid.</p></div>
  <div class="gm19-tabs" role="group" aria-label="Ενότητες Animation Studio">
   <button type="button" data-screen="library">🗂️ Βιβλιοθήκη</button>
   <button type="button" data-screen="edit">🎨 Εισαγωγή / Animation</button>
   <button type="button" data-screen="link">🔗 Σύνδεση</button>
   <button type="button" data-screen="files">💾 Αρχεία</button>
  </div>
  <div id="gm19-notice" role="status" aria-live="polite">Επίλεξε PNG ή sprite sheet για να ξεκινήσεις.</div>
  <section class="gm19-screen" data-page="library">
    <div class="gm19-row gm19-between"><h3>Τα assets μου</h3><button type="button" id="gm19-new">+ Νέο asset</button></div>
    <input id="gm19-search" type="search" placeholder="Αναζήτηση ονόματος ή κατηγορίας" aria-label="Αναζήτηση assets στο Studio"/>
    <div class="gm19-list" id="gm19-list"></div>
    <p class="gm19-note">Η βιβλιοθήκη Studio είναι διαφορετική από τα sprites της φάρμας. Για μεταφορά σε νέο checkpoint κράτα Studio JSON ΚΑΙ Backup Sprites.</p>
  </section>
  <section class="gm19-screen" data-page="edit" hidden>
    <h3>Εισαγωγή & Animation</h3>
    <label>PNG / Sprite Sheet / WebP / JPG<input type="file" id="gm19-file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"/></label>
    <div class="gm19-two">
      <label>Όνομα asset<input id="gm19-name" maxlength="65" placeholder="π.χ. Cow Idle"/></label>
      <label>Κατηγορία<select id="gm19-category"><option value="animals">🐄 Ζώα</option><option value="crops">🌾 Καλλιέργειες</option><option value="trees">🌳 Δέντρα</option><option value="buildings">🏠 Κτίρια</option><option value="decorations">🪴 Διακοσμητικά</option><option value="vehicles">🚜 Οχήματα</option><option value="characters">🧍 Χαρακτήρες</option><option value="hud">🪙 HUD / UI</option><option value="effects">✨ Εφέ</option><option value="other">📦 Άλλα</option></select></label>
    </div>
    <div class="gm19-info" id="gm19-info">Δεν έχει επιλεγεί εικόνα.</div>
    <h4>✂️ Ρυθμίσεις sprite sheet</h4>
    <div class="gm19-grid">
      <label>Στήλες<input type="number" id="gm19-cols" min="1" max="32" value="1"/></label>
      <label>Σειρές<input type="number" id="gm19-rows" min="1" max="16" value="1"/></label>
      <label>Καρέ<input type="number" id="gm19-count" min="1" max="128" value="1"/></label>
      <label>FPS<input type="number" id="gm19-fps" min="1" max="30" value="8"/></label>
      <label>Περιθώριο (px)<input type="number" id="gm19-margin" min="0" max="128" value="0"/></label>
      <label>Κενό καρέ (px)<input type="number" id="gm19-spacing" min="0" max="128" value="0"/></label>
    </div>
    <label class="gm19-check"><input type="checkbox" id="gm19-loop" checked/> Επανάληψη animation (loop)</label>
    <div id="gm19-geometry" class="gm19-info" aria-live="polite">Προσθέστε εικόνα.</div>
    <div class="gm19-preview-wrap"><canvas id="gm19-preview" width="290" height="230" aria-label="Προεπισκόπηση καρέ" role="img"></canvas></div>
    <div class="gm19-player"><button type="button" id="gm19-play">▶ Αναπαραγωγή</button><button type="button" id="gm19-step">⏭ Επόμενο</button><span id="gm19-frame-label">Καρέ –</span></div>
    <input id="gm19-frame" aria-label="Επιλογή καρέ" type="range" min="0" max="0" value="0"/>
    <div class="gm19-row"><button type="button" id="gm19-save" class="gm19-primary">💾 Αποθήκευση στο Studio</button><button type="button" id="gm19-discard">Καθαρισμός</button></div>
  </section>
  <section class="gm19-screen" data-page="link" hidden>
    <h3>Σύνδεση με το παιχνίδι</h3>
    <div class="gm19-info" id="gm19-link-source">Διάλεξε asset από τη Βιβλιοθήκη ή ανέβασε εικόνα.</div>
    <label>Αντικείμενο της πραγματικής φάρμας<select id="gm19-target"></select></label>
    <label>Αναζήτηση αντικειμένου<input type="search" id="gm19-target-search" placeholder="π.χ. cow, apple, hay"/></label>
    <p class="gm19-note" id="gm19-limit">Το πρόγραμμα εφαρμόζει τα καρέ στον υπάρχοντα Sprite Engine. Τα ειδικά states και τα ρούχα του αγρότη θα συνδεθούν με το Character Studio.</p>
    <div class="gm19-info" id="gm19-target-confirm" role="status">Δεν έχει επιλεγεί συγκεκριμένο αντικείμενο.</div>
    <div class="gm19-row"><button type="button" class="gm19-primary" id="gm19-apply">✓ Εφαρμογή στη φάρμα</button><button type="button" id="gm19-back-edit">✎ Επεξεργασία asset</button></div>
    <p class="gm19-note">Για animation στην ίδια εικόνα υποστηρίζονται έως 32 διαδοχικά καρέ σε μία σειρά· η προεπισκόπηση δέχεται έως 128. Μη επαναλαμβανόμενα animations εφαρμόζονται προσωρινά ως στατική πρώτη εικόνα. Τα states του αγρότη δεν τροποποιούνται εδώ.</p>
  </section>
  <section class="gm19-screen" data-page="files" hidden>
    <h3>Ασφαλής μεταφορά Studio</h3>
    <p class="gm19-note">Οι αλλαγές αποθηκεύονται τοπικά όταν είναι διαθέσιμο το IndexedDB. Κάνε πάντα Export JSON πριν αλλάξεις HTML έκδοση ή καθαρίσεις δεδομένα Safari.</p>
    <div class="gm19-row"><button type="button" id="gm19-export">⬇ Backup βιβλιοθήκης Studio</button><button type="button" id="gm19-sprite-backup">🖼️ Μετάβαση σε Backup Sprites φάρμας</button></div>
    <label>Εισαγωγή προηγούμενου Studio JSON<input type="file" id="gm19-import" accept=".json,application/json"/></label>
    <label class="gm19-check"><input type="checkbox" id="gm19-overwrite-import"/> Αντικατάσταση ίδιων Studio IDs (μόνο με επιβεβαίωση)</label>
    <div class="gm19-info" id="gm19-backup-guide">Για πλήρη μεταφορά χρειάζεσαι <b>δύο backups</b>: Studio JSON για τη βιβλιοθήκη και Sprites JSON για τα γραφικά που εφαρμόστηκαν στη φάρμα. Τα αρχεία δεν είναι εναλλάξιμα.</div>
    <p class="gm19-note">Το Import προσθέτει assets στη βιβλιοθήκη. Δεν αντικαθιστά αυτόματα τα sprites της φάρμας — τα εφαρμόζεις εσύ από τη «Σύνδεση».</p>
    <div class="gm19-future"><strong>Επόμενα ανεξάρτητα εργαλεία</strong><p>🎵 Audio Studio: μουσική, ηχητικά εφέ, ένταση και triggers.</p><p>🧍 Character Studio: αρσενικός/θηλυκός αγρότης, ρούχα και animation sets.</p></div>
    <div id="gm19-storage" class="gm19-info"></div>
  </section>`;
 const $=id=>studio.querySelector('#'+id);
 const ui={notice:$('gm19-notice'),file:$('gm19-file'),name:$('gm19-name'),category:$('gm19-category'),cols:$('gm19-cols'),rows:$('gm19-rows'),count:$('gm19-count'),fps:$('gm19-fps'),margin:$('gm19-margin'),spacing:$('gm19-spacing'),loop:$('gm19-loop'),canvas:$('gm19-preview'),geometry:$('gm19-geometry'),info:$('gm19-info'),frame:$('gm19-frame'),frameLabel:$('gm19-frame-label'),play:$('gm19-play'),step:$('gm19-step'),list:$('gm19-list'),search:$('gm19-search'),target:$('gm19-target'),targetSearch:$('gm19-target-search'),linkSource:$('gm19-link-source'),storage:$('gm19-storage')};
 const state={assets:new Map(),currentId:null,src:'',image:null,width:0,height:0,frame:0,playing:false,lastFrame:0,active:false,db:null,dbOK:false,screen:'library',dirty:false,baseline:null,importBusy:false};
 const message=(m,isError=false)=>{ui.notice.textContent=m;ui.notice.classList.toggle('gm19-error',isError)};
 const safeInt=(v,min,max)=>{const x=Number(v);return Number.isInteger(x)&&x>=min&&x<=max?x:null};
 // Snapshot covers metadata and image identity; keep original string for lossless edit tracking.
 const snapshot=()=>({id:state.currentId,src:state.src,meta:JSON.stringify(getMeta())});
 const resetBaseline=()=>{state.baseline=snapshot();state.dirty=false};
 const hasUnsaved=()=>{if(!state.baseline)return !!state.image;
  const now=snapshot();return now.id!==state.baseline.id||now.src!==state.baseline.src||now.meta!==state.baseline.meta;};
 const safeLeave=()=>!hasUnsaved()||window.confirm('Έχεις αλλαγές που δεν αποθήκευσες στο Animation Studio. Να συνεχίσουμε και να χαθούν;');
 const digits=(id,min,max)=>safeInt($(id).value,min,max);
 const getMeta=()=>({name:ui.name.value.trim(),category:ui.category.value,cols:digits('gm19-cols',1,32),rows:digits('gm19-rows',1,16),count:digits('gm19-count',1,128),fps:digits('gm19-fps',1,30),margin:digits('gm19-margin',0,128),spacing:digits('gm19-spacing',0,128),loop:ui.loop.checked});
 resetBaseline();
 const toDataURL=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Αποτυχία ανάγνωσης εικόνας'));r.readAsDataURL(file)});
 const decode=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Δεν διαβάζεται η εικόνα'));img.src=src});
 function geometry(meta){
  if(!state.image)throw Error('Δεν έχει φορτωθεί εικόνα.');
  if(Object.values(meta).some(v=>v===null))throw Error('Έλεγξε τις αριθμητικές τιμές.');
  if(meta.count>meta.cols*meta.rows)throw Error('Τα καρέ δεν μπορούν να είναι περισσότερα από Στήλες × Σειρές.');
  const w=(state.width-2*meta.margin-(meta.cols-1)*meta.spacing)/meta.cols;
  const h=(state.height-2*meta.margin-(meta.rows-1)*meta.spacing)/meta.rows;
  if(w<=0||h<=0||!Number.isInteger(w)||!Number.isInteger(h))throw Error('Τα περιθώρια και τα κενά πρέπει να αφήνουν ακέραιες διαστάσεις καρέ.');
  return {w,h};
 }
 function show(tab){
  state.screen=tab;
  for(const page of studio.querySelectorAll('.gm19-screen'))page.hidden=page.dataset.page!==tab;
  for(const btn of studio.querySelectorAll('[data-screen]'))btn.setAttribute('aria-current',btn.dataset.screen===tab?'page':'false');
  if(tab==='library')renderLibrary();
  if(tab==='link')updateLink();
  if(tab==='files')ui.storage.textContent=state.dbOK?'✓ Τοπική αποθήκευση Studio ενεργή.':'⚠ Η τοπική αποθήκευση δεν είναι διαθέσιμη εδώ. Κάνε Export Studio JSON πριν κλείσεις.';
  if(tab!=='edit')stop(); else draw();
  panel.scrollTop=0;
 }
 function openStudio(){panel.classList.add('gm19-studio-open');studio.hidden=false;state.active=true;show('library');}
 navBtn.addEventListener('click',openStudio);homeBtn.addEventListener('click',openStudio);
 panel.addEventListener('click',ev=>{const b=ev.target.closest('#gm18-navigation > button');if(b&&b!==navBtn){panel.classList.remove('gm19-studio-open');studio.hidden=true;state.active=false;stop();}},true);
 const close=panel.querySelector(':scope > .head > button:last-child');
 if(close)close.addEventListener('click',()=>{panel.classList.remove('gm19-studio-open');studio.hidden=true;state.active=false;stop();});
 // Keep the existing minimize/restore buttons; studio remains in the same window.
 studio.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.screen)));
 function currentRecord(){return state.currentId?state.assets.get(state.currentId):null}
 function renderLibrary(){
  ui.list.replaceChildren();const q=ui.search.value.toLocaleLowerCase('el');
  const arr=[...state.assets.values()].filter(a=>(a.name+' '+a.category+' '+(a.boundObject||'')).toLocaleLowerCase('el').includes(q)).sort((a,b)=>a.name.localeCompare(b.name,'el'));
  if(!arr.length){ui.list.append(el('p','gm19-note',q?'Δεν βρέθηκαν assets.':'Δεν έχεις εισαγάγει assets ακόμη. Πάτησε «+ Νέο asset».'));return;}
  for(const a of arr){const row=el('div','gm19-item');const th=el('img');th.src=a.dataUrl;th.alt='';th.loading='lazy';const detail=el('div','gm19-item-detail');detail.append(el('strong',null,a.name),el('span',null,a.category+' · '+a.count+' καρέ'+(a.boundObject?' · '+a.boundObject:'')));const pick=el('button',null,'Άνοιγμα');pick.type='button';pick.addEventListener('click',()=>loadRecord(a));const remove=el('button',null,'🗑');remove.type='button';remove.title='Διαγραφή από τη Βιβλιοθήκη Studio';remove.setAttribute('aria-label','Διαγραφή Studio asset '+a.name);remove.addEventListener('click',()=>deleteRecord(a));row.append(th,detail,pick,remove);ui.list.append(row);}
 }
 ui.search.addEventListener('input',renderLibrary);
 async function deleteRecord(a){
  if(a.id===state.currentId&&!safeLeave())return;
  if(!confirm('Να αφαιρεθεί το «'+a.name+'» μόνο από τη βιβλιοθήκη Studio; Το sprite της φάρμας ΔΕΝ θα διαγραφεί.'))return;
  state.assets.delete(a.id);if(state.currentId===a.id){state.currentId=null;resetBaseline();}
  let persisted=false;
  if(state.db){persisted=await new Promise(resolve=>{try{const tx=state.db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(a.id);tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false)}catch(e){resolve(false)}})}
  renderLibrary();message(persisted?'✓ Διαγράφηκε μόνο από το Studio.':'✓ Αφαιρέθηκε από την τρέχουσα βιβλιοθήκη. Η μόνιμη διαγραφή δεν επιβεβαιώθηκε.');
 }
 function newDraft(){if(!safeLeave())return;state.currentId=null;state.src='';state.image=null;state.width=state.height=0;state.frame=0;ui.file.value='';ui.name.value='';ui.category.value='animals';ui.cols.value='1';ui.rows.value='1';ui.count.value='1';ui.fps.value='8';ui.margin.value='0';ui.spacing.value='0';ui.loop.checked=true;stop();refresh();show('edit');resetBaseline();message('Επίλεξε νέο PNG ή sprite sheet.');}
 $('gm19-new').addEventListener('click',newDraft);
 async function loadRecord(a){
  if(!safeLeave())return;
  try{const img=await decode(a.dataUrl);state.currentId=a.id;state.src=a.dataUrl;state.image=img;state.width=img.naturalWidth;state.height=img.naturalHeight;state.frame=0;
   ui.name.value=a.name;ui.category.value=a.category;ui.cols.value=a.cols;ui.rows.value=a.rows;ui.count.value=a.count;ui.fps.value=a.fps;ui.margin.value=a.margin;ui.spacing.value=a.spacing;ui.loop.checked=a.loop;ui.file.value='';stop();refresh();show('edit');resetBaseline();message('Άνοιξε το '+a.name+' από τη Βιβλιοθήκη.');}
  catch(e){message('⚠ '+e.message,true)}
 }
 ui.file.addEventListener('change',async()=>{
  const file=ui.file.files?.[0];if(!file)return;
  if(!safeLeave()){ui.file.value='';return;}
  try{
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Χρησιμοποίησε PNG, JPG ή WebP.');
   if(file.size>MAX_FILE)throw Error('Μέγιστο αρχείο εικόνας 8 MB.');
   const src=await toDataURL(file),img=await decode(src);
   if(img.naturalWidth>MAX_IMAGE||img.naturalHeight>MAX_IMAGE)throw Error('Μέγιστες διαστάσεις εικόνας 4096 px.');
   // Preserve currentId on image replacement: update the same asset, do not duplicate it.
   const existing=!!state.currentId;state.src=src;state.image=img;state.width=img.naturalWidth;state.height=img.naturalHeight;state.frame=0;
   if(!existing)ui.name.value=file.name.replace(/\.[^.]+$/,'').slice(0,65);ui.cols.value='1';ui.rows.value='1';ui.count.value='1';ui.fps.value='8';ui.margin.value='0';ui.spacing.value='0';ui.loop.checked=true;
   stop();refresh();message('✓ Φορτώθηκε '+file.name+(existing?' για αντικατάσταση στο ίδιο asset.':' ως νέο asset.')+' · '+img.naturalWidth+'×'+img.naturalHeight+' px');
  }catch(e){ui.file.value='';message('⚠ '+e.message,true)}
 });
 const placementHint=document.createElement('p');
 placementHint.textContent='Σύρε το ζώο πάνω στον ρόμβο και άφησέ το για αποθήκευση. Το πρώτο σημείο ισχύει για όλα τα καρέ. Μετά διορθώνεις κάθε καρέ χωριστά.';
 const resetPlacement=document.createElement('button');
 resetPlacement.type='button';resetPlacement.textContent='Επαναφορά στοίχισης';
 ui.canvas.parentElement.after(placementHint,resetPlacement);
 let placementFrame=null,placementDraft=null,dragBound=false;
 function placementTarget(){
  const match=/^Animal ([a-z0-9-]+) (idle|walk|eat|produce) (front|back|left|right)$/.exec(ui.name.value.trim());
  if(ui.category.value==='animals'&&match&&engine.isAnimal?.(match[1]))
   return {id:match[1],clip:match[2]+'/'+match[3]};
  return null;
 }
 function commitPlacement(pt){
  if(!placementFrame)return;
  const {id,clip,frame}=placementFrame;
  stop();const saved=engine.setManualAnchor(id,clip,frame,pt);
  draw();message(saved?'Η στοίχιση αποθηκεύτηκε.':'Η στοίχιση ισχύει για αυτή τη συνεδρία.',!saved);
 }

 resetPlacement.onclick=()=>commitPlacement(null);
 ui.name.addEventListener('input',()=>draw());ui.category.addEventListener('change',()=>draw());
 const ctx=ui.canvas.getContext('2d');
 function draw(){
  placementFrame=null;
  const target=placementTarget();
  placementHint.hidden=resetPlacement.hidden=!(target&&state.image&&window.OnlyCropsPlacement);
  ctx.clearRect(0,0,ui.canvas.width,ui.canvas.height);
  ctx.fillStyle='#e9dfc6';ctx.fillRect(0,0,ui.canvas.width,ui.canvas.height);
  const block=18;for(let y=0;y<ui.canvas.height;y+=block)for(let x=0;x<ui.canvas.width;x+=block){if(((x+y)/block)%2===0){ctx.fillStyle='#dfd4b8';ctx.fillRect(x,y,block,block)}}
  if(!state.image)return;
  try{
   const m=getMeta(),g=geometry(m);state.frame=Math.min(state.frame,m.count-1);
   const col=state.frame%m.cols,row=Math.floor(state.frame/m.cols);
   const factor=Math.min((ui.canvas.width-24)/g.w,(ui.canvas.height-24)/g.h,4);
   const w=g.w*factor,h=g.h*factor;
   ctx.imageSmoothingEnabled=false;
   if(target&&window.OnlyCropsPlacement){
    if(!dragBound){
     window.OnlyCropsPlacement.bindDrag(ui.canvas,()=>placementFrame?.box,
      pt=>{placementDraft=pt;draw()},pt=>{placementDraft=null;commitPlacement(pt)},stop);
     dragBound=true;
    }
    const box=window.OnlyCropsPlacement.draw(ui.canvas,target.id,target.clip,state.frame,state.image,...extractFrame(m,g,state.frame),placementDraft);
    placementFrame={...target,frame:state.frame,box};
   }else ctx.drawImage(state.image,m.margin+col*(g.w+m.spacing),m.margin+row*(g.h+m.spacing),g.w,g.h,(ui.canvas.width-w)/2,(ui.canvas.height-h)/2,w,h);
   ui.frame.max=String(m.count-1);ui.frame.value=String(state.frame);ui.frameLabel.textContent='Καρέ '+(state.frame+1)+' / '+m.count;
  }catch(e){ui.frameLabel.textContent='Μη έγκυρη διάταξη';}
 }
 function refresh(){
  ui.info.textContent=state.image?('Εικόνα: '+state.width+'×'+state.height+' px'):'Δεν έχει επιλεγεί εικόνα.';
  try{const m=getMeta(),g=geometry(m);ui.geometry.textContent='✓ Κάθε καρέ: '+g.w+'×'+g.h+' px · '+m.count+' / '+(m.cols*m.rows)+' καρέ · '+m.fps+' FPS';ui.geometry.classList.remove('gm19-error');}
  catch(e){ui.geometry.textContent='⚠ '+e.message;ui.geometry.classList.add('gm19-error')}
  draw();
 }
 [ui.cols,ui.rows,ui.count,ui.fps,ui.margin,ui.spacing,ui.loop].forEach(e=>e.addEventListener('input',()=>{state.frame=0;refresh()}));
 ui.frame.addEventListener('input',()=>{state.frame=Number(ui.frame.value)||0;stop();draw()});
 function stop(){state.playing=false;ui.play.textContent='▶ Αναπαραγωγή'}
 ui.play.addEventListener('click',()=>{if(!state.image){message('⚠ Επίλεξε πρώτα εικόνα.',true);return}try{geometry(getMeta());state.playing=!state.playing;state.lastFrame=performance.now();ui.play.textContent=state.playing?'⏸ Παύση':'▶ Αναπαραγωγή';if(state.playing)requestAnimationFrame(tick);}catch(e){message('⚠ '+e.message,true)}});
 ui.step.addEventListener('click',()=>{stop();const m=getMeta();state.frame=(state.frame+1)%(m.count||1);draw()});
 function tick(ts){
  if(!state.playing)return;
  if(panel.hidden||!state.active||state.screen!=='edit'||studio.hidden){stop();return;}
  if(state.active&&state.screen==='edit'&&!studio.hidden&&state.playing){
   const m=getMeta();if(m.fps&&m.count&&ts-state.lastFrame>=1000/m.fps){const steps=Math.max(1,Math.floor((ts-state.lastFrame)/(1000/m.fps)));state.lastFrame=ts;state.frame+=steps;
    if(state.frame>=m.count){if(m.loop)state.frame%=m.count;else {state.frame=m.count-1;stop()}}draw();}
  }
  if(state.playing)requestAnimationFrame(tick);
 }
 async function openDB(){
  if(!window.indexedDB)return false;
  return new Promise(resolve=>{try{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};r.onsuccess=()=>{state.db=r.result;state.dbOK=true;resolve(true)};r.onerror=()=>resolve(false)}catch(e){resolve(false)}});
 }
 function store(a){if(!state.db)return Promise.resolve(false);return new Promise(resolve=>{try{const tx=state.db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(a);tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false)}catch(e){resolve(false)}})}
 function readAll(){if(!state.db)return Promise.resolve([]);return new Promise(resolve=>{try{const r=state.db.transaction(STORE,'readonly').objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([])}catch(e){resolve([])}})}
 async function saveDraft(){
  if(!state.image||!state.src)throw Error('Επίλεξε πρώτα εικόνα.');
  const m=getMeta(),g=geometry(m);
  if(!m.name||m.name.length>65)throw Error('Βάλε όνομα έως 65 χαρακτήρες.');
  const old=currentRecord();const id=state.currentId||('asset_'+Date.now()+'_'+Math.floor(Math.random()*1e6));
  const a={id,...m,width:state.width,height:state.height,frameWidth:g.w,frameHeight:g.h,dataUrl:state.src,boundObject:old?.boundObject||'',updatedAt:new Date().toISOString()};
  state.assets.set(id,a);state.currentId=id;const persisted=await store(a);resetBaseline();
  message(persisted?'✓ Αποθηκεύτηκε στο Studio.':'⚠ Το asset υπάρχει τώρα αλλά η μόνιμη αποθήκευση δεν επιβεβαιώθηκε. Κάνε Export Studio JSON.',!persisted);
  return a;
 }
 $('gm19-save').addEventListener('click',async()=>{try{await saveDraft()}catch(e){message('⚠ '+e.message,true)}});
 $('gm19-discard').addEventListener('click',newDraft);
 function targetLabel(id){const d=window.FV83Defs?.get(id);return (d?.name||id)+' · '+id;}
 function targetStatus(){
  const id=ui.target.value,info=$('gm19-target-confirm');
  if(!id){info.textContent='⚠ Διάλεξε ρητά αντικείμενο από τη λίστα. Η αναζήτηση δεν εφαρμόζει εικόνες αυτόματα.';return;}
  const current=engine.get(id);info.textContent='Επιλογή: '+targetLabel(id)+(current?' · Έχει ήδη sprite και θα αντικατασταθεί.':' · Δεν έχει δικό σου sprite.')+' Το grid δεν αλλάζει.';
 }
 function renderTargets(keepSelection=false){
  const term=ui.targetSearch.value.trim().toLocaleLowerCase('el'),old=keepSelection?ui.target.value:'';
  ui.target.replaceChildren();const initial=el('option',null,'— Επίλεξε συγκεκριμένο αντικείμενο —');initial.value='';ui.target.append(initial);
  for(const id of engine.allowed){const label=targetLabel(id);if(term&&!label.toLocaleLowerCase('el').includes(term))continue;const opt=el('option',null,label);opt.value=id;ui.target.append(opt)}
  if(old&&[...ui.target.options].some(o=>o.value===old))ui.target.value=old;
  else ui.target.value='';
  targetStatus();
 }
 ui.targetSearch.addEventListener('input',()=>renderTargets(false));ui.target.addEventListener('change',targetStatus);
 renderTargets();
 function updateLink(){const a=currentRecord();const m=getMeta();const name=m.name||(a?.name||'');
  ui.linkSource.textContent=state.image?('Asset: '+name+' · '+state.width+'×'+state.height+' px · '+m.count+' καρέ'):'Δεν έχει επιλεγεί asset. Άνοιξε τη Βιβλιοθήκη ή πρόσθεσε PNG.';
  // Restore a saved binding only when there is no active search, without guessing a match.
  if(a?.boundObject&&!ui.targetSearch.value&&[...ui.target.options].some(o=>o.value===a.boundObject))ui.target.value=a.boundObject;
  targetStatus();
 }
 $('gm19-back-edit').addEventListener('click',()=>show('edit'));
 function extractFrame(m,g,c){const col=c%m.cols,row=Math.floor(c/m.cols);return [m.margin+col*(g.w+m.spacing),m.margin+row*(g.h+m.spacing),g.w,g.h]}
 async function normalizeSprite(m,g){
  // The real FV83 renderer cycles columns only. Convert trimmed sheets to one row.
  const frames=m.loop?m.count:1;
  if(frames>32)throw Error('Ο Sprite Engine δέχεται έως 32 καρέ σε μία σειρά. Μείωσε τα καρέ ή κράτησε το animation μόνο στο Studio.');
  if(g.w*frames>4096||g.h>4096)throw Error('Το τελικό sprite sheet ξεπερνά τα 4096 px. Μείωσε τα καρέ ή το μέγεθος εικόνας.');
  const c=document.createElement('canvas');c.width=g.w*frames;c.height=g.h;const cx=c.getContext('2d');
  for(let i=0;i<frames;i++){const s=extractFrame(m,g,i);cx.drawImage(state.image,s[0],s[1],s[2],s[3],i*g.w,0,g.w,g.h)}
  return await new Promise((res,rej)=>c.toBlob(blob=>blob?res(blob):rej(Error('Αποτυχία μετατροπής sprite sheet')),'image/png'));
 }
 $('gm19-apply').addEventListener('click',async()=>{
  const button=$('gm19-apply');if(button.disabled)return;
  try{
   if(!state.image)throw Error('Επίλεξε πρώτα εικόνα από τη Βιβλιοθήκη.');
   const target=ui.target.value;if(!target||!engine.allowed.includes(target))throw Error('Επίλεξε πραγματικό αντικείμενο της φάρμας.');
   if(target==='farmer'||target==='farmer_blonde')throw Error('Ο αγρότης χρειάζεται ξεχωριστό Character Studio με idle/walk/harvest και ρούχα. Δεν αντικαθιστούμε εδώ τα animations του.');
   const m=getMeta(),g=geometry(m);
   if(m.count>32&&m.loop)throw Error('Για εφαρμογή στη φάρμα πρέπει να έχεις έως 32 καρέ. Το Studio μπορεί να προβάλλει έως 128.');
   if(!m.loop&&m.count>1&&!window.confirm('Το animation δεν επαναλαμβάνεται. Η φάρμα θα εμφανίσει ΜΟΝΟ το πρώτο καρέ στατικά. Συνέχεια;'))return;
   if(engine.get(target)&&!window.confirm('Θα αντικατασταθεί το sprite του «'+targetLabel(target)+'». Συνέχεια;'))return;
   button.disabled=true;
   const blob=await normalizeSprite(m,g);
   if(blob.size>MAX_FILE)throw Error('Το τελικό PNG είναι μεγαλύτερο από 8 MB.');
   const a=await saveDraft();
   const old=engine.get(target)?.conf||engine.settings();
   const conf=engine.settings({...old,cols:m.loop?m.count:1,rows:1,fps:m.fps});
   // Guaranteed same engine, same gameplay object/footprint, no new renderer.
   const persisted=await engine.set(target,blob,conf);
   const next={...a,boundObject:target};state.assets.set(a.id,next);const studioSaved=await store(next);resetBaseline();
   message(persisted&&studioSaved?'✓ Η εικόνα/animation εφαρμόστηκε στη φάρμα και αποθηκεύτηκε.':'✓ Εφαρμόστηκε στη φάρμα, αλλά η μόνιμη αποθήκευση δεν επιβεβαιώθηκε. Κράτησε Backup Sprites και Export Studio JSON.',!(persisted&&studioSaved));
  }catch(e){message('⚠ '+e.message,true)}finally{button.disabled=false}
 });
 function downloadJSON(payload,name){const blob=new Blob([JSON.stringify(payload)],{type:'application/json'}),url=URL.createObjectURL(blob);const link=el('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
 $('gm19-export').addEventListener('click',()=>{
  try{const items=[...state.assets.values()];if(items.length>150)throw Error('Πάνω από 150 assets — χώρισε τη βιβλιοθήκη πριν το backup.');const payload={type:'nostalgiaville-animation-asset-studio',version:1,exportedAt:new Date().toISOString(),assets:items};const bytes=new Blob([JSON.stringify(payload)]).size;if(bytes>80*1024*1024)throw Error('Το backup είναι '+Math.ceil(bytes/1048576)+' MB, αλλά το Import δέχεται έως 80 MB. Μείωσε τις εικόνες πριν την εξαγωγή.');downloadJSON(payload,'NostalgiaVille_Studio_CP19_2_Backup.json');message('✓ Δημιουργήθηκε Backup Studio ('+items.length+' assets, '+(bytes/1048576).toFixed(1)+' MB). Θυμήσου και το ξεχωριστό Backup Sprites!');}
  catch(e){message('⚠ '+e.message,true)}
 });
 $('gm19-sprite-backup').addEventListener('click',()=>{
  const navImages=[...document.querySelectorAll('#gm18-navigation > button')].find(b=>b.textContent.includes('Εικόνες'));
  if(!navImages){message('Δεν βρέθηκε η ενότητα Εικόνες.',true);return;}
  navImages.click();
  const backupTab=[...document.querySelectorAll('#gm18-asset-nav > button')].find(b=>b.textContent.includes('Backup'));
  if(backupTab)backupTab.click();
  setTimeout(()=>document.getElementById('gm-cp14-backup')?.scrollIntoView({behavior:'smooth',block:'center'}),150);
 });
 // Validate the complete bundle before changing any record. Do not auto-overwrite by ID.
 async function checkedAsset(a){
  if(!a||typeof a!=='object'||Array.isArray(a)||typeof a.id!=='string'||!a.id.trim()||a.id.length>100||typeof a.name!=='string'||!a.name.trim()||a.name.length>65||typeof a.dataUrl!=='string')throw Error('Ελλιπή στοιχεία asset.');
  if(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(a.dataUrl)||a.dataUrl.length>12e6)throw Error('Ακατάλληλο αρχείο εικόνας στο '+a.name);
  const allowedCategories=[...ui.category.options].map(o=>o.value);
  if(!allowedCategories.includes(a.category))throw Error('Άγνωστη κατηγορία στο '+a.name);
  const m={cols:safeInt(a.cols,1,32),rows:safeInt(a.rows,1,16),count:safeInt(a.count,1,128),fps:safeInt(a.fps,1,30),margin:safeInt(a.margin,0,128),spacing:safeInt(a.spacing,0,128)};
  if(Object.values(m).some(v=>v===null)||m.count>m.cols*m.rows||typeof a.loop!=='boolean')throw Error('Μη έγκυρα καρέ/ρυθμίσεις στο '+a.name);
  const img=await decode(a.dataUrl);
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth>4096||img.naturalHeight>4096)throw Error('Μη έγκυρες διαστάσεις στο '+a.name);
  const w=(img.naturalWidth-2*m.margin-(m.cols-1)*m.spacing)/m.cols;
  const h=(img.naturalHeight-2*m.margin-(m.rows-1)*m.spacing)/m.rows;
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<=0||h<=0)throw Error('Αδύνατη κοπή καρέ στο '+a.name);
  return {id:a.id,name:a.name,category:a.category,...m,loop:a.loop,width:img.naturalWidth,height:img.naturalHeight,frameWidth:w,frameHeight:h,dataUrl:a.dataUrl,boundObject:engine.allowed.includes(a.boundObject)?a.boundObject:'',updatedAt:typeof a.updatedAt==='string'?a.updatedAt:new Date().toISOString()};
 }
 function storeBatch(items){if(!state.db)return Promise.resolve(false);return new Promise(resolve=>{
  try{const tx=state.db.transaction(STORE,'readwrite'),os=tx.objectStore(STORE);for(const a of items)os.put(a);tx.oncomplete=()=>resolve(true);tx.onabort=()=>resolve(false);tx.onerror=()=>resolve(false);}catch(e){resolve(false)}
 });}
 $('gm19-import').addEventListener('change',async ev=>{
  const f=ev.target.files?.[0];if(!f||state.importBusy)return;
  state.importBusy=true;const input=ev.target;input.disabled=true;
  try{
   if(!f.size||f.size>80*1024*1024)throw Error('Το Studio JSON πρέπει να είναι έως 80 MB.');
   const data=JSON.parse(await f.text());
   if(data?.type!=='nostalgiaville-animation-asset-studio'||data?.version!==1||!Array.isArray(data.assets))throw Error('Το JSON δεν είναι συμβατό Backup Studio (v1).');
   if(data.assets.length>150)throw Error('Το Backup Studio επιτρέπει έως 150 assets.');
   const validated=[],ids=new Set();
   for(let i=0;i<data.assets.length;i++){
    const row=data.assets[i];if(ids.has(row?.id))throw Error('Διπλό ID μέσα στο backup: '+row.id);
    message('Έλεγχος εικόνας '+(i+1)+' / '+data.assets.length+'…');
    // Yield occasionally on mobile to keep UI responsive.
    if(i%4===0)await new Promise(r=>setTimeout(r,0));
    const good=await checkedAsset(row);ids.add(good.id);validated.push(good);
   }
   let toInsert=validated.filter(a=>!state.assets.has(a.id));
   const collision=validated.filter(a=>state.assets.has(a.id));
   let replaced=0;
   if(collision.length&&$('gm19-overwrite-import').checked){
    if(window.confirm('ΠΡΟΣΟΧΗ: '+collision.length+' υπάρχοντα Studio assets έχουν ίδιο ID. Θέλεις να αντικατασταθούν; Η φάρμα δεν αλλάζει αυτόματα.')){toInsert=toInsert.concat(collision);replaced=collision.length;}
   }
   const skipped=collision.length-replaced;
   if(state.assets.size+toInsert.length-replaced>150)throw Error('Η συνολική βιβλιοθήκη θα ξεπεράσει τα 150 assets.');
   if(!toInsert.length){message('Δεν έγινε καμία αλλαγή. '+skipped+' ήδη υπάρχοντα IDs παραλείφθηκαν.');show('library');return;}
   // One IndexedDB transaction avoids half-imported studio backups.
   const saved=await storeBatch(toInsert);
   for(const row of toInsert)state.assets.set(row.id,row);
   // Keep displayed editing record until explicitly re-opened.
   message((saved?'✓':'⚠ ')+toInsert.length+' assets εισήχθησαν ('+replaced+' αντικαταστάθηκαν, '+skipped+' παραλείφθηκαν). '+(saved?'Αποθηκεύτηκαν τοπικά.':'Δεν επιβεβαιώθηκε μόνιμη αποθήκευση· κάνε αμέσως Export Studio JSON.'),!saved);
   show('library');
  }catch(e){message('⚠ Το Import ακυρώθηκε χωρίς αλλαγές: '+e.message,true)}finally{input.value='';input.disabled=false;state.importBusy=false}
 });
 (async()=>{await openDB();for(const a of await readAll()){if(a?.id&&a?.dataUrl)state.assets.set(a.id,a)}renderLibrary();ui.storage.textContent=state.dbOK?'✓ IndexedDB ενεργό':'⚠ Δεν είναι διαθέσιμη η τοπική αποθήκευση. Χρησιμοποίησε Export Studio JSON.';})();
 panel.dataset.creatorStudio='19';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,600),{once:true});else setTimeout(install,600);
})();

