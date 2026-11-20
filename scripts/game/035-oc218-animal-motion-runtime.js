/* Only Crops CP20.18 — live animal animation bridge.
 * Reads the EXISTING GM19 IndexedDB library. Never writes to farm saves,
 * animal production, game economy, sprite editor storage or object positions.
 * Missing/invalid animations fall back to the unchanged original FarmImages.draw.
 */
(()=>{'use strict';
 const ANIMALS=new Set((window.FarmGridCatalog?.ROWS||[]).find(([g])=>g==='Ζώα')?.[1]?.map(row=>row[0])||[]);
 const STATES=new Set(['idle','walk','eat','produce']);
 const DIRECTIONS=new Set(['front','back','left','right']);
 const DB='NostalgiaVille_Studio_CP19',STORE='assets';
 const records=new Map(),decoded=new Map(),pending=new Map(),recent=new Map();
 let connected=false,loading=false,revision=0;
 const key=(animal,state,direction)=>animal+'/'+state+'/'+direction;
 const validRecord=a=>{
  if(!a||typeof a.name!=='string'||typeof a.dataUrl!=='string'||!a.dataUrl.startsWith('data:image/'))return null;
  const m=/^Animal ([a-z0-9-]+) (idle|walk|eat|produce) (front|back|left|right)$/.exec(a.name);
  if(!m||!ANIMALS.has(m[1]))return null;
  const cols=Number(a.cols),rows=Number(a.rows),count=Number(a.count),fps=Number(a.fps);
  const margin=Number(a.margin??0),spacing=Number(a.spacing??0);
  if(!Number.isInteger(cols)||cols<1||cols>32||!Number.isInteger(rows)||rows<1||rows>16||
   !Number.isInteger(count)||count<1||count>Math.min(128,cols*rows)||
   !Number.isFinite(fps)||fps<1||fps>30||
   !Number.isInteger(margin)||margin<0||margin>128||
   !Number.isInteger(spacing)||spacing<0||spacing>128||
   !Number.isFinite(a.width)||!Number.isFinite(a.height)||
   a.width<1||a.height<1||a.width>4096||a.height>4096)return null;
  return {key:key(m[1],m[2],m[3]),animal:m[1],state:m[2],direction:m[3],cols,rows,count,fps,margin,spacing,
    updatedAt:typeof a.updatedAt==='string'?a.updatedAt:'',dataUrl:a.dataUrl,uid:String(a.id||a.name)};
 };
 async function refresh(){
  if(loading||!ANIMALS.size||!('indexedDB' in window))return false;
  loading=true;
  let db;
  try{
   db=await new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    req.onblocked=()=>reject(Error('Η βιβλιοθήκη animations είναι απασχολημένη'));
   });
   const all=await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).getAll();
    req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
   });
   const next=new Map();
   // Max 120 named action/direction records; never load arbitrary Studio images into memory.
   for(const source of all.slice(0,300)){
    const row=validRecord(source);if(!row)continue;
    const old=next.get(row.key);
    if(!old||row.updatedAt>=old.updatedAt)next.set(row.key,row);
   }
   records.clear();for(const [k,v] of next)records.set(k,v);
   decoded.clear();pending.clear();revision++;
   connected=true;return true;
  }catch(e){connected=false;return false}
  finally{try{db?.close()}catch(e){}loading=false}
 }
 function imageFor(record){
  const id=record.key+'@'+revision;
  const found=decoded.get(id);if(found)return found;
  if(pending.has(id))return null;
  const img=new Image();
  pending.set(id,img);
  img.onload=()=>{
   pending.delete(id);
   if(img.naturalWidth&&img.naturalHeight){
    const w=(img.naturalWidth-2*record.margin-(record.cols-1)*record.spacing)/record.cols;
    const h=(img.naturalHeight-2*record.margin-(record.rows-1)*record.spacing)/record.rows;
    if(Number.isInteger(w)&&Number.isInteger(h)&&w>0&&h>0)decoded.set(id,{img,w,h});
   }
  };
  img.onerror=()=>{pending.delete(id)};
  img.src=record.dataUrl;
  return null;
 }
 function available(animal,state,direction){
  const choices=[key(animal,state,direction),key(animal,state,'front'),key(animal,'idle',direction),key(animal,'idle','front')];
  for(const k of choices)if(records.has(k))return records.get(k);
  return null;
 }
 function stateFor({animal,objectId,moving,ready}){
  if(moving&&records.has(key(animal,'walk','front')))return 'walk';
  const last=recent.get(objectId);
  if(last&&last>Date.now())return 'produce';
  if(ready)return 'produce';
  return 'idle';
 }
 function draw({animal,objectId,moving=false,ready=false,direction='front',ctx,cx,groundY,baseWidth,zoom=1,scale=1,offsetX=0,offsetY=0,flipX=false}){
  if(!ANIMALS.has(animal)||!ctx)return false;
  const state=stateFor({animal,objectId,moving,ready});
  const selected=available(animal,state,DIRECTIONS.has(direction)?direction:'front');
  if(!selected)return false;
  const source=imageFor(selected);if(!source)return false;
  const {img,w,h}=source,frame=Math.floor(performance.now()/1000*selected.fps)%selected.count;
  const col=frame%selected.cols,row=Math.floor(frame/selected.cols);
  const sx=selected.margin+col*(w+selected.spacing),sy=selected.margin+row*(h+selected.spacing);
  const dw=baseWidth*scale,dh=dw*h/w;
  if(!Number.isFinite(dw)||!Number.isFinite(dh)||dw<=0||dh<=0)return false;
  ctx.save();
  ctx.translate(cx+offsetX*zoom,groundY+offsetY*zoom);
  if(flipX)ctx.scale(-1,1);
  ctx.drawImage(img,sx,sy,w,h,-dw/2,-dh,dw,dh);
  ctx.restore();
  return true;
 }
 function onHarvest(id){if(id!=null)recent.set(id,Date.now()+1800)}
 function hasActive(){return decoded.size>0||pending.size>0}
 window.OnlyCropsAnimalMotion={refresh,draw,onHarvest,hasActive,
  status:()=>({connected,animations:records.size,decoded:decoded.size,animals:[...ANIMALS],revision})};
 // The original GM19 Save in Studio button creates/updates the same IndexedDB.
 // Refresh asynchronously after its transaction; do not interfere with its save listener.
 let reload;
 document.addEventListener('click',e=>{
  if(!e.target.closest?.('#gm19-save,#gm19-import'))return;
  clearTimeout(reload);reload=setTimeout(refresh,1100);
 },true);
 window.addEventListener('focus',()=>{if(!loading&&records.size===0)refresh()});
 refresh();
})();
