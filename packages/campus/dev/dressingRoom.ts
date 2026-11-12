// Cabine d'essayage : le panneau HTML qui s'ouvre par-dessus le campus quand l'avatar entre dans
// la cabine. Le jeu continue de tourner dessous ; il fait un gros plan sur l'avatar dans la zone
// transparente que le panneau laisse visible.
import './creator.css';
import { copyLook, type AvatarLook, type CampusGame } from '../src';
import { createAvatarForm } from './avatarForm';

/**
 * Ouvre la cabine. onClose reçoit la nouvelle apparence si l'utilisateur valide, ou null s'il
 * annule (l'avatar reprend alors son apparence d'origine).
 */
export function openDressingRoom(game: CampusGame, look: AvatarLook, onClose: (look: AvatarLook | null) => void): void {
  const original = copyLook(look);

  const overlay = document.createElement('div');
  overlay.className = 'dressing';
  const preview = document.createElement('div');
  preview.className = 'dressing__preview'; // zone transparente : on y voit l'avatar, dans le jeu
  const panel = document.createElement('section');
  panel.className = 'dressing__panel';
  // Une fenêtre de dialogue pour les lecteurs d'écran, avec son titre
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'dressing-title');
  panel.tabIndex = -1;
  panel.innerHTML = '<h2 id="dressing-title" class="dressing__title">Cabine d’essayage</h2>';
  overlay.append(preview, panel);

  const close = (result: AvatarLook | null): void => {
    document.removeEventListener('keydown', onKeyDown);
    if (!result) game.setLook(original);
    game.endDressing();
    overlay.remove();
    onClose(result);
  };
  // Échap ferme la cabine sans garder les changements, comme Annuler
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') close(null);
  };

  panel.append(
    createAvatarForm({
      look,
      withName: false,
      onChange: (changed) => game.setLook(changed),
      onSubmit: (validated) => close(validated),
      onCancel: () => close(null),
    }),
  );

  document.addEventListener('keydown', onKeyDown);
  document.body.append(overlay);
  game.startDressing(preview);
  panel.focus(); // le clavier et les lecteurs d'écran arrivent directement dans la cabine
}
