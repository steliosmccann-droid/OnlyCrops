

window.FarmGeneral=window.FarmGeneral||{};
(function(g){'use strict'; const handlers=new Map(); g.Events={on(type,fn){if(!handlers.has(type))handlers.set(type,new Set());handlers.get(type).add(fn);return()=>handlers.get(type)?.delete(fn)},emit(type,payload){for(const fn of [...(handlers.get(type)||[])]){try{fn(payload)}catch(e){console.error('Event handler',type,e)}}},count(type){return handlers.get(type)?.size||0}}})(window.FarmGeneral);
(function(g){'use strict';g.Clock={now:()=>Date.now(),readyAt:(plantedAt,duration)=>Number(plantedAt)+Number(duration),isReady:(plantedAt,duration,now=Date.now())=>now>=Number(plantedAt)+Number(duration),clock(ts){const d=new Date(ts);return Number.isFinite(d.getTime())?d.toLocaleString('el-GR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}):'—'}}})(window.FarmGeneral);
(function(g){'use strict';const items=new Map();g.Registry={register(id,meta){if(!id||typeof id!=='string')throw Error('Invalid ID');items.set(id,Object.freeze({...meta,id}));return items.get(id)},get(id){return items.get(id)||null},list(){return [...items.values()]},count(){return items.size}}})(window.FarmGeneral);
(function(g){'use strict';
 const DEFAULT_DURATION=1500;
 let timer=null,element=null,last=null;
 function ensure(){
  if(element?.isConnected)return element;
  element=document.createElement('div');element.id='generalObjectInfo';
  element.className='general-object-info';element.setAttribute('role','status');
  element.setAttribute('aria-live','polite');document.body.appendChild(element);return element;
 }
 function hide(){clearTimeout(timer);timer=null;if(element)element.classList.remove('visible')}
 function show({title='',detail='',x,y,duration=DEFAULT_DURATION}={}){
  const node=ensure();clearTimeout(timer);node.replaceChildren();
  const a=document.createElement('strong'),b=document.createElement('span');
  a.textContent=String(title);b.textContent=String(detail);node.append(a,b);
  const width=window.innerWidth||390,height=window.innerHeight||800;
  // Popup remains inside the iPhone viewport even when the sprite is at its edge.
  const popupWidth=Math.min(230,width-16),left=Math.max(8,Math.min(Number.isFinite(x)?x:width/2,width-popupWidth-8));
  const top=Math.max(48,Math.min((Number.isFinite(y)?y:height/2)-90,height-108));
  node.style.left=left+'px';node.style.top=top+'px';node.classList.add('visible');
  last={title:String(title),detail:String(detail),at:Date.now()};
  timer=setTimeout(hide,Math.max(100,Number(duration)||DEFAULT_DURATION));
 }
 g.ObjectInfo={show,hide,duration:DEFAULT_DURATION,isVisible:()=>!!element?.classList.contains('visible'),getLast:()=>last};
})(window.FarmGeneral);
(function(g){'use strict';g.Save={write(key,value){try{const v=JSON.stringify(value);localStorage.setItem(key,v);return localStorage.getItem(key)===v}catch(e){return false}},read(key,fallback=null){try{const s=localStorage.getItem(key);return s===null?fallback:JSON.parse(s)}catch(e){return fallback}},exportJSON(value,fileName='farm-save.json'){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=fileName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},async readFile(file){return JSON.parse(await file.text())}}})(window.FarmGeneral);
(function(g){'use strict';g.Input={isTap(start,end,threshold=10){return Math.hypot(end.x-start.x,end.y-start.y)<threshold},screenPoint(e,el){const r=el.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}},inside(x,y,rect){return x>=rect.x&&y>=rect.y&&x<rect.x+rect.w&&y<rect.y+rect.h}}})(window.FarmGeneral);
(function(g){'use strict';g.UI={open(el){if(typeof el==='string')el=document.getElementById(el);if(el)el.classList.add('open')},close(el){if(typeof el==='string')el=document.getElementById(el);if(el)el.classList.remove('open')},toggle(el){if(typeof el==='string')el=document.getElementById(el);return el?.classList.toggle('open')||false}}})(window.FarmGeneral);
(function(g){'use strict';const cache=new Map();g.Assets={load(src){if(cache.has(src))return cache.get(src);const promise=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Image load failed'));img.src=src});cache.set(src,promise);return promise},clear(){cache.clear()},count(){return cache.size}}})(window.FarmGeneral);
(function(g){'use strict';g.Animation={frame(now,fps,cols){return Math.floor(now/1000*Math.max(1,fps))%Math.max(1,cols)},frameRect(img,cols,rows,col,row){return {sx:col*img.width/cols,sy:row*img.height/rows,sw:img.width/cols,sh:img.height/rows}},stateRow(state){return {idle:0,walking:1,working:2,harvesting:3,happy:4}[state]??0}}})(window.FarmGeneral);
(function(g){'use strict';let selected=null;g.Selection={choose(obj){selected=obj||null;g.Events?.emit('selection:change',selected);return selected},get(){return selected},clear(){selected=null;g.Events?.emit('selection:change',null)}}})(window.FarmGeneral);
(function(g){'use strict';g.Notifications={announce(message){g.Events?.emit('notification',{message:String(message),at:Date.now()})},on(fn){return g.Events?.on('notification',fn)}}})(window.FarmGeneral);
(function(g){'use strict';let enabled=false;g.Audio={setEnabled(v){enabled=!!v},isEnabled(){return enabled},play(audio){if(!enabled||!audio)return;try{audio.currentTime=0;audio.play()?.catch(()=>{})}catch(e){}}}})(window.FarmGeneral);
(function(g){'use strict';const key='fv-general-settings-v1';const def={sound:false,grid:true,locale:'el-GR'};let settings={...def,...(g.Save?.read(key,{})||{})};g.Settings={get(k){return settings[k]},set(k,v){settings[k]=v;g.Save?.write(key,settings);g.Events?.emit('settings:change',{key:k,value:v})},all(){return {...settings}}}})(window.FarmGeneral);
(function(g){'use strict';const d={el:{ready:'Έτοιμο',growing:'Σε ανάπτυξη',withered:'Μαραμένο',planted:'Φυτεύτηκε',harvest:'Συγκομιδή'},en:{ready:'Ready',growing:'Growing',withered:'Withered',planted:'Planted',harvest:'Harvest'}};g.Locale={t(k,language='el'){return d[language]?.[k]||d.el[k]||k}}})(window.FarmGeneral);
(function(g){'use strict';const tests=new Map();g.Debug={register(name,fn){tests.set(name,fn)},run(){return [...tests].map(([name,fn])=>{try{return{name,passed:!!fn()}}catch(e){return{name,passed:false,error:String(e)}}})},count(){return tests.size}}})(window.FarmGeneral);
(function(g){'use strict';let tool='select';const tools=new Map();g.Tools={register(id,handler){tools.set(id,handler)},choose(id){tool=id;g.Events?.emit('tool:change',id)},current(){return tool},perform(context){const fn=tools.get(tool);return fn?fn(context):null},list(){return [...tools.keys()]}}})(window.FarmGeneral);

