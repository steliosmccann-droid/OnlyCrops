/* Only Crops CP20.15 — standalone Logo tab within the existing Game Maker.
   Reuses original logo editor and its save handlers. No changes to gameplay or saves. */
(()=>{'use strict';
let attempts=0;
function install(){
 const panel=document.getElementById('gm106-panel');
 const nav=document.getElementById('gm20-section');
 const shell=document.getElementById('oc214-shell');
 const choices=document.getElementById('oc214-choices');
 const brand=document.getElementById('oc203-brand-card');
 const logoEditor=document.getElementById('gm106-logo-asset-card');
 const edit=brand?.parentElement;
 const pick=edit?.querySelector(':scope > select');
 if(!panel||!nav||!shell||!choices||!brand||!logoEditor||!pick){
  if(++attempts<100)setTimeout(install,180);return;
 }
 if(document.getElementById('oc215-logo-choice'))return;
 // Move, don't copy: the approved logo, restore logic and PNG handlers stay intact.
 shell.after(brand);
 brand.classList.add('oc215-logo-tab');
 // Old simple HUD/UI views may have marked this old card as hidden.
 brand.classList.remove('oc212-legacy-hidden','oc213-ui-legacy-hidden','gm18-off');
 logoEditor.classList.remove('oc212-legacy-hidden','oc213-ui-legacy-hidden','gm18-off');
 // The existing logo inspector remains the only place that changes its PNG.
 brand.appendChild(logoEditor);
 const choice=document.createElement('button');
 choice.id='oc215-logo-choice';choice.type='button';
 choice.dataset.oc214Screen='branding';
 const emoji=document.createElement('span');emoji.className='oc214-icon';emoji.textContent='🍅';
 const content=document.createElement('span');
 const title=document.createElement('strong');title.textContent='Λογότυπο';
 const desc=document.createElement('small');desc.textContent='Εικόνα και ταυτότητα παιχνιδιού';
 content.append(title,desc);choice.append(emoji,content);
 choices.append(choice);
 const back=document.getElementById('oc214-home');
 const current=document.getElementById('oc214-current');
 const topMenu=document.getElementById('oc214-menu');
 let logoMode=false;
 function sync(){
  brand.hidden=!logoMode||nav.value!=='hud';
  panel.classList.toggle('oc215-branding-open',!brand.hidden);
  if(!brand.hidden){
   panel.dataset.oc214Screen='branding';
   if(current)current.textContent='Λογότυπο';
   if(back)back.hidden=false;
  }
 }
 function setLogoSelected(){
  if(![...pick.options].some(o=>o.value==='.fv90-logo'))return false;
  pick.value='.fv90-logo';
  pick.dispatchEvent(new Event('change',{bubbles:true}));
  return true;
 }
 choice.addEventListener('click',()=>{
  // The existing navigation first activates the underlying HUD edit context.
  nav.value='hud';nav.dispatchEvent(new Event('change',{bubbles:true}));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(nav.value!=='hud')return;
   logoMode=true;
   setLogoSelected();
   sync();
   panel.scrollTop=0;
  }));
 });
 // Selecting another Game Maker task closes branding without changing editor data.
 nav.addEventListener('change',()=>{
  if(logoMode){logoMode=false;requestAnimationFrame(sync)}
 });
 if(back)back.addEventListener('click',()=>{logoMode=false;requestAnimationFrame(sync)});
 if(topMenu)topMenu.addEventListener('click',()=>{
  if(logoMode){logoMode=false;requestAnimationFrame(sync)}
 });
 panel.addEventListener('click',e=>{
  if(e.target.closest('#oc215-logo-choice,#oc203-brand-card,#oc214-shell'))return;
  // No data mutation. Class is only recomputed when the section changes.
 });
 logoMode=false;sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
