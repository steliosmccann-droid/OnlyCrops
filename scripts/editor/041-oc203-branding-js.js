
(()=>{'use strict';
/* ONLY CROPS CP20.3: user-visible identity & Game Maker bridge only.
   IMPORTANT: Do NOT rename legacy localStorage keys, JSON schemas, asset paths,
   selector IDs, XP/coins binding, or gameplay event handlers. */
let attempts=0;
function setup(){
 const panel=document.getElementById('gm106-panel');
 const navigation=document.getElementById('gm20-section');
 const replacement=document.getElementById('gm106-generic-replace-card');
 const logo=document.querySelector('#fv90-nostalgia-hud .fv90-logo');
 if(!panel||!navigation||!replacement||!logo){if(++attempts<100)setTimeout(setup,140);return;}
 if(document.getElementById('oc203-brand-card'))return;
 const edit=replacement.parentElement;
 const pick=edit.querySelector(':scope > select');
 const originalLogoInput=document.getElementById('gm106-logo-file');
 const originalRestore=[...document.querySelectorAll('#gm106-logo-asset-card button')].find(b=>b.textContent.includes('Επαναφορά'));
 const card=document.createElement('section');card.id='oc203-brand-card';
 card.innerHTML=`<strong class="oc203-heading">🍅 Only Crops · Ταυτότητα παιχνιδιού</strong>
 <p class="oc203-note">Το εγκεκριμένο λογότυπο έχει τη ντομάτα <b>χωρίς σώμα</b>, το καρότο με γυαλιά και είναι ήδη ενσωματωμένο. Μπορείς να το αντικαταστήσεις οποτεδήποτε.</p>
 <div class="oc203-logo" role="img" aria-label="Εγκεκριμένο Only Crops logo με ντομάτα χωρίς σώμα, καρότο και σύνθημα"></div>
 <p class="oc203-tagline">“The only crops worth subscribing to.”</p>
 <div class="oc203-actions"><button type="button" id="oc203-edit-logo">🖼️ Αλλαγή λογότυπου</button>
 <button type="button" id="oc203-restore-logo">↺ Επαναφορά Only Crops</button></div>
 <p class="oc203-feedback" id="oc203-brand-feedback" aria-live="polite">Οι αποθηκευμένες αλλαγές στον Game Maker εξακολουθούν να ισχύουν. Οι μηχανισμοί και τα saves δεν αλλάζουν.</p>`;
 // Keep the existing item picker and Coins positioning tool at the top of HUD.
 // CP20.3 inserted this large logo card as the first child, burying later tools on iPhone.
 const coinsPosition=edit.querySelector('#oc210-coins-position');
 if(coinsPosition)coinsPosition.after(card);
 else edit.insertBefore(card,replacement);

 const preview=card.querySelector('.oc203-logo'),feedback=card.querySelector('#oc203-brand-feedback');
 const selectLogo=()=>{
  if(!pick||![...pick.options].some(o=>o.value==='.fv90-logo')){feedback.textContent='⚠ Ο στόχος Logo δεν είναι διαθέσιμος.';return false;}
  pick.value='.fv90-logo';pick.dispatchEvent(new Event('change',{bubbles:true}));return true;
 };
 const sync=()=>{
  card.hidden=navigation.value!=='hud';
  if(card.hidden)return;
  // Show the real currently visible logo skin (including the creator's PNG override).
  preview.style.backgroundImage=getComputedStyle(logo).backgroundImage;
 };
 card.querySelector('#oc203-edit-logo').addEventListener('click',()=>{
  if(!selectLogo())return;
  feedback.textContent='✓ Επιλέχθηκε το πραγματικό λογότυπο. Χρησιμοποίησε το πεδίο PNG του Game Maker παρακάτω.';
  document.getElementById('gm106-logo-asset-card')?.scrollIntoView({behavior:'smooth',block:'start'});
 });
 card.querySelector('#oc203-restore-logo').addEventListener('click',()=>{
  if(!selectLogo())return;
  if(originalRestore&&!originalRestore.disabled){originalRestore.click();feedback.textContent='✓ Επαναφέρθηκε το εγκεκριμένο Only Crops λογότυπο.';}
  else feedback.textContent='✓ Ήδη χρησιμοποιείται το εγκεκριμένο λογότυπο ή δεν υπάρχει προσωπικό PNG προς επαναφορά.';
  requestAnimationFrame(sync);
 });
 navigation.addEventListener('change',sync);
 // Old tabs, home shortcuts, and editor selection can all change navigation.
 panel.addEventListener('click',()=>requestAnimationFrame(sync));
 if(pick)pick.addEventListener('change',()=>requestAnimationFrame(sync));
 const observer=new MutationObserver(()=>requestAnimationFrame(sync));
 observer.observe(logo,{attributes:true,attributeFilter:['style']});
 sync();
 panel.dataset.creatorUi='20.3';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
