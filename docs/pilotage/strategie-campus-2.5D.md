# Campus virtuel 2.5D — périmètre et preuve

**Référence de code actuelle :** branche [`feature/EPI-459-avatar-poc`](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus).

## Ce qui existe dans la branche
- Module Phaser (cartes/scènes, caméra, événements).
- Avatar en calques, catalogue d'apparences et animations provisoires.
- Banc de test Vite avec création d'avatar et cabine d'essayage.
- Commandes annoncées : `npm install`, `npm run dev`, `npm run typecheck`, `npm run build`.

Ce code **n'est pas intégré dans `develop` au 13/11** et le banc de test n'atteste pas d'un jeu multijoueur.

## Prototype à livrer
- Un avatar change d'apparence et se déplace au clic/tactile/clavier.
- Une carte avec quelques lieux et retour vers les services EpiVerse.
- Un mode alternatif (liste de lieux/liens) pour l'accessibilité.
- Intégration dans la version **web** Expo ; étude spécifique WebView pour mobile natif.
- Pas de multijoueur / chat temps réel avant architecture de sessions, modération et sécurité.

## Mesure FPS
Sur **60 secondes**, noter appareil, OS, navigateur, résolution, nombre d'avatars et scène. Enregistrer FPS médian et **p5** (5e percentile). Cibles provisoires : mobile ≥ 30 FPS p5, desktop ≥ 60 FPS p5, **uniquement** dans les conditions enregistrées.

## Risques
Poids des assets, compatibilité mobile, accessibilité clavier/lecteur d'écran, droits des images, charge serveur si présence synchronisée. Les prévenir avant d'envisager du 3D/XR.
