

(()=>{'use strict';
const KEY='FarmVille3026_V114_CropOverrides';
const seeds=window.FarmCrops?.SEEDS;
if(!seeds)return;
const baseline=Object.fromEntries(Object.entries(seeds).map(([id,d])=>[id,{cost:d.cost,xp:d.xp,reward:d.reward,grow:d.grow}]));
const safe=(v,max)=>Number.isSafeInteger(Number(v))&&Number(v)>=0&&Number(v)<=max;
const apply=(id,v)=>{const d=seeds[id];if(!d||!v||!safe(v.cost,10000000)||!safe(v.reward,10000000)||!safe(v.xp,100000)||!Number.isFinite(Number(v.grow))||Number(v.grow)<60000||Number(v.grow)>31536000000)return false;
for(const k of ['cost','xp','reward','grow'])d[k]=Number(v[k]);return true};
const saved=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
for(const [id,v] of Object.entries(saved()))apply(id,v);
const exportData=()=>{const changed={};for(const [id,d] of Object.entries(seeds)){const b=baseline[id];if(['cost','xp','reward','grow'].some(k=>d[k]!==b[k]))changed[id]={cost:d.cost,xp:d.xp,reward:d.reward,grow:d.grow}}return changed};
const persist=()=>{try{const data=exportData();localStorage.setItem(KEY,JSON.stringify(data));const check=JSON.parse(localStorage.getItem(KEY)||'{}');return JSON.stringify(check)===JSON.stringify(data)}catch(e){return false}};
const el=(tag,parent,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;parent.append(e);return e};
function init(){const launch=el('button',document.body,'🌾 Crops Editor');launch.id='gm114-launch';const panel=el('section',document.body);panel.id='gm114-panel';panel.hidden=true;
const head=el('div',panel);head.className='row';el('strong',head,'🌾 Game Maker · Καλλιέργειες');const close=el('button',head,'— Ελαχιστοποίηση');close.onclick=()=>panel.hidden=true;
el('p',panel,'Αλλάζεις τις πραγματικές τιμές καλλιεργειών. Οι αλλαγές επηρεάζουν τις επόμενες σπορές και συγκομιδές.').className='hint';
const choice=el('select',panel);for(const [id,d] of Object.entries(seeds)){const o=el('option',choice,`${d.icon} ${d.name}`);o.value=id}
const controls={};for(const [key,label,min,max,step] of [['cost','Κόστος σπόρου (Coins)',0,10000000,1],['reward','Έσοδα συγκομιδής (Coins)',0,10000000,1],['xp','XP κατά τη σπορά',0,100000,1],['hours','Ώρες ανάπτυξης',1/60,8760,1/60]]){const l=el('label',panel,label);const i=el('input',l);i.type='number';i.min=min;i.max=max;i.step=step;i.inputMode='decimal';controls[key]=i}
const status=el('p',panel,'');status.className='hint';const actions=el('div',panel);actions.className='row';
const btn=(label,fn)=>{const b=el('button',actions,label);b.onclick=fn;return b};
function sync(){const d=seeds[choice.value];if(!d)return;controls.cost.value=d.cost;controls.reward.value=d.reward;controls.xp.value=d.xp;controls.hours.value=+(d.grow/3600000).toFixed(5);status.textContent=`ID: ${choice.value} · Αρχικός χρόνος: ${baseline[choice.value].grow/3600000} ώρες`}
choice.onchange=sync;
btn('✓ Εφαρμογή & Αποθήκευση',()=>{const hours=Number(controls.hours.value);const v={cost:Number(controls.cost.value),reward:Number(controls.reward.value),xp:Number(controls.xp.value),grow:Math.round(hours*3600000)};if(!apply(choice.value,v)){status.textContent='⚠ Έλεγξε τις τιμές. Ελάχιστος χρόνος: 1 λεπτό.';return}const ok=persist();window.FV3026MarketV33?.refresh?.();sync();status.textContent=ok?'✓ Αποθηκεύτηκε και επαληθεύτηκε · '+seeds[choice.value].name+' · '+v.cost+' Coins · '+v.reward+' συγκομιδή · '+v.xp+' XP':'⚠ Η αλλαγή εφαρμόστηκε, αλλά δεν αποθηκεύτηκε. Κάνε Export JSON.'});
btn('↺ Επαναφορά καλλιέργειας',()=>{apply(choice.value,baseline[choice.value]);const ok=persist();window.FV3026MarketV33?.refresh?.();sync();status.textContent=ok?'✓ Επαναφορά και επαληθευμένη αποθήκευση':'⚠ Δεν αποθηκεύτηκε'});
btn('⬇ Export JSON',()=>{const data=JSON.stringify({schema:'FarmVille3026-Crops-V114',crops:exportData()},null,2);const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=el('a',document.body);a.href=url;a.download='FarmVille3026_V114_Crops.json';a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)});
const fileLabel=el('label',panel,'⬆ Import Crops JSON');const file=el('input',fileLabel);file.type='file';file.accept='.json,application/json';
file.onchange=async()=>{try{const f=file.files?.[0];if(!f)return;if(f.size>100000)throw Error('Μεγάλο αρχείο');const data=JSON.parse(await f.text());if(data.schema!=='FarmVille3026-Crops-V114'||!data.crops||typeof data.crops!=='object'||Array.isArray(data.crops))throw Error('Μη συμβατό αρχείο');for(const [id,v] of Object.entries(data.crops)){if(!seeds[id]||!v||!safe(v.cost,10000000)||!safe(v.reward,10000000)||!safe(v.xp,100000)||!Number.isFinite(Number(v.grow))||Number(v.grow)<60000||Number(v.grow)>31536000000)throw Error('Μη έγκυρα δεδομένα')}
for(const [id,b] of Object.entries(baseline))apply(id,b);for(const [id,v] of Object.entries(data.crops))apply(id,v);const ok=persist();window.FV3026MarketV33?.refresh?.();sync();status.textContent=ok?'✓ Import και επαληθευμένη αποθήκευση':'⚠ Import εφαρμόστηκε αλλά δεν αποθηκεύτηκε'}catch(e){status.textContent='⚠ '+e.message}finally{file.value=''}};
el('p',panel,'Σημείωση: ήδη φυτεμένα crops διατηρούν τον χρόνο μαρασμού που υπολογίστηκε κατά τη σπορά. Τα δεδομένα αποθηκεύονται ανά browser· χρησιμοποίησε Export για αντίγραφο ασφαλείας.').className='hint';
launch.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden)sync()};panel.addEventListener('click',e=>{if(e.target===panel)sync()});sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

