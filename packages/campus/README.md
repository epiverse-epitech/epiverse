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
src/scenes/              scènes Phaser
dev/main.ts              banc d'essai (joue le rôle de l'app)
```
