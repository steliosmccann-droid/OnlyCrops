# Only Crops CP20.16 — Simple Sprites / Εικόνες

## Problem
The Game Maker Images area exposed five nested workflows: catalog, single PNG, bulk, sizing and backup, making the first task (select and replace one sprite) hard to find on iPhone.

## Solution
The default **Game Maker → Εικόνες** view now exposes one focused card:
1. Search for an item from the actual `assetTarget` catalog;
2. Select the real item and display its current sprite and locked grid footprint;
3. Choose PNG/JPG/WebP directly from the iPhone (≤8 MB).

This card delegates to the existing `gm-cp12-image-file` native file input, the original `abPick` selector and `FV83Assets` engine. It does **not** create an independent editor, copy sprites to another database or change farm saves.

The old catalog, tune, bulk and backup workflows stay accessible with **⚙ Περισσότερα**. New CSS hides their bulky details only in basic mode.

## Files
- `scripts/editor/050-oc216-simple-sprites.js`
- `styles/creator/063-oc216-simple-sprites.css`
- `index.html`

## Backup
`backup-cp20-15-before-simple-sprites`

## Verification
Source and JS syntax checks passed; remote interactive Safari test has not been performed. On the actual iPhone:
- Game Maker → Εικόνες;
- Search e.g. `cow`, select cow;
- Choose a PNG from Files; check the selected sprite renders and survives refresh;
- Open `Περισσότερα` to verify existing size and backup tools remain available.

If iOS blocks programmatic opening of the old file input, the original native picker is still present in the advanced single-file view; this would need a device-specific follow-up. No change was made to gameplay, IDs, footprints, user coins or save keys.
