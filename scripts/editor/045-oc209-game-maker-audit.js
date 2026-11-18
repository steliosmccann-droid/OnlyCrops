/* Only Crops CP20.9: Non-destructive Game Maker diagnostics. No gameplay mutations. */
(()=>{'use strict';
let attempts=0;
function setup(){
 const panel=document.getElementById('gm106-panel');
 const home=document.getElementById('gm18-home');
 const bar=document.getElementById('gm20-bar');
 if(!panel||!home||!bar){if(++attempts<80)setTimeout(setup,250);return;}
 if(document.getElementById('oc209-diagnostics'))return;
 const section=document.createElement('section');section.id='oc209-diagnostics';
 section.style.cssText='margin:12px 0;padding:12px;border:1px solid #bc9562;border-radius:10px;background:#fff7e6;color:#50361d';
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='🩺 Έλεγχος λειτουργιών Game Maker';toggle.style.cssText='display:block;width:100%;min-height:44px;padding:10px;border-radius:8px;background:#ecd19c;color:#483015;border:1px solid #9b7141;font-weight:bold';
 const out=document.createElement('div');out.hidden=true;out.setAttribute('aria-live','polite');out.style.cssText='font-size:12px;line-height:1.5;overflow-wrap:anywhere;margin-top:10px';
 const again=document.createElement('button');again.type='button';again.textContent='↻ Επανέλεγχος';again.hidden=true;again.style.marginTop='8px';
 section.append(toggle,out,again);home.prepend(section);
 function check(){
  const results=[];
  const add=(name,yes,why)=>results.push({name,ok:!!yes,detail:yes?'':why||'Δεν βρέθηκε / δεν είναι διαθέσιμο'});
  const e=id=>document.getElementById(id);
  const visible=node=>!!(node&&!node.hidden&&!node.classList.contains('gm18-off')&&!node.classList.contains('gm116-hide')&&getComputedStyle(node).display!=='none');
  add('Κεντρικό παράθυρο',!!panel,'Λείπει το gm106-panel');
  add('Πλοήγηση',!!e('gm20-section')&&!!e('gm18-navigation'),'Λείπει ένα από τα μενού ενοτήτων');
  add('HUD/UI',!!panel.querySelector('.tabs button[data-tab="HUD"]')&&!!panel.querySelector('.tabs button[data-tab="UI"]'),'Λείπει μία καρτέλα HUD/UI');
  add('Εικόνες / Sprites',!!e('gm106-real-asset-bridge')&&!!e('assetTarget')&&!!window.FV83Assets,'Δεν συνδέθηκε ο πραγματικός Sprite Engine');
  add('PNG από iPhone',!!e('gm-cp12-image-file')&&e('gm-cp12-image-file').type==='file','Δεν υπάρχει το πραγματικό πεδίο εισαγωγής PNG');
  add('Μηχανισμοί Grid',!!e('gm113-panel')&&!!window.FV113Mechanics,'Δεν συνδέθηκε ο Grid Editor');
  add('Καλλιέργειες',!!e('gm114-panel')&&!!window.FarmCrops?.SEEDS,'Δεν συνδέθηκε ο Crops Editor');
  add('Ζώα & Δέντρα',!!e('gm117-editor')&&!!window.FarmProduction?.save,'Δεν συνδέθηκε το Production Editor');
  add('Market / Οικονομία',!!e('gm118-economy')&&!!window.FV118Economy?.set,'Δεν συνδέθηκε το Market Editor');
  add('Progression / XP',!!e('gm119-progression'),'Δεν συνδέθηκε το Progression Editor');
  add('HUD Objects',!!e('gm108-box'),'Δεν υπάρχει το εργαλείο πρόσθετων στοιχείων HUD');
  add('Animation Studio',!!e('gm19-studio')&&!!e('gm19-nav'),'Δεν εγκαταστάθηκε το Animation Studio');
  const original=!!e('gm106-panel')&&!e('gm106-panel').hidden;
  add('Ο Game Maker είναι ανοιχτός',original,'Το παράθυρο είναι κλειστό ή ελαχιστοποιημένο');
  const which=e('gm20-section')?.value;
  const map={assets:'gm106-real-asset-bridge',systems:'gm116-editor-host',objects:'gm108-box',studio:'gm19-studio'};
  if(map[which]){
   const target=e(map[which]);
   // A child may be hidden while a parent is visible: test both.
   const showing=!!(target&&target.getClientRects().length&&getComputedStyle(target).display!=='none');
   add('Ορατότητα ενεργής ενότητας ('+which+')',showing,'Η τρέχουσα ενότητα φαίνεται κρυμμένη · χρειάζεται έλεγχος πλοήγησης');
  }
  const key='OnlyCrops_CP209_Storage_Test';
  let storage=false;
  try{localStorage.setItem(key,'ok');storage=localStorage.getItem(key)==='ok';localStorage.removeItem(key)}catch(e){}
  add('Αποθήκευση Safari',storage,'Η δοκιμαστική εγγραφή localStorage απέτυχε · οι αποθηκεύσεις μπορεί να μην διατηρούνται');
  return results;
 }
 function run(){
  let list;try{list=check()}catch(e){list=[{name:'Διάγνωση',ok:false,detail:String(e)}]}
  out.replaceChildren();
  const passed=list.filter(x=>x.ok).length;
  const h=document.createElement('strong');h.textContent='Αποτέλεσμα: '+passed+'/'+list.length+' έλεγχοι';out.append(h);
  const ul=document.createElement('ul');ul.style.cssText='padding-left:18px;margin:8px 0';
  list.forEach(item=>{const li=document.createElement('li');li.style.marginBottom='4px';li.textContent=(item.ok?'✓ ':'⚠ ')+item.name+(item.ok?'':' — '+item.detail);ul.append(li)});
  out.append(ul);
  const foot=document.createElement('p');foot.textContent='Ο έλεγχος δεν τροποποιεί αντικείμενα, τιμές ή saves. Ελέγχει συνδέσεις και διαθεσιμότητα, όχι την πλήρη συμπεριφορά κάθε εργαλείου.';out.append(foot);
  out.hidden=false;again.hidden=false;
 }
 toggle.addEventListener('click',run);again.addEventListener('click',run);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
