// Banc d'essai : joue le rôle de l'app Expo, qui montera le module de la même façon.
import { createCampusGame } from '../src';

const parent = document.getElementById('app');
if (!parent) throw new Error('Élément #app introuvable dans index.html');

const game = createCampusGame(parent, { debug: true });

// Rechargement à chaud de Vite : détruire l'ancien jeu avant de réexécuter ce fichier,
// sinon deux jeux s'empilent dans la page. (Même souci plus tard avec React et son StrictMode.)
import.meta.hot?.dispose(() => game.destroy());
