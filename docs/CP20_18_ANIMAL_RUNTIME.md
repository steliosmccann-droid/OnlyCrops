# Only Crops CP20.18 — Animal Animation Runtime (first integration)

## Purpose
Take action/direction clips authored in CP20.17's **existing** GM19 Studio and render them on the actual isometric farm Canvas. Never change FarmVille animal production mechanics, footprint, currency, progress or farm save keys.

## Implemented
- New `scripts/game/035-oc218-animal-motion-runtime.js` reads the **existing** `NostalgiaVille_Studio_CP19` IndexedDB (`assets` store) read-only.
- Recognizes Studio asset names exactly matching `Animal <existing animal-id> <idle|walk|eat|produce> <front|back|left|right>`.
- Validates sprite sheet bounds (columns, rows, frames, FPS, margin, spacing and image dimensions), extracts frames at runtime and animates by FPS.
- Existing `drawAssetObject` in `scripts/game/013-block-013.js` first attempts a matching animal clip, then falls back to the **unchanged** `FarmImages.draw` if a clip doesn't exist, is still decoding, or is invalid.
- **Idle**: resting animal on the farm if matching clip exists.
- **Walk**: animal in original move-item tool while the animal is selected for relocation; **not** roaming or a walking AI.
- **Produce**: animal whose original production timer is ready, plus a short 1.8-second visual after an actual successful harvest. The original harvest still updates timers/coins via the original `FarmProduction` pathway.
- **Eat**: authorable in Studio, but not triggered by gameplay, since no feeding gameplay event exists. No invented feeding mechanic.
- Direction uses existing item orientation (front/left); clips for back/right can be authored now but will not be triggered until a verified motion/direction mechanic exists.
- Existing render loop redraws while an animal clip is loaded; no additional independent animation loop.
- Studio Save click schedules a background read-only catalog refresh to include new clips without modifying library data.

## Data safety
- Backup branch: `backup-cp20-17-before-animal-runtime`.
- Original FarmImages IndexedDB and GM19 Studio records untouched. Original save keys, footprints, object IDs, positions and animal economy untouched.
- No animal will gain a clip unless the creator has saved a matching `Animal ...` Studio asset. No duplicate editor or second persistence store.

## Limitations and verification
- Requires real Studio assets (none were generated in this checkpoint).
- No animal autonomous walking, eating mechanic, or per-animal AI in this checkpoint.
- No synced animation playback when user switches game tabs or reloads: animation clock is based on current time, whereas farm production timers are unchanged.
- Original GM19 can apply at most 32 single-row frames to FarmImages directly; this runtime adapter can read up to 128 authoring frames from the Studio for state-specific animations.
- Need actual Safari/iPhone playtest with custom sheet. JavaScript parse/static entrypoint verified only.

## Quick acceptance test
1. Game Maker → **Animations ζώων** → Cow → Idle → Front → choose sprite sheet and Save in Studio.
2. Return to the farm. Cow should animate Idle if the sheet is valid, with original image remaining on other animals.
3. Create `Animal cow produce front`, save. The cow should show this clip when the original harvest status becomes ready.
4. Collect the cow's output. The produce clip continues briefly, then Idle resumes; harvested Coins and timer should be unaffected.
5. Remove/rename the saved animation in Studio (or use a different animal) and refresh; unconfigured animals should still display their original sprites.
6. Keep Studio JSON + Sprites backup for portability.
