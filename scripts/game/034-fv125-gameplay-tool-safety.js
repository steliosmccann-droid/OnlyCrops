

(()=>{'use strict';
function init(){
 const ids=['fvMulti','fvPlow','fvMove','fvRecycle'];
 const editor=document.getElementById('gm112-mode');
 const overlay=document.getElementById('gm106-pick');
 function exitEdit(){
  if(editor?.classList.contains('active'))editor.click();
  if(overlay)overlay.hidden=true;
  document.querySelectorAll('.gm112-highlight').forEach(n=>n.classList.remove('gm112-highlight'));
 }
 // Capture at window level, ahead of the Game Maker document capture handler.
 window.addEventListener('pointerdown',e=>{
  const btn=e.target.closest?.('button');
  if(btn&&ids.includes(btn.id))exitEdit();
 },true);
 // For keyboard activation and submenu actions.
 for(const id of ids){
  const b=document.getElementById(id);if(!b)continue;
  b.addEventListener('click',exitEdit,true);
 }
 // Make accidental active editor mode obvious and easy to exit.
 if(editor){editor.setAttribute('aria-label','Επεξεργασία HUD — OFF για κανονικό παιχνίδι');}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

