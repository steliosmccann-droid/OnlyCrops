

(function(){
 'use strict';
 const home=document.getElementById('fv63-creative-controls');
 const profile=document.getElementById('fvProfileSwitch');
 const clock=document.getElementById('fvCreativeTimePanel');
 if(!home||!profile||!clock)return;
 home.appendChild(profile);
 home.appendChild(clock);
 // The original V62 click listeners stay attached to the SAME elements.
 // Synchronize display with the actual profile mode already stored by the game.
 const sync=()=>{
   const active=document.documentElement.classList.contains('profile-creative');
   profile.setAttribute('aria-pressed',String(active));
   clock.setAttribute('aria-hidden',String(!active));
 };
 profile.addEventListener('click',()=>{sync();});
 const settings=document.getElementById('fv42-settings-button');
 if(settings)settings.addEventListener('click',sync);
 sync();
})();

