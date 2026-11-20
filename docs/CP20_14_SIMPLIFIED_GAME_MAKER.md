# Only Crops CP20.14 — Game Maker simplification

## Why

The user found the Game Maker still confusing after CP20.12 / CP20.13. The cause is not missing functionality, but stacked CP18, CP19, CP20, CP20.4 and CP20.6 navigation layers, repeated help cards, and separate old/new selectors all visible or reachable at once.

## Changes (non-destructive)

- One clear Game Maker landing page with just four primary actions:
  - HUD
  - Κουμπιά
  - Εικόνες
  - Μηχανισμοί
- Single `← Αρχική` button in the Game Maker header area for returning from any task.
- Existing technical navigation hidden in basic HUD, Buttons and Home views.
- Existing navigation for Sprites, Systems, Studio retained because it is still needed to select sub-tools.
- `⚙ Μενού` exposes full original navigation when needed. Extra tools (Animation, Files, HUD Objects) stay accessible.
- All changes delegate to the existing `#gm20-section` change event; no new game data storage, resets, or alternate Game Maker state.

## Files

- `scripts/editor/048-oc214-simple-maker-shell.js`
- `styles/creator/061-oc214-simple-maker-shell.css`
- `index.html` CP20.14 and cache-busted URLs

## Backup

`backup-cp20-13-before-maker-simplification`

## Validation

Verified source links and JavaScript syntax. Safari/iPhone interaction still needs a user test. No claim that all Sprite, Studio or Market editor behaviors are fixed by these UX-only changes.

## Suggested iPhone acceptance checks

1. Launch Game Maker: see only 4 clear choices.
2. Choose HUD: see simple HUD controls without redundant menus; `← Αρχική` works.
3. Choose Κουμπιά: see simple UI controls; `← Αρχική` works.
4. Choose Εικόνες: original catalog / PNG sub-tools still reachable.
5. Choose Μηχανισμοί: Crops, Production, Market and XP tabs remain reachable.
6. Tap `⚙ Μενού`: full navigation becomes available.
7. Ensure saved farm data, currencies and object placements have not changed.

