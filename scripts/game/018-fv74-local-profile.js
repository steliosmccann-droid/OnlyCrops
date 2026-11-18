

(function(){
'use strict';
const PROFILE_KEY='farmville3026-local-profile-v74';
const OLD_INTRO_KEY='farmville3026-character-intro-v73';
const get=id=>document.getElementById(id);
function readProfile(){try{const v=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(v&&typeof v.name==='string'&&['classic','blonde'].includes(v.character))return v;}catch(e){}return null;}
function localSave(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));localStorage.setItem('classic-farm-character',p.character);localStorage.setItem(OLD_INTRO_KEY,'yes');return true;}catch(e){return false;}}
function setCharacter(id){
 if(!['classic','blonde'].includes(id))return;
 try{farmerCharacter=id;}catch(e){}
 const original=get(id==='classic'?'charClassic':'charBlonde');
 if(original)original.click();
 try{dirty=true;}catch(e){}
}
function init(){
 const modal=get('fv73-welcome'), start=get('fv73-go'), name=get('fv74-name'), opts=Array.from(document.querySelectorAll('[data-fv73-choice]'));
 if(!modal||!start||!name||!opts.length)return;
 let selected='blonde', profile=readProfile();
 function choose(id){
  if(!['classic','blonde'].includes(id))return;
  selected=id;
  opts.forEach(b=>{const active=b.getAttribute('data-fv73-choice')===id;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);b.style.outline=active?'3px solid #81af28':'';b.style.background=active?'#e7f6b9':'';});
  start.disabled=false;
 }
 // Attach both handlers to stable DOM; no dependence on game setup.
 opts.forEach(b=>b.addEventListener('click',function(e){e.stopPropagation();choose(b.getAttribute('data-fv73-choice'));}));
 function open(){profile=readProfile();name.value=profile?.name||'';choose(profile?.character||(()=>{try{return farmerCharacter}catch(e){return 'blonde'}})());modal.hidden=false;modal.style.display='flex';drawPreview();}
 function close(){modal.hidden=true;modal.style.removeProperty('display');}
 function submit(){
  const clean=name.value.trim().replace(/[<>]/g,'').slice(0,24)||'Αγρότης';
  const p={name:clean,character:selected,createdAt:profile?.createdAt||Date.now()};
  localSave(p);profile=p;setCharacter(selected);close();
  const status=get('fv74-profile-status');if(status)status.textContent='👤 '+clean+' · '+(selected==='blonde'?'Αγρότισσα':'Αγρότης');
 }
 start.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();submit();});
 name.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit();}});
 function drawPreview(){const c=get('fv73-blonde-preview');if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;
  let a;try{a=FarmImages.get('farmer_blonde');}catch(e){}
  ctx.clearRect(0,0,c.width,c.height);
  if(!a||!a.img||!a.img.complete||!a.img.naturalWidth||!a.conf||!a.conf.cols||!a.conf.rows){ctx.font='64px system-ui';ctx.fillText('👩‍🌾',8,78);return;}
  const img=a.img, fw=img.naturalWidth/a.conf.cols,fh=img.naturalHeight/a.conf.rows;
  const ratio=Math.min(84/fw,101/fh),w=fw*ratio,h=fh*ratio;
  ctx.imageSmoothingEnabled=true;ctx.drawImage(img,0,0,fw,fh,(c.width-w)/2,(c.height-h)/2,w,h);
 }
 const settings=get('fv42-settings-content');
 if(settings){
  const row=document.createElement('div');row.id='fv74-profile-controls';row.style.cssText='padding:12px;border:1px solid #bca474;border-radius:10px;background:#fff1cd;display:grid;gap:8px';
  const title=document.createElement('strong');title.textContent='Τοπικό προφίλ παίκτη';
  const status=document.createElement('div');status.id='fv74-profile-status';status.style.cssText='font-size:13px';status.textContent=profile?'👤 '+profile.name:'Δεν έχει δημιουργηθεί προφίλ';
  const edit=document.createElement('button');edit.type='button';edit.textContent='👨‍🌾 Αλλαγή προφίλ / χαρακτήρα';edit.style.cssText='padding:10px;border-radius:9px;border:2px solid #987045;background:#fdf8e8;font-weight:700';edit.addEventListener('click',open);
  row.append(title,status,edit);settings.append(row);
 }
 const old=get('fv73-settings');if(old)old.remove();
 if(!profile)open();
 drawPreview();
 // As sprites are loaded asynchronously, refresh the portrait without blocking the form.
 let tries=0;const timer=setInterval(()=>{drawPreview();if(++tries>=16){clearInterval(timer);}},400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

