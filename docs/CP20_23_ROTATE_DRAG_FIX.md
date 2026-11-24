# Only Crops CP20.23 — Rotate + drag consistency

The existing Rotate button swaps the two supported object orientations. When rotation fits at the present location it is committed immediately. If the newly rotated footprint does not fit, the existing Move UI keeps a pending rotation and asks the player to move the object to a clear grid position.

## Fix
The original drag-to-drop handler was still using the *old* item dimensions and did not commit pending rotation on a successful drop. It now:
- calculates proposed width/height from `previewFenceOrientation(item)` using the **existing** `dims` logic;
- validates that footprint against the same existing placement rules;
- commits both the new position and new orientation in one existing `snapshot()` and `save()` operation **only after valid placement**;
- leaves the object unchanged on invalid placement;
- preserves existing Move click-to-drop behavior and animation hooks.

Backup: `backup-cp20-22-before-rotate-preview`.

## iPhone checks
1. Rotate a rectangular item where the destination is clear: it should rotate in place and retain the correct grid footprint.
2. Rotate where the new footprint overlaps another object: the current position should not change; then drag to a free location. It should arrive rotated.
3. Drag to an occupied location with a pending rotation: the drop must fail and the original position and orientation remain intact.
4. Select a second object to Move; CP20.22's explicit selection requirement must still hold.
5. Reload after valid drop and confirm position/orientation persistence.

Source syntax and integration checks passed; live iPhone Safari touch playtest not yet confirmed.
