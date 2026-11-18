
(function(){
'use strict';
const KEY='FarmVille3026_V90_Approved_HUD_Sizes';
const defaults={coins:[0,38],cash:[0,38],xp:[0,43],logo:[0,77],name:[0,45]};
const selectors={coins:'.fv90-coin',cash:'.fv90-cash',xp:'.fv90-xp',logo:'.fv90-logo',name:'.fv90-name'};
let sizes={};try{const stored=JSON.parse(localStorage.getItem(KEY)||'{}');if(stored&&typeof stored==='object')sizes=stored;}catch(e){}
function apply(){for(const key of Object.keys(defaults)){
const el=document.querySelector(selectors[key]);if(!el)continue;
let pair=sizes[key];if(!Array.isArray(pair))pair=defaults[key];
let w=Number(pair[0]),h=Number(pair[1]);
if(Number.isFinite(w)&&w>0)el.style.width=Math.min(1000,Math.max(40,w))+'px';else el.style.removeProperty('width');
if(Number.isFinite(h)&&h>0)el.style.height=Math.min(800,Math.max(15,h))+'px';else el.style.removeProperty('height');
}}
function sync(){const status=document.querySelector('#status'),name=document.querySelector('#fvProfileTitle small');
if(status){let coin=status.querySelector('.fv38-coin'),cash=status.querySelector('.fv38-cash'),level=status.querySelector('.fv38-level'),xp=status.querySelector('.fv38-experience small'),fill=status.querySelector('.fv-level-fill');
const set=(id,v)=>{const el=document.getElementById(id);if(el&&v!==null)el.textContent=v;};
if(coin){const m=coin.textContent.match(/[\d.,]+/);if(m)set('fv90Coins',m[0]);}
if(cash){const m=cash.textContent.match(/[\d.,]+/);if(m)set('fv90Cash',m[0]);}
if(level){const m=level.textContent.match(/(?:LV\s*)?(MAX|\d+)/i);if(m)set('fv90Level',m[1]);}
if(xp){const text=xp.textContent.trim().replace(/Creative · /,'');set('fv90XpText',text);}
if(fill){const f=document.getElementById('fv90Fill');if(f)f.style.width=fill.style.width||'0%';}
}
if(name){const output=document.getElementById('fv90Name');if(output)output.textContent=name.textContent.trim();}
}
function setup(){const status=document.getElementById('status'),name=document.getElementById('fvProfileTitle');
if(status)new MutationObserver(sync).observe(status,{childList:true,subtree:true,characterData:true,attributes:false});
if(name)new MutationObserver(sync).observe(name,{childList:true,subtree:true,characterData:true});
apply();sync();
const host=document.getElementById('fv85-hud');if(host&&!document.getElementById('fv90-hud-size-editor')){
const panel=document.createElement('section');panel.id='fv90-hud-size-editor';
const h=document.createElement('h3');h.textContent='🌾 Nostalgia HUD · Μεγέθη PNG';panel.append(h);
const p=document.createElement('p');p.textContent='Εγκεκριμένες εικόνες. Ρύθμισε ξεχωριστά πλάτος και ύψος· 0 σημαίνει αυτόματο πλάτος.';panel.append(p);
const labels={coins:'1 · Coins',cash:'2 · NF Cash',xp:'3 · XP / Level',logo:'Only Crops Logo',name:'Farm Name'};
for(const k of Object.keys(defaults)){
const row=document.createElement('div');row.className='fv90-size-row';const label=document.createElement('span');label.textContent=labels[k];
const w=document.createElement('input'),height=document.createElement('input');w.type='number';height.type='number';w.min='0';height.min='15';w.max='1000';height.max='800';w.placeholder='Πλάτος';height.placeholder='Ύψος';
const saved=sizes[k]||defaults[k];w.value=saved[0];height.value=saved[1];
function changed(){sizes[k]=[Number(w.value)||0,Number(height.value)||defaults[k][1]];try{localStorage.setItem(KEY,JSON.stringify(sizes));}catch(e){}apply();}
w.addEventListener('change',changed);height.addEventListener('change',changed);
row.append(label,w,height);panel.append(row);
}
const reset=document.createElement('button');reset.type='button';reset.textContent='↺ Επαναφορά μεγεθών Nostalgia';reset.addEventListener('click',()=>{sizes={};try{localStorage.removeItem(KEY);}catch(e){}apply();panel.querySelectorAll('.fv90-size-row').forEach((row,i)=>{const k=Object.keys(defaults)[i],inp=row.querySelectorAll('input');inp[0].value='0';inp[1].value=defaults[k][1];});});panel.append(reset);
const exportBtn=document.createElement('button');exportBtn.type='button';exportBtn.textContent='⬇ Export Nostalgia HUD για ChatGPT';exportBtn.onclick=()=>{const payload={schema:'nostalgia-approved-hud-v90',version:90,source:'Nostalgia_Approved_HUD_Separate_Assets.zip',sizes,layout:'vertical coins,nf_cash,xp_level; logo and name on right'};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='FarmVille3026_V90_Nostalgia_HUD_For_ChatGPT.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};panel.append(exportBtn);
host.append(panel);
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
