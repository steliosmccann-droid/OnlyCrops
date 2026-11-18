
(function(){
'use strict';
const APP_VERSION='V66';
window.FarmVille3026Version=APP_VERSION;
let ready=false, failed=false, current=0;
const errors=[];
const view=()=>document.getElementById('fv-boot');
function update(message,pct){
 const msg=document.getElementById('fv-boot-message'),bar=document.getElementById('fv-boot-bar');
 if(msg)msg.textContent=message;
 if(bar)bar.style.width=pct+'%';
}
function finish(){
 if(ready||failed)return;
 ready=true;
 update('Η φάρμα είναι έτοιμη!',100);
 const el=view();if(el){el.classList.add('fv-boot-done');setTimeout(()=>{el.hidden=true;},400);}
}
function fail(message){
 if(ready||failed)return;
 failed=true;
 const el=view();if(el)el.classList.add('fv-boot-failed');
 update('Η φάρμα δεν φορτώθηκε σωστά.',100);
 const help=document.getElementById('fv-boot-help');
 if(help)help.textContent=message+' · Έλεγξε ότι ανέβασες όλους τους φακέλους στο GitHub.';
 const retry=document.getElementById('fv-boot-retry');
 if(retry)retry.hidden=false;
}
window.addEventListener('farmville:ready',finish);
window.addEventListener('error',function(e){
 if(ready)return;
 const target=e.target;
 if(target&&target!==window&&target.tagName==='SCRIPT'){
  fail('Δεν φορτώθηκε το αρχείο '+(target.getAttribute('src')||'script'));return;
 }
 if(e.error&&e.error.message)errors.push(e.error.message);
},true);
window.addEventListener('unhandledrejection',function(e){if(!ready)errors.push(String(e.reason||'Αποτυχία αρχικοποίησης'));});
document.addEventListener('DOMContentLoaded',function(){
 const retry=document.getElementById('fv-boot-retry');
 if(retry)retry.addEventListener('click',()=>location.reload());
 if(!ready&&!failed)update('Αρχικοποιούνται οι μηχανισμοί…',80);
});
window.setTimeout(function(){
 if(!ready&&!failed)fail(errors.length?errors[0]:'Η εκκίνηση άργησε υπερβολικά');
},18000);
window.FarmVilleBoot={ready:()=>ready,version:APP_VERSION};
})();

