

(function(){
'use strict';
const $=id=>document.getElementById(id);
const overlay=$('fv42-settings-overlay'),openBtn=$('fv42-settings-button'),closeBtn=$('fv42-settings-close');
const feedback=$('fv42-settings-feedback');
let returnFocus=null;
const gridSetting=$('fv45-setting-grid');
function syncGrid(){const b=$('toggleGrid');if(b)gridSetting.checked=b.classList.contains('active')}
gridSetting.addEventListener('change',()=>{const b=$('toggleGrid');if(!b)return;if(b.classList.contains('active')!==gridSetting.checked)b.click();syncGrid();feedback.textContent=gridSetting.checked?'Το πλέγμα εμφανίζεται.':'Το πλέγμα είναι κρυφό.'});
function open(){returnFocus=document.activeElement;syncGrid();overlay.hidden=false;closeBtn.focus()}
function close(){overlay.hidden=true;if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus()}
openBtn.addEventListener('click',open);
closeBtn.addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
$('fv42-setting-export').addEventListener('click',()=>{const b=$('cropSaveExport');if(!b){feedback.textContent='Η εξαγωγή δεν είναι διαθέσιμη.';return}b.click();feedback.textContent='Άνοιξε η εξαγωγή αντιγράφου ασφαλείας.'});
$('fv42-setting-import').addEventListener('click',()=>{const b=$('cropSaveImport');if(!b){feedback.textContent='Η εισαγωγή δεν είναι διαθέσιμη.';return}b.click();feedback.textContent='Επίλεξε αρχείο JSON της φάρμας.'});
})();

