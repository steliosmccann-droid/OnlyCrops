

document.addEventListener('DOMContentLoaded',()=>{
 const settings=document.querySelector('#fv42-settings-content');
 if(!settings)return;
 const row=document.createElement('div');row.id='fv71-extra-graphics';row.style.cssText='display:flex;gap:8px;align-items:center;justify-content:center;margin:10px 0;flex-wrap:wrap';
 const camera=document.createElement('button');camera.type='button';camera.title='Φωτογραφία φάρμας';camera.setAttribute('aria-label','Φωτογραφία φάρμας');camera.style.cssText='background:url('+JSON.stringify(window.FV71_ART['camera.png'])+') center/contain no-repeat;width:52px;height:52px;border:0;cursor:pointer';
 camera.onclick=()=>{try{const canvas=document.getElementById('game');const a=document.createElement('a');a.download='FarmVille3026-Farm.png';a.href=canvas.toDataURL('image/png');a.click()}catch(err){alert('Η φωτογραφία δεν αποθηκεύτηκε: '+err.message)}};
 const music=document.createElement('button');music.type='button';music.disabled=true;music.title='Μουσική — θα ενεργοποιηθεί όταν προστεθεί το Audio System';music.setAttribute('aria-label','Μουσική — σύντομα');music.style.cssText='background:url('+JSON.stringify(window.FV71_ART['music.png'])+') center/contain no-repeat;width:44px;height:44px;border:0;opacity:.55';
 row.append(camera,music);settings.append(row);
});

