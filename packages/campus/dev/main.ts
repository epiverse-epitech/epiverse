// Banc d'essai : joue le rôle de l'app Expo, qui montera le module de la même façon.
// L'écran affiché dépend de l'adresse : ?ecran=campus ou ?ecran=creation.
import { DEFAULT_LOOK, copyLook, createCampusGame } from '../src';
import { mountHtmlCreator } from './creatorHtml';
import { openDressingRoom } from './dressingRoom';
import { showToast } from './toast';

const parent = document.getElementById('app');
if (!parent) throw new Error('Élément #app introuvable dans index.html');

const screen = new URLSearchParams(location.search).get('ecran');

/** Monte l'écran demandé et renvoie de quoi le démonter. */
function mount(target: HTMLElement): () => void {
  if (screen === 'campus') return mountCampus(target);
  if (screen === 'creation') return mountHtmlCreator(target);
  return mountMenu(target);
}

/**
 * Le campus, et ce que l'app fait quand l'avatar entre dans un bâtiment. C'est l'app qui garde
 * l'apparence de l'avatar (plus tard : dans le profil de l'étudiant, via l'API).
 */
function mountCampus(target: HTMLElement): () => void {
  let look = copyLook(DEFAULT_LOOK);
  let dressing = false;

  const game = createCampusGame(target, {
    debug: true,
    look,
    onEnterBuilding: (buildingId) => {
      if (buildingId !== 'dressing-room') {
        showToast(`Entrée : ${buildingId} (la page de l'organisation s'ouvrirait ici)`);
        return;
      }
      if (dressing) return;
      dressing = true;
      openDressingRoom(game, look, (result) => {
        dressing = false;
        if (result) {
          look = result;
          showToast('Nouvelle tenue validée');
        }
      });
    },
  });
  return () => game.destroy();
}

function mountMenu(target: HTMLElement): () => void {
  const menu = document.createElement('nav');
  menu.setAttribute('aria-label', "Écrans du banc d'essai");
  Object.assign(menu.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '24px',
    font: '17px system-ui, sans-serif',
  });
  menu.innerHTML = `
    <a href="?ecran=campus">Campus (carte et déplacements)</a>
    <a href="?ecran=creation">Création d'avatar</a>
  `;
  menu.querySelectorAll('a').forEach((link) => Object.assign(link.style, { color: '#9fd3f0', padding: '10px 0' }));
  target.append(menu);
  return () => menu.remove();
}

const unmount = mount(parent);

// Rechargement à chaud de Vite : démonter l'écran avant de réexécuter ce fichier,
// sinon deux jeux s'empilent dans la page. (Même souci plus tard avec React et son StrictMode.)
import.meta.hot?.dispose(() => unmount());
