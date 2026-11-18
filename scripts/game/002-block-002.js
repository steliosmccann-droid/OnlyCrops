/* Only Crops CP20.8 — boot diagnostics and recovered-ready handshake.
   Does not touch gameplay, saves, farm engine, currencies, or object definitions. */
(function(){'use strict';
const APP_VERSION='CP20.8';
window.FarmVille3026Version=APP_VERSION;
let ready=false, failed=false;
const errors=[];
const $=id=>document.getElementById(id);
const view=()=>$('fv-boot');
const str=e=>String(e?.message||e||'Άγνωστο σφάλμα').slice(0,280);
function update(message,pct){
 const msg=$('fv-boot-message'),bar=$('fv-boot-bar');
 if(msg)msg.textContent=message;
 if(bar)bar.style.width=pct+'%';
}
function finish(){
 if(ready)return;
 ready=true;failed=false;
 update('Η φάρμα είναι έτοιμη!',100);
 const el=view();
 if(el){el.classList.remove('fv-boot-failed');el.classList.add('fv-boot-done');setTimeout(()=>{el.hidden=true;},400);}
}
function fail(detail){
 if(ready)return;
 failed=true;
 const el=view();
 if(el){el.hidden=false;el.classList.add('fv-boot-failed');}
 update('Η εκκίνηση της φάρμας διακόπηκε.',100);
 const help=$('fv-boot-help');
 if(help)help.textContent=str(detail)+' · Δεν πειράχτηκαν οι αποθηκεύσεις. Πάτησε Επανάληψη φόρτωσης.';
 const retry=$('fv-boot-retry');if(retry)retry.hidden=false;
}
function canvasReady(){
 try{
  const c=$('game');
  if(!c||c.width<2||c.height<2)return false;
  const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)return false;
  // A drawn nontransparent pixel establishes that the gameplay renderer ran.
  const points=[[0,0],[Math.floor(c.width/2),Math.floor(c.height/2)],[c.width-1,c.height-1]];
  return points.some(([x,y])=>ctx.getImageData(x,y,1,1).data[3]!==0);
 }catch(e){return false}
}
window.addEventListener('farmville:ready',finish);
window.addEventListener('error',function(e){
 if(ready)return;
 const target=e.target;
 if(target&&target!==window&&target.tagName==='SCRIPT'){
  errors.push('Δεν φορτώθηκε: '+(target.getAttribute('src')||'αρχείο JavaScript'));
  fail(errors[errors.length-1]);return;
 }
 if(e.error?.message)errors.push(str(e.error));
 else if(e.message)errors.push(str(e.message)+(e.filename?' · '+e.filename.split('/').pop():''));
},true);
window.addEventListener('unhandledrejection',e=>{if(!ready)errors.push(str(e.reason))});
function attemptReady(){
 if(ready)return true;
 if(canvasReady()){finish();return true}
 return false;
}
document.addEventListener('DOMContentLoaded',function(){
 const retry=$('fv-boot-retry');
 if(retry)retry.addEventListener('click',()=>{
   const url=new URL(location.href);
   url.searchParams.set('oc-reload',String(Date.now()));
   location.replace(url.href);
 });
 if(!ready&&!failed)update('Αρχικοποιούνται οι μηχανισμοί…',80);
 // In case gameplay rendered but the legacy ready event was missed.
 if(!ready)requestAnimationFrame(attemptReady);
});
let ticks=0;
const poll=setInterval(()=>{
 if(ready){clearInterval(poll);return}
 if(attemptReady()){clearInterval(poll);return}
 if(++ticks>=32){
  clearInterval(poll);
  fail(errors[0]||'Η φάρμα δεν έστειλε σήμα ετοιμότητας. Έλεγξε τη σύνδεση και δοκίμασε ξανά.');
 }
},500);
window.FarmVilleBoot={ready:()=>ready,failed:()=>failed,version:APP_VERSION,errors:()=>errors.slice(),retry:()=>{const b=$('fv-boot-retry');b?.click()}};
})();
