

(()=>{'use strict';function init(){const gm=document.getElementById('gm106-panel'),tabs=gm?.querySelector('.tabs'),host=document.getElementById('gm116-editor-host'),api=window.FV118Economy;if(!gm||!tabs||!host||!api)return;
const tab=document.createElement('button');tab.dataset.tab='Economy';tab.textContent='🛒 Market';tabs.append(tab);
const panel=document.createElement('section');panel.id='gm118-economy';panel.hidden=true;host.append(panel);
const title=document.createElement('strong');title.textContent='🛒 Market & Economy';panel.append(title);
const help=document.createElement('small');help.textContent='Επεξεργασία Coins και επιπέδου ξεκλειδώματος για αντικείμενα με καταχωρισμένη τιμή Coins. Δεν αλλάζει τις τιμές NF Cash ή τις καλλιέργειες.';panel.append(help);
const search=document.createElement('input');search.placeholder='🔎 Αναζήτηση αντικειμένου';panel.append(search);
const select=document.createElement('select');panel.append(select);
const mk=(text,type='number')=>{const l=document.createElement('label');l.textContent=text;const input=document.createElement('input');input.type=type;l.append(input);panel.append(l);return input};
const price=mk('Τιμή αγοράς (Coins)'),level=mk('Επίπεδο ξεκλειδώματος');price.min=0;price.max=100000000;price.step=1;level.min=1;level.max=999;level.step=1;
const info=document.createElement('small');panel.append(info);
function options(){const q=search.value.trim().toLocaleLowerCase('el');const previous=select.value;select.replaceChildren();for(const item of api.items.filter(i=>i.price!==null&&(i.name+' '+i.id).toLocaleLowerCase('el').includes(q))){const o=document.createElement('option');o.value=item.id;o.textContent=item.name+' ('+item.id+')';select.append(o)}if([...select.options].some(o=>o.value===previous))select.value=previous;load()}
function load(){const item=api.get(select.value);price.disabled=level.disabled=!item;if(!item){info.textContent='Δεν βρέθηκε αντικείμενο';return}price.value=item.price;level.value=item.level||1;info.textContent='Αρχική τιμή: '+item.original.price+' Coins · Αρχικό επίπεδο: '+(item.original.level||1)+' · Μεταπώληση: 5% της τιμής Coins'}
const actions=document.createElement('div');actions.className='actions';panel.append(actions);
const btn=(name,fn)=>{const b=document.createElement('button');b.textContent=name;b.onclick=fn;actions.append(b)};
btn('✓ Εφαρμογή & Αποθήκευση',()=>{const row={price:Number(price.value),level:Number(level.value)};info.textContent=api.set(select.value,row)?'✓ Αποθηκεύτηκε και ενημερώθηκε το Market':'⚠ Μη έγκυρη τιμή ή αποτυχία αποθήκευσης'});
btn('↺ Επαναφορά',()=>{api.reset(select.value);load()});
btn('⬇ Export JSON',()=>{const blob=new Blob([JSON.stringify(api.export(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FarmVille3026_Market_V118.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)});
const file=document.createElement('input');file.type='file';file.accept='.json,application/json';panel.append(file);file.onchange=async()=>{try{const obj=JSON.parse(await file.files[0].text());info.textContent=api.import(obj)?'✓ Οι ρυθμίσεις εισήχθησαν':'⚠ Μη συμβατό JSON';options()}catch(e){info.textContent='⚠ Σφάλμα ανάγνωσης JSON'}file.value=''};
function show(){for(const child of host.children)child.hidden=child!==panel;host.hidden=false;for(const b of tabs.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===tab));for(const sec of gm.querySelectorAll(':scope > section'))if(sec!==host)sec.hidden=true;gm.scrollTop=0;panel.hidden=false;options()}
tab.onclick=show;
for(const b of [...tabs.querySelectorAll('button')].filter(b=>b!==tab))b.addEventListener('click',()=>{panel.hidden=true});
search.oninput=options;select.onchange=load;options();
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0)})();

