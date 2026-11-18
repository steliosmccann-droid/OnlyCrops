# Only Crops CP20.11 — HUD Coins control visibility

## Reproduced source-level issue

The screenshot showed the HUD screen with the large **Only Crops · Ταυτότητα παιχνιδιού** logo card but without the Coins positioning keypad. The brand card's CP20.3 script (`scripts/editor/041-oc203-branding-js.js`) inserted it at `edit.firstChild`, ahead of the original item picker and CP20.10 Coins controls. On iPhone it consumed a large part of the view before the actual editing tools.

## Patch

The card now inserts *after* `#oc210-coins-position` when available; fallback inserts before the legacy generic replacement card. The real original editor, existing event handlers, selector IDs, save keys, farm data and player currency remain unchanged. Updated `index.html` to CP20.11 and all local asset URL version query strings to avoid old Safari cache.

Backup: `backup-cp20-10-before-hud-layout-fix`.

## Check on iPhone

Open Game Maker → HUD. The item selector and `🪙 Μετακίνηση εικόνας Coins` should now appear above the large logo/branding card. Test `→` to move 5px, close or refresh, verify position stays.

This fix was source-verified and syntax-checked, but not yet visually playtested on the user's Safari.
