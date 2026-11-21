# Only Crops CP20.20 — Classic FarmVille Move placement grid

## Goal
When moving any placed object on the real farm, show the classic isometric mini-grid and actual placement footprint.

## Change
Only `scripts/game/013-block-013.js` and release references in `index.html` changed:
- The existing `drawGrid()` automatically displays the playable grid while `tool==='move'`, even when the player's general grid toggle is off. Outside Move, original grid toggle behavior is preserved.
- Uses the existing `FarmGridCore` geometry, `footprint()` and `validatePlacement()` for both visual guidance and actual placement rules. No new parallel grid or alternative occupancy logic.
- Selected source footprint highlighted blue; target footprint green when placement is valid, red when invalid, with concise label.
- Existing semi-transparent ghost preview remains, but the duplicate Move footprint fill is suppressed.
- Move mode and hover/pointer handling, real drag-to-move and click-to-move, existing footprints and saves remain unchanged.
- Grid disappears automatically when leaving Move (unless the normal player grid toggle was already on).

## Backup
`backup-cp20-19-before-move-grid`

## Verification
Static checks and JS syntax passed. Safari touch playtest not yet confirmed.

## iPhone playtest
1. Turn off grid in normal mode.
2. Select Move — grid must immediately appear.
3. Select cow or hay bale. Its original footprint becomes blue; drag or tap an empty destination: target should be green.
4. Try an occupied or out-of-bounds target — preview must be red and placement must remain disallowed.
5. Confirm object footprint and position match the original rules.
6. Leave Move — grid returns to the previous toggle state, and reload preserves previously stored farm data.
