# Only Crops CP20.24 — Rotate visual preview

## User-reported issue
The Rotate button changes orientation/footprint, but the image may appear unchanged. In particular, when the rotated footprint collides at the current location, the original renderer was still drawing the stored orientation rather than the pending rotated preview. A simple mirrored sprite may also look identical if the art is symmetrical.

## Implemented
- When Rotate is pending due to collision, render the selected sprite with the **pending orientation**, without modifying the saved object.
- Draw the rotated proposed footprint over the original object: red if obstructed, green otherwise.
- Display a visible `↻ 0°` / `↻ 90°` direction indicator while the item is selected for Move.
- Keep source grid selection, valid placement rules, drag/tap operations, the two existing orientation states and saved values unchanged.
- The rendering still uses horizontal mirroring for 2D sprites. A true alternate back/side view requires **separate directional artwork**; this release does not fabricate 3D views or rotate an upright sprite sideways.

## Safety
Backup branch: `backup-cp20-23-before-rotate-visual-fix`.
No changes to farm saves, economy, gameplay, animal behavior or footprints.

## iPhone acceptance
1. Select Move, choose a rectangular item, tap Rotate; verify sprite mirror/orientation marker and swapped footprint.
2. Rotate where obstruction prevents saving: pending orientation preview and red proposed footprint should be visible, while actual object stays saved in original orientation.
3. Drag to a valid location: confirm position and orientation commit together.
4. Rotate a symmetrical animal: direction label changes even if the art visually looks the same; actual alternative directional artwork is still needed for a distinct animal side/back view.

Validation performed: JS syntax and index integration; not yet tested in Safari on iPhone.
