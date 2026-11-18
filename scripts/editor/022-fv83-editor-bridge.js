

(function(){'use strict';
const KEY='FarmVille3026_V83_Asset_Editor_Position';
function el(tag,attrs={},text){const a=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='className')a.className=v;else a.setAttribute(k,v)}if(text!==undefined)a.textContent=text;return a}
function btn(t,fn,id){const b=el('button',{type:'button'},t);if(id)b.id=id;b.addEventListener('click',fn);return b}
function saveFile(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),45000)}
function toURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Δεν διαβάζεται το αρχείο'));r.readAsDataURL(blob)})}
function setup(){
 const panel=document.getElementById('assetPanel');
 const engine=window.FV83Assets,defs=window.FV83Defs;
 if(!panel||!engine)return;
 const target=document.getElementById('assetTarget');
 const heading=panel.querySelector('.asset-head');
 const title=heading?.querySelector('strong');if(title)title.textContent='⠿ 🎨 Asset Editor · V83';
 // V123: Legacy settings launchers removed; Game Maker is the single entry point.
 const minimize=btn('▱',()=>panel.classList.toggle('fv83-collapsed'),'fv83-minimize');minimize.title='Σύμπτυξη ή άνοιγμα';heading.insertBefore(minimize,heading.querySelector('#assetClose'));
 const footprint=el('div',{id:'fv83-footprint'});const targetLabel=target.closest('label');target.after(footprint);
 function updateFootprint(){const id=target.value,d=defs.get(id),asset=engine.get(id);footprint.textContent=d?`Αντικείμενο: ${d.name} · grid ${d.w}×${d.h} (κλειδωμένο)`:`${id==='farmer'||id==='farmer_blonde'?'Χαρακτήρας':'Καλλιέργεια'} · Δεν αλλάζει το grid`;if(asset?.blob)footprint.textContent+=' · Προσαρμοσμένο PNG';}
 target.addEventListener('change',updateFootprint);updateFootprint();
 const info=el('div',{className:'fv83-group'});
 info.append(el('strong',{},'🖼️ Ρυθμίσεις εικόνας'));
 info.append(el('p',{},'Επίλεξε αντικείμενο → PNG/WebP → κλίμακα, θέση ή animation → Αποθήκευση εικόνας. Οι αλλαγές εφαρμόζονται στον υπάρχοντα Sprite Engine, χωρίς αλλαγή footprint.'));
 const adjust=btn('💾 Αποθήκευση μόνο των ρυθμίσεων',async()=>{
   const id=target.value,a=engine.get(id);if(!a){alert('Δεν υπάρχει εικόνα για αυτόν τον στόχο. Εισήγαγε PNG πρώτα.');return}
   try{
     let blob=a.blob;
     if(!blob && a.inlineSrc){const response=await fetch(a.inlineSrc);blob=await response.blob()}
     if(!blob)throw Error('Δεν βρέθηκαν δεδομένα εικόνας');
     const conf=engine.settings({scale:document.getElementById('assetScale').value,cols:document.getElementById('assetCols').value,rows:document.getElementById('assetRows').value,fps:document.getElementById('assetFPS').value,offsetX:document.getElementById('assetOffsetX').value,offsetY:document.getElementById('assetOffsetY').value,flipX:document.getElementById('assetFlipX').checked});
     await engine.set(id,blob,conf);document.getElementById('assetMessage').textContent='✓ Αποθηκεύτηκαν οι αλλαγές στο sprite '+id;updateFootprint();
   }catch(e){document.getElementById('assetMessage').textContent='⚠ '+e.message}
 });info.append(adjust);
 const exportSection=el('div',{className:'fv83-group'});exportSection.append(el('strong',{},'📦 Δύο αρχεία για ενσωμάτωση'));
 exportSection.append(el('p',{},'Αφού ολοκληρώσεις τα γραφικά, πάτα «Asset αρχείο για ChatGPT». Το αρχείο περιέχει τις εικόνες που άλλαξες και τις ρυθμίσεις τους. Οι αλλαγές HUD/UI εξάγονται από το Game Maker.'));
 const exportAsset=btn('📦 Εξαγωγή Assets για ChatGPT',async()=>{
  const status=document.getElementById('fv83-export-status');status.textContent='Δημιουργία αρχείου…';
  try{
   const modified=engine.entries().filter(([name,a])=>a.blob&&engine.allowed.includes(name));
   if(!modified.length){status.textContent='Δεν έχεις αποθηκεύσει ακόμη δικά σου PNG στον Sprite Engine. Εισήγαγε εικόνα και πάτα Αποθήκευση εικόνας.';return}
   const images=[];for(const [name,a] of modified){const d=defs.get(name);images.push({id:name,displayName:d?.name||name,lockedFootprint:d?{width:d.w,height:d.h}:null,config:a.conf,filename:`${name}.${a.blob.type==='image/webp'?'webp':a.blob.type==='image/jpeg'?'jpg':'png'}`,mimeType:a.blob.type,base64DataURL:await toURL(a.blob)})}
   saveFile({format:'FarmVille3026-Asset-Editor-Handoff',schemaVersion:1,fromVersion:'V83',createdAt:new Date().toISOString(),instructions:'Replace visual sprites and sprite configurations only. Keep original grid footprints, map, gameplay rules and save keys unchanged. Imported images are embedded as data URLs.',assets:images},'FarmVille3026_V83_Assets_For_ChatGPT.json');status.textContent=`✓ Εξήχθησαν ${images.length} αλλαγμένα assets. Στείλε αυτό το JSON στο chat.`;
  }catch(err){status.textContent='⚠ '+err.message}
 },'fv83-export-chat');exportSection.append(exportAsset);
 const status=el('div',{id:'fv83-export-status',className:'fv83-note'},'Για HUD/UI χρησιμοποίησε την εξαγωγή του Game Maker.');exportSection.append(status);
 const oldExports=panel.querySelector('.asset-export');if(oldExports)panel.insertBefore(info,oldExports);else panel.append(info);panel.insertBefore(exportSection,oldExports||null);
 // Keep current panel within finger reach, while allowing free motion.
 let drag=null;
 heading.addEventListener('pointerdown',ev=>{if(ev.target.closest('button')||ev.target.closest('input'))return;const r=panel.getBoundingClientRect();drag={x:ev.clientX,y:ev.clientY,left:r.left,top:r.top,id:ev.pointerId};heading.setPointerCapture?.(ev.pointerId);ev.preventDefault()});
 heading.addEventListener('pointermove',ev=>{if(!drag||ev.pointerId!==drag.id)return;const x=drag.left+ev.clientX-drag.x,y=drag.top+ev.clientY-drag.y;panel.style.left=x+'px';panel.style.top=y+'px';panel.style.right='auto';panel.style.bottom='auto';ev.preventDefault()});
 const endDrag=()=>{if(!drag)return;drag=null;try{localStorage.setItem(KEY,JSON.stringify({left:panel.style.left,top:panel.style.top}))}catch(e){}};
 heading.addEventListener('pointerup',endDrag);heading.addEventListener('pointercancel',endDrag);
 try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p&&typeof p.left==='string'&&typeof p.top==='string'){panel.style.left=p.left;panel.style.top=p.top;panel.style.right='auto';panel.style.bottom='auto'}}catch(e){}
 // Separate export UI shortcut for convenience, no duplicate export logic.
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

