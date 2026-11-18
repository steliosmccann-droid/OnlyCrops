

(()=>{'use strict';
const KEY='FarmVille3026_V108_Objects';
const targets=[['Coins εικόνα','.fv90-coin'],['Coins αριθμός','#fv90Coins'],['NF Cash εικόνα','.fv90-cash'],['NF Cash αριθμός','#fv90Cash'],['XP εικόνα','.fv90-xp'],['Level','#fv90Level'],['XP bar','.fv90-xp-track'],['XP κείμενο','#fv90XpText'],['Only Crops Logo','.fv90-logo'],['Πινακίδα','.fv90-name'],['Όνομα','#fv90Name'],['Toolbar','.classic-tools'],['Select','#fvMulti'],['Plow','#fvPlow'],['Recycle','#fvRecycle'],['Ribbons','#fv39Ribbons'],['Market','#fvMarket'],['Gifts','#fvGifts']];
const $=q=>{try{return document.querySelector(q)}catch(e){return null}};
const make=(tag,p,txt)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;p.append(e);return e};
const cap=(n,a,b)=>Math.min(b,Math.max(a,Number(n)||0));
let model={objects:[],hidden:[]},selected=null,drag=null;
try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&Array.isArray(v.objects)&&Array.isArray(v.hidden))model=v}catch(e){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(model));return true}catch(e){return false}}
function draw(){
 document.querySelectorAll('.gm108-object').forEach(n=>n.remove());
 for(const [label,sel] of targets){const n=$(sel);if(n)n.style.setProperty('visibility',model.hidden.includes(sel)?'hidden':'','important')}
 for(const item of model.objects){const el=make('div',document.body);el.className='gm108-object'+(selected===item.id?' gm108-selected':'');el.dataset.gm108Id=item.id;
  el.style.left=cap(item.x,0,innerWidth-25)+'px';el.style.top=cap(item.y,0,innerHeight-25)+'px';el.style.width=cap(item.w,24,600)+'px';el.style.height=cap(item.h,24,600)+'px';
  if(item.type==='image'){const img=make('img',el);img.src=item.src;img.alt='Game Maker asset'}else{el.textContent=item.text;el.style.font=`bold ${cap(item.font||20,10,70)}px system-ui`;el.style.color=item.color||'#fff';el.style.textShadow='0 1px 3px #000a'}
  el.onpointerdown=e=>{e.preventDefault();selected=item.id;el.setPointerCapture(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:item.x,oy:item.y};selectItem();};
  el.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;item.x=cap(drag.ox+e.clientX-drag.x,0,innerWidth-25);item.y=cap(drag.oy+e.clientY-drag.y,0,innerHeight-25);el.style.left=item.x+'px';el.style.top=item.y+'px'};
  el.onpointerup=el.onpointercancel=()=>{if(drag){drag=null;persist();selectItem()}};
 }
}
function init(){const panel=$('#gm106-panel');if(!panel)return;
 const box=make('section',panel);box.id='gm108-box';make('strong',box,'🧱 Αντικείμενα · Add / Remove');
 make('p',box,'Πρόσθεσε κείμενο ή PNG πάνω στη φάρμα. Σύρε το με το δάχτυλο. Τα υπάρχοντα στοιχεία HUD/UI κρύβονται χωρίς να διαγράφονται οι μηχανισμοί τους.');
 const label=make('label',box,'Νέο κείμενο');const text=make('input',label);text.type='text';text.placeholder='π.χ. Καλώς ήρθες!';
 const actions=make('div',box);actions.className='actions';
 const button=(name,fn)=>{const b=make('button',actions,name);b.type='button';b.onclick=fn;return b};
 const msg=make('p',box,'');msg.setAttribute('aria-live','polite');
 const newId=()=> 'gm-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
 button('＋ Προσθήκη κειμένου',()=>{const t=text.value.trim();if(!t){msg.textContent='Γράψε πρώτα κείμενο';return}const item={id:newId(),type:'text',text:t,x:110,y:220,w:210,h:52,font:20};model.objects.push(item);selected=item.id;persist();draw();selectItem();msg.textContent='✓ Προστέθηκε'});
 const pngLabel=make('label',box,'＋ Προσθήκη PNG');const png=make('input',pngLabel);png.type='file';png.accept='image/png';
 png.onchange=async()=>{try{const f=png.files?.[0];if(!f)return;if(f.size>750000)throw Error('PNG έως 750 KB για τοπική αποθήκευση');const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)});const item={id:newId(),type:'image',src,x:110,y:220,w:120,h:120};model.objects.push(item);selected=item.id;if(!persist()){model.objects.pop();throw Error('Δεν χωρά στην τοπική αποθήκευση')}draw();selectItem();msg.textContent='✓ Το PNG προστέθηκε'}catch(e){msg.textContent='⚠ '+e.message}finally{png.value=''}};
 const choiceLabel=make('label',box,'Επιλεγμένο αντικείμενο');const choice=make('select',choiceLabel);
 const fields=make('div',box);fields.className='fields';const inputs={};
 for(const [k,title,min,max] of [['x','X',0,1200],['y','Y',0,1800],['w','Πλάτος',24,600],['h','Ύψος',24,600]]){
  const l=make('label',fields,title),inp=make('input',l);inp.type='number';inp.min=min;inp.max=max;inputs[k]=inp;
  inp.onchange=()=>{const item=model.objects.find(x=>x.id===selected);if(!item)return;item[k]=cap(inp.value,min,max);persist();draw();selectItem(false)};
 }
 function selectItem(rebuild=true){if(rebuild){choice.replaceChildren();const blank=make('option',choice,'— Επιλογή —');blank.value='';for(const item of model.objects){const op=make('option',choice,item.type==='text'?item.text.slice(0,28):'🖼 PNG '+item.id.slice(-4));op.value=item.id}choice.value=selected||''}
  const item=model.objects.find(x=>x.id===selected);for(const [k,input] of Object.entries(inputs)){input.disabled=!item;input.value=item?item[k]:''}
 }
 choice.onchange=()=>{selected=choice.value;draw();selectItem(false)};
 button('🗑 Αφαίρεση επιλεγμένου',()=>{if(!selected){msg.textContent='Επίλεξε αντικείμενο';return}model.objects=model.objects.filter(x=>x.id!==selected);selected=null;persist();draw();selectItem();msg.textContent='✓ Αφαιρέθηκε'});
 const existingLabel=make('label',box,'Υπάρχον HUD / UI');const existing=make('select',existingLabel);
 for(const [name,sel] of targets){const opt=make('option',existing,name);opt.value=sel}
 button('− Απόκρυψη',()=>{if(!model.hidden.includes(existing.value))model.hidden.push(existing.value);persist();draw();msg.textContent='✓ Κρύφτηκε χωρίς διαγραφή'});
 button('＋ Επαναφορά',()=>{model.hidden=model.hidden.filter(x=>x!==existing.value);persist();draw();msg.textContent='✓ Εμφανίστηκε ξανά'});
 button('↺ Επαναφορά όλων',()=>{if(!confirm('Να αφαιρεθούν όλα τα πρόσθετα αντικείμενα και να εμφανιστούν όλα τα κρυμμένα;'))return;model={objects:[],hidden:[]};selected=null;persist();draw();selectItem()});
 button('⬇ Export Objects JSON',()=>{const blob=new Blob([JSON.stringify({schema:'FarmVille3026-Objects-V108',...model},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),a=make('a',document.body);a.href=u;a.download='FarmVille3026_V108_Objects.json';a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)});
 selectItem();draw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

