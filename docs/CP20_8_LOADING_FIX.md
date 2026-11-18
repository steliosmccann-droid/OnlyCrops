# CP20.8 — Safari loading recovery

## Symptom
Safari could remain on the loading overlay if the engine-ready event did not arrive, a resource was stale in cache, or a startup script threw. Exact original error on the user's device was not available.

## Changes
- `scripts/game/002-block-002.js`: gives a clear error rather than an indefinite loading screen; catches resource/script errors; offers a retry without altering saved game data.
- If the game canvas has visibly rendered but the legacy `farmville:ready` event was missed, the boot overlay now closes based on rendered pixels.
- After ~16 seconds with no rendered canvas, the screen shows a retry button and the first available error instead of staying in an ambiguous state.
- `index.html`: appends `?v=cp20.8` to 43 local JavaScript and 57 local CSS references, to avoid a mixed old/new cache in Safari. URLs still point to the same files.
- Existing localStorage save keys, object IDs, grid, economy, and mechanics remain unchanged.
- Preserves backup branch `backup-cp20-7-before-loading-fix`.

## Verification
- Confirmed all 43 referenced JS files exist in the repository; two are intentionally empty.
- Tested original CP20.5 JavaScript bundle syntax with Node locally.
- Browser rendering could not be tested in the execution environment; requires real Safari check.
- The missing ready event or stale cached assets are **plausible causes**, not a confirmed device-side root cause.
