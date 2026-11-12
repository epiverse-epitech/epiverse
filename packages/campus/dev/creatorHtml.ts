// Écran de création d'avatar (à la création du compte) : un aperçu animé et le formulaire HTML.
import './creator.css';
import { DEFAULT_LOOK, createCampusGame } from '../src';
import { createAvatarForm } from './avatarForm';
import { showToast } from './toast';

/** Monte l'écran dans parent et renvoie une fonction qui le démonte. */
export function mountHtmlCreator(parent: HTMLElement): () => void {
  const screen = document.createElement('div');
  screen.className = 'creator';
  const preview = document.createElement('div');
  preview.className = 'creator__preview';
  screen.append(preview);
  parent.append(screen);

  // Le jeu n'occupe que la boîte d'aperçu : c'est la mise en page CSS qui décide de sa taille.
  const game = createCampusGame(preview, { screen: 'creator', look: DEFAULT_LOOK });

  const form = createAvatarForm({
    look: DEFAULT_LOOK,
    withName: true,
    onChange: (look) => game.setLook(look),
    onSubmit: (look, name) => {
      console.info('Avatar validé', { displayName: name, look });
      showToast(`Avatar de ${name ?? '?'} validé`);
    },
  });
  form.setAttribute('aria-label', 'Créer mon avatar');
  screen.append(form);

  return () => {
    game.destroy();
    screen.remove();
  };
}
