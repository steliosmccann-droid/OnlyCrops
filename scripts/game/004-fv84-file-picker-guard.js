

document.addEventListener('DOMContentLoaded',function(){
  for(const input of document.querySelectorAll('#assetPanel input[type="file"],#fv78-editor input[type="file"]')){
    ['pointerdown','pointerup','touchstart','touchend','click'].forEach(function(type){input.addEventListener(type,function(event){event.stopPropagation();},{passive:true});});
  }
});

