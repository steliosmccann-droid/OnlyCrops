# Only Crops — Checkpoint 20.3 | Editable GitHub Project

Το έργο περιλαμβάνει **το παιχνίδι και τον ενσωματωμένο Game Maker**, στην έκδοση Checkpoint 20.3. Η μετατροπή από το αρχικό ενιαίο HTML έγινε χωρίς σκόπιμες αλλαγές στους μηχανισμούς.

## Πού επεξεργάζομαι τι

| Τμήμα | Αρχεία |
| --- | --- |
| Δομή σελίδας, HUD, βασικά στοιχεία | `index.html` |
| Χρώματα, διαστάσεις και UI | `styles/` |
| Λογότυπο και χρώματα Only Crops | `styles/creator/042-oc203-branding-css.css`, `styles/creator/043-only-crops-repo-branding.css` |
| Game Maker και ενσωματωμένοι editors | `scripts/editor/` |
| Παιχνίδι, καλλιέργειες και οικονομία | `scripts/game/` |
| Αρχικά/ενσωματωμένα γραφικά | `scripts/assets/` |
| App icon, loading screen, logo | `assets/branding/` |
| Ρυθμίσεις εγκατάστασης από Safari | `manifest.webmanifest` |

### Σημαντικό

- **Μη μετονομάζεις/μετακινείς** αρχεία χωρίς να αλλάζεις τις αντίστοιχες `src` / `href` αναφορές στο `index.html`.
- Τα `styles` φορτώνουν με την αρχική σειρά που βρίσκονταν στο HTML. Τα JavaScript scripts επίσης φορτώνουν με την αρχική σειρά, χωρίς `async` ή `defer`.
- Οι εικόνες που είχαν ενσωματωθεί ως base64 παραμένουν σε ορισμένα CSS/JS για συμβατότητα. Το διαχωρισμένο project είναι πιο εύκολο στη συντήρηση, αλλά **δεν μετατρέπει όλα τα γραφικά σε ανεξάρτητα PNG**.
- Το Game Maker είναι **μέσα στο παιχνίδι**, όχι ξεχωριστή εφαρμογή. Ορισμένα εργαλεία αποθήκευσης/εξαγωγής του Game Maker χρησιμοποιούν τοπικά δεδομένα browser· οι αλλαγές μέσω του Game Maker **δεν κάνουν αυτόματα commit στο GitHub**. Για μόνιμη ενημέρωση repo πρέπει να ενημερώνεις τα πραγματικά αρχεία του repo.
- Τα saves στο Safari είναι τοπικά στον browser και στη συγκεκριμένη διεύθυνση. Κάνε export save πριν αλλάξεις URL αν θέλεις να τα κρατήσεις.

## Νέο GitHub repository

1. Στο [github.com/new](https://github.com/new), δημιούργησε νέο **Public** repository, π.χ. `Only-Crops` (χωρίς να προσθέσεις README/gitignore/license).
2. **Αποσυμπίεσε** το ZIP. Ανέβασε **τα περιεχόμενά του** στο root του repo (όχι το ZIP ως ένα αρχείο). Οι φάκελοι `assets/`, `styles/`, `scripts/` πρέπει να κρατήσουν τη δομή τους.
3. GitHub → **Settings → Pages → Build and deployment → Deploy from a branch** → `main` / `(root)` → Save.
4. Το site θα είναι `https://<USERNAME>.github.io/<REPO>/` μετά την ολοκλήρωση του deployment.

**iPhone:** Το web upload του GitHub δεν είναι πάντα βολικό για ολόκληρους φακέλους από το Files. Η μεταφορά πολλών φακέλων μπορεί να χρειάζεται Git client με υποστήριξη commit/push από iPhone. Μην ανεβάσεις απλώς το ZIP σαν repository file, γιατί το GitHub Pages δεν θα αποσυμπιέσει αυτόματα το παιχνίδι.

## Προέλευση / έλεγχος

Αφετηρία: `Only_Crops_CP20_3_Repo.zip` με το εγκεκριμένο branding. Έγινε διαχωρισμός 54 CSS blocks και 40 JavaScript blocks σε αρχεία (στα αντίστοιχα `styles/` και `scripts/`). Διατηρήθηκαν τα δεδομένα JSON μέσα στο `index.html`, τα εγκεκριμένα αρχεία branding, το manifest και η σειρά των script/style blocks.
