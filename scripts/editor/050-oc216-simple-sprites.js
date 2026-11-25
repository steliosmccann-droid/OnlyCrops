/* Only Crops CP20.16 — simple Sprite entry point; uses the original CP12 image input
 and Sprite Engine; does not create a second editor or touch farm data. */
(()=>{'use strict';
function drawPlacement(canvas,id,clip,frame,img,sx,sy,fw,fh){
 const engine=window.FV83Assets,ctx=canvas.getContext('2d');
 const def=window.FV83Defs.get(id),conf=engine.get(id)?.conf||{};
 const anchor=engine.manualAnchor(id,clip,frame)||engine.groundAnchor(id,img,sx,sy,fw,fh)||{x:.5,y:1};
 const W=canvas.width,H=canvas.height;
 const base=Math.max(15,(def.w+def.h)*15.5*.65),scale=conf.scale||1;
 const automatic=!!engine.manualAnchor(id,clip,frame)||engine.isCentered(id);
 const dx=automatic?0:conf.offsetX||0,dy=automatic?0:conf.offsetY||0;
 const width=base*scale,height=width*fh/fw,flip=!!conf.flipX;
 const ax=flip?1-anchor.x:anchor.x;
 const halfX=(def.w+def.h)*15.5/4,halfY=(def.w+def.h)*8/4;
 const extentX=Math.max(halfX,width+Math.abs(dx)),extentY=Math.max(halfY,height+Math.abs(dy));
 const z=Math.min((W-20)/(2*extentX),(H-20)/(2*extentY));
 const cx=W/2,cy=H/2;
 const x=cx+(dx-width*ax)*z,y=cy+(dy-height*anchor.y)*z,w=width*z,h=height*z;
 ctx.fillStyle='#f6efdc';ctx.fillRect(0,0,W,H);
 ctx.beginPath();
 for(const [i,[gx,gy]] of [[0,0],[def.w,0],[def.w,def.h],[0,def.h]].entries()){
  const px=cx+((gx-def.w/2)-(gy-def.h/2))*7.75*z,py=cy+((gx-def.w/2)+(gy-def.h/2))*4*z;
  if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);
 }
 ctx.closePath();ctx.fillStyle='#b9d496';ctx.fill();ctx.strokeStyle='#527335';ctx.lineWidth=2;ctx.stroke();
 ctx.save();ctx.translate(flip?x+w:x,y);if(flip)ctx.scale(-1,1);
 ctx.drawImage(img,sx,sy,fw,fh,0,0,w,h);ctx.restore();
 ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#8a3219';ctx.stroke();
 return {x,y,w,h,flip};
}
function pointAt(canvas,box,event){
 const r=canvas.getBoundingClientRect();
 const x=((event.clientX-r.left)*canvas.width/r.width-box.x)/box.w;
 const y=((event.clientY-r.top)*canvas.height/r.height-box.y)/box.h;
 return x>=0&&x<=1&&y>=0&&y<=1?{x:box.flip?1-x:x,y}:null;
}
window.OnlyCropsPlacement={draw:drawPlacement,pointAt};
function attachAnimalCenter(picker,after){
 const wrap=document.createElement('section');after.after(wrap);
 function add(tag,label){const n=document.createElement(tag);n.textContent=label;wrap.append(n);return n}
 add('strong','Στοίχιση στο πλέγμα');
 const hint=add('p','Πάτησε ανάμεσα στα πόδια. Το πρώτο σημείο ισχύει για όλα τα καρέ. Μετά διορθώνεις κάθε καρέ χωριστά.');
 const canvas=add('canvas','');canvas.width=320;canvas.height=220;canvas.style.cssText='width:100%;height:auto;display:block;touch-action:manipulation';
 const next=add('button',''),reset=add('button','Επαναφορά στοίχισης');next.type=reset.type='button';
 const status=add('p','');status.setAttribute('role','status');
 let frame=0,last='',box=null;
 function refresh(){
  const id=picker.value,engine=window.FV83Assets,a=engine?.get(id);
  wrap.hidden=!engine?.isAnimal?.(id);wrap.style.display=wrap.hidden?'none':'';
  if(last!==id){frame=0;last=id;status.textContent=''}
  box=null;if(wrap.hidden)return;
  const ready=!!a?.img?.naturalWidth;
  canvas.hidden=!ready;canvas.style.display=ready?'block':'none';reset.disabled=!ready;
  if(!ready){next.hidden=true;hint.textContent='Διάλεξε εικόνα ζώου για να εμφανιστεί ο ρόμβος.';if(a?.img&&!a.img.complete)a.img.addEventListener('load',refresh,{once:true});return}
  hint.textContent='Πάτησε ανάμεσα στα πόδια. Το πρώτο σημείο ισχύει για όλα τα καρέ. Μετά διορθώνεις κάθε καρέ χωριστά.';
  const cols=a.conf.cols,rows=a.conf.rows,count=cols*rows;
  frame%=count;next.hidden=count===1;next.textContent='Καρέ '+(frame+1)+' / '+count+' · Επόμενο';
  const w=a.img.naturalWidth/cols,h=a.img.naturalHeight/rows;
  box=drawPlacement(canvas,id,'sprite',frame,a.img,(frame%cols)*w,Math.floor(frame/cols)*h,w,h);
 }
 function save(pt){const ok=window.FV83Assets.setManualAnchor(picker.value,'sprite',frame,pt);refresh();status.textContent=ok?'Η στοίχιση αποθηκεύτηκε.':'Η στοίχιση ισχύει για αυτή τη συνεδρία.'}
 next.onclick=()=>{frame++;refresh()};reset.onclick=()=>save(null);
 canvas.onclick=ev=>{if(box){const pt=pointAt(canvas,box,ev);if(pt)save(pt)}};
 picker.addEventListener('change',refresh);refresh();return refresh;
}
window.OnlyCropsAttachAnimalCenter=attachAnimalCenter;
let attempts=0;
function install(){
 const panel=document.getElementById('gm106-panel'),nav=document.getElementById('gm20-section');
 const bridge=document.getElementById('gm106-real-asset-bridge');
 const original=bridge?.querySelector('select[aria-label="Πραγματικό αντικείμενο Sprite Editor"]');
 const file=document.getElementById('gm-cp12-image-file');
 const statusOriginal=[...bridge?.querySelectorAll('p[aria-live="polite"]')||[]].slice(-1)[0];
 if(!panel||!nav||!bridge||!original||!file||!document.getElementById('assetTarget')){
  if(++attempts<100)setTimeout(install,200);return;
 }
 if(document.getElementById('oc216-simple-sprites'))return;
 const create=(tag,parent,value)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;parent.append(e);return e};
 const card=create('section',bridge);card.id='oc216-simple-sprites';bridge.prepend(card);
 create('h2',card,'🌳 Εικόνες — Εύκολη επεξεργασία');
 create('p',card,'1. Βρες αντικείμενο. 2. Επίλεξε PNG από το iPhone. 3. Η εικόνα εφαρμόζεται στη φάρμα.');
 const searchLabel=create('label',card,'Αναζήτηση αντικειμένου');
 const search=create('input',searchLabel);search.type='search';search.placeholder='π.χ. cow, chicken, apple…';search.id='oc216-search';search.autocomplete='off';
 const pickerLabel=create('label',card,'Ποιο αντικείμενο;');
 const picker=create('select',pickerLabel);picker.id='oc216-picker';
 const info=create('p',card);info.id='oc216-info';info.setAttribute('aria-live','polite');
 const preview=create('div',card);preview.id='oc216-preview';
 const img=create('img',preview);img.alt='Προεπισκόπηση επιλεγμένου sprite';img.hidden=true;
 const noImg=create('p',preview,'Δεν υπάρχει ακόμη δική σου εικόνα γι’ αυτό το αντικείμενο.');
 const fileLabel=create('label',card,'📁 Επιλογή PNG, JPG ή WebP από iPhone');
 const choose=create('button',fileLabel,'＋ Διάλεξε εικόνα');choose.type='button';
 const showCenter=attachAnimalCenter(picker,pickerLabel);
 const explanation=create('p',card,'Χρησιμοποιεί την ίδια εισαγωγή εικόνας που υπάρχει ήδη στο παιχνίδι. Μέχρι 8 MB. Το grid δεν αλλάζει.');
 const message=create('p',card);message.id='oc216-message';message.setAttribute('role','status');
 const advanced=create('button',card,'⚙ Περισσότερα: μέγεθος, animation, backup');advanced.id='oc216-advanced';advanced.type='button';advanced.setAttribute('aria-expanded','false');
 let objectUrl=null,advancedOpen=false,all=[];
 function fold(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el-GR')}
 function data(){
  const target=document.getElementById('assetTarget');
  const source=[...target.options].filter(o=>o.value);
  const used=new Set();
  return source.filter(o=>!used.has(o.value)&&used.add(o.value)).map(o=>({id:o.value,name:o.textContent.trim()||o.value}));
 }
 function fill(){
  const current=picker.value||original.value||'cow',q=fold(search.value.trim());
  all=data().filter(x=>!q||fold(x.name+' '+x.id).includes(q));
  picker.replaceChildren();
  for(const row of all){const opt=create('option',picker,row.name+' · '+row.id);opt.value=row.id}
  if(all.some(o=>o.id===current))picker.value=current;
  else if(all.length)picker.value=all[0].id;
  picker.disabled=!all.length;choose.disabled=!all.length;
  showCenter();
  if(!all.length){info.textContent='Δεν βρέθηκε αντικείμενο. Δοκίμασε άλλη αναζήτηση.';img.hidden=true;noImg.hidden=false;return}
  selectOriginal();
 }
 function selectOriginal(){
  const id=picker.value;if(!id)return;
  if(![...original.options].some(o=>o.value===id)){
   message.textContent='⚠ Αυτό το αντικείμενο δεν είναι διαθέσιμο στον ενεργό Sprite Engine.';
   choose.disabled=true;return;
  }
  choose.disabled=false;
  if(original.value!==id){original.value=id;original.dispatchEvent(new Event('change',{bubbles:true}))}
  draw();
 }
 function draw(){
  showCenter();
  const id=picker.value,engine=window.FV83Assets,asset=engine?.get?.(id),def=window.FV83Defs?.get?.(id);
  if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}
  img.removeAttribute('src');img.hidden=true;noImg.hidden=false;
  info.textContent=(def?.name||id)+(def?' · Grid '+def.w+'×'+def.h:'')+' · '+(asset?.blob?'Δικό σου sprite':asset?.inlineSrc?'Ενσωματωμένη εικόνα':'Χωρίς εικόνα PNG');
  let src='';
  if(asset?.blob){objectUrl=URL.createObjectURL(asset.blob);src=objectUrl}
  else if(typeof asset?.inlineSrc==='string')src=asset.inlineSrc;
  if(src){img.src=src;img.hidden=false;noImg.hidden=true}
 }
 function changeAdvanced(next){
  advancedOpen=next;
  panel.classList.toggle('oc216-assets-advanced',next);
  advanced.textContent=next?'✕ Κλείσιμο προηγμένων':'⚙ Περισσότερα: μέγεθος, animation, backup';
  advanced.setAttribute('aria-expanded',String(next));
  const submenu=document.getElementById('gm20-subsection');
  if(next&&submenu&&[...submenu.options].some(o=>o.value==='single')){
   submenu.value='single';submenu.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }
 function refresh(){
  const active=nav.value==='assets';
  panel.classList.toggle('oc216-assets-active',active);
  card.hidden=!active;
  if(!active){panel.classList.remove('oc216-assets-advanced');return}
  if(advancedOpen)panel.classList.add('oc216-assets-advanced');
  if(!picker.options.length)fill();
  else {showCenter();draw()}
 }
 picker.addEventListener('change',selectOriginal);
 search.addEventListener('input',fill);
 choose.addEventListener('click',()=>{
  selectOriginal();
  if(choose.disabled)return;
  // Direct iPhone user gesture on the real input; its original onChange owns
  // validation, image decoding, saving and updating the map.
  file.click();
 });
 advanced.addEventListener('click',()=>{changeAdvanced(!advancedOpen)});
 nav.addEventListener('change',()=>requestAnimationFrame(refresh));
 if(statusOriginal)new MutationObserver(()=>{
  message.textContent=statusOriginal.textContent||'';
  draw();
 }).observe(statusOriginal,{subtree:true,characterData:true,childList:true});
 window.addEventListener('pagehide',()=>{if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}},{once:true});
 fill();refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
