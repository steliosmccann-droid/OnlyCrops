

(()=>{'use strict';
function init(){
 const hud=document.getElementById('fv90-nostalgia-hud');if(!hud)return;
 const modal=document.createElement('div');modal.id='fv110-dialog';modal.hidden=true;
 modal.innerHTML='<section id="fv110-card" role="dialog" aria-modal="true" aria-labelledby="fv110-title"><h3 id="fv110-title"></h3><p id="fv110-description"></p><button id="fv110-close" type="button">Επιστροφή στη φάρμα</button></section>';
 document.body.append(modal);
 const close=()=>{modal.hidden=true};modal.querySelector('#fv110-close').onclick=close;
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
 function open(kind){
  modal.querySelector('#fv110-title').textContent=kind==='cash'?'💵 Add NF Cash':'🪙 Add Coins';
  modal.querySelector('#fv110-description').textContent=kind==='cash'?'Εδώ θα συνδεθεί μελλοντικά το κατάστημα NF Cash. Προς το παρόν δεν υπάρχουν ενεργές αγορές ή πληρωμές.':'Εδώ θα συνδεθούν μελλοντικά οι διαθέσιμοι τρόποι απόκτησης Coins. Τα Coins συνεχίζουν να κερδίζονται από τους μηχανισμούς της φάρμας.';
  modal.hidden=false;modal.querySelector('#fv110-close').focus();
 }
 for(const [kind,sel,name] of [['coins','.fv90-coin','Προσθήκη Coins'],['cash','.fv90-cash','Add NF Cash']]){
  const parent=hud.querySelector(sel);if(!parent)continue;
  const b=document.createElement('button');b.type='button';b.className='fv110-add';b.setAttribute('aria-label',name);b.title=name;b.textContent='+';
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(kind)});parent.append(b);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

