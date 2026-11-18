# Only Crops CP20.9 — Game Maker audit and persistence fixes

## Scope and precautions
- Previous stable version: CP20.8.
- Backup branch: `backup-cp20-8-before-game-maker-audit`.
- No changes to farm save keys, farming mechanics, crop growth, object footprints, player wallets, existing sprites, or historical catalog.
- Tested by inspecting exact GitHub source and JavaScript syntax checks. **Not** a validated Safari/iPhone acceptance test.
- Local browser rendering test in the execution environment was blocked by network sandbox policy, so interactive issues remain to be confirmed on device.

## High-confidence confirmed implementation defects

1. **HUD/UI edit feedback could incorrectly claim success**: `scripts/editor/024-fv106-maker.js` function `change()` called `store()` but discarded the result and reported successful save. `setAppearance()` did the same. Fixed: verify persistent roundtrip and rollback on failure.
2. **HUD/UI JSON/PNG import could leave unsaved in-memory state**: same file imported to `state`, invoked `store()` without checking, then reported success. Fixed: check save and restore previous state on error.
3. **Production values could be active but unsaved**: `scripts/editor/031-gm117-editor-script.js` applied production changes before storage and failed to roll back. Fixed: snapshot and restore on failed save.
4. **Production import could partially apply invalid data**: prior import silently skipped invalid definitions and could leave changed runtime state if saving failed. Fixed: prevalidate all rows and revert on any failure.
5. **Production reset or save had no verified read-back**: `scripts/game/012-block-012.js` only checked whether setItem threw. Fixed verification and reset rollback.
6. **Market price/level edits could mutate active values before storage succeeds**: `scripts/game/013-block-013.js` FV118Economy set() changed market data, then attempted to save. Fixed as atomic verified storage transaction, updating market maps only after write success.
7. **Market import was a series of reset()/set() calls with ignored failures**: fixed to validate then commit one batch, preserving previous state if storage fails.

## Remaining issues / risks not claimed fixed

- Layered tab management from CP18/CP19/CP20/CP20.4/CP20.6 operates on the same Game Maker panel and can cause hidden or empty sections; needs actual iPhone reproduction.
- HUD Objects editor uses a separate storage system; its feedback and positioning need an individual end-to-end pass.
- Safari file input behavior for multiple PNGs, JSON imports, Animation Studio IndexedDB, and iOS Files picker needs end-to-end confirmation.
- The historical 2009–2020 research catalog is not yet tied to the active sprite/item editor by design.
- HTML/CSS and image preview sizing on iPhone need visual verification.

## New non-destructive diagnostic

Game Maker home now has the button **🩺 Έλεγχος λειτουργιών Game Maker**. It checks existence of the actual component/API connections (HUD, Sprite Engine, Crops, Production, Market, XP, Studio), the selected section's visibility, and one temporary localStorage write/read/delete. It **does not** change game data or replace save files. This is a connectivity diagnostic, not a complete automation of every editor workflow.

## Verification checklist on iPhone Safari

1. Open refreshed `https://steliosmccann-droid.github.io/OnlyCrops/?v=cp20.9`.
2. Open Game Maker and press **🩺 Έλεγχος λειτουργιών Game Maker**. Record any warnings.
3. Open Sprites > select item > load PNG > refresh page > check image persisted.
4. Open HUD > adjust a position or color > refresh page > check persistence.
5. Open Systems > Production > modify a safe test value > apply > refresh > ensure it persisted. Reset afterwards.
6. Open Systems > Market > modify a test price > apply > refresh > check persistence.
7. Visit each section and subcategory (especially Studio and Objects) to check for blank screens.
8. Export all saves and verify the original farm still loads unchanged.

## Files changed
- `scripts/editor/024-fv106-maker.js`
- `scripts/editor/031-gm117-editor-script.js`
- `scripts/game/012-block-012.js`
- `scripts/game/013-block-013.js`
- `scripts/editor/045-oc209-game-maker-audit.js` (new)
- `index.html` (CP20.9, cache-busted URLs)
