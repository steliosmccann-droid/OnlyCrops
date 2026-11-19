# CP20.12 — Simple HUD editor on iPhone

## Evidence
On the user's Safari screenshots, Game Maker HUD showed several stacked explanatory cards and the game's branding before practical editing controls, plus a four-direction keypad whose text was clipped by narrow columns and the window viewport.

## Change
Added one compact **HUD — Εύκολη επεξεργασία** card inside the existing Game Maker's HUD editor:
- Selector for actual HUD objects (Coins, NF Cash, XP, logo, etc.), synced to the original V106 item select.
- Four tap-friendly arrows, one step selector (1, 5, 10, 20px), X/Y status and position reset.
- Movement uses the ORIGINAL numeric X/Y controls via their change handlers and save/rollback system; no new persistent state.
- Old verbose cards, logo replacement and advanced appearance controls are hidden by default *only* in the HUD section. **Περισσότερες ρυθμίσεις** exposes them, including direct farm selection.
- Existing other Game Maker sections, sprite/animation tools, market, farm saves and game state are not changed.
- Files: `scripts/editor/046-oc212-simple-hud.js`, `styles/creator/059-oc212-simple-hud.css`, `index.html`.
- Backup: `backup-cp20-11-before-simple-hud`.

## Validation and limitations
Checked that new JS parses and is referenced by CP20.12 index; source-level audit only. No actual user-device Safari acceptance yet.
Check on iPhone: open `?v=cp20.12`, Game Maker → HUD, select Coins image, move right once, confirm live HUD shifts, refresh and confirm persistent position; open advanced settings and verify original controls available.
