# Only Crops CP20.22 — Move selection regression fix

## Reproduced source issue
The CP20.21 pointerdown/pointermove implementation automatically assigned `movingId` to any object under a drag, even if that specific object was not selected for Move. This bypassed the normal tap/context selection workflow and caused unrelated next objects to be moved by dragging them.

## Change
- A drag candidate is registered **only if** the touched item is already the selected `movingId`.
- Pointermove no longer auto-assigns `movingId` when the player drags across other objects.
- Pointerup commits a drag only if that item remains the current Move selection.
- The existing tap-to-select path and context menu's Move action remain unchanged.
- No changes to grid, object footprints, farm state, save keys, economy or animation storage.

## Backup
`backup-cp20-21-before-move-selection-fix`

## iPhone checks
1. Open CP20.22, choose Move.
2. Drag an object without first selecting it: it must **not** relocate automatically. Tap/select that object, then drag it.
3. After a successful move, drag another object without selecting it: that second object must stay in place.
4. Select the second object and move it. The original placement grid and green/red preview must still apply.
5. Check both the normal player/context-menu Move action and tap-to-select → drag.

## Verification
JavaScript parses; release references and selection guards inspected. Actual mobile Safari test not performed.
