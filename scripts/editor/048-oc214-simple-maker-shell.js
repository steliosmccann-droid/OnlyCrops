/* Only Crops CP20.14: one clear entrance and one task at a time.
   This is a UI adapter for existing CP20 navigation. Never writes saves or farm state. */
(()=>{'use strict';
let attempts=0;
function install(){
 const panel=document.getElementById('gm106-panel');
 const nav=document.getElementById('gm20-section');
 const home=document.getElementById('gm18-home');
 const studio=document.getElementById('gm19-studio');
 if(!panel||!nav||!home||!studio){
  if(++attempts<90)setTimeout(install,200);return;
 }
 if(document.getElementById('oc214-shell'))return;
 const el=(name,parent,text)=>{const n=document.createElement(name);if(text!==undefined)n.textContent=text;parent.appendChild(n);return n};
 const shell=el('div',panel);shell.id='oc214-shell';
 const head=panel.querySelector(':scope > .head');
 if(head)head.after(shell);else panel.prepend(shell);
 const bar=el('div',shell);bar.className='oc214-bar';
 const back=el('button',bar,'← Αρχική');back.type='button';back.id='oc214-home';
 const where=el('strong',bar,'Game Maker');where.id='oc214-current';
 const full=el('button',bar,'Προηγμένα');full.type='button';full.id='oc214-menu';full.setAttribute('aria-expanded','false');
 const welcome=el('section',home);welcome.id='oc214-welcome';
 home.insertBefore(welcome,home.firstChild);
 el('h2',welcome,'Τι θέλεις να αλλάξεις;');

 const choices=el('div',welcome);choices.id='oc214-choices';
 const buttons=[
  ['assets','🌳','Εικόνες','Εικόνα, θέση και μέγεθος'],
  ['ui','🧰','Κουμπιά','Select, Plow, Market και Zoom'],
  ['hud','🪙','Οθόνη παιχνιδιού','Coins, XP και λογότυπο'],
  ['systems','⚙','Κανόνες παιχνιδιού','Καλλιέργειες, τιμές και χρόνοι'],
  ['files','💾','Αρχεία','Εισαγωγή και αντίγραφα']
 ];
 for(const [key,emoji,name,detail] of buttons){
  const b=el('button',choices);b.type='button';b.dataset.oc214Screen=key;
  el('span',b,emoji).className='oc214-icon';
  const copy=el('span',b);el('strong',copy,name);el('small',copy,detail);
  b.addEventListener('click',()=>navigate(key));
 }
 const extra=el('button',welcome,'Προηγμένα εργαλεία');
 extra.type='button';extra.className='oc214-more';
 extra.addEventListener('click',()=>{setFull(true);sync()});
 const descriptions={home:'Αρχική',hud:'HUD',ui:'Κουμπιά',assets:'Εικόνες / Sprites',systems:'Μηχανισμοί',studio:'Animation Studio',files:'Αρχεία',objects:'Στοιχεία HUD',gametools:'Εργαλεία'};
 const tools=el('div',shell);tools.className='oc235-tools';
 const sub=document.getElementById('gm20-subsection');
 let fullMode=false,toolSignature='';
 function syncTools(section){
  const visible=section==='systems'||section==='studio'||(section==='assets'&&panel.classList.contains('oc216-assets-advanced'));
  tools.hidden=fullMode||!visible;
  const signature=section+'|'+Array.from(sub?.options||[],o=>o.value+'='+o.textContent).join('|');
  if(signature!==toolSignature){
   toolSignature=signature;tools.replaceChildren();
   for(const option of sub?.options||[]){
    const button=el('button',tools,option.textContent);button.type='button';button.dataset.tool=option.value;
    button.onclick=()=>{sub.value=option.value;sub.dispatchEvent(new Event('change',{bubbles:true}));requestAnimationFrame(sync)};
   }
  }
  for(const button of tools.children)button.setAttribute('aria-pressed',String(button.dataset.tool===sub?.value));
 }

 function navigate(section){
  if(![...nav.options].some(o=>o.value===section))return;
  nav.value=section;
  // This dispatch calls the ORIGINAL CP20 navigation, including save guards.
  nav.dispatchEvent(new Event('change',{bubbles:true}));
  requestAnimationFrame(()=>requestAnimationFrame(sync));
 }
 function setFull(on){
  fullMode=!!on;
  panel.classList.toggle('oc214-full-mode',fullMode);
  full.setAttribute('aria-expanded',String(fullMode));
  full.textContent=fullMode?'✕ Απλό':'Προηγμένα';
 }
 function sync(){
  const section=nav.value||'home';
  panel.dataset.oc214Screen=section;
  where.textContent=descriptions[section]||'Game Maker';
  back.hidden=section==='home';
  syncTools(section);
  // Avoid editor scroll retaining deep old position when switching sections.
  if(section==='home')panel.scrollTop=0;
 }
 back.addEventListener('click',()=>navigate('home'));
 full.addEventListener('click',()=>{setFull(!fullMode);sync()});
 nav.addEventListener('change',()=>requestAnimationFrame(()=>requestAnimationFrame(sync)));
 panel.addEventListener('click',event=>{
  if(event.target.closest('#oc214-shell,#oc214-welcome'))return;
  requestAnimationFrame(()=>requestAnimationFrame(sync));
 });
 // Preserve the original home buttons/actions invisibly: they are still present for
 // links and original event handlers, but the creator sees only the four choices.
 panel.classList.add('oc214-ready');
 const observer=new MutationObserver(()=>requestAnimationFrame(sync));
 observer.observe(nav,{attributes:true});
 if(sub)observer.observe(sub,{childList:true});
 observer.observe(panel,{attributes:true,attributeFilter:['class']});
 sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
