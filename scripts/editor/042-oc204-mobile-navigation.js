/* Only Crops CP20.4 – creator navigation enhancement.
   Additive UI only: delegates navigation to the CP20 existing select and handlers. */
(()=>{'use strict';
 let tries=0;
 function setup(){
  const panel=document.getElementById('gm106-panel');
  const nav=document.getElementById('gm18-navigation');
  const select=document.getElementById('gm20-section');
  if(!panel||!nav||!select){if(++tries<60)setTimeout(setup,250);return;}
  if(document.getElementById('oc204-creator-toolbar'))return;
  const bar=document.createElement('div');bar.id='oc204-creator-toolbar';
  bar.setAttribute('role','group');bar.setAttribute('aria-label','Γρήγορη πλοήγηση Game Maker');
  const home=document.createElement('button');home.type='button';home.id='oc204-home';home.textContent='⌂ Αρχική';
  home.setAttribute('aria-label','Επιστροφή στην αρχική του Game Maker');
  const location=document.createElement('div');location.id='oc204-location';location.setAttribute('role','status');location.setAttribute('aria-live','polite');
  const title=document.createElement('strong');title.textContent='Game Maker';
  const subtitle=document.createElement('span');location.append(title,subtitle);
  const help=document.createElement('button');help.type='button';help.id='oc204-help';help.textContent='?';
  help.setAttribute('aria-label','Βοήθεια για την επιλεγμένη ενότητα');
  const helpText=document.createElement('p');helpText.id='oc204-help-text';helpText.hidden=true;
  helpText.textContent='Διάλεξε ενότητα από το μενού. Οι αλλαγές στα εργαλεία αποθήκευσης πρέπει να αποθηκεύονται πριν αλλάξεις εργαλείο. Τα αρχεία του GitHub δεν ενημερώνονται αυτόματα.';
  bar.append(home,location,help);nav.before(bar);bar.after(helpText);
  function sync(){
   const opt=select.selectedOptions&&select.selectedOptions[0];
   subtitle.textContent=opt?opt.textContent:'Αρχική';
   home.disabled=select.value==='home';
  }
  home.addEventListener('click',()=>{
   if(select.value==='home')return;
   select.value='home';
   select.dispatchEvent(new Event('change',{bubbles:true}));
   // CP20 can block switching to protect unsaved Studio work.
   requestAnimationFrame(sync);
  });
  help.addEventListener('click',()=>{helpText.hidden=!helpText.hidden;help.setAttribute('aria-expanded',String(!helpText.hidden));});
  select.addEventListener('change',()=>requestAnimationFrame(sync));
  const observer=new MutationObserver(sync);
  observer.observe(select,{attributes:true,attributeFilter:['value']});
  const originalNav=document.getElementById('gm19-nav');
  if(originalNav)observer.observe(panel,{attributes:true,attributeFilter:['class']});
  sync();panel.dataset.creatorUi='20.4';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
