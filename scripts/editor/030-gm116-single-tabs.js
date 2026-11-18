

(()=>{'use strict';
function init(){
 const main=document.getElementById('gm106-panel'),mechanics=document.getElementById('gm113-panel'),crops=document.getElementById('gm114-panel');
 if(!main||!mechanics||!crops)return;
 const tabs=main.querySelector('.tabs');if(!tabs)return;
 const original=[...tabs.querySelectorAll('button')];
 const regularSections=[...main.children].filter(e=>e.tagName==='SECTION'&&e!==mechanics&&e!==crops);
 const oldTitle=main.querySelector('.head strong');if(oldTitle)oldTitle.textContent='🎮 Game Maker';
 // Only one navigation row; no duplicate sub-navigation.
 const holder=document.createElement('section');holder.id='gm116-editor-host';
 holder.append(mechanics,crops);main.insertBefore(holder,regularSections[0]||null);
 mechanics.classList.add('gm115-inside');crops.classList.add('gm115-inside');
 const mechTab=document.createElement('button');mechTab.textContent='⚙ Μηχανισμοί';mechTab.dataset.tab='Mechanics';
 const cropTab=document.createElement('button');cropTab.textContent='🌾 Crops';cropTab.dataset.tab='Crops';
 tabs.append(mechTab,cropTab);
 const all=[...original,mechTab,cropTab];
 function show(tab){
  const special=tab==='Mechanics'||tab==='Crops';
  holder.hidden=!special;
  mechanics.hidden=tab!=='Mechanics';
  crops.hidden=tab!=='Crops';
  // Existing V106 handles HUD/UI/Tools; only hide its content for editor tabs.
  for(const sec of regularSections)if(special)sec.hidden=true;
  for(const el of [...main.children]){
   if(el===holder||el===tabs||el.classList.contains('head'))continue;
   if(el.tagName==='P'||el.classList.contains('actions')||el.tagName==='LABEL')el.classList.toggle('gm116-hide',special);
  }
  all.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tab===tab)));
  if(special){main.scrollTop=0;const nested=tab==='Mechanics'?mechanics:crops;nested.scrollTop=0}
 }
 for(const button of original){
  button.addEventListener('click',()=>{show(button.dataset.tab); // V106 click handler already restores its sections.
   holder.hidden=true;
  });
 }
 mechTab.onclick=()=>show('Mechanics');cropTab.onclick=()=>show('Crops');
 // Prevent legacy editor minimize from creating a blank embedded view.
 for(const panel of [mechanics,crops]){
  const top=panel.querySelector('.gm113-line button,.row button');
  if(top)top.addEventListener('click',()=>{show('HUD');original.find(b=>b.dataset.tab==='HUD')?.click()});
 }
 // When panel reopens, keep the selected editor state.
 show('HUD');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();

