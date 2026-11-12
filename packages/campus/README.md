# packages/campus — campus 2.5D (Julien)

Module Phaser 4 indépendant de React : `createCampusGame(élémentParent, options)` crée le jeu dans
un élément de la page et renvoie de quoi le piloter. L'app Expo le montera sur la page `/campus`.
Le dossier contient aussi un banc d'essai Vite (`index.html` + `dev/`) pour le développer seul.

Prototype en cours (branche `feature/EPI-459-avatar-poc`) : hors CI pour l'instant.

## Lancer

```bash
cd packages/campus
npm install
npm run dev        # banc d'essai sur http://localhost:5173 et sur le réseau local
npm run typecheck  # vérification des types
npm run build      # types + build de production dans dist/
```

Sur téléphone : même Wi-Fi que l'ordinateur, puis ouvrir l'adresse « Network » affichée par
`npm run dev`.

## Structure

```
src/index.ts             API publique du module
src/createCampusGame.ts  création et destruction du jeu
src/avatar/              avatar en calques : disposition des feuilles, graphismes provisoires,
                         animations, conteneur Avatar
src/input/               gestes : toucher, maintien, deux doigts
src/camera/              caméra : modes focus et libre, zoom par niveaux (×0,5, ×1, ×2 maximum)
src/ui/                  interface HTML par-dessus le jeu (boutons de caméra)
src/events.ts            événements échangés entre l'interface HTML et le jeu
src/world/               carte provisoire (chemins, fontaine, arbres, maisons)
src/scenes/              scènes Phaser (scène de test de l'avatar, compteur de debug)
dev/main.ts              banc d'essai (joue le rôle de l'app)
```

## Graphismes

Les graphismes actuels sont provisoires, dessinés par code (`src/avatar/placeholderArt.ts`), en
niveaux de gris pour être recolorés par teinte. Un vrai pack (CC0 de préférence ; en CC-BY ou
CC-BY-SA, noter l'attribution ici) remplacera les data URL par des fichiers PNG au même format :
une ligne par direction (bas, gauche, droite, haut), 2 images de repos puis 4 de marche, en 32 × 48.
