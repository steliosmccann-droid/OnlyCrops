

(()=>{'use strict';
const create=(tag,parent,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;parent.append(e);return e};
function init(){const launch=create('button',document.body,'⚙ Μηχανισμοί');launch.id='gm113-launch';const panel=create('section',document.body);panel.id='gm113-panel';panel.hidden=true;
const head=create('div',panel);head.className='gm113-line';create('strong',head,'⚙ Game Maker · Μηχανισμοί');const minimize=create('button',head,'—');minimize.onclick=()=>panel.hidden=true;
const help=create('p',panel,'Επεξεργασία πραγματικών ορισμών αντικειμένων στο grid. Οι αλλαγές αποθηκεύονται τοπικά και εφαρμόζονται σε νέες τοποθετήσεις.');help.className='gm113-note';
const api=()=>window.FV113Mechanics;
const status=create('p',panel,'');status.className='gm113-note';
const search=create('input',panel);search.type='search';search.placeholder='Αναζήτηση αντικειμένου / κατηγορίας';
const select=create('select',panel);select.size=1;
const nameLabel=create('label',panel,'Όνομα αντικειμένου');const name=create('input',nameLabel);name.type='text';name.maxLength=80;name.style.width='100%';
const dims=create('div',panel);dims.className='gm113-line';create('span',dims,'Grid footprint:');const w=create('input',dims);w.type='number';w.min=1;w.max=24;w.step=1;w.setAttribute('aria-label','Πλάτος grid');create('span',dims,'×');const h=create('input',dims);h.type='number';h.min=1;h.max=24;h.step=1;h.setAttribute('aria-label','Ύψος grid');
const detail=create('p',panel,'');detail.className='gm113-note';
const actions=create('div',panel);actions.className='gm113-line';
function button(t,fn){const b=create('button',actions,t);b.onclick=fn;return b}
function list(){const a=api();return a?a.list():[]}
function refresh(keep){const term=search.value.toLocaleLowerCase('el');const items=list().filter(d=>(d.name+' '+d.id+' '+d.group).toLocaleLowerCase('el').includes(term));select.replaceChildren();for(const d of items){const o=create('option',select,d.name+' · '+d.w+'×'+d.h);o.value=d.id}if(keep&&items.some(x=>x.id===keep))select.value=keep;sync()}
function sync(){const d=list().find(x=>x.id===select.value);for(const e of [name,w,h])e.disabled=!d;if(!d){detail.textContent='Δεν βρέθηκε αντικείμενο';return}name.value=d.name;w.value=d.w;h.value=d.h;detail.textContent=`ID: ${d.id} · Κατηγορία: ${d.group} · Αρχικό μέγεθος: ${d.original.w}×${d.original.h}`}
search.oninput=()=>refresh();select.onchange=sync;
button('✓ Εφαρμογή',()=>{const a=api();if(!a){status.textContent='⚠ Δεν είναι διαθέσιμος ο μηχανισμός';return}if(!a.update(select.value,{name:name.value,w:Number(w.value),h:Number(h.value)})){status.textContent='⚠ Μη έγκυρες διαστάσεις (1–24)';return}status.textContent='✓ Αποθηκεύτηκε. Οι νέες τοποθετήσεις χρησιμοποιούν τις διαστάσεις.';refresh(select.value)});
button('↺ Επαναφορά',()=>{const a=api();if(a?.reset(select.value)){status.textContent='✓ Επαναφορά εργοστασιακού ορισμού';refresh(select.value)}});
button('💾 Save Game',()=>{try{api()?.saveGame();status.textContent='✓ Ζητήθηκε αποθήκευση φάρμας'}catch(e){status.textContent='⚠ '+e.message}});
button('⬇ Export',()=>{const data=api()?.export();if(!data)return;const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=create('a',document.body);a.href=url;a.download='FarmVille3026_V113_Mechanics.json';a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)});
const file=create('input',panel);file.type='file';file.accept='.json,application/json';file.onchange=async()=>{try{const f=file.files?.[0];if(!f)return;if(f.size>200000)throw Error('Μεγάλο JSON');if(!api()?.import(JSON.parse(await f.text())))throw Error('Μη συμβατό αρχείο');status.textContent='✓ Import ολοκληρώθηκε';refresh()}catch(e){status.textContent='⚠ '+e.message}finally{file.value=''}};
create('p',panel,'Δεν αλλάζει ακόμη τη συμπεριφορά crops, timers, οικονομίας ή μηχανημάτων. Αυτά απαιτούν ξεχωριστές ασφαλείς συνδέσεις με το game engine.').className='gm113-note';
launch.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden)refresh(select.value)};
refresh();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

