
(()=>{'use strict';
/* Patch original toolbar after CP18 has installed its mobile navigation.
   No game engine data or sprite store is accessed. */
function setup(){
 const panel=document.getElementById('gm106-panel');
 const launcher=document.getElementById('gm106-launch');
 const head=panel?.querySelector(':scope > .head');
 if(!panel||!launcher||!head||!document.getElementById('gm18-navigation')||panel.dataset.gm181Ready)return;
 const buttons=[...head.querySelectorAll(':scope > button')];
 if(buttons.length<4)return;
 const [minBtn,smallerBtn,biggerBtn,closeBtn]=buttons;
 panel.dataset.gm181Ready='yes';
 const controls=[[minBtn,'—','Ελαχιστοποίηση Game Maker'],[smallerBtn,'−','Μικρότερο παράθυρο Game Maker'],[biggerBtn,'+','Μεγαλύτερο παράθυρο Game Maker']];
 for(const [btn,txt,label] of controls){
  btn.classList.add('gm181-window-control');btn.textContent=txt;btn.type='button';
  btn.title=label;btn.setAttribute('aria-label',label);
 }
 closeBtn.title='Κλείσιμο Game Maker';closeBtn.setAttribute('aria-label','Κλείσιμο Game Maker');
 let step=2; // 0 small, 1 medium, 2 fullscreen, always adjusted to viewport
 let minimized=false;
 function setSize(next){
   step=Math.max(0,Math.min(2,next));
   panel.classList.toggle('gm181-small',step===0);
   panel.classList.toggle('gm181-medium',step===1);
   smallerBtn.disabled=step===0;biggerBtn.disabled=step===2;
   smallerBtn.setAttribute('aria-label',step===0?'Ήδη στο μικρότερο μέγεθος':'Μίκρυνση Game Maker');
   biggerBtn.setAttribute('aria-label',step===2?'Ήδη σε πλήρη οθόνη':'Μεγέθυνση Game Maker');
   panel.dataset.gm181Size=['small','medium','full'][step];
 }
 // Override the legacy handlers: the old CSS had hidden them, and its width
 // changes were overridden by the CP18 full-screen mobile stylesheet.
 smallerBtn.onclick=()=>setSize(step-1);
 biggerBtn.onclick=()=>setSize(step+1);
 minBtn.onclick=()=>{
   minimized=true;
   panel.hidden=true;
   launcher.textContent='↗ Επαναφορά Game Maker';
   launcher.classList.add('gm181-minimized');
   launcher.setAttribute('aria-label','Επαναφορά ελαχιστοποιημένου Game Maker');
 };
 // Capture only a restore click, keeping the current CP18 screen/scroll selection.
 // Ordinary launch clicks still run the original launcher and organizer handlers.
 launcher.addEventListener('click',ev=>{
   if(!minimized)return;
   ev.preventDefault();ev.stopImmediatePropagation();
   minimized=false;panel.hidden=false;
   launcher.textContent='🎮 Game Maker';
   launcher.classList.remove('gm181-minimized');
   launcher.setAttribute('aria-label','Άνοιγμα Game Maker');
 },true);
 closeBtn.addEventListener('click',()=>{
   minimized=false;launcher.classList.remove('gm181-minimized');
   launcher.textContent='🎮 Άνοιγμα Game Maker';
   launcher.setAttribute('aria-label','Άνοιγμα Game Maker');
 });
 setSize(2);
}
let tries=0;
function start(){
 setup();
 if(!document.querySelector('#gm106-panel[data-gm181-ready]')&&++tries<20)setTimeout(start,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,350),{once:true});else setTimeout(start,350);
})();
