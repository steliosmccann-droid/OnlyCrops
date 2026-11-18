# CP20.10 — HUD Coins positioning usability fix

## Reported problem
User could not find how to move the Coins image inside the Game Maker HUD editor, despite the CP20.9 diagnostics passing 14/14.

## Root cause found in source
The original V106 editor offers a HUD item dropdown and general X/Y sliders far below several lengthy asset panels. The Coins image inspector mainly exposes PNG replacement, with no obvious dedicated positioning control. Subsequent CP18/20 UI organizers reused the panel but did not surface the position controls prominently. This is an accessibility/discoverability defect, not evidence of a missing save engine.

## Patch
- `scripts/editor/024-fv106-maker.js`: add one concise **🪙 Μετακίνηση εικόνας Coins** panel at the top of the **existing** HUD editor. Controls select the real `.fv90-coin` target, move it with four 44px minimum buttons, choose 1/5/10/20px step, view X/Y coordinates, and reset only the Coins image X/Y overrides. Uses existing `change()`, `render()`, `store()`, and the V106 persistence key, never duplicates the editor state or mutates game currency.
- `styles/creator/058-oc210-coins-position.css`: responsive touch-friendly directional keypad and readable status.
- `index.html`: CP20.10 cache-busted CSS/JS references.
- Branch `backup-cp20-9-before-hud-coins-usability` preserves prior main.

## Tests
- JavaScript syntax and presence of event hookup verified in repository.
- Needs iPhone Safari usability test: navigate Game Maker → HUD, tap arrows, refresh, ensure visual position persists.
- Farm and player save keys unchanged. Only V106 layout overrides for `.fv90-coin` change on user interaction.

## Follow-up
If the real Coins image still fails to move, inspect CSS specificity and transform interactions in Safari using an actual screenshot or device-level remote debugging. No claim of completed iPhone test.
