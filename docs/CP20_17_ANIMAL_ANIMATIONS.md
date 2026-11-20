# Only Crops CP20.17 — Animal Animation Editor

## Goal
All game animals are intended to receive animations. Build an iPhone-friendly workflow **inside the existing GM19 Animation Studio**, without introducing another image database.

## Implemented
- A dedicated `🐄 Animations ζώων` Game Maker landing action and `🐄 Ζώα` tab in GM19 Studio.
- Reads **live** animals from `FarmGridCatalog.ROWS` group `Ζώα` and filters to currently valid `FV83Assets.allowed` items. At present this means seven base animals (cow, chicken, sheep, pig, rabbit, duck, goat), not all previously approved yet-unregistered variants.
- Choice of animation state: Idle, Walk, Eat, Production/Harvest.
- Four directions: Front, Back, Left, Right.
- Validated sprite-sheet parameters (1–32 columns, 1–16 rows, 1–128 frames, 1–30 FPS), named assets e.g. `Animal cow walk left`.
- **Create animation** uses GM19’s existing new-draft handler, real iPhone image file input, frame geometry, playback preview and **Save in Studio** (the current IndexedDB and Studio JSON export). User explicitly clicks “Apply movement settings” after importing an image, because the original importer resets sheet values when loading a new file.
- No sprite changes until the original GM19 `Apply to farm` action is explicitly chosen.

## Current gameplay limits (important)
The existing farm engine supports a **single active sprite/animation per object**. Keeping separate Idle, Walk, Eat and Production clips in Studio does **not** yet connect state switching to animal movement, feeding or harvest triggers. This checkpoint is an animation authoring/storage workflow, **not** a full animal animation state machine. Adding runtime state switching safely requires a separate engine checkpoint and playtest.

## Data safety
Uses native GM19 IndexedDB store `NostalgiaVille_Studio_CP19` and existing `FV83Assets`. No new game-save keys, changes to grid, footprints, currency, animal harvest economy, existing asset images or farm placements. No imported animation is automatically activated in the game.

## Files
- `scripts/editor/051-oc217-animal-animations.js`
- `styles/creator/064-oc217-animal-animations.css`
- `index.html` CP20.17

## Backup
`backup-cp20-16-before-animal-animation-editor`

## iPhone Safari test
1. Open `?v=cp20.17`, Game Maker → Animations ζώων.
2. Choose Cow → Walk → Left; enter 4 columns, 1 row, 4 frames, 6 FPS.
3. Tap Create animation; choose sprite sheet PNG (four equal frames across).
4. After import tap Apply movement settings; view Play and Next Frame in existing Studio.
5. Tap Save in Studio, then check it appears in Studio Library and after page refresh.
6. Repeat for Idle and other actions/directions; use Studio JSON Export for portability.
7. Do not select `Apply to farm` for non-idle clips expecting automatic triggered behavior: runtime switching is not implemented.

## Verification
Source existence, script syntax and entrypoint references checked. Actual iPhone import/playback not remotely tested.
