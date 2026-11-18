

// Original FarmVille crop values, classic 2009 era. Times are real milliseconds.
window.FarmCrops=(function(){
'use strict';
const SEEDS={
 strawberry:{name:'Φράουλα',icon:'🍓',cost:10,xp:1,reward:35,grow:4*3600000},
 soybean:{name:'Σόγια',icon:'🌱',cost:15,xp:2,reward:63,grow:24*3600000},
 eggplant:{name:'Μελιτζάνα',icon:'🍆',cost:25,xp:2,reward:88,grow:48*3600000},
 wheat:{name:'Σιτάρι',icon:'🌾',cost:35,xp:2,reward:115,grow:72*3600000}
};
function stage(crop,now=Date.now()){
 if(!crop||!SEEDS[crop.seed]||!Number.isFinite(crop.plantedAt))return 'invalid';
 const t=Math.max(0,now-crop.plantedAt),grow=SEEDS[crop.seed].grow;
 if(t<grow)return 'growing';
 const witherAt=Number.isFinite(crop.witherAt)?crop.witherAt:crop.plantedAt+grow*2.5;
 if(now<witherAt)return 'ripe';
 return 'withered';
}
function plant(plot,seed,wallet,now=Date.now()){
 const d=SEEDS[seed];
 if(!plot||plot.kind!=='plot'||plot.soil!=='ready'||plot.crop)return {ok:false,reason:'Χρειάζεται άδειο οργωμένο χωράφι'};
 if(!d)return {ok:false,reason:'Άγνωστος σπόρος'};
 if(!Number.isFinite(wallet.coins)||wallet.coins<d.cost)return {ok:false,reason:'Δεν έχεις αρκετά Coins'};
 if(!Number.isFinite(now)||now<0)return {ok:false,reason:'Μη έγκυρος χρόνος'};
 wallet.coins-=d.cost;wallet.xp+=d.xp;plot.crop={seed,plantedAt:now,witherAt:now+d.grow*(2+Math.random()*0.5)};return {ok:true,cost:d.cost,xp:d.xp};
}
function harvest(plot,wallet,now=Date.now()){
 if(!plot||plot.kind!=='plot'||!plot.crop)return {ok:false,reason:'Δεν υπάρχουν φυτά'};
 const status=stage(plot.crop,now);
 if(status==='growing')return {ok:false,reason:'Τα φυτά δεν έχουν ωριμάσει'};
 if(status==='withered')return {ok:false,reason:'Τα φυτά μαράθηκαν· χρειάζονται ξανά όργωμα'};
 if(status!=='ripe')return {ok:false,reason:'Μη έγκυρη καλλιέργεια'};
 const reward=SEEDS[plot.crop.seed].reward;wallet.coins+=reward;plot.crop=null;plot.soil='fallow';return {ok:true,reward};
}
function wither(plot,now=Date.now()){
 if(plot&&plot.kind==='plot'&&plot.crop&&stage(plot.crop,now)==='withered'){
  plot.crop=null;plot.soil='fallow';return true;
 }return false;
}
return {SEEDS,stage,plant,harvest,wither};
})();

