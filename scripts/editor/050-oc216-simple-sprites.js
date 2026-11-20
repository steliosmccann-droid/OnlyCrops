/* Only Crops CP20.16 — simple Sprite entry point; uses the original CP12 image input
 and Sprite Engine; does not create a second editor or touch farm data. */
(()=>{'use strict';
let attempts=0;
function install(){
 const panel=document.getElementById('gm106-panel'),nav=document.getElementById('gm20-section');
 const bridge=document.getElementById('gm106-real-asset-bridge');
 const original=bridge?.querySelector('select[aria-label="Πραγματικό αντικείμενο Sprite Editor"]');
 const file=document.getElementById('gm-cp12-image-file');
 const statusOriginal=[...bridge?.querySelectorAll('p[aria-live="polite"]')||[]].slice(-1)[0];
 if(!panel||!nav||!bridge||!original||!file||!document.getElementById('assetTarget')){
  if(++attempts<100)setTimeout(install,200);return;
 }
 if(document.getElementById('oc216-simple-sprites'))return;
 const create=(tag,parent,value)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;parent.append(e);return e};
 const card=create('section',bridge);card.id='oc216-simple-sprites';bridge.prepend(card);
 create('h2',card,'🌳 Εικόνες — Εύκολη επεξεργασία');
 create('p',card,'1. Βρες αντικείμενο. 2. Επίλεξε PNG από το iPhone. 3. Η εικόνα εφαρμόζεται στη φάρμα.');
 const searchLabel=create('label',card,'Αναζήτηση αντικειμένου');
 const search=create('input',searchLabel);search.type='search';search.placeholder='π.χ. cow, chicken, apple…';search.id='oc216-search';search.autocomplete='off';
 const pickerLabel=create('label',card,'Ποιο αντικείμενο;');
 const picker=create('select',pickerLabel);picker.id='oc216-picker';
 const info=create('p',card);info.id='oc216-info';info.setAttribute('aria-live','polite');
 const preview=create('div',card);preview.id='oc216-preview';
 const img=create('img',preview);img.alt='Προεπισκόπηση επιλεγμένου sprite';img.hidden=true;
 const noImg=create('p',preview,'Δεν υπάρχει ακόμη δική σου εικόνα γι’ αυτό το αντικείμενο.');
 const fileLabel=create('label',card,'📁 Επιλογή PNG, JPG ή WebP από iPhone');
 const choose=create('button',fileLabel,'＋ Διάλεξε εικόνα');choose.type='button';
 const explanation=create('p',card,'Χρησιμοποιεί την ίδια εισαγωγή εικόνας που υπάρχει ήδη στο παιχνίδι. Μέχρι 8 MB. Το grid δεν αλλάζει.');
 const message=create('p',card);message.id='oc216-message';message.setAttribute('role','status');
 const advanced=create('button',card,'⚙ Περισσότερα: μέγεθος, animation, backup');advanced.id='oc216-advanced';advanced.type='button';advanced.setAttribute('aria-expanded','false');
 let objectUrl=null,advancedOpen=false,all=[];
 function fold(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el-GR')}
 function data(){
  const target=document.getElementById('assetTarget');
  const source=[...target.options].filter(o=>o.value);
  const used=new Set();
  return source.filter(o=>!used.has(o.value)&&used.add(o.value)).map(o=>({id:o.value,name:o.textContent.trim()||o.value}));
 }
 function fill(){
  const current=picker.value||original.value||'cow',q=fold(search.value.trim());
  all=data().filter(x=>!q||fold(x.name+' '+x.id).includes(q));
  picker.replaceChildren();
  for(const row of all){const opt=create('option',picker,row.name+' · '+row.id);opt.value=row.id}
  if(all.some(o=>o.id===current))picker.value=current;
  else if(all.length)picker.value=all[0].id;
  picker.disabled=!all.length;choose.disabled=!all.length;
  if(!all.length){info.textContent='Δεν βρέθηκε αντικείμενο. Δοκίμασε άλλη αναζήτηση.';img.hidden=true;noImg.hidden=false;return}
  selectOriginal();
 }
 function selectOriginal(){
  const id=picker.value;if(!id)return;
  if(![...original.options].some(o=>o.value===id)){
   message.textContent='⚠ Αυτό το αντικείμενο δεν είναι διαθέσιμο στον ενεργό Sprite Engine.';
   choose.disabled=true;return;
  }
  choose.disabled=false;
  if(original.value!==id){original.value=id;original.dispatchEvent(new Event('change',{bubbles:true}))}
  draw();
 }
 function draw(){
  const id=picker.value,engine=window.FV83Assets,asset=engine?.get?.(id),def=window.FV83Defs?.get?.(id);
  if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}
  img.removeAttribute('src');img.hidden=true;noImg.hidden=false;
  info.textContent=(def?.name||id)+(def?' · Grid '+def.w+'×'+def.h:'')+' · '+(asset?.blob?'Δικό σου sprite':asset?.inlineSrc?'Ενσωματωμένη εικόνα':'Χωρίς εικόνα PNG');
  let src='';
  if(asset?.blob){objectUrl=URL.createObjectURL(asset.blob);src=objectUrl}
  else if(typeof asset?.inlineSrc==='string')src=asset.inlineSrc;
  if(src){img.src=src;img.hidden=false;noImg.hidden=true}
 }
 function changeAdvanced(next){
  advancedOpen=next;
  panel.classList.toggle('oc216-assets-advanced',next);
  advanced.textContent=next?'✕ Κλείσιμο προηγμένων':'⚙ Περισσότερα: μέγεθος, animation, backup';
  advanced.setAttribute('aria-expanded',String(next));
  const submenu=document.getElementById('gm20-subsection');
  if(next&&submenu&&[...submenu.options].some(o=>o.value==='single')){
   submenu.value='single';submenu.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }
 function refresh(){
  const active=nav.value==='assets';
  panel.classList.toggle('oc216-assets-active',active);
  card.hidden=!active;
  if(!active){panel.classList.remove('oc216-assets-advanced');return}
  if(advancedOpen)panel.classList.add('oc216-assets-advanced');
  if(!picker.options.length)fill();
  else draw();
 }
 picker.addEventListener('change',selectOriginal);
 search.addEventListener('input',fill);
 choose.addEventListener('click',()=>{
  selectOriginal();
  if(choose.disabled)return;
  // Direct iPhone user gesture on the real input; its original onChange owns
  // validation, image decoding, saving and updating the map.
  file.click();
 });
 advanced.addEventListener('click',()=>{changeAdvanced(!advancedOpen)});
 nav.addEventListener('change',()=>requestAnimationFrame(refresh));
 if(statusOriginal)new MutationObserver(()=>{
  message.textContent=statusOriginal.textContent||'';
  draw();
 }).observe(statusOriginal,{subtree:true,characterData:true,childList:true});
 window.addEventListener('pagehide',()=>{if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}},{once:true});
 fill();refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
