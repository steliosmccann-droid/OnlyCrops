
// FarmVille3026 V59 — Production System (animals + existing trees)
// Stateless catalog & clock functions. No map, save key or placement changes.
(function(){
'use strict';
const CATALOG=Object.freeze({
 cow:{hours:24,coins:6,product:'Γάλα',type:'animal'},
 chicken:{hours:24,coins:8,product:'Αυγά',type:'animal'},
 sheep:{hours:72,coins:28,product:'Μαλλί',type:'animal'},
 pig:{hours:48,coins:30,product:'Τρούφες',type:'animal'},
 apple:{hours:72,coins:28,product:'Μήλα',type:'tree'},
 cherry:{hours:48,coins:18,product:'Κεράσια',type:'tree'},
 orange:{hours:96,coins:40,product:'Πορτοκάλια',type:'tree'},
 // FarmVille 2009: archived animal/tree guides (on-farm, not building bonuses).
 rabbit:{hours:96,coins:60,product:'Μαλλί Angora',type:'animal'},
 duck:{hours:48,coins:45,product:'Πούπουλα',type:'animal'},
 goat:{hours:48,coins:54,product:'Κατσικίσιο γάλα',type:'animal'},
 fig:{hours:72,coins:33,product:'Σύκα',type:'tree'},
 avocado:{hours:72,coins:37,product:'Αβοκάντο',type:'tree'},
 // Wiki sources: https://farmville.fandom.com/wiki/Lychee_Tree and /Maple_Tree
 lychee:{hours:3,coins:140,product:'Λίτσι',type:'tree'},
 maple:{hours:48,coins:150,product:'Σιρόπι σφενδάμου',type:'tree'}
});

const DAY_MS=3600000;
function definition(kind){return Object.prototype.hasOwnProperty.call(CATALOG,kind)?CATALOG[kind]:null}
function status(item,now=Date.now()){
 if(!item)return null;
 const def=definition(item.kind);if(!def)return null;
 const cycle=def.hours*DAY_MS;
 const readyAt=Number.isFinite(item.harvestReadyAt)&&item.harvestReadyAt>0?item.harvestReadyAt:now+cycle;
 const remaining=Math.max(0,readyAt-now);
 const progress=Math.min(100,Math.max(0,Math.floor(100*(cycle-remaining)/cycle)));
 return {ready:remaining===0,readyAt,remaining,coins:def.coins,product:def.product,hours:def.hours,type:def.type,progress};
}
function start(item,now=Date.now()){
 const def=item&&definition(item.kind);if(!def)return item;
 item.harvestReadyAt=now+def.hours*DAY_MS;item.harvestCount=0;return item;
}
function reset(item,now=Date.now()){const d=item&&definition(item.kind);if(!d)return item;item.harvestReadyAt=now+d.hours*DAY_MS;item.harvestCount=(Number.isInteger(item.harvestCount)?item.harvestCount:0)+1;return item}
function formatTime(ms){const minutes=Math.ceil(Math.max(0,ms)/60000);const days=Math.floor(minutes/1440);const hours=Math.floor((minutes%1440)/60);const mins=minutes%60;if(days)return days+'η '+hours+'ω';if(hours)return hours+'ω '+mins+'λ';return minutes+'λ'}
const ORIGINAL=JSON.parse(JSON.stringify(CATALOG));
const KEY='FarmVille3026_V117_Production';
function validate(v){return v&&Number.isFinite(Number(v.hours))&&Number(v.hours)>=0.05&&Number(v.hours)<=8760&&Number.isInteger(Number(v.coins))&&Number(v.coins)>=0&&Number(v.coins)<=1000000}
function apply(kind,data){if(!Object.prototype.hasOwnProperty.call(CATALOG,kind)||!validate(data))return false;CATALOG[kind].hours=Number(data.hours);CATALOG[kind].coins=Number(data.coins);return true}
function save(){try{const data={};for(const k of Object.keys(CATALOG))data[k]={hours:CATALOG[k].hours,coins:CATALOG[k].coins};localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){return false}}
function restore(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(const [k,v] of Object.entries(saved))apply(k,v)}catch(e){}}
function resetOne(kind){if(!ORIGINAL[kind])return false;apply(kind,ORIGINAL[kind]);return save()}
restore();
window.FarmProduction=Object.freeze({CATALOG,definition,status,start,reset,formatTime,apply,save,resetOne,storageKey:KEY});
})();

