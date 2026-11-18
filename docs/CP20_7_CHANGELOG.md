# Only Crops — CP20.7 Crops Editor persistence fix

This checkpoint makes the existing Crops Editor's **Apply**, **Reset** and **Import JSON** transactions safer.

- Apply still changes the real `window.FarmCrops.SEEDS` definition used by gameplay.
- A successful save is read back and verified against `FarmVille3026_V114_CropOverrides`.
- On a failed persistence check, runtime crop values are restored instead of leaving an unsaved live change.
- Reset and Import JSON have equivalent rollback handling.
- The existing crop schema, market refresh hook, current farm saves and engine logic are unchanged.
- Existing planted crops retain their previously calculated timing as explained by the original editor.
- Code-level guards checked; real iPhone Safari playtest is still required.

Suggested playtest: edit one crop's Coins reward and save, reopen editor to confirm; then restore. Import a previously exported crops JSON and check the selected values again.
