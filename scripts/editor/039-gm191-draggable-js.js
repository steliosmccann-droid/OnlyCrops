
(()=>{'use strict';
/* Drag minimized launcher AND small/medium editor. A swipe never triggers Restore.
   This patch touches no farm object/state, grid, currency, or animation data. */
let attempts=0;
function setup(){
 const button=document.getElementById('gm106-launch');
 const panel=document.getElementById('gm106-panel');
 const head=panel?.querySelector(':scope > .head');
 if(!button||!panel||!head||panel.dataset.gm181Ready!=='yes'||panel.dataset.gm191Ready)return false;
 panel.dataset.gm191Ready='yes';
 const KEY='NostalgiaVille_gm191_launcher_position';
 const clamp=(n,a,b)=>Math.min(Math.max(n,a),Math.max(a,b));
 const viewport=()=>({w:window.innerWidth||document.documentElement.clientWidth,h:window.innerHeight||document.documentElement.clientHeight});
 const fit=(x,y,w,h)=>{const vp=viewport();return {x:clamp(x,8,Math.max(8,vp.w-w-8)),y:clamp(y,8,Math.max(8,vp.h-h-8))}};
 const place=(el,x,y)=>{
  el.style.setProperty('left',Math.round(x)+'px','important');
  el.style.setProperty('top',Math.round(y)+'px','important');
  el.style.setProperty('right','auto','important');
  el.style.setProperty('bottom','auto','important');
 };
 let saved=null,wasMinimized=false,suppressDragClick=false;
 try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))saved=p}catch(_e){}
 const keep=()=>{
  if(!button.classList.contains('gm181-minimized'))return;
  const r=button.getBoundingClientRect();
  const v=viewport(),pos=fit(r.left,r.top,r.width,r.height);
  saved={x:pos.x/Math.max(1,v.w-r.width),y:pos.y/Math.max(1,v.h-r.height)};
  try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_e){}
 };
 function applySaved(){
  if(!button.classList.contains('gm181-minimized'))return;
  const r=button.getBoundingClientRect(),v=viewport();
  if(saved){const xy=fit(saved.x*Math.max(1,v.w-r.width),saved.y*Math.max(1,v.h-r.height),r.width,r.height);place(button,xy.x,xy.y)}
  else {const xy=fit(r.left,r.top,r.width,r.height);place(button,xy.x,xy.y)}
  button.title='Σύρε για μετακίνηση · πάτησε για άνοιγμα';
 }
 function clearPosition(el){for(const x of ['left','right','top','bottom'])el.style.removeProperty(x)}
 const observer=new MutationObserver(()=>{
  const minimized=button.classList.contains('gm181-minimized');
  if(minimized&&!wasMinimized){wasMinimized=true;requestAnimationFrame(applySaved)}
  if(!minimized&&wasMinimized){wasMinimized=false;button.classList.remove('gm191-moving');clearPosition(button);button.removeAttribute('title')}
 });
 observer.observe(button,{attributes:true,attributeFilter:['class']});
 // Document capture runs before the CP18.1 restore handler on the button itself.
 document.addEventListener('click',e=>{
  if(e.target===button&&suppressDragClick){suppressDragClick=false;e.preventDefault();e.stopImmediatePropagation()}
 },true);
 let pointer=null;
 button.addEventListener('pointerdown',e=>{
  if(!button.classList.contains('gm181-minimized')||(!e.isPrimary)||e.button>0)return;
  const r=button.getBoundingClientRect();
  pointer={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:r.left,y:r.top,w:r.width,h:r.height,moved:false};
  try{button.setPointerCapture(e.pointerId)}catch(_e){}
 },true);
 button.addEventListener('pointermove',e=>{
  const d=pointer;if(!d||e.pointerId!==d.id)return;
  const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
  if(!d.moved&&Math.hypot(dx,dy)<8)return;
  d.moved=true;button.classList.add('gm191-moving');
  const xy=fit(d.x+dx,d.y+dy,d.w,d.h);place(button,xy.x,xy.y);
  if(e.cancelable)e.preventDefault();
 },true);
 function finish(e){
  const d=pointer;if(!d||d.id!==e.pointerId)return;
  if(d.moved){suppressDragClick=true;keep();setTimeout(()=>{suppressDragClick=false},160)}
  pointer=null;button.classList.remove('gm191-moving');
  try{if(button.hasPointerCapture(e.pointerId))button.releasePointerCapture(e.pointerId)}catch(_e){}
 }
 button.addEventListener('pointerup',finish,true);
 button.addEventListener('pointercancel',finish,true);
 // In the small or medium editor, drag from empty header/title, never from window controls.
 let windowDrag=null;
 head.addEventListener('pointerdown',e=>{
  if(panel.hidden||!panel.classList.contains('gm181-small')&&!panel.classList.contains('gm181-medium')||e.target.closest('button,input,select')||!e.isPrimary||e.button>0)return;
  const r=panel.getBoundingClientRect();
  windowDrag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:r.left,y:r.top,w:r.width,h:r.height};
  e.stopImmediatePropagation();
  try{head.setPointerCapture(e.pointerId)}catch(_e){}
  if(e.cancelable)e.preventDefault();
 },true);
 head.addEventListener('pointermove',e=>{
  const d=windowDrag;if(!d||e.pointerId!==d.id)return;
  const xy=fit(d.x+e.clientX-d.startX,d.y+e.clientY-d.startY,d.w,d.h);
  panel.classList.add('gm191-moved');place(panel,xy.x,xy.y);
  e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
 },true);
 function stopWindowDrag(e){if(!windowDrag||e.pointerId!==windowDrag.id)return;windowDrag=null;e.stopImmediatePropagation();try{if(head.hasPointerCapture(e.pointerId))head.releasePointerCapture(e.pointerId)}catch(_e){}}
 head.addEventListener('pointerup',stopWindowDrag,true);
 head.addEventListener('pointercancel',stopWindowDrag,true);
 const panelObserver=new MutationObserver(()=>{
  if(panel.dataset.gm181Size==='full'){panel.classList.remove('gm191-moved');clearPosition(panel)}
  else if(panel.classList.contains('gm191-moved')){const r=panel.getBoundingClientRect(),p=fit(r.left,r.top,r.width,r.height);place(panel,p.x,p.y)}
 });
 panelObserver.observe(panel,{attributes:true,attributeFilter:['data-gm181-size']});
 window.addEventListener('resize',()=>{
  if(button.classList.contains('gm181-minimized'))applySaved();
  if(panel.classList.contains('gm191-moved')){const r=panel.getBoundingClientRect(),p=fit(r.left,r.top,r.width,r.height);place(panel,p.x,p.y)}
 });
 if(button.classList.contains('gm181-minimized')){wasMinimized=true;requestAnimationFrame(applySaved)}
 return true;
}
function start(){if(!setup()&&++attempts<40)setTimeout(start,250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
