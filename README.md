# Only Crops — Checkpoint 20.15

Το **🍅 Λογότυπο** έχει πλέον δική του καρτέλα στον Game Maker και δεν εμφανίζεται ανάμεσα στις ρυθμίσεις HUD, Coins και Κουμπιών. Οι ίδιες λειτουργίες PNG και επαναφοράς διατηρούνται. [Αναφορά](docs/CP20_15_LOGO_TAB.md).

# Only Crops — Checkpoint 20.14

Πιο καθαρός Game Maker: 4 βασικές επιλογές, ένα κουμπί «← Αρχική», κρυμμένα τα διπλά μενού στα HUD/Κουμπιά και πρόσβαση στα υπόλοιπα εργαλεία από «⚙ Μενού». Backup: `backup-cp20-13-before-maker-simplification`. [Αναφορά αλλαγών](docs/CP20_14_SIMPLIFIED_GAME_MAKER.md).

# Only Crops — Checkpoint 20.13

Game Maker → Κουμπιά: απλή επιλογή κουμπιού, μετακίνηση, αυτόματη αποθήκευση από τον υπάρχοντα editor και προηγμένες ρυθμίσεις προαιρετικά. [Αναλυτικά](docs/CP20_13_SIMPLE_UI.md).

# Only Crops — Checkpoint 20.12

Απλοποιημένος HUD Editor για iPhone: διάλεξε στοιχείο → μετακίνησε με βελάκια → αυτόματη αποθήκευση. Τα προχωρημένα εργαλεία ανοίγουν μόνο όταν τα χρειάζεσαι. [Τεκμηρίωση](docs/CP20_12_SIMPLE_HUD.md).

# Only Crops — Checkpoint 20.10

Game Maker → HUD: απευθείας εργαλείο για την εικόνα Coins, με βελάκια θέσης, βήμα pixels και επαναφορά. Χρησιμοποιεί τα υπάρχοντα HUD overrides και την αυτόματη αποθήκευση. Backup: `backup-cp20-9-before-hud-coins-usability`. [Αναφορά](docs/CP20_10_HUD_COINS_USABILITY.md).

# Only Crops — Checkpoint 20.9

Έλεγχος Game Maker: διορθώσεις αποθήκευσης και rollback σε HUD/UI, παραγωγή και Market. Νέο κουμπί «🩺 Έλεγχος λειτουργιών Game Maker» στην Αρχική. Κανένα save της φάρμας δεν διαγράφηκε. [Αναφορά CP20.9](docs/CP20_9_GAME_MAKER_AUDIT.md).

# Only Crops — Checkpoint 20.8

Διόρθωση Loading στο Safari: εμφανίζεται συγκεκριμένο σφάλμα/Επανάληψη αντί για ατελείωτη φόρτωση. Προστέθηκε ανίχνευση ήδη σχεδιασμένης φάρμας και ανανέωση της cache των αρχείων. Τα saves και οι μηχανισμοί παραμένουν αμετάβλητα. Απαιτείται δοκιμή στο iPhone.

# Only Crops — Checkpoint 20.7

Η CP20.7 διορθώνει τη διαδικασία Εφαρμογής, Επαναφοράς και Import του Crops Editor: οι πραγματικές τιμές καλλιεργειών επανέρχονται αν αποτύχει η αποθήκευση. Δεν αλλάζει το σύστημα αποθήκευσης ή τους μηχανισμούς της φάρμας.

# Only Crops — Checkpoint 20.6

Η CP20.6 προσθέτει το κουμπί «← Πίσω» στην πλοήγηση του Game Maker, για εύκολη επιστροφή στην προηγούμενη ενότητα από το iPhone. Διατηρεί τις προειδοποιήσεις μη αποθηκευμένων αλλαγών, τους μηχανισμούς και τα saves.

# Only Crops — Checkpoint 20.5

Η CP20.5 βελτιώνει τη βοήθεια μέσα στον υπάρχοντα Game Maker σε iPhone: οδηγίες ανά ενότητα, εμφάνιση επιλεγμένου υποεργαλείου και καλύτερη αναγνωσιμότητα. Δεν αλλάζει μηχανισμούς, saves ή assets.

# Only Crops — Checkpoint 20.4

Το CP20.4 προσθέτει στο ενσωματωμένο Game Maker σταθερή μπάρα πλοήγησης για iPhone, επιστροφή στην αρχική, ένδειξη ενότητας και σύντομη βοήθεια. Δεν αλλάζει τους μηχανισμούς της φάρμας.

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
