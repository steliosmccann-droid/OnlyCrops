

(()=>{'use strict';
const STORE='FarmVille3026_V106_Maker';
const groups={
HUD:[['Coins εικόνα','.fv90-coin'],['Coins αριθμός','#fv90Coins'],['NF Cash εικόνα','.fv90-cash'],['NF Cash αριθμός','#fv90Cash'],['XP εικόνα','.fv90-xp'],['Level','#fv90Level'],['XP bar','.fv90-xp-track'],['XP κείμενο','#fv90XpText'],['Only Crops Logo','.fv90-logo'],['Πινακίδα','.fv90-name'],['Όνομα','#fv90Name']],
UI:[['Εργαλειοθήκη','.classic-tools'],['Select','#fvMulti'],['Plow','#fvPlow'],['Recycle','#fvRecycle'],['Ribbons','#fv39Ribbons'],['Market','#fvMarket'],['Gifts','#fvGifts'],['Βελάκι Select','#fv38MultiArrow'],['Βελάκι Plow','#fv38PlowArrow'],['Υπομενού Select / Plow','#fv38Submenu'],['Zoom +','#zoomIn'],['Zoom −','#zoomOut'],['Camera','#recenter'],['Ρυθμίσεις ⚙','#fv42-settings-button']]
};
const $=s=>{try{return document.querySelector(s)}catch(e){return null}};
const add=(tag,p,t)=>{const x=document.createElement(tag);if(t!==undefined)x.textContent=t;p.append(x);return x};
const cap=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
let state={},undo=[],redo=[],section='HUD',gesture=null;
try{const v=JSON.parse(localStorage.getItem(STORE)||localStorage.getItem('FarmVille3026_V105_GameMaker')||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))state=v}catch(e){}
const selectors=[...new Set(Object.values(groups).flat().map(a=>a[1]))];
function store(){try{const data=JSON.stringify(state);localStorage.setItem(STORE,data);return localStorage.getItem(STORE)===data}catch(e){return false}}
function checkpoint(){undo.push(JSON.stringify(state));if(undo.length>50)undo.shift();redo=[]}

// Existing Game Maker state: the toolbar remains the real gameplay toolbar.
// The two skin slots below affect its background images ONLY, never game logic.
const GM_TOOLBAR_TARGETS=['.classic-tools','#fvMulti','#fvPlow','#fvRecycle','#fv39Ribbons','#fvMarket','#fvGifts','#fv38MultiArrow','#fv38PlowArrow','#zoomIn','#zoomOut','#recenter','#fv42-settings-button'];
// UI-only targets are dormant until the creator modifies their appearance.
const GM09_NEW_TARGETS=['#fv38MultiArrow','#fv38PlowArrow','#fv38Submenu','#zoomIn','#zoomOut','#recenter','#fv42-settings-button'];
const GM09_ARROWS=['#fv38MultiArrow','#fv38PlowArrow'];
function applyToolbarSkins(){
 for(const sel of GM_TOOLBAR_TARGETS){
  const e=$(sel);if(!e)continue;
  const v=state[sel]||{};
  const active=sel!=='.classic-tools'&&(e.classList.contains('active')||e.dataset.gm106Pressed==='1'||(GM09_ARROWS.includes(sel)&&e.getAttribute('aria-expanded')==='true'));
  const image=(active&&v.activeImage)?v.activeImage:v.image;
  if(image){
   e.style.setProperty('background-image',`url("${image}")`,'important');
   e.style.setProperty('background-size','100% 100%','important');
   e.style.setProperty('background-repeat','no-repeat','important');
   // The original HUD uses invisible arrow hit-targets. Reveal only if a PNG was assigned.
   if(GM09_ARROWS.includes(sel)&&v.opacity===undefined)e.style.setProperty('opacity','1','important');
   if(sel==='#fv42-settings-button'){e.style.setProperty('color','transparent','important');e.style.setProperty('border','0','important');}
  }else{
   for(const p of ['background-image','background-size','background-repeat'])e.style.removeProperty(p);
   if(GM09_ARROWS.includes(sel)&&v.opacity===undefined)e.style.removeProperty('opacity');
   if(sel==='#fv42-settings-button'){e.style.removeProperty('color');e.style.removeProperty('border');}
  }
 }
}
function renderSubmenuSkins(){
 const host=document.getElementById('fv38Submenu');if(!host)return;
 const images=state['#fv38Submenu']?.subImages||{};
 // CSS rules target the REAL runtime-generated menu children. They never intercept clicks.
 const slots={
  'select-bg':['select',0], 'plow-bg':['plow',0],
  'select-select':['select',1], 'select-move':['select',2],
  'select-seeder':['select',3], 'select-harvester':['select',4],
  'plow-plow':['plow',1], 'plow-tractor':['plow',2]
 };
 let css='';
 const valid=x=>typeof x==='string'&&/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(x);
 for(const [key,[type,index]] of Object.entries(slots)){
  const item=images[key]||{};
  const selector='html.mode-farm #fv38Submenu[data-v77="'+type+'"]'+(index?' button:nth-of-type('+index+')':'');
  if(valid(item.normal))css+=selector+'{background-image:url("'+item.normal+'")!important;background-repeat:no-repeat!important;background-size:100% 100%!important;background-position:center!important;}\n';
  if(index&&valid(item.pressed))css+=selector+':active{background-image:url("'+item.pressed+'")!important;}\n';
 }
 let style=document.getElementById('gm106-submenu-skins');
 if(!style){style=document.createElement('style');style.id='gm106-submenu-skins';document.head.appendChild(style)}
 style.textContent=css;
}
function render(){
 for(const sel of selectors){const e=$(sel);if(!e)continue;const v=state[sel]||{};
 if(GM09_NEW_TARGETS.includes(sel)&&!Object.keys(v).some(k=>['x','y','scale','opacity','image','activeImage'].includes(k)))continue;
 e.style.setProperty('translate',`${cap(v.x,-400,400)}px ${cap(v.y,-400,400)}px`,'important');
 e.style.setProperty('scale',String(cap(v.scale??100,25,250)/100),'important');
 if(GM09_ARROWS.includes(sel)&&v.opacity===undefined)e.style.removeProperty('opacity');
 else e.style.setProperty('opacity',String(cap(v.opacity??100,0,100)/100),'important');
 if(v.image){e.style.setProperty('background-image',`url("${v.image}")`,'important');e.style.setProperty('background-size','contain','important');e.style.setProperty('background-repeat','no-repeat','important')}
 else for(const p of ['background-image','background-size','background-repeat'])e.style.removeProperty(p);
 }
 renderAppearance();
 applyToolbarSkins();
 renderSubmenuSkins();
}

// Creator visual overrides: applied ONLY to approved HUD elements.
// Never write their textContent or the live XP fill percentage.
function renderAppearance(){
 const textSelectors=['#fv90Coins','#fv90Cash','#fv90Level','#fv90XpText','#fv90Name'];
 for(const sel of textSelectors){
  const e=$(sel);if(!e)continue;
  const v=state[sel]||{};
  const size=Number(v.fontSize);
  if(v.fontSize!==undefined&&Number.isFinite(size)&&size>=8&&size<=40)e.style.setProperty('font-size',size+'px','important');
  else e.style.removeProperty('font-size');
  if(typeof v.textColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.textColor))e.style.setProperty('color',v.textColor,'important');
  else e.style.removeProperty('color');
 }
 const bar=$('.fv90-xp-track'),fill=$('#fv90Fill');
 const v=state['.fv90-xp-track']||{};
 if(bar){
  if(Number.isFinite(Number(v.barWidth))&&v.barWidth!==undefined&&Number(v.barWidth)>=20&&Number(v.barWidth)<=95)bar.style.setProperty('width',Number(v.barWidth)+'%','important');
  else bar.style.removeProperty('width');
  if(Number.isFinite(Number(v.barHeight))&&v.barHeight!==undefined&&Number(v.barHeight)>=15&&Number(v.barHeight)<=90)bar.style.setProperty('height',Number(v.barHeight)+'%','important');
  else bar.style.removeProperty('height');
  if(typeof v.trackColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.trackColor))bar.style.setProperty('background',v.trackColor,'important');
  else bar.style.removeProperty('background');
 }
 if(fill){
  if(typeof v.fillColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(v.fillColor))fill.style.setProperty('background',v.fillColor,'important');
  else fill.style.removeProperty('background');
 }
}
function init(){
 const launch=add('button',document.body,'🎮 Game Maker');launch.id='gm106-launch';
 const panel=add('section',document.body);panel.id='gm106-panel';panel.hidden=true;
 const head=add('div',panel);head.className='head';add('strong',head,'🎮 Game Maker · Checkpoint 17.1');
 const compact=add('button',head,'—');compact.title='Ελαχιστοποίηση';
 const shrink=add('button',head,'−');shrink.title='Μίκρυνση παραθύρου';
 const grow=add('button',head,'+');grow.title='Μεγέθυνση παραθύρου';
 const close=add('button',head,'✕');close.onclick=()=>panel.hidden=true;
 let panelWidth= Math.min(420,window.innerWidth-16);
 const setWidth=w=>{panelWidth=Math.max(240,Math.min(window.innerWidth-16,w));panel.style.width=panelWidth+'px';};
 shrink.onclick=()=>setWidth(panelWidth-40);grow.onclick=()=>setWidth(panelWidth+40);
 compact.onclick=()=>{panel.hidden=true;launch.textContent='🎮 Άνοιγμα Game Maker';};
 let dragWindow=null;
 head.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=panel.getBoundingClientRect();dragWindow={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top};head.setPointerCapture(e.pointerId);});
 head.addEventListener('pointermove',e=>{if(!dragWindow||dragWindow.id!==e.pointerId)return;panel.style.left=Math.max(0,Math.min(innerWidth-70,dragWindow.left+e.clientX-dragWindow.x))+'px';panel.style.top=Math.max(0,Math.min(innerHeight-70,dragWindow.top+e.clientY-dragWindow.y))+'px';});
 head.addEventListener('pointerup',()=>dragWindow=null);head.addEventListener('pointercancel',()=>dragWindow=null);
 const tabs=add('div',panel);tabs.className='tabs';
 const edit=add('section',panel),pick=add('select',edit);

 // Creator-only Coins image inspector. It operates only on V106 layout overrides.
 // The approved HUD CSS and gameplay rendering are NOT changed.
 const coinsCard=add('section',edit);coinsCard.id='gm106-coins-asset-card';
 coinsCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 const coinsTitle=add('strong',coinsCard,'🪙 Coins — πραγματική εικόνα HUD');coinsTitle.style.display='block';
 const coinsPath=add('p',coinsCard);coinsPath.style.cssText='font-size:12px;overflow-wrap:anywhere;margin:6px 0';
 const coinsPreview=add('img',coinsCard);coinsPreview.alt='Προεπισκόπηση πραγματικής εικόνας Coins';
 coinsPreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:210px;height:64px;background:#e4d3b1;border-radius:7px;margin:6px auto';
 const coinsSource=add('p',coinsCard);coinsSource.style.cssText='font-size:11px;margin:5px 0';
 const coinsLabel=add('label',coinsCard,'📁 Αντικατάσταση PNG από Αρχεία iPhone');
 coinsLabel.style.cssText='font-size:13px;display:block';
 const coinsFile=add('input',coinsLabel);coinsFile.id='gm106-coins-file';coinsFile.type='file';coinsFile.accept='image/png,.png';
 const coinsRestore=add('button',coinsCard,'↺ Επαναφορά αρχικής εικόνας Coins');coinsRestore.type='button';
 coinsRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const coinsMsg=add('p',coinsCard);coinsMsg.style.cssText='font-size:12px;margin:5px 0';
 const COIN_SEL='.fv90-coin';
 const ORIGINAL_COIN_PATH='assets/ui/aec31849fb851e98.png';
 function cssCoinUrl(){
  // Read the source of the actual approved HUD rather than a legacy sprite.
  const raw=getComputedStyle(document.documentElement).getPropertyValue('--fv90-coins').trim();
  const match=/^url\(\s*([\s\S]*?)\s*\)$/.exec(raw);
  if(!match)return '';
  const v=match[1].trim();
  return (v[0]==='"'||v[0]==="'")?v.slice(1,-1):v;
 }
 function refreshCoins(){
  coinsCard.style.display=(section==='HUD'&&pick.value===COIN_SEL)?'block':'none';
  if(coinsCard.style.display==='none')return;
  const el=$(COIN_SEL),override=state[COIN_SEL]?.image,src=override||cssCoinUrl();
  coinsPreview.hidden=!src;
  if(src)coinsPreview.src=src;
  else coinsPreview.removeAttribute('src');
  coinsPath.textContent='Στοιχείο: #fv90-nostalgia-hud .fv90-coin';
  coinsSource.textContent=override?'Εικόνα: δικό σου PNG (αποθηκευμένο στον Game Maker)':'Αρχική πηγή: '+ORIGINAL_COIN_PATH+' (ενσωματωμένο στο HTML)';
  coinsRestore.disabled=!override;
 }
 coinsFile.onchange=async()=>{
  const f=coinsFile.files?.[0];if(!f)return;
  try{
   if(!$(COIN_SEL))throw Error('Δεν βρέθηκε το πραγματικό Coins HUD');
   if(!(f.type==='image/png'||f.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε αρχείο PNG');
   if(f.size>2000000)throw Error('Το PNG πρέπει να είναι έως 2 MB για ασφαλή αποθήκευση στο iPhone');
   const image=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(f)});
   const checked=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Μη έγκυρη εικόνα PNG'));i.src=image});
   if(!checked.naturalWidth||!checked.naturalHeight)throw Error('Το PNG είναι κενό');
   const previous=JSON.stringify(state);
   checkpoint();state[COIN_SEL]??={};state[COIN_SEL].image=image;
   if(!store()){
    state=JSON.parse(previous);render();sync();throw Error('Η αποθήκευση στο iPhone απέτυχε. Δοκίμασε μικρότερο PNG');
   }
   render();sync();coinsMsg.textContent='✓ Εφαρμόστηκε στο πραγματικό HUD και αποθηκεύτηκε';
   msg.textContent='✓ Νέο PNG Coins — μόνο εμφάνιση';
  }catch(err){coinsMsg.textContent='⚠ '+err.message;}
  finally{coinsFile.value='';refreshCoins();}
 };
 coinsRestore.onclick=()=>{
  if(!state[COIN_SEL]?.image)return;
  checkpoint();delete state[COIN_SEL].image;
  render();if(!store()){coinsMsg.textContent='⚠ Αποτυχία αποθήκευσης';return}
  sync();coinsMsg.textContent='✓ Επαναφέρθηκε η αρχική εικόνα Coins';
 };

 // Creator-only logo asset inspector (same existing Game Maker window).
 // The game's logo remains an approved CSS image until the creator selects a new PNG.
 const logoCard=add('section',edit);logoCard.id='gm106-logo-asset-card';
 logoCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 const logoTitle=add('strong',logoCard,'🍅 Only Crops Logo — πραγματική εικόνα HUD');logoTitle.style.display='block';
 const logoPath=add('p',logoCard);logoPath.style.cssText='font-size:12px;overflow-wrap:anywhere;margin:6px 0';
 const logoPreview=add('img',logoCard);logoPreview.alt='Προεπισκόπηση εγκεκριμένου λογότυπου';
 logoPreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:220px;height:108px;background:#e4d3b1;border-radius:7px;margin:6px auto';
 const logoSource=add('p',logoCard);logoSource.style.cssText='font-size:11px;margin:5px 0;overflow-wrap:anywhere';
 const logoLabel=add('label',logoCard,'📁 Αντικατάσταση λογότυπου PNG από iPhone');
 logoLabel.style.cssText='font-size:13px;display:block';
 const logoFile=add('input',logoLabel);logoFile.type='file';logoFile.accept='image/png,.png';logoFile.id='gm106-logo-file';
 const logoRestore=add('button',logoCard,'↺ Επαναφορά αρχικού λογότυπου');logoRestore.type='button';
 logoRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const logoMsg=add('p',logoCard);logoMsg.style.cssText='font-size:12px;margin:5px 0';logoMsg.setAttribute('aria-live','polite');
 const LOGO_SEL='.fv90-logo';
 function cssLogoUrl(){
  const raw=getComputedStyle(document.documentElement).getPropertyValue('--fv90-logo').trim();
  const match=/^url\(\s*([\s\S]*?)\s*\)$/.exec(raw);
  if(!match)return '';
  const v=match[1].trim();return(v[0]==='"'||v[0]==="'")?v.slice(1,-1):v;
 }
 function refreshLogo(){
  logoCard.style.display=(section==='HUD'&&pick.value===LOGO_SEL)?'block':'none';
  if(logoCard.style.display==='none')return;
  const e=$(LOGO_SEL),override=state[LOGO_SEL]?.image,src=override||cssLogoUrl();
  logoPath.textContent=e?'Στοιχείο: #fv90-nostalgia-hud .fv90-logo':'⚠ Το πραγματικό λογότυπο δεν βρέθηκε';
  logoPreview.hidden=!src;if(src)logoPreview.src=src;else logoPreview.removeAttribute('src');
  logoSource.textContent=override?'Πηγή: PNG που επέλεξες, αποθηκευμένο στον Game Maker':'Πηγή: Only Crops (εγκεκριμένο PNG ενσωματωμένο στο HTML)';
  logoRestore.disabled=!override;
 }
 logoFile.onchange=async()=>{
  const f=logoFile.files?.[0];if(!f)return;
  try{
   if(!$(LOGO_SEL))throw Error('Δεν βρέθηκε το πραγματικό λογότυπο HUD');
   if(!(f.type==='image/png'||f.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε αρχείο PNG');
   if(f.size>2000000)throw Error('Το PNG πρέπει να είναι έως 2 MB για ασφαλή αποθήκευση στο iPhone');
   const img=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(f)});
   const checked=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Το PNG δεν είναι έγκυρο'));i.src=img});
   if(!checked.naturalWidth||!checked.naturalHeight)throw Error('Το PNG είναι κενό');
   const prev=JSON.stringify(state);
   checkpoint();state[LOGO_SEL]??={};state[LOGO_SEL].image=img;
   if(!store()){state=JSON.parse(prev);render();sync();throw Error('Αποθήκευση απέτυχε. Δοκίμασε μικρότερο PNG');}
   render();sync();logoMsg.textContent='✓ Το λογότυπο αντικαταστάθηκε και αποθηκεύτηκε';
   msg.textContent='✓ Νέο λογότυπο — μόνο εμφάνιση';
  }catch(err){logoMsg.textContent='⚠ '+err.message;}
  finally{logoFile.value='';refreshLogo();}
 };
 logoRestore.onclick=()=>{
  if(!state[LOGO_SEL]?.image)return;
  const prev=JSON.stringify(state);checkpoint();delete state[LOGO_SEL].image;
  if(!store()){state=JSON.parse(prev);render();sync();logoMsg.textContent='⚠ Αποτυχία αποθήκευσης';return;}
  render();sync();logoMsg.textContent='✓ Επαναφέρθηκε το αρχικό λογότυπο';
 };

 // Farm-name sign visual editing. Player-owned farm name is read-only here.
 // Never mutate #fv90Name.textContent, game state or the player-save storage key.
 const nameCard=add('section',edit);nameCard.id='gm106-nameplate-asset-card';
 nameCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 const nameTitle=add('strong',nameCard,'🏡 Πινακίδα φάρμας — πραγματικό HUD');nameTitle.style.display='block';
 const nameTarget=add('p',nameCard);nameTarget.style.cssText='font-size:12px;overflow-wrap:anywhere;margin:6px 0';
 const namePreview=add('img',nameCard);namePreview.alt='Προεπισκόπηση πινακίδας φάρμας';
 namePreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:240px;height:90px;background:#e4d3b1;border-radius:7px;margin:6px auto';
 const nameSource=add('p',nameCard);nameSource.style.cssText='font-size:11px;overflow-wrap:anywhere;margin:5px 0';
 const liveName=add('p',nameCard);liveName.style.cssText='font-size:13px;font-weight:700;margin:8px 0;color:#57351e;overflow-wrap:anywhere';
 const nameInfo=add('p',nameCard,'Το όνομα προέρχεται από το πραγματικό save της φάρμας. Το PNG αλλάζει μόνο τη διακόσμηση της πινακίδας.');
 nameInfo.style.cssText='font-size:11px;line-height:1.4;margin:4px 0 8px';
 const nameLabel=add('label',nameCard,'📁 Αντικατάσταση πινακίδας με PNG από iPhone');
 nameLabel.style.cssText='font-size:13px;display:block';
 const nameFile=add('input',nameLabel);nameFile.id='gm106-nameplate-file';nameFile.type='file';nameFile.accept='image/png,.png';
 const nameRestore=add('button',nameCard,'↺ Επαναφορά αρχικής πινακίδας');nameRestore.type='button';
 nameRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const goNameText=add('button',nameCard,'✏ Ρυθμίσεις εμφάνισης πραγματικού ονόματος');goNameText.type='button';
 goNameText.style.cssText='display:block;width:100%;margin:7px 0';
 const nameMsg=add('p',nameCard);nameMsg.style.cssText='font-size:12px;margin:5px 0';nameMsg.setAttribute('aria-live','polite');
 const NAME_SEL='.fv90-name';
 function cssNameUrl(){
  const raw=getComputedStyle(document.documentElement).getPropertyValue('--fv90-name').trim();
  const match=/^url\(\s*([\s\S]*?)\s*\)$/.exec(raw);
  if(!match)return '';
  const v=match[1].trim();return(v[0]==='"'||v[0]==="'")?v.slice(1,-1):v;
 }
 function refreshName(){
  nameCard.style.display=(section==='HUD'&&pick.value===NAME_SEL)?'block':'none';
  if(nameCard.style.display==='none')return;
  const e=$(NAME_SEL),override=state[NAME_SEL]?.image,src=override||cssNameUrl();
  nameTarget.textContent=e?'Στοιχείο: #fv90-nostalgia-hud .fv90-name':'⚠ Δεν βρέθηκε η πραγματική πινακίδα';
  namePreview.hidden=!src;if(src)namePreview.src=src;else namePreview.removeAttribute('src');
  nameSource.textContent=override?'Πηγή: προσωπικό PNG αποθηκευμένο στον Game Maker':'Πηγή: CSS --fv90-name (αρχική ενσωματωμένη εικόνα)';
  liveName.textContent='Ζωντανό όνομα φάρμας: '+($('#fv90Name')?.textContent.trim()||'—');
  nameRestore.disabled=!override;
 }
 nameFile.onchange=async()=>{
  const f=nameFile.files?.[0];if(!f)return;
  try{
   if(!$(NAME_SEL))throw Error('Δεν βρέθηκε η πραγματική πινακίδα HUD');
   if(!(f.type==='image/png'||f.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε αρχείο PNG');
   if(f.size>2000000)throw Error('Το PNG πρέπει να είναι έως 2 MB για ασφαλή αποθήκευση στο iPhone');
   const img=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(f)});
   const decoded=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Το PNG δεν είναι έγκυρο'));i.src=img});
   if(!decoded.naturalWidth||!decoded.naturalHeight)throw Error('Το PNG είναι κενό');
   const prev=JSON.stringify(state);
   checkpoint();state[NAME_SEL]??={};state[NAME_SEL].image=img;
   if(!store()){state=JSON.parse(prev);render();sync();throw Error('Αποθήκευση απέτυχε. Δοκίμασε μικρότερο PNG');}
   render();sync();nameMsg.textContent='✓ Η πινακίδα άλλαξε και αποθηκεύτηκε — το όνομα διατηρήθηκε';
   msg.textContent='✓ Νέα πινακίδα — χωρίς αλλαγή ονόματος φάρμας';
  }catch(err){nameMsg.textContent='⚠ '+err.message;}
  finally{nameFile.value='';refreshName();}
 };
 nameRestore.onclick=()=>{
  if(!state[NAME_SEL]?.image)return;
  const prev=JSON.stringify(state);checkpoint();delete state[NAME_SEL].image;
  if(!store()){state=JSON.parse(prev);render();sync();nameMsg.textContent='⚠ Αποτυχία αποθήκευσης';return;}
  render();sync();nameMsg.textContent='✓ Επαναφέρθηκε η αρχική πινακίδα';
 };
 goNameText.onclick=()=>{pick.value='#fv90Name';sync();};


 // UI tab: inspector of the *existing* classic toolbar and its six real buttons.
 // No additional toolbar or gameplay button is created.
 const tbCard=add('section',edit);tbCard.id='gm106-toolbar-asset-card';
 tbCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 add('strong',tbCard,'🧰 Πραγματική εργαλειοθήκη — PNG editor').style.display='block';
 const tbTarget=add('p',tbCard);tbTarget.style.cssText='font-size:12px;overflow-wrap:anywhere;margin:6px 0';
 const tbSource=add('p',tbCard);tbSource.style.cssText='font-size:11px;line-height:1.4;overflow-wrap:anywhere;margin:5px 0';
 const tbPreview=add('img',tbCard);tbPreview.alt='Προεπισκόπηση επιλεγμένου στοιχείου εργαλειοθήκης';
 tbPreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:220px;height:105px;background:#e4d3b1;border-radius:7px;margin:6px auto';
 const tbNoPreview=add('p',tbCard,'Το αρχικό φόντο είναι σχεδιασμένο με CSS, όχι με ξεχωριστό PNG.');
 tbNoPreview.style.cssText='font-size:11px;line-height:1.35;margin:6px 0';
 const tbNormalLabel=add('label',tbCard,'📁 Αντικατάσταση κανονικής εικόνας PNG');
 tbNormalLabel.style.cssText='font-size:13px;display:block;margin-top:7px';
 const tbNormalFile=add('input',tbNormalLabel);tbNormalFile.id='gm106-toolbar-normal-file';tbNormalFile.type='file';tbNormalFile.accept='image/png,.png';
 const tbNormalRestore=add('button',tbCard,'↺ Επαναφορά αρχικής κανονικής εικόνας');
 tbNormalRestore.type='button';tbNormalRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const tbActiveGroup=add('section',tbCard);tbActiveGroup.id='gm106-toolbar-active-group';
 tbActiveGroup.style.cssText='border-top:1px solid #d7b98c;padding-top:7px;margin-top:9px';
 add('strong',tbActiveGroup,'Εικόνα όταν το κουμπί είναι ενεργό');
 const tbActiveSource=add('p',tbActiveGroup);tbActiveSource.style.cssText='font-size:11px;overflow-wrap:anywhere;margin:4px 0';
 const tbActivePreview=add('img',tbActiveGroup);tbActivePreview.alt='Προεπισκόπηση ενεργού κουμπιού';
 tbActivePreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:150px;height:70px;background:#e4d3b1;border-radius:7px;margin:4px auto';
 const tbActiveLabel=add('label',tbActiveGroup,'📁 PNG για ενεργό κουμπί');
 tbActiveLabel.style.cssText='font-size:13px;display:block;margin-top:6px';
 const tbActiveFile=add('input',tbActiveLabel);tbActiveFile.id='gm106-toolbar-active-file';tbActiveFile.type='file';tbActiveFile.accept='image/png,.png';
 const tbActiveRestore=add('button',tbActiveGroup,'↺ Επαναφορά εικόνας ενεργού κουμπιού');
 tbActiveRestore.type='button';tbActiveRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const tbMessage=add('p',tbCard);tbMessage.style.cssText='font-size:12px;margin:5px 0';tbMessage.setAttribute('aria-live','polite');
 const tbNote=add('p',tbCard,'Επεξεργάζεσαι μόνο τα γραφικά. Οι ενέργειες Select, Plow, Market και Ρυθμίσεις παραμένουν ίδιες. Το αρχικό ⚙ είναι κουμπί CSS, όχι ξεχωριστό PNG. Οι δικές σου εικόνες αποθηκεύονται τοπικά στον browser, όχι μέσα στο αρχείο HTML.');
 tbNote.style.cssText='font-size:11px;line-height:1.4;margin:7px 0 0';
 // Source filenames are catalog metadata, not links in this standalone HTML.
 const tbOriginalFiles={"#fvMulti": {"normal": "assets/ui/3a3d3dc276455759.png", "active": "assets/ui/c02605b6bfc2a43e.png"}, "#fvPlow": {"normal": "assets/ui/b5dc5bd136152e60.png", "active": "assets/ui/7a9b513d34c82ede.png"}, "#fvRecycle": {}, "#fv39Ribbons": {"normal": "assets/ui/477c36e0f71333a7.png", "active": "assets/ui/a042c55ed45b28e8.png"}, "#fvMarket": {"normal": "assets/ui/ffa709a4458d3b98.png", "active": "assets/ui/b35aa1faa177d95b.png"}, "#fvGifts": {"normal": "assets/ui/e396e3ba37c9a220.png", "active": "assets/ui/b201db41e24a85a3.png"}, "#fv42-settings-button": {}};
 function safeBackgroundUrl(value){
  const match=/^url\(["']?([\s\S]*?)["']?\)$/.exec(value.trim());
  return match?match[1]:'';
 }
 function refreshToolbar(){
  const sel=pick.value,enabled=section==='UI'&&GM_TOOLBAR_TARGETS.includes(sel);
  tbCard.style.display=enabled?'block':'none';if(!enabled)return;
  const e=$(sel),v=state[sel]||{},sources=tbOriginalFiles[sel]||{};
  tbTarget.textContent=e?'Πραγματικό στοιχείο: '+sel:'⚠ Δεν βρέθηκε το στοιχείο '+sel;
  let native='';
  if(e)native=safeBackgroundUrl(getComputedStyle(e).backgroundImage);
  const normal=v.image||native;
  tbPreview.hidden=!normal;tbNoPreview.hidden=!!normal;
  if(normal)tbPreview.src=normal;else tbPreview.removeAttribute('src');
  tbSource.textContent=v.image?'Κανονική εικόνα: δικό σου PNG, αποθηκευμένο στον Game Maker':sources.normal?'Αρχικό αρχείο οργανωμένου project: '+sources.normal+' (ενσωματωμένο στο HTML)':'Αρχικό φόντο: CSS / χωρίς εντοπισμένο ξεχωριστό PNG';
  tbNormalRestore.disabled=!v.image;
  tbActiveGroup.hidden=sel==='.classic-tools';
  if(sel!=='.classic-tools'){
   tbActiveSource.textContent=v.activeImage?'Ενεργή εικόνα: δικό σου PNG':sources.active?'Αρχικό ενεργό PNG: '+sources.active:'Ενεργή εικόνα: προέρχεται από τις υπάρχουσες CSS καταστάσεις';
   tbActivePreview.hidden=!v.activeImage;
   if(v.activeImage)tbActivePreview.src=v.activeImage;else tbActivePreview.removeAttribute('src');
   tbActiveRestore.disabled=!v.activeImage;
  }
 }
 async function loadToolbarPNG(file,slot){
  const sel=pick.value;
  try{
   if(section!=='UI'||!GM_TOOLBAR_TARGETS.includes(sel)||!$(sel))throw Error('Επίλεξε πραγματικό στοιχείο της εργαλειοθήκης');
   if(!file||!(file.type==='image/png'||file.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε PNG');
   if(file.size>2000000)throw Error('Το PNG πρέπει να είναι έως 2 MB για αποθήκευση στο iPhone');
   const img=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Δεν διαβάστηκε το αρχείο'));r.readAsDataURL(file)});
   const decoded=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Το αρχείο δεν είναι έγκυρη εικόνα'));i.src=img});
   if(!decoded.naturalWidth||!decoded.naturalHeight)throw Error('Το PNG είναι κενό');
   const previous=JSON.stringify(state);checkpoint();state[sel]??={};state[sel][slot]=img;
   if(!store()){state=JSON.parse(previous);render();sync();throw Error('Δεν χωρά στην τοπική αποθήκευση. Δοκίμασε μικρότερο PNG');}
   render();sync();tbMessage.textContent='✓ Η εικόνα άλλαξε στο πραγματικό στοιχείο και αποθηκεύτηκε';
   msg.textContent='✓ Αλλαγή εικόνας UI — χωρίς αλλαγή μηχανισμού';
  }catch(error){tbMessage.textContent='⚠ '+error.message;}
  finally{refreshToolbar()}
 }
 tbNormalFile.onchange=async()=>{const f=tbNormalFile.files?.[0];if(f)await loadToolbarPNG(f,'image');tbNormalFile.value=''};
 tbActiveFile.onchange=async()=>{const f=tbActiveFile.files?.[0];if(f)await loadToolbarPNG(f,'activeImage');tbActiveFile.value=''};
 function restoreToolbarSlot(slot){
  const sel=pick.value;if(!GM_TOOLBAR_TARGETS.includes(sel)||!state[sel]?.[slot])return;
  const previous=JSON.stringify(state);checkpoint();delete state[sel][slot];
  if(!store()){state=JSON.parse(previous);tbMessage.textContent='⚠ Αποτυχία αποθήκευσης';return;}
  render();sync();tbMessage.textContent='✓ Επαναφέρθηκε η αρχική εικόνα';
 }
 tbNormalRestore.onclick=()=>restoreToolbarSlot('image');
 tbActiveRestore.onclick=()=>restoreToolbarSlot('activeImage');
 // Observe only active-state changes, never capture or replace the gameplay's event handlers.
 for(const sel of GM_TOOLBAR_TARGETS){
  if(sel==='.classic-tools')continue;
  const e=$(sel);if(!e)continue;
  new MutationObserver(()=>applyToolbarSkins()).observe(e,{attributes:true,attributeFilter:['class','aria-expanded']});
  e.addEventListener('pointerdown',()=>{e.dataset.gm106Pressed='1';applyToolbarSkins()},{passive:true});
  const released=()=>{delete e.dataset.gm106Pressed;applyToolbarSkins()};
  e.addEventListener('pointerup',released,{passive:true});
  e.addEventListener('pointercancel',released,{passive:true});
  e.addEventListener('pointerleave',released,{passive:true});
 }


 // Checkpoint 09: image editing for the EXISTING runtime-created submenu buttons.
 // The Select/Plow menu remains owned by the existing game code. We set ONLY CSS skins.
 const smCard=add('section',edit);smCard.id='gm106-submenu-assets-card';
 smCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 add('strong',smCard,'🧩 Υπομενού Select / Plow — γραφικά').style.display='block';
 const smText=add('p',smCard,'Διάλεξε την εικόνα φόντου ή το πραγματικό κουμπί του υπομενού. Δεν αλλάζουν οι εντολές των εργαλείων.');
 smText.style.cssText='font-size:12px;line-height:1.4;margin:7px 0';
 const smPick=add('select',smCard);smPick.id='gm106-submenu-target';smPick.style.cssText='display:block;width:100%;min-height:38px';
 const smOptions=[
  ['select-bg','Φόντο υπομενού Select',null],
  ['select-select','Select — κουμπί','select_select'],
  ['select-move','Move — κουμπί','select_move'],
  ['select-seeder','Seeder — κουμπί (Σύντομα)','plow_seeder'],
  ['select-harvester','Harvester — κουμπί (Σύντομα)','plow_harvester'],
  ['plow-bg','Φόντο υπομενού Plow',null],
  ['plow-plow','Plow — κουμπί','plow_plow'],
  ['plow-tractor','Tractor — κουμπί (Σύντομα)','plow_tractor']
 ];
 for(const [key,label] of smOptions){const option=add('option',smPick,label);option.value=key}
 const smSource=add('p',smCard);smSource.style.cssText='font-size:11px;overflow-wrap:anywhere;margin:6px 0';
 const smPreview=add('img',smCard);smPreview.alt='Προεπισκόπηση κουμπιού υπομενού';
 smPreview.style.cssText='display:block;object-fit:contain;max-width:100%;width:220px;height:95px;background:#e4d3b1;border-radius:7px;margin:7px auto';
 const smNormalLabel=add('label',smCard,'📁 Νέο PNG για το επιλεγμένο στοιχείο');
 smNormalLabel.style.cssText='font-size:13px;display:block';
 const smNormalFile=add('input',smNormalLabel);smNormalFile.type='file';smNormalFile.accept='image/png,.png';smNormalFile.id='gm106-submenu-normal-file';
 const smNormalRestore=add('button',smCard,'↺ Επαναφορά αρχικού γραφικού');smNormalRestore.type='button';
 smNormalRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const smPressedGroup=add('section',smCard);smPressedGroup.style.cssText='margin:8px 0;padding-top:7px;border-top:1px solid #d7b98c';
 const smPressedLabel=add('label',smPressedGroup,'📁 PNG όταν το κουμπί πατιέται (προαιρετικό)');
 smPressedLabel.style.cssText='font-size:13px;display:block';
 const smPressedFile=add('input',smPressedLabel);smPressedFile.type='file';smPressedFile.accept='image/png,.png';smPressedFile.id='gm106-submenu-pressed-file';
 const smPressedRestore=add('button',smPressedGroup,'↺ Επαναφορά εικόνας πατήματος');smPressedRestore.type='button';
 smPressedRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const smMsg=add('p',smCard);smMsg.style.cssText='font-size:12px;margin:5px 0';smMsg.setAttribute('aria-live','polite');
 add('p',smCard,'Η νέα εικόνα θα φανεί όταν ανοίξεις το αντίστοιχο μενού μέσα στη φάρμα. Τα κουμπιά «Σύντομα» παραμένουν ανενεργά.').style.cssText='font-size:11px;line-height:1.4;margin:8px 0';
 function smCurrent(){const x=state['#fv38Submenu']?.subImages;return x?.[smPick.value]||{}}
 function refreshSubmenu(){
  smCard.style.display=section==='UI'&&pick.value==='#fv38Submenu'?'block':'none';
  if(smCard.style.display==='none')return;
  const key=smPick.value,item=smCurrent(),entry=smOptions.find(x=>x[0]===key);
  const reference=entry?.[2]?window.FV77_SUBMENU_ASSETS?.[entry[2]]:'';
  const src=item.normal||reference||'';
  smPreview.hidden=!src;
  if(src)smPreview.src=src;else smPreview.removeAttribute('src');
  smSource.textContent=item.normal?'Πηγή: προσωπικό PNG αποθηκευμένο στον Game Maker':reference?('Διαθέσιμο αρχικό sprite αναφοράς: '+entry[2]+'. Η εικόνα της φάρμας μπορεί να έχει επιπλέον CSS καταστάσεις.'):'Αρχικό φόντο: CSS της φάρμας (δεν υπάρχει ανεξάρτητο αρχείο εδώ)';
  smNormalRestore.disabled=!item.normal;
  smPressedRestore.disabled=!item.pressed;
  smPressedGroup.hidden=key.endsWith('-bg');
 }
 smPick.addEventListener('change',refreshSubmenu);
 async function smLoadPNG(file,slot){
  const key=smPick.value;
  try{
   if(!file||!(file.type==='image/png'||file.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε PNG');
   if(file.size>2000000)throw Error('PNG έως 2 MB για ασφαλή αποθήκευση στο iPhone');
   const img=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(file)});
   const valid=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i.naturalWidth>0&&i.naturalHeight>0);i.onerror=()=>rej(Error('Μη έγκυρο PNG'));i.src=img});
   if(!valid||!/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(img))throw Error('Μη έγκυρο PNG');
   const previous=JSON.stringify(state);checkpoint();state['#fv38Submenu']??={};state['#fv38Submenu'].subImages??={};state['#fv38Submenu'].subImages[key]??={};state['#fv38Submenu'].subImages[key][slot]=img;
   if(!store()){state=JSON.parse(previous);render();sync();throw Error('Δεν αποθηκεύτηκε. Δοκίμασε μικρότερο PNG')}
   render();sync();smMsg.textContent='✓ Αποθηκεύτηκε η εικόνα του υπομενού (μόνο εμφάνιση)';
  }catch(err){smMsg.textContent='⚠ '+err.message}
  finally{refreshSubmenu()}
 }
 smNormalFile.addEventListener('change',async()=>{const f=smNormalFile.files?.[0];if(f)await smLoadPNG(f,'normal');smNormalFile.value=''});
 smPressedFile.addEventListener('change',async()=>{const f=smPressedFile.files?.[0];if(f)await smLoadPNG(f,'pressed');smPressedFile.value=''});
 function smRestore(slot){
  const key=smPick.value,item=smCurrent();if(!item[slot])return;
  const previous=JSON.stringify(state);checkpoint();delete item[slot];
  if(!store()){state=JSON.parse(previous);smMsg.textContent='⚠ Αποτυχία αποθήκευσης';return}
  render();sync();smMsg.textContent='✓ Επαναφέρθηκε μόνο η επιλεγμένη εικόνα';
 }
 smNormalRestore.onclick=()=>smRestore('normal');
 smPressedRestore.onclick=()=>smRestore('pressed');

 const note=add('p',edit);note.className='note';
 const realCard=add('section',edit);realCard.id='gm106-real-target-card';
 realCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 const realTitle=add('strong',realCard,'👁 Πραγματικό στοιχείο στη φάρμα');realTitle.style.display='block';
 const realStatus=add('p',realCard);realStatus.style.cssText='font-size:12px;overflow-wrap:anywhere;line-height:1.4;margin:6px 0';
 const realPreviewWrap=add('div',realCard);realPreviewWrap.style.cssText='background:#e4d3b1;border-radius:8px;padding:12px;overflow:auto';
 const realPreview=add('div',realPreviewWrap);realPreview.style.cssText='display:flex;align-items:center;justify-content:center;min-height:72px';
 const realHint=add('p',realCard,'Το preview είναι αντίγραφο του πραγματικού στοιχείου που χρησιμοποιεί τώρα η φάρμα.');
 realHint.style.cssText='font-size:11px;line-height:1.4;margin:7px 0 0';
 function gm106StripPreviewIds(root){
  if(!root||root.nodeType!==1)return;
  if(root.hasAttribute('id'))root.removeAttribute('id');
  root.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 }
 function gm106BuildLiveClone(node){
  const clone=node.cloneNode(true);
  gm106StripPreviewIds(clone);
  const all=[clone,...clone.querySelectorAll('*')];
  for(const el of all){
   if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.tagName==='SELECT'||el.tagName==='BUTTON')el.disabled=true;
   el.style.pointerEvents='none';
  }
  clone.style.translate='0px 0px';
  clone.style.scale='1';
  clone.style.transform='none';
  clone.style.opacity='1';
  clone.style.left='auto';
  clone.style.top='auto';
  clone.style.right='auto';
  clone.style.bottom='auto';
  clone.style.margin='0 auto';
  clone.style.maxWidth='100%';
  return clone;
 }
 function refreshRealTarget(){
  const supported=section==='HUD'||section==='UI';
  realCard.style.display=supported?'block':'none';
  if(!supported)return;
  const sel=pick.value,target=$(sel),label=pick.selectedOptions?.[0]?.textContent?.trim()||sel;
  realPreview.replaceChildren();
  if(!target){
   realStatus.textContent='⚠ Δεν βρέθηκε το πραγματικό στοιχείο για το '+label+' ('+sel+')';
   realHint.textContent='Δοκίμασε άλλη επιλογή ή χρησιμοποίησε την «Επιλογή πάνω στη φάρμα».';
   return;
  }
  realStatus.textContent='Στοιχείο: '+label+' · Selector: '+sel;
  realPreview.appendChild(gm106BuildLiveClone(target));
  realHint.textContent='Το preview είναι αντίγραφο του πραγματικού στοιχείου που χρησιμοποιεί τώρα η φάρμα.';
 }
 const replaceCard=add('section',edit);replaceCard.id='gm106-generic-replace-card';
 replaceCard.style.cssText='margin:8px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff7e8;display:none';
 const replaceTitle=add('strong',replaceCard,'🖼 Αντικατάσταση PNG για το επιλεγμένο στοιχείο');replaceTitle.style.display='block';
 const replaceInfo=add('p',replaceCard);replaceInfo.style.cssText='font-size:12px;line-height:1.4;margin:6px 0;overflow-wrap:anywhere';
 const replaceSource=add('p',replaceCard);replaceSource.style.cssText='font-size:11px;line-height:1.4;margin:5px 0;overflow-wrap:anywhere';
 const replaceLabel=add('label',replaceCard,'📁 Επίλεξε PNG από τα Αρχεία iPhone');replaceLabel.style.cssText='font-size:13px;display:block';
 const replaceFile=add('input',replaceLabel);replaceFile.type='file';replaceFile.accept='image/png,.png';replaceFile.id='gm106-generic-replace-file';
 const replaceRestore=add('button',replaceCard,'↺ Επαναφορά αρχικής εικόνας του στοιχείου');replaceRestore.type='button';
 replaceRestore.style.cssText='display:block;width:100%;margin:7px 0';
 const replaceMsg=add('p',replaceCard);replaceMsg.style.cssText='font-size:12px;margin:5px 0';replaceMsg.setAttribute('aria-live','polite');
 const replaceHelp=add('p',replaceCard,'Το PNG εφαρμόζεται στο πραγματικό στοιχείο που είναι τώρα επιλεγμένο. Για κουμπιά με ενεργή κατάσταση ή ειδικά HUD στοιχεία, υπάρχουν και πρόσθετα εργαλεία πιο κάτω.');
 replaceHelp.style.cssText='font-size:11px;line-height:1.4;margin:7px 0 0';
 function refreshGenericReplace(){
  const supported=section==='HUD'||section==='UI';
  replaceCard.style.display=supported?'block':'none';
  if(!supported)return;
  const sel=pick.value,target=$(sel),label=pick.selectedOptions?.[0]?.textContent?.trim()||sel,v=state[sel]||{};
  replaceInfo.textContent=target?'Στοιχείο: '+label+' · Selector: '+sel:'⚠ Δεν βρέθηκε το πραγματικό στοιχείο για το '+label+' ('+sel+')';
  let native='';
  if(target)native=safeBackgroundUrl(getComputedStyle(target).backgroundImage||'');
  replaceSource.textContent=v.image?'Τρέχουσα εικόνα: προσωπικό PNG αποθηκευμένο στον Game Maker':native?'Αρχική πηγή: background-image του πραγματικού στοιχείου':'Αρχική πηγή: δεν εντοπίστηκε ξεχωριστό PNG — το στοιχείο ίσως σχεδιάζεται με CSS ή κείμενο.';
  replaceRestore.disabled=!v.image;
 }
 async function applyGenericReplace(file){
  const sel=pick.value,target=$(sel),label=pick.selectedOptions?.[0]?.textContent?.trim()||sel;
  try{
   if(section!=='HUD'&&section!=='UI')throw Error('Η αντικατάσταση δουλεύει μόνο σε HUD ή UI στόχους');
   if(!target)throw Error('Δεν βρέθηκε το πραγματικό στοιχείο για το '+label);
   if(!file||!(file.type==='image/png'||file.name.toLowerCase().endsWith('.png')))throw Error('Επίλεξε αρχείο PNG');
   if(file.size>2000000)throw Error('Το PNG πρέπει να είναι έως 2 MB για ασφαλή αποθήκευση στο iPhone');
   const img=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(file)});
   const valid=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>0&&i.naturalHeight>0);i.onerror=()=>reject(Error('Το PNG δεν είναι έγκυρο'));i.src=img});
   if(!valid||!/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(img))throw Error('Το PNG δεν είναι έγκυρο');
   const previous=JSON.stringify(state);checkpoint();state[sel]??={};state[sel].image=img;
   if(!store()){state=JSON.parse(previous);render();sync();throw Error('Δεν αποθηκεύτηκε. Δοκίμασε μικρότερο PNG');}
   render();sync();replaceMsg.textContent='✓ Το νέο PNG εφαρμόστηκε στο επιλεγμένο στοιχείο';
   msg.textContent='✓ Νέο PNG στο '+label;
  }catch(err){replaceMsg.textContent='⚠ '+err.message;}
  finally{replaceFile.value='';refreshGenericReplace();}
 }
 replaceFile.onchange=async()=>{const f=replaceFile.files?.[0];if(f)await applyGenericReplace(f)};
 replaceRestore.onclick=()=>{
  const sel=pick.value,label=pick.selectedOptions?.[0]?.textContent?.trim()||sel;
  if(!state[sel]?.image)return;
  const previous=JSON.stringify(state);checkpoint();delete state[sel].image;
  if(!store()){state=JSON.parse(previous);replaceMsg.textContent='⚠ Αποτυχία αποθήκευσης';return;}
  render();sync();replaceMsg.textContent='✓ Επαναφέρθηκε η αρχική εικόνα για το '+label;
 };
 const fields=add('div',edit),inputs={};
 const msg=add('p',panel,'Επίλεξε στοιχείο, μετακίνησέ το και αποθήκευσε.');msg.className='note';msg.setAttribute('aria-live','polite');
 const tools=add('section',panel);tools.hidden=true;
 function sync(){const v=state[pick.value]||{};for(const [k,x] of Object.entries(inputs)){const n=v[k]??(k==='scale'||k==='opacity'?100:0);x.range.value=n;x.number.value=n}
 note.textContent=$(pick.value)?'✓ Συνδεδεμένο — οι αλλαγές φαίνονται αμέσως':'⚠ Το στοιχείο δεν βρέθηκε';refreshRealTarget();refreshGenericReplace();refreshCoins();refreshLogo();refreshName();refreshToolbar();refreshSubmenu();syncAppearance();}
 function tab(t,sel){section=t;edit.hidden=t==='Tools';tools.hidden=t!=='Tools';if(t==='Tools')abLoadCatalog();
  tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===t)));
  if(!edit.hidden){pick.replaceChildren();for(const [name,s] of groups[t]){const o=add('option',pick,name);o.value=s}if(sel&&[...pick.options].some(o=>o.value===sel))pick.value=sel;sync()}
 }
 for(const [id,label] of [['HUD','HUD'],['UI','UI'],['Tools','Map / Assets']]){const b=add('button',tabs,label);b.dataset.tab=id;b.onclick=()=>tab(id)}
 pick.onchange=sync;
 function change(k,v,record=false){if(!$(pick.value))return;const previous=JSON.stringify(state);if(record)checkpoint();state[pick.value]??={};state[pick.value][k]=v;if(!store()){state=JSON.parse(previous);render();sync();msg.textContent='⚠ Η αλλαγή δεν αποθηκεύτηκε · επανήλθαν οι προηγούμενες ρυθμίσεις';return}render();sync();msg.textContent='✓ Αποθηκεύτηκε'}
 for(const [k,label,min,max,step] of [['x','Θέση X',-400,400,1],['y','Θέση Y',-400,400,1],['scale','Μέγεθος %',25,250,1],['opacity','Διαφάνεια %',0,100,1]]){
  const l=add('label',fields,label),line=add('div',l);line.className='control';
  const range=add('input',line),number=add('input',line);
  range.type='range';number.type='number';
  for(const i of [range,number]){i.min=min;i.max=max;i.step=step}
  inputs[k]={range,number};
  let begun=false;
  range.onpointerdown=()=>{checkpoint();begun=true};
  range.oninput=()=>{if(!begun){checkpoint();begun=true}change(k,cap(range.value,min,max));};
  range.onchange=()=>begun=false;
  number.onfocus=()=>checkpoint();
  number.onchange=()=>change(k,cap(number.value,min,max));
 }

 // Dynamic values are already updated by the V90 HUD bridge. This is VISUAL EDITING ONLY.
 const looks=add('section',edit);looks.id='gm106-live-stats-editor';
 looks.style.cssText='margin:10px 0;padding:10px;border:1px solid #ad8452;border-radius:10px;background:#fff9e9';
 const looksTitle=add('strong',looks,'🔢 Ζωντανοί αριθμοί και XP Bar');
 looksTitle.style.display='block';looksTitle.style.marginBottom='5px';
 const looksExplain=add('p',looks,'Οι τιμές ενημερώνονται από το παιχνίδι. Εδώ αλλάζεις μόνο την εμφάνιση.');
 looksExplain.style.cssText='font-size:12px;line-height:1.35;margin:4px 0 10px';
 const textLooks=add('div',looks),barLooks=add('div',looks);
 const lookNumber={};const lookColors={};
 function numberField(parent,key,label,min,max,step,unit){
  const labelEl=add('label',parent,label+' ('+unit+')');labelEl.style.cssText='display:block;margin:8px 0;font-size:13px;font-weight:650';
  const row=add('div',labelEl);row.style.cssText='display:flex;align-items:center;gap:8px';
  const slider=add('input',row),number=add('input',row);
  slider.type='range';number.type='number';
  slider.style.cssText='flex:1;min-width:0';number.style.cssText='width:75px;max-width:75px';
  for(const el of [slider,number]){el.min=min;el.max=max;el.step=step;}
  let interacting=false;
  slider.addEventListener('pointerdown',()=>{checkpoint();interacting=true});
  slider.addEventListener('input',()=>{if(!interacting){checkpoint();interacting=true;}setAppearance(key,cap(slider.value,min,max));});
  slider.addEventListener('change',()=>{interacting=false;});
  number.addEventListener('change',()=>{checkpoint();setAppearance(key,cap(number.value,min,max));});
  lookNumber[key]={slider,number,min,max};
 }
 function colorField(parent,key,label){
  const wrap=add('label',parent,label);wrap.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;font-size:13px;font-weight:650';
  const picker=add('input',wrap);picker.type='color';picker.style.cssText='width:75px;height:40px;min-height:40px';
  picker.addEventListener('change',()=>{checkpoint();setAppearance(key,picker.value);});
  lookColors[key]=picker;
 }
 numberField(textLooks,'fontSize','Μέγεθος γραμματοσειράς',8,40,1,'px');
 colorField(textLooks,'textColor','Χρώμα αριθμού / κειμένου');
 numberField(barLooks,'barWidth','Πλάτος μπάρας XP',20,95,1,'%');
 numberField(barLooks,'barHeight','Ύψος μπάρας XP',15,90,1,'%');
 colorField(barLooks,'fillColor','Χρώμα γεμίσματος XP');
 colorField(barLooks,'trackColor','Χρώμα φόντου XP');
 const looksDefault=add('button',looks,'↺ Αρχική εμφάνιση επιλεγμένου στοιχείου');
 looksDefault.type='button';looksDefault.style.cssText='display:block;width:100%;margin-top:10px';
 looksDefault.onclick=()=>{
  const sel=pick.value;if(!$(sel))return;
  checkpoint();state[sel]??={};
  for(const k of ['fontSize','textColor','barWidth','barHeight','fillColor','trackColor'])delete state[sel][k];
  render();store();sync();msg.textContent='✓ Επαναφέρθηκε μόνο η εμφάνιση αυτού του στοιχείου';
 };
 function hexColor(value,fallback){
  if(!value)return fallback;
  const v=String(value).trim();
  if(/^#[0-9a-fA-F]{6}$/.test(v))return v;
  const m=/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(v);
  if(m)return '#'+[m[1],m[2],m[3]].map(x=>Number(x).toString(16).padStart(2,'0')).join('');
  return fallback;
 }
 function setAppearance(key,value){
  if(!$(pick.value))return;
  const before=JSON.stringify(state);
  state[pick.value]??={};state[pick.value][key]=value;
  if(!store()){state=JSON.parse(before);renderAppearance();syncAppearance();msg.textContent='⚠ Δεν αποθηκεύτηκε η εμφάνιση · επανήλθε η προηγούμενη';return}
  renderAppearance();syncAppearance();msg.textContent='✓ Αποθηκεύτηκε η εμφάνιση (χωρίς αλλαγή τιμής ή XP)';
 }
 function syncAppearance(){
  const sel=pick.value;
  const isText=section==='HUD'&&['#fv90Coins','#fv90Cash','#fv90Level','#fv90XpText','#fv90Name'].includes(sel);
  const isBar=section==='HUD'&&sel==='.fv90-xp-track';
  looks.hidden=!(isText||isBar);
  if(looks.hidden)return;
  textLooks.hidden=!isText;barLooks.hidden=!isBar;
  const v=state[sel]||{},e=$(sel);
  if(!e)return;
  const computed=getComputedStyle(e);
  for(const [key,field] of Object.entries(lookNumber)){
   if((isText&&key!=='fontSize')||(isBar&&key==='fontSize'))continue;
   let fallback;
   if(key==='fontSize')fallback=Math.round(parseFloat(computed.fontSize)||14);
   else if(key==='barWidth')fallback=61;
   else fallback=48;
   const n=(v[key]!==undefined&&v[key]!==null)?Number(v[key]):fallback;
   const value=cap(n,field.min,field.max);
   field.slider.value=String(value);field.number.value=String(value);
  }
  if(isText)lookColors.textColor.value=hexColor(v.textColor||computed.color,'#542b10');
  if(isBar){
   lookColors.fillColor.value=hexColor(v.fillColor,'#f3b800');
   lookColors.trackColor.value=hexColor(v.trackColor,'#f7d69d');
  }
 }
 const move=add('div',edit);move.className='move';
 for(const [label,dx,dy] of [['↖',-5,-5],['↑',0,-5],['↗',5,-5],['←',-5,0],['●',0,0],['→',5,0],['↙',-5,5],['↓',0,5],['↘',5,5]]){
  const b=add('button',move,label);b.onclick=()=>{if(!dx&&!dy)return;checkpoint();state[pick.value]??={};state[pick.value].x=cap((state[pick.value].x||0)+dx,-400,400);state[pick.value].y=cap((state[pick.value].y||0)+dy,-400,400);render();store();sync()};
 }
 const actions=add('div',edit);actions.className='actions';
 const btn=(parent,label,fn)=>{const b=add('button',parent,label);b.onclick=fn;return b};
 btn(actions,'↶ Undo',()=>{if(!undo.length)return;redo.push(JSON.stringify(state));state=JSON.parse(undo.pop());render();store();sync()});
 btn(actions,'↷ Redo',()=>{if(!redo.length)return;undo.push(JSON.stringify(state));state=JSON.parse(redo.pop());render();store();sync()});
 btn(actions,'↺ Reset',()=>{checkpoint();delete state[pick.value];render();store();sync()});
 const overlay=add('div',document.body);overlay.id='gm106-pick';overlay.hidden=true;
 const hint=add('div',overlay,'Άγγιξε ένα στοιχείο HUD ή UI για να το επιλέξεις και σύρε το για μετακίνηση.');
 hint.style.cssText='position:absolute;top:12%;left:5%;right:5%;padding:12px;background:#fff2d5;border-radius:12px;color:#382516;font:bold 14px system-ui;pointer-events:none';
 btn(actions,'☝ Επιλογή / σύρσιμο',()=>{panel.hidden=true;overlay.hidden=false;msg.textContent='Άγγιξε ή σύρε το στοιχείο'});
 overlay.onpointerdown=e=>{
  e.preventDefault();overlay.style.pointerEvents='none';const target=document.elementFromPoint(e.clientX,e.clientY);overlay.style.pointerEvents='';
  let best=null;
  for(const [g,entries] of Object.entries(groups))for(const [,sel] of entries){
   const n=$(sel);if(!target||!n||!(n===target||n.contains(target)))continue;
   let depth=0,t=target;while(t&&t!==n){depth++;t=t.parentElement}
   if(!best||depth<best.depth)best={g,sel,depth};
  }
  if(!best){overlay.hidden=true;panel.hidden=false;msg.textContent='⚠ Αυτό το στοιχείο δεν υποστηρίζεται';return}
  tab(best.g,best.sel);checkpoint();
  gesture={id:e.pointerId,sel:best.sel,x:e.clientX,y:e.clientY,ox:state[best.sel]?.x||0,oy:state[best.sel]?.y||0};
  overlay.setPointerCapture(e.pointerId);
 };
 overlay.onpointermove=e=>{if(!gesture||gesture.id!==e.pointerId)return;
  const g=gesture;state[g.sel]??={};state[g.sel].x=cap(g.ox+e.clientX-g.x,-400,400);state[g.sel].y=cap(g.oy+e.clientY-g.y,-400,400);render();
 };
 function finish(){if(!gesture)return;gesture=null;store();overlay.hidden=true;panel.hidden=false;sync();msg.textContent='✓ Η θέση αποθηκεύτηκε'}
 overlay.onpointerup=finish;overlay.onpointercancel=finish;
 add('p',tools,'Χρησιμοποίησε τα πραγματικά εργαλεία της φάρμας. Ο χάρτης δεν αλλάζει grid engine.');
 for(const [label,id] of [['↖ Select / Move','fvMulti'],['🪓 Plow','fvPlow'],['♻ Recycle','fvRecycle'],['🛒 Market','fvMarket']]){
  btn(tools,label,()=>{const b=document.getElementById(id);if(!b){msg.textContent='⚠ Το εργαλείο δεν βρέθηκε';return}panel.hidden=true;b.click()});
 }
 btn(tools,'🌳 Sprite Editor',()=>{const a=$('#assetPanel');if(!a){msg.textContent='⚠ Δεν βρέθηκε Sprite Editor';return}panel.hidden=true;a.style.display='';a.classList.add('open','maker-assets-visible');a.classList.remove('fv83-collapsed')});

 // Checkpoint 14: portable sprite backup / restore extending EXISTING Checkpoint 13.
 // Never mutates a farm object, its footprint, market prices or player save.
 const assetBridge=add('section',tools);assetBridge.id='gm106-real-asset-bridge';
 assetBridge.style.cssText='border:1px solid #ad8452;border-radius:10px;padding:10px;margin:12px 0;background:#fff7e8';
 add('strong',assetBridge,'🗂️ Asset Manager 2.0 · Checkpoint 15');
 const abHelp=add('p',assetBridge,'Φίλτραρε τα πραγματικά αντικείμενα ανά κατηγορία, αναζήτησε με όνομα ή ID και βρες αμέσως ποια έχουν δικό σου PNG. Οι αλλαγές γίνονται στον υπάρχοντα Sprite Engine.');
 abHelp.style.cssText='font-size:12px;line-height:1.4;margin:7px 0';
 // CP15 is a *catalogue view* of assetTarget — never a new asset database.
 const abFilterArea=add('section',assetBridge);abFilterArea.id='gm-cp15-filters';
 abFilterArea.style.cssText='margin:9px 0;padding:9px;border:1px solid #c7b08a;border-radius:10px;background:#f7efe0';
 const abFilterGrid=add('div',abFilterArea);
 abFilterGrid.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px';
 const abCategoryLabel=add('label',abFilterGrid,'Κατηγορία');abCategoryLabel.style.cssText='display:grid;gap:4px;min-width:0;font-size:12px;font-weight:700';
 const abCategory=add('select',abCategoryLabel);abCategory.id='gm-cp15-category';abCategory.style.cssText='width:100%;min-width:0;box-sizing:border-box;padding:8px;font-size:14px';
 for(const [id,label] of [['all','📦 Όλα'],['animals','🐄 Ζώα'],['trees','🌳 Δέντρα'],['buildings','🏠 Κτίρια'],['decor','🎀 Διακοσμητικά'],['vehicles','🚜 Οχήματα'],['crops','🌾 Καλλιέργειες'],['characters','🧑 Χαρακτήρες'],['other','🧩 Άλλα']]){
  const op=add('option',abCategory,label);op.value=id;
 }
 const abStatusLabel=add('label',abFilterGrid,'Εικόνες');abStatusLabel.style.cssText='display:grid;gap:4px;min-width:0;font-size:12px;font-weight:700';
 const abStatus=add('select',abStatusLabel);abStatus.id='gm-cp15-status';abStatus.style.cssText='width:100%;min-width:0;box-sizing:border-box;padding:8px;font-size:14px';
 for(const [id,label] of [['all','Όλες'],['custom','✎ Δικές μου'],['bundled','✓ Ενσωματωμένες'],['canvas','○ Χωρίς PNG']]){
  const op=add('option',abStatus,label);op.value=id;
 }
 const abFavLabel=add('label',abFilterArea);abFavLabel.style.cssText='display:flex;align-items:center;gap:7px;margin-top:9px;font-size:12px;font-weight:600';
 const abOnlyFav=add('input',abFavLabel);abOnlyFav.type='checkbox';abOnlyFav.id='gm-cp15-only-fav';abOnlyFav.style.cssText='width:19px;height:19px;flex:none';
 add('span',abFavLabel,'⭐ Μόνο αγαπημένα');
 const abResultCount=add('div',abFilterArea,'');abResultCount.id='gm-cp15-count';abResultCount.setAttribute('aria-live','polite');
 abResultCount.style.cssText='font-size:12px;line-height:1.4;margin-top:7px;color:#5b452c';
 const abSearch=add('input',assetBridge);abSearch.type='search';abSearch.placeholder='🔎 Αναζήτηση: cow, μηλιά, hay bale…';
 abSearch.setAttribute('aria-label','Αναζήτηση αντικειμένου φάρμας');
 abSearch.style.cssText='display:block;width:100%;max-width:100%;box-sizing:border-box;margin:6px 0;padding:8px';
 const abPick=add('select',assetBridge);abPick.setAttribute('aria-label','Πραγματικό αντικείμενο Sprite Editor');
 abPick.style.cssText='display:block;width:100%;max-width:100%;margin:6px 0;padding:8px';
 // CP15: small, iPhone-friendly pages of items; avoids a 1000-row menu.
 const abFavSelected=add('button',assetBridge,'☆ Προσθήκη στα αγαπημένα');abFavSelected.type='button';
 abFavSelected.id='gm-cp15-fav-selected';abFavSelected.style.cssText='display:block;width:100%;min-height:40px;margin:5px 0 8px;padding:7px';
 const abList=add('div',assetBridge);abList.id='gm-cp15-result-list';
 abList.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:188px;overflow-y:auto;overscroll-behavior:contain;padding:3px;border:1px solid #d6c19d;border-radius:9px;background:#fffaf1';
 const abPageControls=add('div',assetBridge);abPageControls.style.cssText='display:flex;align-items:center;gap:9px;justify-content:space-between;margin:7px 0 10px';
 const abPrevPage=add('button',abPageControls,'◀ Πίσω');abPrevPage.type='button';
 const abPageText=add('span',abPageControls,'1 / 1');abPageText.style.cssText='font-size:12px;font-weight:700';
 const abNextPage=add('button',abPageControls,'Επόμενα ▶');abNextPage.type='button';
 const abEmptyNote=add('p',assetBridge,'Δεν βρέθηκαν αντικείμενα με αυτά τα φίλτρα.');abEmptyNote.hidden=true;
 abEmptyNote.style.cssText='margin:7px 0;font-size:12px';

 const abDetails=add('div',assetBridge);abDetails.style.cssText='font-size:12px;line-height:1.5;overflow-wrap:anywhere;margin:8px 0';
 const abPreview=add('img',assetBridge);abPreview.alt='Εικόνα πραγματικού sprite';
 abPreview.style.cssText='display:none;max-width:100%;width:200px;height:110px;object-fit:contain;margin:8px auto;background:#e7d9bb;border-radius:8px';
 // CP13 preview frame: overlays never affect the actual farm map or grid.
 const abFrame=add('div',assetBridge);abFrame.style.cssText='width:100%;height:126px;max-width:330px;margin:7px auto;overflow:hidden;background:#e7d9bb;border-radius:9px;display:flex;align-items:center;justify-content:center';
 abFrame.appendChild(abPreview); // Reparent the EXISTING CP11/12 preview, not a duplicate sprite.
 abPreview.style.margin='0';abPreview.style.transformOrigin='center center';
 const abActions=add('div',assetBridge);abActions.style.cssText='display:flex;flex-wrap:wrap;gap:8px';
 const abOpen=add('button',abActions,'✎ Άνοιγμα στο Sprite Editor');abOpen.type='button';
 const abRefresh=add('button',abActions,'↻ Ανανέωση');abRefresh.type='button';
 // CP12: direct, visible iPhone file picker on the existing Sprite Engine.
 // Reuses FarmImages.set() for image validation and IndexedDB persistence.
 const abDirect=add('label',assetBridge,'📁 Άμεση αλλαγή PNG / JPG / WebP');
 abDirect.htmlFor='gm-cp12-image-file';
 abDirect.style.cssText='display:block;font-size:13px;font-weight:700;margin:12px 0 3px';
 const abFile=add('input',assetBridge);abFile.id='gm-cp12-image-file';
 abFile.type='file';abFile.accept='.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp';
 abFile.setAttribute('aria-label','Επίλεξε εικόνα για το αντικείμενο της φάρμας');
 abFile.style.cssText='display:block;width:100%;max-width:100%;box-sizing:border-box;font-size:14px;padding:9px 3px;min-height:44px';
 const abHint=add('p',assetBridge,'Η εικόνα μπαίνει απευθείας στο επιλεγμένο αντικείμενο. Μέγιστο 8 MB. Διατηρούνται οι ρυθμίσεις καρέ του υπάρχοντος sprite. Δεν αλλάζουν grid, οικονομία ή gameplay.');
 abHint.style.cssText='font-size:11px;line-height:1.45;margin:3px 0 8px';
 // CP13: size/position control operates exclusively on existing image configuration.
 const abTune=add('section',assetBridge);abTune.id='gm-cp13-tune';
 abTune.style.cssText='background:#fffdf6;border:1px solid #c8ab7a;border-radius:9px;padding:10px;margin:10px 0';
 const abTuneTitle=add('strong',abTune,'📐 Μέγεθος και θέση εικόνας');abTuneTitle.style.display='block';
 const abTuneHelp=add('p',abTune,'Οι αλλαγές αφορούν μόνο την εικόνα, ΟΧΙ το μέγεθος του αντικειμένου στο grid. Η προεπισκόπηση είναι ενδεικτική.');
 abTuneHelp.style.cssText='font-size:11px;line-height:1.35;margin:5px 0 9px';
 function abSlider(title,min,max,step){
  const wrap=add('label',abTune);wrap.style.cssText='display:block;font-size:12px;font-weight:600;margin:9px 0';
  const head=add('div',wrap);head.style.cssText='display:flex;justify-content:space-between;gap:8px';
  add('span',head,title);const result=add('span',head);result.style.fontVariantNumeric='tabular-nums';
  const input=add('input',wrap);input.type='range';input.min=min;input.max=max;input.step=step;
  input.style.cssText='display:block;width:100%;min-height:32px;margin:2px 0';
  return {input,result};
 }
 const abScaleCtl=abSlider('Μέγεθος',0.25,5,0.05);
 const abXctl=abSlider('Οριζόντια θέση (X)',-150,150,1);
 const abYctl=abSlider('Κάθετη θέση (Y)',-150,150,1);
 const abMirrorLabel=add('label',abTune,'↔ Αναστροφή εικόνας');
 abMirrorLabel.style.cssText='display:flex;align-items:center;gap:10px;margin:8px 0;font-size:12px';
 const abMirror=add('input',abMirrorLabel);abMirror.type='checkbox';abMirrorLabel.prepend(abMirror);
 const abTuneActions=add('div',abTune);abTuneActions.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:6px';
 const abApply=add('button',abTuneActions,'✓ Εφαρμογή');abApply.type='button';
 const abReset=add('button',abTuneActions,'↺ Θέση / μέγεθος');abReset.type='button';
 abApply.style.cssText='min-height:42px;font-size:12px';abReset.style.cssText='min-height:42px;font-size:12px';
 const abTuneStatus=add('p',abTune,'');abTuneStatus.style.cssText='font-size:11px;line-height:1.4;margin:7px 0 0';
 const abTuneInputs=[abScaleCtl.input,abXctl.input,abYctl.input,abMirror];
 function abRedrawTune(){
  const sc=Number(abScaleCtl.input.value)||1,x=Number(abXctl.input.value)||0,y=Number(abYctl.input.value)||0;
  abScaleCtl.result.textContent=Math.round(sc*100)+'%';
  abXctl.result.textContent=(x>0?'+':'')+x+' px';
  abYctl.result.textContent=(y>0?'+':'')+y+' px';
  // Thumbnail-only approximation. FarmImages.draw() remains the actual renderer.
  abPreview.style.transform='translate('+Math.round(x*.22)+'px,'+Math.round(y*.22)+'px) scale('+sc+') scaleX('+(abMirror.checked?-1:1)+')';
 }
 function abLoadTune(asset){
  const engine=window.FV83Assets;
  const c=engine?.settings(asset?.conf)||{scale:1,offsetX:0,offsetY:0,flipX:false};
  abScaleCtl.input.value=c.scale;abXctl.input.value=c.offsetX;abYctl.input.value=c.offsetY;abMirror.checked=!!c.flipX;
  // Canvas defaults have no image to reposition; bundled PNGs and custom uploads do.
  const supported=!!(asset?.blob||asset?.inlineSrc?.startsWith('data:image/'));
  for(const input of abTuneInputs)input.disabled=!supported;
  abApply.disabled=abReset.disabled=!supported;
  abTuneStatus.textContent=supported?'Έτοιμο για αλλαγή. Πάτησε Εφαρμογή για τη φάρμα.':'Πρώτα πρόσθεσε εικόνα PNG/JPG/WebP στο αντικείμενο.';
  abRedrawTune();
 }
 for(const input of abTuneInputs)input.addEventListener('input',abRedrawTune);
 function abGetImageBlob(asset){
  if(asset?.blob)return asset.blob;
  const src=asset?.inlineSrc;
  if(typeof src!=='string'||!/^data:image\/(png|jpeg|webp);base64,/i.test(src))throw Error('Πρώτα εισήγαγε PNG/JPG/WebP στο συγκεκριμένο αντικείμενο.');
  const comma=src.indexOf(','),mime=src.slice(5,src.indexOf(';')).toLowerCase();
  const raw=atob(src.slice(comma+1));
  if(!raw.length||raw.length>8*1024*1024)throw Error('Η ενσωματωμένη εικόνα ξεπερνά το όριο των 8 MB.');
  const parts=[];for(let i=0;i<raw.length;i+=32768){const chunk=raw.slice(i,i+32768);const arr=new Uint8Array(chunk.length);for(let j=0;j<chunk.length;j++)arr[j]=chunk.charCodeAt(j);parts.push(arr)}
  return new Blob(parts,{type:mime});
 }
 let abTuneBusy=false;
 async function abApplyTune(reset=false){
  if(abTuneBusy)return;
  const engine=window.FV83Assets,key=abPick.value;
  try{
   if(!engine||!key||!engine.allowed.includes(key))throw Error('Επίλεξε πραγματικό sprite.');
   const original=engine.get(key);if(!original)throw Error('Το αντικείμενο δεν έχει ακόμα εικόνα.');
   const blob=abGetImageBlob(original);
   const conf={...original.conf,...(reset?{scale:1,offsetX:0,offsetY:0,flipX:false}:{scale:Number(abScaleCtl.input.value),offsetX:Number(abXctl.input.value),offsetY:Number(abYctl.input.value),flipX:abMirror.checked})};
   if(reset){abScaleCtl.input.value='1';abXctl.input.value='0';abYctl.input.value='0';abMirror.checked=false;abRedrawTune()}
   abTuneBusy=true;abApply.disabled=abReset.disabled=true;
   const persisted=await engine.set(key,blob,conf);
   abAssetInfo();
   abMsg.textContent=persisted?'✓ Εφαρμόστηκε και αποθηκεύτηκε η θέση/κλίμακα της εικόνας.':'⚠ Η θέση/κλίμακα εφαρμόστηκε τώρα, αλλά δεν επιβεβαιώθηκε μόνιμη αποθήκευση. Κράτησε αντίγραφο από τον Sprite Editor.';
  }catch(e){abMsg.textContent='⚠ '+(e?.message||'Η αλλαγή δεν ολοκληρώθηκε');}
  finally{abTuneBusy=false;abAssetInfo()}
 }
 abApply.onclick=()=>abApplyTune(false);
 abReset.onclick=()=>abApplyTune(true);
 // CP14: portable backup / restore of creator-added sprites (PNG, JPG, WebP + settings).
 // It does not export bundled art or alter farm saves, grid, pricing or gameplay.
 const abBackup=add('section',assetBridge);abBackup.id='gm-cp14-backup';
 abBackup.style.cssText='background:#f6f5ed;border:1px solid #8ca091;border-radius:9px;padding:10px;margin:10px 0';
 const abBackupTitle=add('strong',abBackup,'💾 Backup εικόνων αντικειμένων');abBackupTitle.style.display='block';
 const abBackupNote=add('p',abBackup,'Εδώ αποθηκεύεις ΜΟΝΟ τα PNG/JPG/WebP που άλλαξες στα αντικείμενα, μαζί με μέγεθος και θέση. Το αρχείο λέγεται NostalgiaVille_Sprites_Backup_CP14.json. Δεν περιλαμβάνει HUD, διάταξη Game Maker ή πρόοδο φάρμας.');
 abBackupNote.style.cssText='font-size:11px;line-height:1.45;margin:5px 0';
 const abBackupActions=add('div',abBackup);abBackupActions.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px';
 const abBackupExport=add('button',abBackupActions,'⬇ Αποθήκευση sprites');abBackupExport.type='button';
 const abBackupImport=add('button',abBackupActions,'⬆ Επαναφορά sprites');abBackupImport.type='button';
 for(const el of [abBackupExport,abBackupImport])el.style.cssText='min-height:44px;font-size:12px;padding:6px';
 const abBackupFile=add('input',abBackup);abBackupFile.type='file';abBackupFile.accept='.json,application/json';
 abBackupFile.setAttribute('aria-label','Αρχείο backup sprites JSON');
 abBackupFile.style.cssText='display:none';
 const abBackupStatus=add('p',abBackup,'Για επαναφορά επέλεξε το αρχείο NostalgiaVille_Sprites_Backup_CP14.json από τα Αρχεία του iPhone. Τα άλλα Export JSON πιο κάτω είναι για διαφορετικές ρυθμίσεις.');
 abBackupStatus.setAttribute('aria-live','polite');abBackupStatus.style.cssText='font-size:11px;line-height:1.45;margin:7px 0 0;overflow-wrap:anywhere';
 const abBackupLimit=8*1024*1024;
 let abBackupBusy=false;
 function abBackupBusySet(busy){abBackupBusy=busy;abBackupExport.disabled=busy;abBackupImport.disabled=busy;abBackupFile.disabled=busy;}
 function abToData(blob){return new Promise((res,rej)=>{const reader=new FileReader();reader.onload=()=>res(String(reader.result));reader.onerror=()=>rej(Error('Δεν μπορεί να διαβαστεί μία εικόνα.'));reader.readAsDataURL(blob)});}
 function abDecodeData(url){
  const m=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/i.exec(url);
  if(!m)throw Error('Το πακέτο περιέχει μη υποστηριζόμενη εικόνα.');
  if(m[2].length>Math.ceil(abBackupLimit*4/3)+8)throw Error('Εικόνα μεγαλύτερη από 8 MB.');
  const raw=atob(m[2]);if(!raw.length||raw.length>abBackupLimit)throw Error('Μη έγκυρο μέγεθος εικόνας.');
  const chunks=[];for(let i=0;i<raw.length;i+=32768){const sub=raw.slice(i,i+32768),arr=new Uint8Array(sub.length);for(let j=0;j<sub.length;j++)arr[j]=sub.charCodeAt(j);chunks.push(arr)}
  return new Blob(chunks,{type:m[1].toLowerCase()});
 }
 abBackupExport.onclick=async()=>{
  if(abBackupBusy)return;
  abBackupBusySet(true);
  try{
   const engine=window.FV83Assets;if(!engine)throw Error('Ο Sprite Engine δεν βρέθηκε.');
   const sprites=engine.entries().filter(([id,a])=>engine.allowed.includes(id)&&a?.blob);
   if(!sprites.length)throw Error('Δεν υπάρχουν ακόμα δικά σου sprites για backup. Πρόσθεσε πρώτα PNG/JPG/WebP.');
   if(sprites.length>300)throw Error('Πάρα πολλά sprites για ένα αντίγραφο.');
   const rows=[];
   for(let i=0;i<sprites.length;i++){
    const [id,a]=sprites[i];if(a.blob.size>abBackupLimit)throw Error('Μεγάλο αρχείο: '+id);
    abBackupStatus.textContent='Δημιουργία backup… '+(i+1)+'/'+sprites.length;
    rows.push({name:id,conf:engine.settings(a.conf),src:await abToData(a.blob)});
   }
   const data={format:'NostalgiaVille-GameMaker-Sprite-Backup',schemaVersion:1,checkpoint:14,createdAt:new Date().toISOString(),images:rows};
   const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='NostalgiaVille_Sprites_Backup_CP14.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
   abBackupStatus.textContent='✓ Έτοιμο backup '+rows.length+' sprites ('+(blob.size/1024/1024).toFixed(1)+' MB). Φύλαξε το JSON στα Αρχεία του iPhone.';
  }catch(err){abBackupStatus.textContent='⚠ '+(err?.message||'Η εξαγωγή απέτυχε');}
  finally{abBackupBusySet(false)}
 };
 abBackupImport.onclick=()=>{if(!abBackupBusy){abBackupFile.value='';abBackupFile.click()}};
 abBackupFile.onchange=async()=>{
  const file=abBackupFile.files?.[0];if(!file||abBackupBusy)return;
  abBackupBusySet(true);
  try{
   if(file.size>45*1024*1024||file.size===0)throw Error('Το JSON πρέπει να είναι έως 45 MB.');
   const data=JSON.parse(await file.text());
   if(data?.format!=='NostalgiaVille-GameMaker-Sprite-Backup'){
    const schema=String(data?.schema||'');
    if(schema.startsWith('FarmVille3026-GameMaker-'))throw Error('Διάλεξες Export HUD/UI του Game Maker, όχι backup εικόνων. Για τα sprites πάτησε πρώτα «Αποθήκευση sprites» και μετά «Επαναφορά sprites».');
    if(schema.includes('Crops')||schema.includes('production')||schema.includes('Market'))throw Error('Το αρχείο ανήκει σε άλλη καρτέλα του Game Maker (καλλιέργειες / παραγωγή / Market), όχι στα sprites.');
    throw Error('Αυτό το JSON δεν είναι αντίγραφο sprites. Επίλεξε το NostalgiaVille_Sprites_Backup_CP14.json.');
   }
   if(data.schemaVersion!==1||!Array.isArray(data.images)||!data.images.length||data.images.length>300)throw Error('Το αντίγραφο εικόνων έχει μη συμβατή έκδοση ή δεν περιλαμβάνει έγκυρες εικόνες.');
   const engine=window.FV83Assets;if(!engine)throw Error('Ο Sprite Engine δεν είναι διαθέσιμος.');
   const seen=new Set(),rows=[];
   // Validate entire file BEFORE requesting confirmation or modifying anything.
   for(const entry of data.images){
    if(typeof entry?.name!=='string'||!engine.allowed.includes(entry.name)||seen.has(entry.name)||typeof entry.src!=='string'||!entry.conf||typeof entry.conf!=='object')throw Error('Μη έγκυρη καταχώρηση sprite στο backup.');
    seen.add(entry.name);rows.push({name:entry.name,blob:abDecodeData(entry.src),conf:engine.settings(entry.conf)});
   }
   if(!window.confirm('Επαναφορά '+rows.length+' εικόνων; Οι υπάρχουσες εικόνες για αυτά τα αντικείμενα θα αντικατασταθούν. Η πρόοδος της φάρμας δεν επηρεάζεται.')){abBackupStatus.textContent='Η επαναφορά ακυρώθηκε.';return}
   let ok=0,unsaved=0;const fail=[];
   for(let i=0;i<rows.length;i++){
    const row=rows[i];abBackupStatus.textContent='Επαναφορά… '+(i+1)+'/'+rows.length+' ('+row.name+')';
    try{const saved=await engine.set(row.name,row.blob,row.conf);ok++;if(!saved)unsaved++}catch(err){fail.push(row.name+': '+(err?.message||'αποτυχία'))}
   }
   abAssetInfo();
   abLoadCatalog();
    abBackupStatus.textContent=(fail.length?'⚠ ':'✓ ')+ok+'/'+rows.length+' εικόνες επανήλθαν.'+(unsaved?' '+unsaved+' χωρίς επιβεβαιωμένη μόνιμη αποθήκευση.':'')+(fail.length?' Απέτυχαν: '+fail.slice(0,3).join(' · '):'');
  }catch(err){abBackupStatus.textContent='⚠ '+(err?.message||'Αποτυχία επαναφοράς');}
  finally{abBackupFile.value='';abBackupBusySet(false)}
 };
 const abMsg=add('p',assetBridge,'');abMsg.setAttribute('aria-live','polite');abMsg.style.cssText='font-size:12px;margin:6px 0';
 let abImageUrl='';let abEntries=[];
 const abEngine=()=>window.FV83Assets;
 function abAssetInfo(){
  const engine=abEngine(),key=abPick.value;
  if(!engine||!key){abPreview.style.display='none';abDetails.textContent='Επίλεξε αντικείμενο από τον κατάλογο.';abUpdateFavoriteButton();return}
  const asset=engine.get(key),def=window.FV83Defs?.get(key);
  abLoadTune(asset);
  const label=abEntries.find(v=>v.key===key)?.label||key;
  if(abImageUrl){URL.revokeObjectURL(abImageUrl);abImageUrl=''}
  abPreview.removeAttribute('src');abPreview.style.display='none';
  const source=asset?.blob?'Δικό σου αρχείο εικόνας (Sprite Editor / iPhone)':asset?.inlineSrc?(asset.inlineSrc.startsWith('data:')?'Ενσωματωμένη εικόνα στο παιχνίδι':asset.inlineSrc):'Βασικό σχέδιο Canvas — δεν υπάρχει ξεχωριστό PNG';
  const grid=def?'Grid: '+def.w+' × '+def.h+' (χωρίς δυνατότητα αλλαγής εδώ)':'Grid: δεν εφαρμόζεται σε χαρακτήρα/καλλιέργεια';
  const size=asset?.img?.naturalWidth?(asset.img.naturalWidth+' × '+asset.img.naturalHeight+' px'):'—';
  abDetails.replaceChildren();
  for(const line of ['Αντικείμενο: '+label,'ID: '+key,grid,'Πηγή: '+source,'Εικόνα: '+size]){const p=add('div',abDetails,line);p.style.margin='2px 0'}
  if(asset?.blob){abImageUrl=URL.createObjectURL(asset.blob);abPreview.src=abImageUrl;abPreview.style.display='block'}
  else if(asset?.inlineSrc){abPreview.src=asset.inlineSrc;abPreview.style.display='block'}
  abHighlightSelected();
 }
  // CP15 metadata is purely editor-side and uses its own key. The farm save and
  // the CP14 sprite backup format remain untouched for backwards compatibility.
  const CP15_META='NostalgiaVille_CP15_Asset_Manager_2';
  const abFold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el-GR');
  const abPageSize=10;
  let abPage=0,abMatches=[],abCardURLs=[];
  let abMeta={favorites:[],selected:''};
  try{const raw=JSON.parse(localStorage.getItem(CP15_META)||'{}');if(Array.isArray(raw?.favorites))abMeta.favorites=raw.favorites.filter(v=>typeof v==='string').slice(0,500);if(typeof raw?.selected==='string')abMeta.selected=raw.selected;}catch(e){}
  let abFavoriteSet=new Set(abMeta.favorites);
  function abSaveMeta(){
   abMeta.favorites=[...abFavoriteSet];
   try{localStorage.setItem(CP15_META,JSON.stringify(abMeta));}catch(e){/* Filtering still works without localStorage. */}
  }
  function abCategoryOf(row){
   const g=abFold(row.group),id=row.key;
   if(id==='farmer'||id.startsWith('farmer_'))return 'characters';
   if(['strawberry','soybean','eggplant','wheat'].includes(id)||g.includes('καλλιεργ'))return 'crops';
   if(id==='apple'||g.includes('δεντρα')||g.includes('χωραφι'))return 'trees';
   if(id==='hay'||g.includes('decor')||g.includes('διακοσμ'))return 'decor';
   if(g.includes('ζωα'))return 'animals';
   if(g.includes('κτιρια'))return 'buildings';
   if(g.includes('οχηματα'))return 'vehicles';
   return 'other';
  }
  function abStatusOf(key){
   const a=abEngine()?.get(key);
   return a?.blob?'custom':a?.inlineSrc?'bundled':'canvas';
  }
  function abStatusBadge(status){return status==='custom'?'✎ Δικό σου PNG':status==='bundled'?'✓ Ενσωματωμένο':'○ Canvas';}
  function abClearThumbs(){for(const u of abCardURLs)URL.revokeObjectURL(u);abCardURLs=[];}
  function abUpdateFavoriteButton(){
   const key=abPick.value,active=!!key&&abFavoriteSet.has(key);
   abFavSelected.disabled=!key;
   abFavSelected.textContent=!key?'☆ Επίλεξε αντικείμενο':active?'★ Στα αγαπημένα — πάτησε για αφαίρεση':'☆ Προσθήκη στα αγαπημένα';
  }
  function abRenderPage(){
   abClearThumbs();abList.replaceChildren();
   const pages=Math.max(1,Math.ceil(abMatches.length/abPageSize));
   abPage=Math.min(Math.max(0,abPage),pages-1);
   const shown=abMatches.slice(abPage*abPageSize,(abPage+1)*abPageSize);
   abPageText.textContent=(abPage+1)+' / '+pages;
   abPrevPage.disabled=abPage===0;abNextPage.disabled=abPage>=pages-1;
   abPageControls.hidden=abMatches.length<=abPageSize;
   abEmptyNote.hidden=abMatches.length>0;
   for(const row of shown){
    const selected=row.key===abPick.value,stat=abStatusOf(row.key);
    const card=add('button',abList);card.type='button';card.className='gm-cp15-card';
    card.dataset.assetId=row.key;card.setAttribute('aria-pressed',String(selected));
    card.style.cssText='display:flex;align-items:center;gap:5px;min-width:0;min-height:54px;text-align:left;padding:5px;border:1px solid '+(selected?'#a96a20':'#d9c49d')+';border-radius:7px;background:'+(selected?'#f4dfb4':'#fffdf8')+';color:#51351c;font-size:12px';
    const img=add('img',card);img.alt='';img.loading='lazy';img.style.cssText='width:36px;height:36px;object-fit:contain;flex:none;border-radius:5px;background:#eaddc4';
    const a=abEngine()?.get(row.key);
    if(a?.blob){const url=URL.createObjectURL(a.blob);abCardURLs.push(url);img.src=url;}
    else if(a?.inlineSrc){img.src=a.inlineSrc;}
    else{img.style.display='none';const ph=add('span',card,'🌿');ph.style.cssText='font-size:22px;flex:none'}
    const body=add('span',card);body.style.cssText='display:flex;min-width:0;flex-direction:column;gap:2px';
    const name=add('strong',body,(abFavoriteSet.has(row.key)?'★ ':'')+row.label);name.style.cssText='display:block;overflow:hidden;text-overflow:ellipsis;line-height:1.2';
    const sub=add('small',body,abStatusBadge(stat));sub.style.cssText='font-size:10px;color:#806b52';
    card.onclick=()=>{
     abPick.value=row.key;abMeta.selected=row.key;abSaveMeta();
     abAssetInfo();abRenderPage();
    };
   }
  }
  function abHighlightSelected(){
   abUpdateFavoriteButton();
   for(const card of abList.querySelectorAll('.gm-cp15-card')){
    const current=card.dataset.assetId===abPick.value;
    card.setAttribute('aria-pressed',String(current));
    card.style.borderColor=current?'#a96a20':'#d9c49d';card.style.background=current?'#f4dfb4':'#fffdf8';
   }
  }
  function abLoadCatalog(resetPage=false){
   const source=document.getElementById('assetTarget');
   if(!source){abMsg.textContent='⚠ Δεν βρέθηκε ο πραγματικός κατάλογος Sprite Editor.';return}
   const previous=abPick.value||abMeta.selected||source.value;
   const found=new Set();
   abEntries=Array.from(source.options).filter(o=>o.value&&!found.has(o.value)&&found.add(o.value))
    .map(o=>({key:o.value,label:o.textContent.trim(),group:o.parentElement?.tagName==='OPTGROUP'?o.parentElement.label:''}));
   const q=abFold(abSearch.value.trim()),cat=abCategory.value,stat=abStatus.value;
   abMatches=abEntries.filter(o=>(cat==='all'||abCategoryOf(o)===cat)
     &&(stat==='all'||abStatusOf(o.key)===stat)
     &&(!abOnlyFav.checked||abFavoriteSet.has(o.key))
     &&(!q||abFold(o.label+' '+o.key+' '+o.group).includes(q)));
   if(resetPage)abPage=0;
   abResultCount.textContent=abMatches.length+' από '+abEntries.length+' αντικείμενα · '+abEntries.filter(o=>abStatusOf(o.key)==='custom').length+' με δική σου εικόνα · '+abFavoriteSet.size+' αγαπημένα';
   // The select contains only the filtered matches; the visible cards are paged.
   abPick.replaceChildren();
   if(!abMatches.length){const o=add('option',abPick,'Δεν βρέθηκε αντικείμενο');o.value='';abPick.disabled=true;abOpen.disabled=true;abFile.disabled=true;abApply.disabled=true;abReset.disabled=true;abAssetInfo();abRenderPage();return}
   abPick.disabled=false;abOpen.disabled=false;abFile.disabled=false;
   for(const row of abMatches){const o=add('option',abPick,row.label);o.value=row.key;}
   if(abMatches.some(o=>o.key===previous))abPick.value=previous;
   else if(abMeta.selected&&abMatches.some(o=>o.key===abMeta.selected))abPick.value=abMeta.selected;
   abMeta.selected=abPick.value;abSaveMeta();
   abAssetInfo();abRenderPage();
  }
  abSearch.oninput=()=>abLoadCatalog(true);
  abCategory.onchange=()=>abLoadCatalog(true);
  abStatus.onchange=()=>abLoadCatalog(true);
  abOnlyFav.onchange=()=>abLoadCatalog(true);
  abPick.onchange=()=>{
   abMeta.selected=abPick.value;abSaveMeta();
   const idx=abMatches.findIndex(o=>o.key===abPick.value);
   if(idx>=0)abPage=Math.floor(idx/abPageSize);
   abAssetInfo();abRenderPage();
  };
  abFavSelected.onclick=()=>{
   const key=abPick.value;if(!key)return;
   if(abFavoriteSet.has(key))abFavoriteSet.delete(key);else abFavoriteSet.add(key);
   abSaveMeta();
   if(abOnlyFav.checked)abLoadCatalog(true);else{abResultCount.textContent=abMatches.length+' από '+abEntries.length+' αντικείμενα · '+abEntries.filter(o=>abStatusOf(o.key)==='custom').length+' με δική σου εικόνα · '+abFavoriteSet.size+' αγαπημένα';abRenderPage();abUpdateFavoriteButton();}
  };
  abPrevPage.onclick=()=>{if(abPage>0){abPage--;abRenderPage()}};
  abNextPage.onclick=()=>{if((abPage+1)*abPageSize<abMatches.length){abPage++;abRenderPage()}};
 // The same validated set() function used by the REAL sprite editor updates live farm art.
 // Never edits placed objects, dimensions, save data, money, XP, crops or gameplay.
 let abImportBusy=false;
 abFile.onchange=async()=>{
  const uploaded=abFile.files?.[0];if(!uploaded||abImportBusy)return;
  const engine=abEngine(),key=abPick.value;
  try{
   if(!engine||!key||!engine.allowed.includes(key))throw Error('Επίλεξε πραγματικό αντικείμενο από τον κατάλογο.');
   let mime=uploaded.type.toLowerCase();
   if(!mime){const ext=uploaded.name.toLowerCase().split('.').pop();mime=({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'})[ext]||'';}
   if(!['image/png','image/jpeg','image/webp'].includes(mime))throw Error('Χρειάζεται PNG, JPG ή WebP.');
   if(uploaded.size===0||uploaded.size>8*1024*1024)throw Error('Επίλεξε εικόνα έως 8 MB.');
   abImportBusy=true;abFile.disabled=true;abOpen.disabled=true;
   abMsg.textContent='Ελέγχεται η εικόνα και εφαρμόζεται στο πραγματικό sprite…';
   const file=(mime===uploaded.type)?uploaded:new File([uploaded],uploaded.name,{type:mime});
   const old=engine.get(key);
   const conf=old?.conf||engine.settings();
   const persist=await engine.set(key,file,conf);
   // Editor remains the owner of the same image engine; update its view if it is open.
   const target=document.getElementById('assetTarget'),sp=document.getElementById('assetPanel');
   if(sp?.classList.contains('open')&&target){target.value=key;target.dispatchEvent(new Event('change',{bubbles:true}))}
   abLoadCatalog();
   abMsg.textContent=persist
    ?'✓ Η εικόνα άλλαξε στη φάρμα και αποθηκεύτηκε τοπικά στο iPhone.'
    :'⚠ Η εικόνα άλλαξε τώρα, αλλά η μόνιμη αποθήκευση δεν ήταν διαθέσιμη. Εξήγαγέ τη από τον Sprite Editor.';
  }catch(err){
   abMsg.textContent='⚠ '+(err?.message||'Δεν ολοκληρώθηκε η εισαγωγή')+' Για αλλαγές σε spritesheet χρησιμοποίησε τον Sprite Editor.';
  }finally{
   abImportBusy=false;abFile.value='';abFile.disabled=!abPick.value;abOpen.disabled=!abPick.value;
  }
 };
 abRefresh.onclick=()=>{abLoadCatalog();abMsg.textContent='✓ Ανανεώθηκαν τα στοιχεία από τον Sprite Engine'};
 abOpen.onclick=()=>{
  const key=abPick.value, target=document.getElementById('assetTarget'), sp=document.getElementById('assetPanel');
  if(!key||!target||!sp||!Array.from(target.options).some(o=>o.value===key)){
   abMsg.textContent='⚠ Το επιλεγμένο αντικείμενο δεν υπάρχει στον πραγματικό Sprite Editor';return;
  }
  target.value=key;
  target.dispatchEvent(new Event('change',{bubbles:true}));
  // The existing Sprite Editor owns all imports, rendering and saves.
  sp.classList.add('open','maker-assets-visible');sp.classList.remove('fv83-collapsed');
  sp.style.display='';panel.hidden=true;
  abMsg.textContent='✓ Άνοιξε το πραγματικό sprite '+key;
 };
 // Checkpoint 16: bulk import into the REAL CP15 sprite catalogue, never an independent asset store.
 // Staging is read-only; actual replacements happen only after explicit preview and confirmation.
 const cp16Batch=add('section',assetBridge);cp16Batch.id='gm-cp16-bulk';
 assetBridge.insertBefore(cp16Batch,abTune);
 cp16Batch.style.cssText='border:1px solid #8b9b83;background:#eff4e7;border-radius:10px;padding:10px;margin:12px 0';
 const cp16Heading=add('strong',cp16Batch,'📦 Μαζική εισαγωγή PNG · Checkpoint 16');
 cp16Heading.style.cssText='display:block;font-size:15px;margin-bottom:5px';
 const cp16Help=add('p',cp16Batch,'Επίλεξε έως 30 εικόνες PNG/JPG/WebP μαζί. Τα ονόματα IMG_1234.png από iPhone ΔΕΝ αντιστοιχίζονται αυτόματα. Κάτω από κάθε εικόνα διάλεξε το αντικείμενο όπου θα τοποθετηθεί, ή πάτησε «Στο επιλεγμένο αντικείμενο». Καμία αλλαγή χωρίς επιβεβαίωση.');
 cp16Help.style.cssText='font-size:12px;line-height:1.45;margin:5px 0 9px';
 const cp16File=add('input',cp16Batch);cp16File.id='gm-cp16-files';cp16File.type='file';cp16File.multiple=true;cp16File.accept='.png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp';
 cp16File.setAttribute('aria-label','Επίλεξε πολλά αρχεία εικόνων');cp16File.style.cssText='display:block;width:100%;max-width:100%;font-size:14px;min-height:44px';
 const cp16Summary=add('div',cp16Batch,'Δεν έχουν επιλεγεί εικόνες.');cp16Summary.id='gm-cp16-summary';
 const cp17Guidance=add('div',cp16Batch,'Βήμα 1: Διάλεξε PNG. Βήμα 2: Διάλεξε αντικείμενο για κάθε εικόνα. Βήμα 3: Εφαρμογή.');cp17Guidance.id='gm-cp17-guidance';cp17Guidance.setAttribute('aria-live','polite');cp17Guidance.style.cssText='font-size:13px;font-weight:700;padding:9px;border:1px solid #c99a4f;border-radius:8px;background:#fff3cf;margin:9px 0;line-height:1.4';
 cp16Summary.style.cssText='font-size:12px;margin:8px 0;color:#4e5638';cp16Summary.setAttribute('aria-live','polite');
 const cp16RowsBox=add('div',cp16Batch);cp16RowsBox.id='gm-cp16-rows';cp16RowsBox.style.cssText='display:grid;gap:7px;max-height:330px;overflow-y:auto;overscroll-behavior:contain';
 const cp16Buttons=add('div',cp16Batch);cp16Buttons.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px';
 const cp16Apply=add('button',cp16Buttons,'✓ Εφαρμογή εικόνων');cp16Apply.type='button';cp16Apply.id='gm-cp16-apply';cp16Apply.disabled=true;
 const cp16Clear=add('button',cp16Buttons,'✕ Καθαρισμός λίστας');cp16Clear.type='button';cp16Clear.id='gm-cp16-clear';
 for(const el of [cp16Apply,cp16Clear])el.style.cssText='min-height:44px;font-size:12px;padding:7px';
 const cp16Message=add('p',cp16Batch,'Πριν αντικαταστήσεις εικόνες που ήδη έχεις, κράτησε Backup Sprites από το Checkpoint 14.');
 cp16Message.id='gm-cp16-message';cp16Message.setAttribute('aria-live','polite');cp16Message.style.cssText='font-size:12px;line-height:1.45;overflow-wrap:anywhere;margin:8px 0 0';
  // CP17 protects the EXISTING sprite registry, no separate asset database or farm changes.
  const cp17Card=add('section',cp16Batch);cp17Card.id='gm-cp17-undo-box';
  cp17Card.style.cssText='border:1px solid #b89359;border-radius:9px;background:#fffaf0;padding:9px;margin:10px 0 0';
  const cp17Heading=add('strong',cp17Card,'↶ Checkpoint 17.1 · Εισαγωγή / Αναίρεση — διορθώσεις');
  cp17Heading.style.cssText='display:block;font-size:13px;margin-bottom:5px';
  const cp17Desc=add('p',cp17Card,'Αν αποτύχει εικόνα στη μαζική εισαγωγή, γίνεται προσπάθεια αυτόματης επαναφοράς όσων άλλαξαν. Μετά από επιτυχημένη εισαγωγή μπορείς να αναιρέσεις ΟΛΟ το τελευταίο πακέτο, όσο παραμένει ανοιχτό αυτό το HTML.');
  cp17Desc.style.cssText='font-size:11px;line-height:1.45;margin:5px 0 8px';
  const cp17UndoButton=add('button',cp17Card,'↶ Αναίρεση τελευταίου πακέτου');
  cp17UndoButton.id='gm-cp17-undo';cp17UndoButton.type='button';cp17UndoButton.disabled=true;
  cp17UndoButton.style.cssText='width:100%;min-height:44px;padding:8px;font-size:13px';
  const cp17Status=add('p',cp17Card,'Δεν υπάρχει πρόσφατη μαζική εισαγωγή για αναίρεση. Για επαναφορά μετά από κλείσιμο, χρησιμοποίησε Backup Sprites.');
  cp17Status.id='gm-cp17-status';cp17Status.setAttribute('aria-live','polite');
  cp17Status.style.cssText='font-size:11px;line-height:1.45;margin:7px 0 0;overflow-wrap:anywhere';
 const cp16MaxBytes=8*1024*1024;
 let cp16Rows=[],cp16Busy=false;
 function cp16ClearRows(){for(const row of cp16Rows){if(row.url)URL.revokeObjectURL(row.url)}cp16Rows=[];cp16RowsBox.replaceChildren();}
 const cp16Normalize=text=>abFold(text).trim().replace(/[\s-]+/g,'_');
 function cp16Mime(file){let mime=(file.type||'').toLowerCase();if(!mime){const ext=file.name.toLowerCase().split('.').pop();mime=({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'})[ext]||'';}return mime;}
 const cp16AllowedMime=['image/png','image/jpeg','image/webp'];
 function cp16RowsReady(){
  const good=cp16Rows.filter(row=>row.enabled&&row.target&&!row.issue);
  const seen=new Set(),dupe=new Set();
  for(const row of good){if(seen.has(row.target))dupe.add(row.target);seen.add(row.target)}
  const invalid=cp16Rows.filter(row=>row.issue).length;
  const unmapped=cp16Rows.filter(row=>!row.target&&!row.issue).length;
  cp16Summary.textContent=cp16Rows.length+' εικόνες · '+good.length+' έτοιμες · '+unmapped+' χωρίς αντιστοίχιση · '+invalid+' μη έγκυρες'+(dupe.size?' · ⚠ Διπλός στόχος: '+[...dupe].join(', '):'');
  cp17Guidance.textContent=cp16Busy?'⏳ Επεξεργασία εικόνων…': !cp16Rows.length?'1. Διάλεξε εικόνες · 2. Όρισε αντικείμενο για καθεμία · 3. Πάτησε Εφαρμογή':dupe.size?'⚠ Έχεις δώσει το ίδιο αντικείμενο σε δύο εικόνες. Άλλαξε τον στόχο μίας από αυτές.':good.length===0?'⚠ Δεν υπάρχει εικόνα έτοιμη. Κάτω από κάθε εικόνα πάτησε το πεδίο «Αντικείμενο (ID)» και διάλεξε στόχο.':unmapped?'✓ '+good.length+' εικόνες έτοιμες. Οι άλλες '+unmapped+' δεν θα εισαχθούν. Μπορείς να επιλέξεις αντικείμενο κάτω από την εικόνα τους.':'✓ '+good.length+' εικόνες έτοιμες. Πάτησε «Εφαρμογή εικόνων» και επιβεβαίωσε.';
  cp16Apply.disabled=cp16Busy||!good.length||!!dupe.size;
  cp16Clear.disabled=cp16Busy;
  cp16File.disabled=cp16Busy;
  for(const row of cp16Rows){if(row.select)row.select.disabled=cp16Busy||!!row.issue;if(row.check)row.check.disabled=cp16Busy||!row.target||!!row.issue}
  return {good,dupe};
 }
 function cp16Render(){
  cp16RowsBox.replaceChildren();
  for(const row of cp16Rows){
   const wrap=add('div',cp16RowsBox);wrap.style.cssText='border:1px solid #c8d0bf;background:#fffdf6;border-radius:8px;padding:7px;display:grid;gap:5px';
   const head=add('div',wrap);head.style.cssText='display:flex;align-items:center;gap:7px;min-width:0';
   const thumb=add('img',head);thumb.alt='Προεπισκόπηση '+row.file.name;thumb.src=row.url;thumb.style.cssText='width:40px;height:40px;object-fit:contain;border:1px solid #ded2bb;border-radius:5px;flex:none';
   const info=add('div',head);info.style.cssText='min-width:0;flex:1;overflow-wrap:anywhere;font-size:11px';
   add('strong',info,row.file.name);add('div',info,(row.file.size/1024).toFixed(0)+' KB'+(row.issue?' · ⚠ '+row.issue:''));
   const enabled=add('input',head);enabled.type='checkbox';enabled.checked=row.enabled;enabled.disabled=!!row.issue;enabled.title='Συμπερίληψη στην εισαγωγή';enabled.setAttribute('aria-label','Συμπερίληψη '+row.file.name);row.check=enabled;
   const targetLabel=add('label',wrap,'2 · Αντικείμενο (ID) — διάλεξε εδώ');targetLabel.style.cssText='display:grid;gap:3px;font-size:12px;font-weight:700;color:#51351c';
   const selector=add('select',targetLabel);selector.style.cssText='width:100%;max-width:100%;min-width:0;padding:11px;min-height:44px;font-size:14px;border:2px solid #b58440;border-radius:6px;background:#fff';row.select=selector;
   let o=add('option',selector,'— ΕΠΙΛΕΞΕ ΑΝΤΙΚΕΙΜΕΝΟ (παράλειψη) —');o.value='';
   for(const v of abEntries){o=add('option',selector,v.label+' ('+v.key+')');o.value=v.key}
   selector.value=row.target||'';
   selector.onchange=()=>{row.target=selector.value;row.enabled=!!row.target&&!row.issue;enabled.checked=row.enabled;cp16RowsReady()};
   if(!row.target&&!row.issue){
    const fast=add('button',wrap,'🎯 Στο επιλεγμένο αντικείμενο του Asset Manager');fast.type='button';
    fast.style.cssText='min-height:42px;padding:8px;background:#f8e7c7;border:1px solid #ae853d;border-radius:6px;font-size:12px;color:#573d1f';
    fast.onclick=()=>{const key=abPick.value;if(!key||!abEngine()?.allowed.includes(key)){cp16Message.textContent='⚠ Επίλεξε πρώτα αντικείμενο στον Asset Manager.';return;}row.target=key;row.enabled=true;selector.value=key;enabled.checked=true;cp16RowsReady();cp16Message.textContent='✓ Αντιστοιχίστηκε το '+row.file.name+' με το '+key+'. Έλεγξε το πριν την Εφαρμογή.';};
   }
   enabled.onchange=()=>{row.enabled=enabled.checked;cp16RowsReady()};
  }
  cp16RowsReady();
 }
 cp16File.onchange=()=>{
  if(cp16Busy)return;
  const files=Array.from(cp16File.files||[]);if(!files.length)return;
  if(files.length>30){cp16Message.textContent='⚠ Μέγιστο 30 εικόνες ανά πακέτο. Επίλεξε μικρότερη ομάδα.';cp16File.value='';return}
  cp16ClearRows();
  const engine=abEngine();
  if(!engine||!abEntries.length){abLoadCatalog();}
  const byId=new Map(abEntries.map(row=>[cp16Normalize(row.key),row.key]));
  const byLabel=new Map(); // Intentionally NOT used for guessing: only exact stable IDs auto-map.
  for(const file of files){
   const mime=cp16Mime(file),issue=!cp16AllowedMime.includes(mime)?'Μόνο PNG, JPG, WebP':(!file.size||file.size>cp16MaxBytes)?'Μέγιστο 8 MB ανά εικόνα':'';
   const stem=file.name.replace(/\.(png|jpe?g|webp)$/i,'');
   const target=!issue?(byId.get(cp16Normalize(stem))||''):'';
   const url=URL.createObjectURL(file);
   cp16Rows.push({file,mime,issue,target,enabled:!!target,url});
  }
  cp16Render();cp16Message.textContent=cp16Rows.some(r=>!r.target&&!r.issue)?'⚠ Κάποιες εικόνες (π.χ. IMG_1015.png) δεν έχουν στόχο. Επίλεξε «Αντικείμενο (ID)» κάτω από κάθε εικόνα, μετά πάτησε Εφαρμογή.':'✓ Οι εικόνες αναγνωρίστηκαν. Έλεγξε την αντιστοίχιση πριν την Εφαρμογή.';
  cp16File.value='';
 };
 cp16Clear.onclick=()=>{if(cp16Busy)return;cp16ClearRows();cp16RowsReady();cp16Message.textContent='Η λίστα καθαρίστηκε. Καμία εικόνα της φάρμας δεν άλλαξε.'};
 function cp16Inspect(file,conf){
  return new Promise((resolve,reject)=>{
   const url=URL.createObjectURL(file);const img=new Image();
   img.onload=()=>{URL.revokeObjectURL(url);const w=img.naturalWidth,h=img.naturalHeight;
    if(!w||!h||w>4096||h>4096)return reject(Error('Μέγιστες διαστάσεις 4096 px'));
    if(w%conf.cols||h%conf.rows)return reject(Error('Οι διαστάσεις δεν ταιριάζουν με τα καρέ του sprite'));
    resolve({w,h});
   };
   img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Μη αναγνώσιμο αρχείο εικόνας'))};img.src=url;
  });
 }
  // Only the last successful batch can be undone. Snapshot is transient and never
  // serialised with the farm save, sprite backup or Game Maker HUD preferences.
  let cp17UndoBatch=null;
  function cp17UpdateUndo(){
   const canUndo=!!cp17UndoBatch?.length&&!cp16Busy;
   cp17UndoButton.disabled=!canUndo;
   cp17UndoButton.textContent=canUndo?'↶ Αναίρεση '+cp17UndoBatch.length+' εικόνων':'↶ Αναίρεση τελευταίου πακέτου';
  }
  function cp17Snapshot(engine,name){
   const current=engine.get(name);
   if(!current)return {name,kind:'none'};
   if(current.blob)return {name,kind:'custom',blob:current.blob,conf:engine.settings(current.conf)};
   if(current.inlineSrc)return {name,kind:'bundled',src:current.inlineSrc,conf:engine.settings(current.conf)};
   throw Error('Δεν μπορεί να αποθηκευτεί η προηγούμενη εικόνα: '+name);
  }
  async function cp17Restore(engine,snap){
   if(snap.kind==='custom')return await engine.set(snap.name,snap.blob,snap.conf);
   const stored=await engine.remove(snap.name);
   if(snap.kind==='bundled'){
    if(engine.loadBundled({images:[{name:snap.name,src:snap.src,conf:snap.conf}]})!==1)
      throw Error('Δεν επανήλθε το ενσωματωμένο γραφικό '+snap.name);
   }
   // Restored bundled data already lives in the HTML. No IndexedDB row is required
   // unless a newer custom image was persisted, which remove() deletes.
   return snap.kind==='bundled' ? (stored||!engine.storageOK()) : stored;
  }
  async function cp17Rollback(engine,items){
   const failed=[],unsaved=[];
   for(const item of [...items].reverse()){
    try{
     const persisted=await cp17Restore(engine,item.before);
     if(!persisted)unsaved.push(item.name);
    }catch(err){failed.push(item.name+': '+(err?.message||'αποτυχία'))}
   }
   abLoadCatalog();
   return {failed,unsaved};
  }
  cp17UndoButton.onclick=async()=>{
   if(cp16Busy||!cp17UndoBatch?.length)return;
   const engine=abEngine();if(!engine)return;
   // Don't clobber a new manual edit performed after the batch.
   const different=cp17UndoBatch.filter(item=>engine.get(item.name)?.blob!==item.appliedBlob);
   if(different.length){
    cp17Status.textContent='⚠ Έχουν αλλάξει ξανά τα '+different.map(x=>x.name).join(', ')+'. Η αναίρεση διακόπηκε για να μη χαθούν οι νεότερες αλλαγές. Χρησιμοποίησε Backup Sprites.';
    cp17UndoBatch=null;cp17UpdateUndo();return;
   }
   if(!window.confirm('Να επαναφερθούν οι '+cp17UndoBatch.length+' εικόνες όπως ήταν ΠΡΙΝ την τελευταία μαζική εισαγωγή; Η πρόοδος της φάρμας δεν αλλάζει.'))return;
   cp16Busy=true;cp16RowsReady();cp17UpdateUndo();
   const pending=cp17UndoBatch;
   try{
    cp17Status.textContent='Επαναφορά προηγούμενων εικόνων…';
    const result=await cp17Rollback(engine,pending);
    const notRestored=new Set(result.failed.map(t=>t.split(':')[0]));
    cp17UndoBatch=pending.filter(item=>notRestored.has(item.name)&&engine.get(item.name)?.blob===item.appliedBlob);
    const count=pending.length-result.failed.length;
    cp17Status.textContent=(result.failed.length?'⚠ ':'✓ ')+count+'/'+pending.length+' εικόνες επανήλθαν.'+
     (result.unsaved.length?' ⚠ Η τοπική αποθήκευση δεν επιβεβαιώθηκε για '+result.unsaved.length+'· φύλαξε Backup Sprites.':'')+
     (result.failed.length?' Δεν επανήλθαν: '+result.failed.join(' · ')+'. Κάνε επαναφορά από Backup αν χρειαστεί.':'');
    cp16Message.textContent=cp17Status.textContent;
   }catch(err){
    cp17Status.textContent='⚠ Σφάλμα αναίρεσης: '+(err?.message||String(err))+'. Κάνε Restore από το Backup Sprites αν χρειαστεί.';
    cp16Message.textContent=cp17Status.textContent;
   }finally{cp16Busy=false;cp16RowsReady();cp17UpdateUndo();}
  };
  cp16Apply.onclick=async()=>{
   if(cp16Busy)return;
   const engine=abEngine(),{good,dupe}=cp16RowsReady();
   if(!engine||!good.length||dupe.size){cp16Message.textContent='⚠ Διόρθωσε πρώτα τις αντιστοιχίσεις.';return}
   cp16Busy=true;cp16RowsReady();cp17UpdateUndo();
   let applied=[];
   try{
    // Validate the ENTIRE batch, then snapshot everything, BEFORE any mutation.
    const prepared=[];
    for(let i=0;i<good.length;i++){
     const row=good[i];cp16Message.textContent='Έλεγχος εικόνων… '+(i+1)+'/'+good.length;
     if(!engine.allowed.includes(row.target))throw Error('Δεν υπάρχει αυτό το αντικείμενο: '+row.target);
     if(row.issue||!cp16AllowedMime.includes(row.mime)||!row.file.size||row.file.size>cp16MaxBytes)throw Error('Μη έγκυρη εικόνα: '+row.file.name);
     const file=(row.mime===row.file.type)?row.file:new File([row.file],row.file.name,{type:row.mime});
     const conf=engine.settings(engine.get(row.target)?.conf||{});
     let effectiveConf=conf,staticFallback=false;
     try{await cp16Inspect(file,conf)}
     catch(inspectError){
      if((conf.cols>1||conf.rows>1)&&inspectError?.message==='Οι διαστάσεις δεν ταιριάζουν με τα καρέ του sprite'){
       effectiveConf=engine.settings({...conf,cols:1,rows:1});
       await cp16Inspect(file,effectiveConf);
       staticFallback=true;
      }else throw inspectError;
     }
     prepared.push({row,file,conf:effectiveConf,staticFallback,before:cp17Snapshot(engine,row.target)});
    }
    const replacements=prepared.filter(p=>!!engine.get(p.row.target)).length;
    if(!prepared.length)throw Error('Καμία εικόνα δεν έχει στόχο. Χρειάζεται να επιλέξεις αντικείμενο (ID) κάτω από την εικόνα.');
    const staticCount=prepared.filter(p=>p.staticFallback).length;
    if(!window.confirm('Θέλεις να εισαγάγεις '+prepared.length+' εικόνες; '+replacements+' αντικείμενα έχουν ήδη γραφικό και θα αντικατασταθεί.'+(staticCount?' ΠΡΟΣΟΧΗ: '+staticCount+' θα μπουν ως στατικές εικόνες 1×1 καρέ (χωρίς το προηγούμενο animation), επειδή δεν ταιριάζουν με τις σειρές/στήλες.':'')+' Κράτησε πρώτα Backup Sprites. Το grid και η πρόοδος δεν αλλάζουν.')){
     cp16Message.textContent='Η εισαγωγή ακυρώθηκε. Δεν αντικαταστάθηκε κανένα sprite.';return;
    }
    let unsaved=0;
    for(let i=0;i<prepared.length;i++){
     const p=prepared[i];cp16Message.textContent='Εισαγωγή… '+(i+1)+'/'+prepared.length+' · '+p.row.target;
     // Include the current target in rollback even if set() throws after mutation.
     applied.push({name:p.row.target,before:p.before,appliedBlob:p.file});
     const stored=await engine.set(p.row.target,p.file,p.conf);
     if(!stored)unsaved++;
    }
    // Overwrite the previous undo history ONLY after a fully successful batch.
    cp17UndoBatch=applied.map(item=>({...item,appliedBlob:engine.get(item.name)?.blob}));
    abLoadCatalog();
    cp16Message.textContent='✓ '+prepared.length+'/'+prepared.length+' εικόνες εφαρμόστηκαν.'+(staticCount?' '+staticCount+' εισήχθησαν ως στατικές εικόνες.':'')+(unsaved?' ⚠ '+unsaved+' χωρίς επιβεβαιωμένη μόνιμη αποθήκευση· κράτησε Backup Sprites.':'');
    cp17Status.textContent='✓ Μπορείς τώρα να αναιρέσεις την τελευταία εισαγωγή '+prepared.length+' εικόνων. Η αναίρεση χάνεται όταν κλείσεις ή ανανεώσεις τη σελίδα.';
   }catch(err){
    const reason=err?.message||'Αποτυχία εισαγωγής';
    if(!applied.length){cp16Message.textContent='⚠ Δεν εφαρμόστηκε πακέτο: '+reason+'. Αν πρόκειται για απλό PNG σε αντικείμενο με animation, μπες στο Sprite Editor για σωστές σειρές/στήλες.';}
    else{
     cp16Message.textContent='⚠ Η εισαγωγή απέτυχε. Γίνεται επαναφορά προηγούμενων εικόνων…';
     const result=await cp17Rollback(engine,applied);
     cp16Message.textContent='⚠ Η εισαγωγή σταμάτησε: '+reason+'. '+(result.failed.length
      ?'Δεν αποκαταστάθηκαν όλες οι εικόνες: '+result.failed.join(' · ')+'. Χρησιμοποίησε Backup Sprites.'
      :'Οι '+applied.length+' εικόνες της απόπειρας επανήλθαν.')+
      (result.unsaved.length?' ⚠ Η μόνιμη αποθήκευση επαναφοράς δεν επιβεβαιώθηκε.':'');
     cp17Status.textContent='Η αποτυχημένη απόπειρα δεν δημιούργησε νέα καταχώρηση αναίρεσης.';
    }
   }finally{cp16Busy=false;cp16RowsReady();cp17UpdateUndo();}
  };
 // Populate only when the creator opens Map / Assets, not on gameplay startup.

 const footerHelp=add('p',panel,'⚙️ Ξεχωριστά αρχεία: τα κουμπιά παρακάτω είναι για HUD/UI ή για την πρόοδο της φάρμας, ΟΧΙ για τα sprites.');footerHelp.style.cssText='padding:9px 10px;background:#fff7e8;border:1px solid #ad8452;border-radius:8px;font-size:12px;line-height:1.4;margin:12px 0 6px';
 const footer=add('div',panel);footer.className='actions';
 btn(footer,'⬇ Export HUD/UI JSON',()=>{const blob=new Blob([JSON.stringify({schema:'FarmVille3026-GameMaker-V106',layout:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=add('a',document.body);a.href=url;a.download='FarmVille3026_V106_GameMaker.json';a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)});
 btn(footer,'💾 Export προόδου φάρμας',()=>{const e=$('#fv42-setting-export');if(e)e.click();else msg.textContent='⚠ Η εξαγωγή φάρμας δεν βρέθηκε'});
 const label=add('label',panel,'⬆ Import HUD/UI JSON ή PNG για επιλεγμένο στοιχείο (όχι sprites)');
 const file=add('input',label);file.type='file';file.accept='.json,.png,image/png,application/json';
 file.onchange=async()=>{const before=JSON.stringify(state);try{const f=file.files?.[0];if(!f)return;
  if(f.type==='image/png'||f.name.toLowerCase().endsWith('.png')){
   if(section==='Tools'||!$(pick.value))throw Error('Επίλεξε HUD ή UI');
   if(f.size>900000)throw Error('PNG έως 900 KB');
   const image=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});
   checkpoint();state[pick.value]??={};state[pick.value].image=image;
  }else{const obj=JSON.parse(await f.text());if(!['FarmVille3026-GameMaker-V106','FarmVille3026-GameMaker-V105'].includes(obj.schema)||!obj.layout||typeof obj.layout!=='object'||Array.isArray(obj.layout))throw Error('Μη συμβατό JSON');checkpoint();state=obj.layout}
  if(!store())throw Error('Το αρχείο εισήχθη στη μνήμη αλλά δεν αποθηκεύτηκε. Δοκίμασε μικρότερο αρχείο.');render();if(section!=='Tools')sync();msg.textContent='✓ Εισαγωγή και αποθήκευση ολοκληρώθηκαν';
 }catch(e){state=JSON.parse(before);render();if(section!=='Tools')sync();msg.textContent='⚠ '+e.message+' · επανήλθαν οι προηγούμενες ρυθμίσεις'}finally{file.value=''}};
 launch.onclick=()=>{panel.hidden=!panel.hidden;launch.textContent=panel.hidden?'🎮 Άνοιγμα Game Maker':'🎮 Game Maker';if(!panel.hidden&&section!=='Tools')sync()};
 tab('HUD');render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

