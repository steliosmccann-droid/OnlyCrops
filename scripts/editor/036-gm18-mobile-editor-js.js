
(()=>{'use strict';
// Mobile organizer uses the EXISTING Game Maker, Sprite Engine, farm UI, and file inputs.
// It does NOT add or change crops, units, grid, money, or save formats.
function setup(){
 const panel=document.querySelector('#gm106-panel'),launch=document.querySelector('#gm106-launch');
 if(!panel||!launch||document.querySelector('#gm18-navigation'))return;
 const head=panel.querySelector(':scope > .head'),oldTabs=panel.querySelector(':scope > .tabs');
 const tabBtns=oldTabs?[...oldTabs.querySelectorAll('button[data-tab]')]:[];
 const bridge=document.getElementById('gm106-real-asset-bridge'),tools=bridge?.parentElement;
 const edit=[...panel.children].find(el=>el.tagName==='SECTION'&&el!==tools&&el.querySelector(':scope > select'));
 const footer=[...panel.children].find(el=>el.classList?.contains('actions'));
 const fileLabel=[...panel.children].find(el=>el.tagName==='LABEL'&&/Import HUD\/UI JSON/.test(el.textContent));
 const footerHelp=footer?.previousElementSibling;
 const footerInput=fileLabel?.querySelector('input');
 const host=panel.querySelector('#gm116-editor-host'),objectBox=panel.querySelector('#gm108-box');
 if(!head||tabBtns.length<3||!bridge||!tools||!edit||!footer){return;}
 // Retain every old control and event listener; switch only visibility in the mobile organizer.
 head.querySelector('strong').textContent='🎮 Only Crops · Game Maker';
 const hclose=head.querySelector('button:last-child');hclose.setAttribute('aria-label','Κλείσιμο Game Maker');
 const navigation=document.createElement('nav');navigation.id='gm18-navigation';navigation.setAttribute('aria-label','Κεντρικές ενότητες Game Maker');
 const areaNav=document.createElement('nav');areaNav.id='gm18-asset-nav';areaNav.setAttribute('aria-label','Εργαλεία εικόνων');areaNav.hidden=true;
 const systemNav=document.createElement('nav');systemNav.id='gm18-system-nav';systemNav.setAttribute('aria-label','Εργαλεία μηχανισμών');systemNav.hidden=true;
 const status=document.createElement('div');status.id='gm18-status';status.setAttribute('aria-live','polite');
 const home=document.createElement('section');home.id='gm18-home';home.innerHTML='<h2>Δημιούργησε τη δική σου φάρμα 🌾</h2><p>Επίλεξε τι θέλεις να επεξεργαστείς. Κάθε εργαλείο συνδέεται με το πραγματικό παιχνίδι — δεν δημιουργείται δεύτερη φάρμα.</p><div id="gm18-cards"></div><div id="gm18-actions"></div><div class="gm18-summary">ℹ Οι αλλαγές γραφικών αποθηκεύονται στη συσκευή όπου γίνονται. Για μεταφορά σε άλλη έκδοση κράτησε Backup Sprites και Export HUD/UI.</div>';
 const lead=document.createElement('div');lead.id='gm18-content-lead';lead.hidden=true;
 const help=document.createElement('div');help.id='gm18-support';help.hidden=true;
 oldTabs.before(navigation);navigation.after(areaNav);areaNav.after(systemNav);systemNav.after(status);status.after(home);home.after(lead);lead.after(help);
 const navEntries=[['home','⌂ Αρχική'],['hud','🪙 HUD'],['ui','🧰 Κουμπιά'],['assets','🌳 Εικόνες'],['systems','⚙ Μηχανισμοί'],['objects','🧱 Στοιχεία'],['gametools','🎮 Εργαλεία'],['files','💾 Αρχεία']];
 const systemEntries=[['Mechanics','⚙ Grid'],['Crops','🌾 Crops'],['Production','🐄 Ζώα'],['Economy','🪙 Market'],['Progression','⭐ XP']];
 const assetEntries=[['catalog','🗂️ Κατάλογος'],['single','🖼️ Μία εικόνα'],['bulk','📦 Πολλές'],['tune','📐 Μέγεθος'],['backup','💾 Backup']];
 const navButtons=new Map(), assetButtons=new Map(), systemButtons=new Map();
 const makeButton=(parent,label,click)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',click);parent.append(b);return b};
 let mode='home',assetMode='catalog',systemMode='Mechanics';
 const card=(title,desc,go)=>{const b=makeButton(home.querySelector('#gm18-cards'),'',go);const st=document.createElement('strong');st.textContent=title;const sp=document.createElement('span');sp.textContent=desc;b.append(st,sp)};
 const action=(label,handler)=>makeButton(home.querySelector('#gm18-actions'),label,handler);
 // Original HUD/UI/Tools button calls are the only way to change the old editor state.
 function selectOld(tab){const b=tabBtns.find(v=>v.dataset.tab===tab);if(b&&b.getAttribute('aria-pressed')!=='true')b.click()}
 const children=[...panel.children].filter(el=>![head,navigation,areaNav,systemNav,status,home,lead,help].includes(el));
 function switchScreen(next,sub,fromOriginal=false){
  if(sub&&next==='systems')systemMode=sub;
  if(!fromOriginal){if(next==='hud')selectOld('HUD');else if(next==='ui')selectOld('UI');else if(next==='assets'||next==='gametools')selectOld('Tools');else if(next==='objects')selectOld('HUD');else if(next==='systems')selectOld(systemMode)}
  mode=next;if(sub)assetMode=sub;
  for(const child of children){let visible=false;
   if(next==='hud'||next==='ui')visible=child===edit || child===oldTabs || (child.tagName==='P'&&child.classList.contains('note')) || (child.tagName==='BUTTON'&&/Επιλογή πάνω στη φάρμα/.test(child.textContent));
   else if(next==='assets'||next==='gametools')visible=child===tools;
   else if(next==='systems')visible=child===host;
   else if(next==='objects')visible=child===objectBox;
   else if(next==='files')visible=child===footer||child===fileLabel||child===footerHelp;
   child.classList.toggle('gm18-off',!visible);
  }
  if(next==='objects'&&objectBox){objectBox.hidden=false;objectBox.classList.remove('gm116-hide');}
  home.classList.toggle('gm18-off',next!=='home');
  areaNav.hidden=next!=='assets';systemNav.hidden=next!=='systems';lead.hidden=next==='home';help.hidden=next==='home';
  const guides={
   hud:['🪙 HUD / Πάνω μπάρα','Αλλαγή εικόνων, θέσεων, γραμματοσειρών και XP μπάρας. Οι πραγματικοί αριθμοί και το XP συνεχίζουν να ενημερώνονται από το παιχνίδι.'],
   ui:['🧰 Κουμπιά παιχνιδιού','Αλλαγή εμφάνισης πραγματικών κουμπιών, όχι των εντολών τους. Οι λειτουργίες Select, Plow, Market κ.ά. μένουν ίδιες.'],
   assets:['🌳 Εικόνες αντικειμένων','Ζώα, δέντρα, κτίρια, καλλιέργειες και διακοσμητικά από τον πραγματικό Sprite Engine.'],
   systems:['⚙ Μηχανισμοί παιχνιδιού','Αλλαγή πραγματικών ρυθμίσεων Grid, Crops, Ζώων, Market και XP μόνο όταν επιλέξεις Εφαρμογή.'],
   objects:['🧱 Στοιχεία φάρμας','Πρόσθεσε κείμενο ή εικόνες στη φάρμα από το υπάρχον Add / Remove εργαλείο.'],
   gametools:['🎮 Εργαλεία φάρμας','Γρήγορη πρόσβαση στις πραγματικές εντολές Select, Plow, Recycle, Market και Sprite Editor.'],
   files:['💾 Αρχεία / Εξαγωγές','Τα JSON του HUD/UI, τα backups εικόνων και η πρόοδος της φάρμας είναι διαφορετικά αρχεία.']
  };
  if(guides[next]){lead.replaceChildren();const title=document.createElement('strong');title.textContent=guides[next][0];lead.append(title,document.createTextNode(guides[next][1]));}
  for(const [key,b] of navButtons){b.setAttribute('aria-current',key===next?'page':'false')}
  for(const [key,b] of assetButtons){b.setAttribute('aria-current',key===assetMode?'page':'false')}
  for(const [key,b] of systemButtons){b.setAttribute('aria-current',key===systemMode?'page':'false')}
  if(next==='assets')showAssetMode();
  else if(next==='systems')help.textContent='Οι ρυθμίσεις εδώ επηρεάζουν πραγματικούς μηχανισμούς — κράτησε backup πριν αλλάξεις τιμές. Χρησιμοποίησε την καρτέλα παραπάνω για κατηγορία.';
  else if(next==='objects')help.textContent='Η προσθήκη/αφαίρεση αντικειμένων HUD είναι ξεχωριστή από τις εικόνες της φάρμας. Για sprites άνοιξε Εικόνες.';
  else if(next==='files'){
   help.innerHTML='<strong>Τρία διαφορετικά backups</strong><div>1. <b>Sprites:</b> εικόνες και θέσεις ζώων/κτιρίων — «Εικόνες → Backup».</div><div>2. <b>HUD/UI JSON:</b> θέση, μέγεθος και εμφάνιση του HUD.</div><div>3. <b>Πρόοδος φάρμας:</b> κανονικό αποθηκευμένο παιχνίδι.</div>';
  }else if(next==='hud'||next==='ui'){
   help.textContent='✋ Για απευθείας επιλογή ενός στοιχείου στην οθόνη, πάτησε «Επεξεργασία στη φάρμα» από την Αρχική.';
  }
  for(const child of [...tools.children])child.classList.toggle('gm18-off',next==='assets'?child!==bridge:next==='gametools'?child===bridge:true);
  status.textContent=next==='home'?'✓ Game Maker έτοιμος · διάλεξε ενότητα':next==='assets'?'Εικόνες · '+(assetEntries.find(r=>r[0]===assetMode)?.[1]||''):next==='systems'?'Μηχανισμοί · '+(systemEntries.find(r=>r[0]===systemMode)?.[1]||systemMode): 'Ενότητα: '+(guides[next]?.[0]||next);
  panel.scrollTop=0;
 }
 for(const [key,label] of navEntries)navButtons.set(key,makeButton(navigation,label,()=>switchScreen(key)));
 for(const [key,label] of assetEntries)assetButtons.set(key,makeButton(areaNav,label,()=>switchScreen('assets',key)));
 for(const [key,label] of systemEntries){if(tabBtns.some(b=>b.dataset.tab===key))systemButtons.set(key,makeButton(systemNav,label,()=>switchScreen('systems',key)))}
 card('🪙 HUD','Coins, NF Cash, XP/Level, λογότυπο',()=>switchScreen('hud'));
 card('🧰 Κουμπιά','Εργαλειοθήκη, επιλογές, zoom',()=>switchScreen('ui'));
 card('🌳 Αντικείμενα','Αναζήτηση, κατηγορίες, όλα τα sprites',()=>switchScreen('assets','catalog'));
 card('🖼️ Μία εικόνα','Προσθήκη PNG από Αρχεία iPhone',()=>switchScreen('assets','single'));
 card('📦 Πολλές εικόνες','Μαζικό PNG και αναίρεση πακέτου',()=>switchScreen('assets','bulk'));
 card('📐 Μέγεθος','Θέση, αναστροφή και κλίμακα sprite',()=>switchScreen('assets','tune'));
 card('💾 Backups','Αποθήκευση και επαναφορά εικόνων',()=>switchScreen('assets','backup'));
 card('⚙ Μηχανισμοί','Grid, crops, ζώα, Market, XP',()=>switchScreen('systems','Mechanics'));
 card('🧱 Στοιχεία','Προσθήκη ή αφαίρεση HUD/UI εικόνων',()=>switchScreen('objects'));
 card('🎮 Εργαλεία φάρμας','Select, Plow, Market και Sprite Editor',()=>switchScreen('gametools'));
 card('📤 Export φάρμας','HUD / UI JSON και πρόοδος παιχνιδιού',()=>switchScreen('files'));
 action('👆 Επεξεργασία στη φάρμα',()=>{const b=[...panel.children].find(el=>el.tagName==='BUTTON'&&/Επιλογή πάνω στη φάρμα/.test(el.textContent));if(b){b.click()}else{status.textContent='⚠ Δεν βρέθηκε η άμεση επεξεργασία στην τρέχουσα έκδοση.'}});
 action('▶ Δοκιμή παιχνιδιού',()=>{const t=document.querySelector('#gm112-mode');if(t?.classList.contains('active'))t.click();panel.hidden=true;launch.textContent='🎮 Άνοιγμα Game Maker'});
 // Preserve the old live selectors, but show only the tool needed at each step.
 const abPick=bridge.querySelector('select[aria-label="Πραγματικό αντικείμενο Sprite Editor"]');
 const filter=bridge.querySelector('#gm-cp15-filters');
 const search=[...bridge.children].find(el=>el.tagName==='INPUT'&&el.type==='search');
 const fave=bridge.querySelector('#gm-cp15-fav-selected'),list=bridge.querySelector('#gm-cp15-result-list');
 const empty=bridge.querySelector('#gm-cp15-result-list ~ p[hidden]');
 const pageControls=list?.nextElementSibling;
 const tune=bridge.querySelector('#gm-cp13-tune'),backup=bridge.querySelector('#gm-cp14-backup'),bulk=bridge.querySelector('#gm-cp16-bulk');
 const file=bridge.querySelector('#gm-cp12-image-file');
 const preview=[...bridge.children].find(el=>el.tagName==='DIV'&&el.querySelector(':scope > img[alt="Εικόνα πραγματικού sprite"]'));
 const directLabel=file?.previousElementSibling;
 const attrs=[...bridge.children];
 const keep=(node)=>node&&attrs.includes(node);
 const details=[...bridge.children].find(el=>el.tagName==='DIV'&&/overflow-wrap:anywhere/.test(el.style.cssText)&&el!==preview);
 const selectedSet=new Set([abPick,details,preview].filter(Boolean));
 const globalMsg=[...bridge.children].find(el=>el.tagName==='P'&&el.getAttribute('aria-live')==='polite');
 const directHint=file?.nextElementSibling;
 // Content nodes are NOT relocated (existing event listeners and selectors remain valid).
 const always=[...bridge.children].filter(el=>el.tagName==='STRONG'||(el.tagName==='P'&&el!==globalMsg&&/Φίλτραρε τα πραγματικά αντικείμενα/.test(el.textContent)));
 function showAssetMode(){
  for(const child of attrs){let yes=false;
   if(assetMode==='catalog')yes=always.includes(child)||[filter,search,abPick,fave,list,pageControls,empty,details,preview,globalMsg].includes(child)||child.tagName==='DIV'&&child.querySelector('button')&&/Άνοιγμα στο Sprite Editor/.test(child.textContent);
   else if(assetMode==='single')yes=[abPick,details,preview,file,directLabel,directHint,globalMsg].includes(child);
   else if(assetMode==='bulk')yes=[abPick,bulk,globalMsg].includes(child);
   else if(assetMode==='tune')yes=[abPick,details,preview,tune,globalMsg].includes(child);
   else if(assetMode==='backup')yes=[backup,globalMsg].includes(child);
   child.classList.toggle('gm18-off',!yes);
  }
  // Fallback visibility for a real selector if the content structure changes later.
  if(assetMode!=='backup'&&abPick)abPick.classList.remove('gm18-off');
  if(assetMode==='bulk')help.textContent='1. Διάλεξε εικόνες · 2. Διάλεξε αντικείμενο για κάθε μία · 3. Εφαρμογή · 4. Αναίρεση, αν χρειάζεται.';
  else if(assetMode==='single')help.textContent='Επίλεξε αντικείμενο πάνω από το πεδίο εισαγωγής. Το PNG αλλάζει μόνο την εικόνα του συγκεκριμένου αντικειμένου.';
  else if(assetMode==='tune')help.textContent='Τα ρυθμιστικά αφορούν την εικόνα, όχι το μέγεθος του αντικειμένου στο grid.';
  else if(assetMode==='backup')help.textContent='Αυτό το backup περιλαμβάνει μόνο τις εικόνες αντικειμένων. Δεν περιλαμβάνει HUD, πρόοδο ή οικονομία.';
  else help.textContent='Φίλτραρε με κατηγορία ή αναζήτησε. Πάτησε «Μία εικόνα» για PNG ή «Μέγεθος» για ρυθμίσεις.';
  help.hidden=false;
 }
 // Direct-selection remains fully wired: tapping a HUD or UI element in edit mode
 // still calls the ORIGINAL tab and synchronizes our mobile navigation.
 for(const b of tabBtns){b.addEventListener('click',()=>{const map={HUD:'hud',UI:'ui',Tools:'assets'};const newMode=map[b.dataset.tab]||(systemEntries.some(r=>r[0]===b.dataset.tab)?'systems':null);if(newMode&&mode!==newMode)switchScreen(newMode,newMode==='systems'?b.dataset.tab:undefined,true)})}
 // If the user opens from the floating game button, return to the home dashboard.
 launch.addEventListener('click',()=>{if(!panel.hidden)switchScreen('home')});
 // File input remains unchanged; the organizer provides clearer, contextual access.
 // Swipe back is intentionally not intercepted so touch sliders continue to work.
 hclose.addEventListener('click',()=>{status.textContent='Ο Game Maker έκλεισε. Οι αποθηκευμένες ρυθμίσεις παραμένουν.'});
 switchScreen('home');
 // A creator can inspect the source from an iPhone; make version explicit.
 panel.dataset.creatorUi='18';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,200),{once:true});else setTimeout(setup,200);
})();
