# Only Crops CP20.15 — Independent Logo tab

## Issue reported from actual iPhone screenshot

The large **Only Crops · Ταυτότητα παιχνιδιού** branding card was inserted into the real HUD editor by `scripts/editor/041-oc203-branding-js.js`. Consequently it appeared while editing Coins, despite not belonging to the HUD editing workflow.

## Fix

- Added a fifth action **🍅 Λογότυπο** on the Game Maker start screen.
- Reparented the original `#oc203-brand-card` to the main Game Maker panel, outside the HUD editor. The original `#gm106-logo-asset-card` (PNG import, restore and its original event listeners) moves with it.
- When selecting Logo, the existing HUD tab is activated internally for the original logo picker, but the generic HUD editor is hidden. Only the Logo screen is displayed.
- Leaving Logo returns to normal Game Maker screens; the branding card is not displayed in HUD or the other editors.
- Removed any inherited legacy-hidden CSS classes when moving the existing DOM elements.
- No changes to image files, localStorage save keys, game economy, grid, sprites, player saves or existing editing handlers.

## Files

`scripts/editor/049-oc215-logo-tab.js`, `styles/creator/062-oc215-logo-tab.css`, `index.html`.

Backup branch: `backup-cp20-14-before-logo-tab`.

## Check on iPhone

1. Load CP20.15 and open Game Maker.
2. In **HUD**, the branding card should NOT appear.
3. Return to **Αρχική**; press **🍅 Λογότυπο**.
4. Check the existing approved logo, PNG import and restore controls appear only there.
5. Return to **Αρχική** and enter **Κουμπιά** or **Εικόνες**; branding must remain hidden.

Static source and syntax checks passed, but an actual Safari session has not been executed here.
