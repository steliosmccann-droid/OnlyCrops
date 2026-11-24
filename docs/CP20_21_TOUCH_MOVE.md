# Only Crops CP20.21 — Touch Move preview
## Changes
- Preserve the existing FarmGridCore and CP20.20 automatic placement grid.
- On a **real drag**, the source sprite is dimmed while the object preview follows the target cell. The original game object does not move until the existing validated `classicDragFinish` completes.
- Draw the placement footprint and valid/invalid labels **after** the ghost sprite, so feedback stays legible on the iPhone.
- On pointer cancellation, clear a drag-only selection and leave object coordinates and saves unchanged.
- Do not modify placement validation, grid footprints, barn storage, animal production or player economy.

## Backup
`backup-cp20-20-before-touch-move`

## iPhone checks
1. Open the game, choose Move, drag Cow or Hay Bale to a free space. Ghost image should follow the finger in grid increments and target footprint should remain green and visible.
2. Try placing onto another object. Target should turn red; placement must not be saved.
3. Interrupt drag (e.g. system interruption) and verify source is still in the original position.
4. Try click-to-select then tap-to-drop; original method must still work.
5. Exit Move and check the grid follows the original toggle state.

The modified JS passes source syntax validation. Live touch input has not been verified on an iPhone yet.
