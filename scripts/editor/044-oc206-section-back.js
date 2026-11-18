/* Only Crops CP20.6: editor-only section Back control.
   Goes through existing CP20 navigation and respects its Studio save warning. */
(()=>{'use strict';
 let attempts=0;
 function install(){
  const panel=document.getElementById('gm106-panel');
  const select=document.getElementById('gm20-section');
  const toolbar=document.getElementById('oc204-creator-toolbar');
  const home=document.getElementById('oc204-home');
  if(!panel||!select||!toolbar||!home){if(++attempts<80)setTimeout(install,200);return;}
  if(document.getElementById('oc206-back'))return;
  const back=document.createElement('button');
  back.type='button';back.id='oc206-back';back.textContent='← Πίσω';
  back.setAttribute('aria-label','Πίσω στην προηγούμενη ενότητα του Game Maker');
  back.title='Προηγούμενη ενότητα';
  toolbar.insertBefore(back,home);
  const history=[];
  let current=select.value||'home';
  let returning=false;
  const update=()=>{
   const available=history.length>0;
   back.disabled=!available;
   back.title=available?'Πίσω: '+(Array.from(select.options).find(o=>o.value===history[history.length-1])?.textContent||'προηγούμενη ενότητα'):'Δεν υπάρχει προηγούμενη ενότητα';
  };
  const observeActual=()=>{
   const next=select.value||'home';
   if(returning)return;
   if(next!==current){
    if(history[history.length-1]!==current)history.push(current);
    if(history.length>12)history.shift();
    current=next;
   }
   update();
  };
  const deferObserve=()=>requestAnimationFrame(()=>requestAnimationFrame(observeActual));
  select.addEventListener('change',deferObserve);
  // CP20 may navigate from toolbar buttons rather than the select.
  panel.addEventListener('click',e=>{
   if(e.target.closest('#oc206-back'))return;
   deferObserve();
  });
  const markerObserver=new MutationObserver(deferObserve);
  const nav=document.getElementById('gm18-navigation');
  if(nav)for(const b of nav.querySelectorAll(':scope > button'))markerObserver.observe(b,{attributes:true,attributeFilter:['aria-current']});
  markerObserver.observe(panel,{attributes:true,attributeFilter:['class']});
  back.addEventListener('click',()=>{
   if(returning||!history.length)return;
   const target=history[history.length-1];
   returning=true;
   select.value=target;
   // Use exactly the same change handler as the existing section picker.
   select.dispatchEvent(new Event('change',{bubbles:true}));
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const actual=select.value||'home';
    // If unsaved Studio changes caused a cancellation, leave history untouched.
    if(actual===target){
     history.pop();
     current=actual;
    }else current=actual;
    returning=false;
    update();
   }));
  });
  update();
  panel.dataset.creatorUi='20.6';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();