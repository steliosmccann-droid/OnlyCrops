# Only Crops CP20.19 — Animal directions & saved clip coverage

## Scope
After CP20.18 connected GM19 animation assets to the farm Canvas, this checkpoint makes real animal relocation choose a direction and makes the 4×4 action/direction coverage visible in the existing Animal Animation Editor.

## Changes
- `scripts/game/035-oc218-animal-motion-runtime.js`: new **transient** `onMove(id, dx, dy)` and `directionFor(id)` choose right/left/front/back based on the real grid displacement. The matching `Walk` clip is selected for approximately 1.35 seconds after successful relocation. Maintains `Idle` and `Produce` clip fallback from CP20.18. Adds read-only `status().clips`.
- `scripts/game/013-block-013.js`: call `onMove` only when a validated click-to-move or drag-to-move succeeds. Move/placement logic and saves remain the original routines.
- `scripts/editor/051-oc217-animal-animations.js`: show a 4 actions × 4 directions **read-only** status grid for the selected animal, based on loaded native Studio clips; includes a Refresh button. This does not generate images or assert that missing clips exist.
- `styles/creator/064-oc217-animal-animations.css`: compact mobile status grid.
- `index.html`: CP20.19 references/cache refresh.

## Strict limitations
- An existing saved FarmVille/Only Crops animal object still has only two persistent orientation states (0 and 1). This checkpoint **does not** alter them or save new direction fields. All four directions are supported only by movement-derived short-lived clip selection when the destination differs from the source.
- The Move tool teleports to the target grid square. The 1.35-second Walk is a visual feedback clip, **not pathfinding or actual animated locomotion across tiles**.
- Eat clips can be stored in Studio, but cannot play in the real farm until feeding interaction exists.
- Missing, invalid or undecoded clips fall back to the previous original sprite renderer.
- No new animal species, images or animation sprites have been created in this checkpoint.
- Stored farm data, production clocks, coins, XP, object sizes and animal inventory untouched.

## Device test on iPhone
1. Open `https://steliosmccann-droid.github.io/OnlyCrops/?v=cp20.19`.
2. Game Maker → 🐄 Animations ζώων → Cow; examine saved clip coverage, tap ↻ to refresh after saving.
3. Author and save `Animal cow idle front` and `Animal cow walk right` using native GM19 Studio; return to farm.
4. Move a cow to the right on the grid. It should play right Walk briefly if valid, then resume Idle.
5. Check original farm coordinates and Coins/harvest timers did not change other than the authorized Move itself.
6. Animals without saved clips should still display normally.

## Verification
The three modified JavaScript files passed syntax validation and the CP20.19 index points to them. The real Safari animation and save persistence require a device-level playtest.

Backup: `backup-cp20-17-before-animal-runtime` is the CP20.17 baseline. CP20.18 is retained in commit history, but a separate CP20.18-specific backup branch was not created in this update.
