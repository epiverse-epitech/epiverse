# Protocole de mesures produit — 13/11/2026

**Objet :** évaluer le réseau social EpiVerse et son monde 2.5D (inspiration Habbo/VRChat). Les seuils ci-dessous sont **proposés** ; aucune mesure produit ne doit être annoncée comme obtenue avant un test reproductible.

| ID | Mesure | Protocole minimal | Cible indicative | État |
|---|---|---|---|---|
| UX-01 | Réactivité UI p95 (ms) | 30 interactions identiques (clic → peinture), après échauffement, même appareil/navigateur | ≤ 200 ms | Non mesuré |
| WEB-01 | LCP p75 (s), INP p75 (ms) | Parcours accueil/agenda sur mobile et desktop, données de terrain si disponibles ; laboratoire distingué | LCP ≤ 2,5 s ; INP ≤ 200 ms | Non mesuré |
| A11Y-01 | Violations bloquantes WCAG 2.2 AA | axe-core **et** audit manuel clavier, focus, lecteur d'écran sur connexion, événements et campus (fallback inclus) | 0 bloquante | Non audité |
| API-01 | Latence p50/p95/p99 et erreurs 5xx | Charge fixée, 10 min, endpoints auth/profil/événement, req/s et machine indiqués | p95 ≤ 500 ms ; 5xx < 1 % | Non mesuré en charge |
| CAMP-01 | FPS p5/médian et frame-time p95 (ms) | 60 s, 1/10/50 avatars selon support, scène et déplacements fixes, mesure `requestAnimationFrame` | PC 60 Hz : FPS p5 ≥ 60, p95 frame-time ≤ 16,7 ms ; mobile 30 FPS / 33,3 ms | Non mesuré |
| SOC-01 | Délai de présence avatar A→B p95 (ms) | Deux navigateurs et réseau fixe, 30 déplacements, horloges synchronisées | Baseline à déterminer | Multijoueur non prouvé |
| E2E-01 | Réussite parcours MVP (%) | Inscription, profil, événement, mentor, entrée campus, cas erreurs et autorisations | 100 % parcours P0 | Non validé |

## Conditions obligatoires du relevé

Pour **chaque observation** : date UTC, auteur, URL PR/SHA, branche, environnement, OS, CPU/GPU, mémoire, écran/Hz, résolution, navigateur/version, réseau, nombre d'utilisateurs/avatars, scénario, durée, nombre d'itérations, méthode, fichier de résultats. Deux relevés sont comparables seulement à protocole identique. Les valeurs manquantes sont **N/A**, jamais 0.

## Interprétation de « 60 FPS »

« 60 FPS » n'est **pas** un résultat : préciser appareil, taux de rafraîchissement, résolution, scène, nombre d'avatars, charge réseau, durée et distribution des frames. Le 5e percentile de FPS doit être calculé sur des fenêtres comparables (par exemple fenêtres d'une seconde) ; le p95 des durées entre frames se mesure sur les frames brutes et **ne doit pas être présenté comme exactement équivalent** au FPS p5 agrégé. Si l'écran est limité à 60 Hz, les FPS mesurés peuvent plafonner à environ 60 ; viser p5 ≥ 60 peut être trop strict en pratique, à réviser après baseline.

## Outils et exécution

- API : k6 ou Artillery, sortie JSON/CSV versionnée hors données sensibles.
- Web : Playwright, Lighthouse CI, Web Vitals (distinguer lab et field).
- Accessibilité : axe-core et contrôle manuel clavier/lecteur d'écran.
- Monde : instrumenter le rendu, sauvegarder frametimes bruts et traces Chrome ; vérifier présence multijoueur avec deux clients.
- Graphique : mesurer **au moins deux points réels** à dates distinctes et tracer l'évolution. En attendant, seule la [tendance des PR fusionnées](KPI.md) est factuelle.

**Rôles de mesure proposés :** Philimon (web), Eckson (API), Soumia (UX/UI et accessibilité), Julien/Thomas (campus), Ousmane (CI/charge), Estelle (validation). Affectations à confirmer par les personnes concernées.
