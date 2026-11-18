/* Only Crops CP20.5 — editor-only contextual help and navigation feedback.
   The existing CP20 and CP20.4 handlers remain the source of truth. */
(()=>{'use strict';
  let tries=0;
  const helpBySection={
    home:'Επίλεξε μία από τις έξι κατηγορίες για να επεξεργαστείς την ίδια φάρμα. Τα εργαλεία δεν αποτελούν δεύτερο παιχνίδι.',
    hud:'Το HUD δείχνει πραγματικές τιμές Coins, NF Cash και XP. Αποθήκευσε από το αντίστοιχο εργαλείο πριν κλείσεις τον Game Maker.',
    ui:'Εδώ αλλάζεις την εμφάνιση των κουμπιών. Οι ενέργειες Select, Plow, Market και οι μηχανισμοί τους παραμένουν στο παιχνίδι.',
    assets:'Επίλεξε αντικείμενο, εισήγαγε εικόνα PNG και έλεγξε την προεπισκόπηση/διαστάσεις πριν εφαρμόσεις. Η εισαγωγή δεν ανεβάζει αυτόματα εικόνες στο GitHub.',
    studio:'Το Animation Studio διατηρεί δική του βιβλιοθήκη. Αποθήκευσε τις αλλαγές σου πριν μεταβείς σε άλλη ενότητα.',
    systems:'Οι λειτουργίες Grid, Crops, Production, Economy και Progression έχουν ξεχωριστά εργαλεία. Χρησιμοποίησε τα υπάρχοντα κουμπιά «Εφαρμογή».',
    objects:'Αυτή η ενότητα επεξεργάζεται στοιχεία HUD / UI. Δεν μετακινεί τα αντικείμενα πάνω στο grid της φάρμας.',
    gametools:'Εδώ βρίσκονται τα υπάρχοντα εργαλεία χειρισμού της φάρμας. Η εμφάνιση ενός εργαλείου δεν σημαίνει ότι έχει αποκτήσει νέα λειτουργία.',
    files:'Κράτησε ξεχωριστά backups για HUD/UI, sprites και Animation Studio. Η τοπική αποθήκευση δεν ενημερώνει από μόνη της το repository.'
  };
  function install(){
    const panel=document.getElementById('gm106-panel');
    const selector=document.getElementById('gm20-section');
    const sub=document.getElementById('gm20-subsection');
    const location=document.getElementById('oc204-location');
    const help=document.getElementById('oc204-help');
    const helpText=document.getElementById('oc204-help-text');
    if(!panel||!selector||!location||!help||!helpText){if(++tries<80)setTimeout(install,200);return;}
    if(panel.dataset.oc205Installed)return;
    panel.dataset.oc205Installed='yes';
    const subtitle=location.querySelector('span');
    const live=document.createElement('div');
    live.id='oc205-section-hint';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
    helpText.after(live);
    help.setAttribute('aria-controls','oc204-help-text');
    const reflect=()=>{
      const key=selector.value||'home';
      const option=selector.selectedOptions&&selector.selectedOptions[0];
      const selected=option?option.textContent:'Αρχική';
      const subOption=sub&&!sub.hidden&&sub.selectedOptions&&sub.selectedOptions[0];
      if(subtitle)subtitle.textContent=subOption&&['assets','systems','studio'].includes(key)
        ?selected+' · '+subOption.textContent:selected;
      helpText.textContent=helpBySection[key]||helpBySection.home;
      live.textContent=key==='home'?'':helpBySection[key];
      live.hidden=key==='home';
      help.setAttribute('aria-expanded',String(!helpText.hidden));
    };
    // The legacy CP20 logic may veto navigation when Studio changes are not saved.
    // Reflect only the resulting, actual selection after its handlers finish.
    const deferred=()=>requestAnimationFrame(reflect);
    selector.addEventListener('change',deferred);
    if(sub)sub.addEventListener('change',deferred);
    help.addEventListener('click',deferred);
    const observer=new MutationObserver(deferred);
    observer.observe(selector,{attributes:true,attributeFilter:['value']});
    observer.observe(panel,{attributes:true,attributeFilter:['class']});
    if(sub)observer.observe(sub,{childList:true,attributes:true,attributeFilter:['hidden']});
    reflect();panel.dataset.creatorUi='20.5';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();