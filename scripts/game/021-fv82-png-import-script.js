

(function(){'use strict';
const DB='FarmVille3026_UI_Images', STORE='pngOverrides';
const targets=[
 ['select','Select','.classic-tools .fv38-multi>button:first-child',true],
 ['plow','Plow','.classic-tools .fv38-plow>button:first-child',true],
 ['recycle','Recycle','.classic-tools .fv38-recycle>button:first-child',false],
 ['ribbons','Ribbons','.classic-tools .fv39-ribbons>button:first-child',true],
 ['market','Market','.classic-tools .fv38-market>button:first-child',true],
 ['gifts','Gifts','.classic-tools .fv38-gifts>button:first-child',true],
 ['toolbar','Πλαίσιο Toolbar','.classic-tools',false],
 ['coins','Coins','.fv38-money>div:first-child',false],
 ['cash','FV Cash','.fv38-money>div:nth-child(2)',false],
 ['xp','XP / Level','.fv38-experience',false],
 ['farmname','Όνομα φάρμας','.fv38-farmname',false],
 ['zoomIn','Zoom +','.controls #zoomIn',true],
 ['zoomOut','Zoom −','.controls #zoomOut',true],
 ['camera','Camera','.controls #recenter',true]
];
let db=null, cache={},fallback=false, panel=null, choice=null, mode=null, preview=null, status=null;
const selector=id=>targets.find(t=>t[0]===id)?.[2];
const canStates=id=>targets.find(t=>t[0]===id)?.[3];
function statusText(text){if(status)status.textContent=text;}
function openDB(){return new Promise(resolve=>{if(!window.indexedDB){fallback=true;resolve(null);return;}try{const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>{const d=request.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE)};request.onsuccess=()=>{db=request.result;resolve(db)};request.onerror=()=>{fallback=true;resolve(null)};}catch(e){fallback=true;resolve(null)}})}
function allSaved(){return new Promise(resolve=>{if(!db){try{resolve(JSON.parse(localStorage.getItem('fv82-ui-png-small')||'{}'));}catch(e){resolve({})}return;}try{const t=db.transaction(STORE,'readonly');const o=t.objectStore(STORE),r=o.getAllKeys();r.onsuccess=()=>{const keys=r.result||[];const result={};if(!keys.length){resolve(result);return;}let n=0;keys.forEach(k=>{const q=o.get(k);q.onsuccess=()=>{if(typeof q.result==='string')result[k]=q.result;if(++n===keys.length)resolve(result)};q.onerror=()=>{if(++n===keys.length)resolve(result)}})};r.onerror=()=>resolve({})}catch(e){resolve({})}})}
function store(k,val){return new Promise((resolve,reject)=>{if(!db){try{const all=JSON.parse(localStorage.getItem('fv82-ui-png-small')||'{}');if(val)all[k]=val;else delete all[k];localStorage.setItem('fv82-ui-png-small',JSON.stringify(all));resolve()}catch(e){reject(new Error('Ο χώρος αποθήκευσης δεν επαρκεί. Δοκίμασε μικρότερο PNG.'))}return;}try{const t=db.transaction(STORE,'readwrite');if(val)t.objectStore(STORE).put(val,k);else t.objectStore(STORE).delete(k);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error||new Error('Αποτυχία αποθήκευσης'))}catch(e){reject(e)}})}
function rules(){let css='';for(const t of targets){const id=t[0],sel='html.mode-farm '+t[2];const n=cache[id+':normal'],a=cache[id+':active'],p=cache[id+':pressed'];
if(n)css+=sel+'{background-image:url("'+n+'")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:100% 100%!important;}\n';
if(t[3]&&a)css+=sel+'.fv82-active{background-image:url("'+a+'")!important;}\n';
if(t[3]&&p)css+=sel+':active{background-image:url("'+p+'")!important;}\n';
}
// Select must not appear permanently active just because it is the default tool.
// Existing normal image is used until the submenu is actually expanded.
css+='html.mode-farm .classic-tools .fv38-multi>button:first-child.active:not(.fv82-active){background-image:url("'+window.FV82_SELECT_NORMAL+'")!important;}\n';
css+='html.mode-farm .classic-tools .fv38-multi>button:first-child.fv82-active{background-image:url("'+(cache['select:active']||window.FV82_SELECT_ACTIVE)+'")!important;}\n';
css+='html.mode-farm .classic-tools .fv38-multi>button:first-child:active{background-image:url("'+(cache['select:pressed']||window.FV82_SELECT_PRESSED)+'")!important;}\n';
// If a user imported Select normal, the active class must not override its custom normal state.
if(cache['select:normal'])css+='html.mode-farm .classic-tools .fv38-multi>button:first-child:not(.fv82-active):not(:active){background-image:url("'+cache['select:normal']+'")!important;}\n';
let style=document.getElementById('fv82-user-skins');if(!style){style=document.createElement('style');style.id='fv82-user-skins';document.head.appendChild(style)}style.textContent=css;
}
function updateSelect(){const btn=document.querySelector('.classic-tools .fv38-multi>button:first-child');const arrow=document.getElementById('fv38MultiArrow');if(!btn)return;const expanded=arrow?.getAttribute('aria-expanded')==='true';btn.classList.toggle('fv82-active',!!expanded);}
function watch(){const arrow=document.getElementById('fv38MultiArrow');if(arrow)new MutationObserver(updateSelect).observe(arrow,{attributes:true,attributeFilter:['aria-expanded']});updateSelect()}
function refreshPreview(){const id=choice?.value||'select',st=mode?.value||'normal',url=cache[id+':'+st];if(preview){preview.style.backgroundImage=url?'url("'+url+'")':'none';preview.textContent=url?'':'Χρησιμοποιείται το αρχικό γραφικό';}statusText(url?'Προσαρμοσμένο PNG: '+id+' / '+st:'Αρχικό γραφικό: '+id+' / '+st);}
function createPanel(){const editor=document.getElementById('fv78-editor');if(!editor||document.getElementById('fv82-png-panel'))return;
panel=document.createElement('details');panel.id='fv82-png-panel';panel.open=false;panel.style.cssText='margin:8px 0;padding:10px;border:2px solid #a87a45;background:#ffefc2;border-radius:10px;color:#513314';
const h=document.createElement('summary');h.textContent='🖼️ Import PNG · Γραφικά UI';h.style.cssText='font-size:14px;font-weight:900;cursor:pointer';panel.appendChild(h);
const p=document.createElement('p');p.textContent='Επίλεξε κουμπί και κατάσταση Normal / Active / Pressed. Η εισαγωγή αλλάζει μόνο το γραφικό, όχι τη λειτουργία του.';panel.appendChild(p);
choice=document.createElement('select');choice.setAttribute('aria-label','Στοιχείο για PNG');for(const t of targets){const o=document.createElement('option');o.value=t[0];o.textContent=t[1];choice.appendChild(o)}panel.appendChild(choice);
mode=document.createElement('select');mode.setAttribute('aria-label','Κατάσταση εικόνας');for(const v of ['normal','active','pressed']){const o=document.createElement('option');o.value=v;o.textContent=v[0].toUpperCase()+v.slice(1);mode.appendChild(o)}panel.appendChild(mode);
const syncMode=()=>{for(const o of mode.options)o.disabled=!canStates(choice.value)&&o.value!=='normal';if(!canStates(choice.value))mode.value='normal';refreshPreview()};choice.addEventListener('change',syncMode);mode.addEventListener('change',refreshPreview);
const file=document.createElement('input');file.type='file';file.accept='image/png,.png';file.id='fv84-ui-png-file';file.setAttribute('aria-label','Επίλεξε PNG από Αρχεία iPhone');file.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:4;width:100%;min-height:46px;max-width:100%;font-size:16px;pointer-events:auto!important;touch-action:manipulation;margin:10px 0';
file.addEventListener('change',async()=>{const f=file.files?.[0];file.value='';if(!f)return;if(!f.name.toLowerCase().endsWith('.png')&&!/image\/png/.test(f.type)){statusText('Δέχομαι μόνο PNG.');return;}if(f.size>8*1024*1024){statusText('PNG πάνω από 8 MB. Μείωσε το μέγεθός του.');return;}const id=choice.value,st=mode.value,key=id+':'+st;try{const url=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Δεν διαβάστηκε το PNG'));r.readAsDataURL(f)});if(typeof url!=='string'||!url.startsWith('data:image/png;base64,'))throw Error('Μη έγκυρο PNG');await store(key,url);cache[key]=url;rules();refreshPreview();statusText('✅ Το PNG εφαρμόστηκε και αποθηκεύτηκε: '+id+' / '+st);}catch(e){statusText('❌ '+(e.message||e))}});
const importButton=document.createElement('div');importButton.textContent='📥 Πάτησε «Επιλογή αρχείου» παρακάτω για PNG. Το αρχείο εφαρμόζεται μόλις επιλεγεί.';importButton.style.cssText='font-size:12px;font-weight:700;line-height:1.4';
const reset=document.createElement('button');reset.type='button';reset.textContent='↶ Αρχικό PNG';reset.onclick=async()=>{const k=choice.value+':'+mode.value;await store(k,null);delete cache[k];rules();refreshPreview();};
preview=document.createElement('div');preview.style.cssText='height:86px;background-size:contain;background-repeat:no-repeat;background-position:center;background-color:#e4cfaa;border:1px dashed #997044;border-radius:8px;margin:8px 0;display:flex;justify-content:center;align-items:center;font-size:11px;text-align:center';
status=document.createElement('small');status.style.cssText='display:block;overflow-wrap:anywhere';
panel.append(file,importButton,reset,preview,status);
const header=editor.querySelector('header');if(header)header.insertAdjacentElement('afterend',panel);else editor.prepend(panel);syncMode();}
(async()=>{await openDB();cache=await allSaved();rules();const init=()=>{watch();createPanel();};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();
})();

