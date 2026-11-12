import Phaser from 'phaser';
import { DEFAULT_LOOK, type AvatarLook } from './avatar/layers';
import { SET_LOOK } from './events';
import { AvatarScene } from './scenes/AvatarScene';
import { CreatorPreviewScene } from './scenes/CreatorPreviewScene';
import { DebugOverlayScene } from './scenes/DebugOverlayScene';
import { createCameraButtons } from './ui/cameraButtons';
import { CreatorPanelScene } from './ui-phaser/CreatorPanelScene';
import { creatorLayout } from './ui-phaser/creatorLayout';

export interface CampusGameOptions {
  /** Affiche les images par seconde, la taille du jeu et la densité de pixels. */
  debug?: boolean;
  /** Écran affiché : le campus (par défaut) ou l'aperçu de création d'avatar. */
  screen?: 'campus' | 'creator';
  /** Apparence de départ de l'avatar. */
  look?: AvatarLook;
  /**
   * Écran de création : 'none' (par défaut) = seulement l'aperçu, l'app fournit l'interface ;
   * 'phaser' = interface dessinée dans Phaser (version de comparaison).
   */
  creatorUi?: 'none' | 'phaser';
  /** Interface Phaser : l'apparence a changé. */
  onLookChange?: (look: AvatarLook) => void;
  /** Interface Phaser : l'utilisateur a validé. */
  onValidate?: (look: AvatarLook) => void;
}

/** Ce que l'app reçoit pour piloter le jeu. */
export interface CampusGame {
  /** Change l'apparence de l'avatar affiché (aperçu ou campus). */
  setLook(look: AvatarLook): void;
  destroy(): void;
}

// Styles du conteneur créé par le module. On les pose sur notre propre <div> plutôt que sur
// l'élément de l'app : le module ne modifie pas ce qui ne lui appartient pas.
const ROOT_STYLE: Partial<CSSStyleDeclaration> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  // Le navigateur ne zoome pas, ne défile pas et ne sélectionne rien quand on touche le jeu.
  // Le reste de la page garde son zoom : important pour l'accessibilité.
  touchAction: 'none',
  userSelect: 'none',
  webkitUserSelect: 'none',
};

export function createCampusGame(parent: HTMLElement, options: CampusGameOptions = {}): CampusGame {
  const root = document.createElement('div');
  Object.assign(root.style, ROOT_STYLE);
  // Propriétés propres à Safari iOS, absentes des types DOM standard
  root.style.setProperty('-webkit-touch-callout', 'none'); // pas de menu sur appui long
  root.style.setProperty('-webkit-tap-highlight-color', 'transparent'); // pas de flash gris au toucher
  parent.appendChild(root);

  const game = new Phaser.Game({
    // WebGL uniquement : les téléphones visés le gèrent tous, et le rendu Canvas est déprécié en
    // Phaser 4 (il ignorerait aussi la teinte qui sert à changer les couleurs de l'avatar).
    type: Phaser.WEBGL,
    parent: root,
    backgroundColor: '#1b2333',
    // Graphismes en pixel art : agrandis sans flou (pas d'anticrénelage, pixels arrondis)
    pixelArt: true,
    // Pas de son pour l'instant : Phaser ne crée pas de contexte audio (le navigateur
    // l'aurait bloqué de toute façon tant que l'utilisateur n'a pas touché la page).
    audio: { noAudio: true },
    // Deux doigts suivis en même temps (par défaut : un seul). Le deuxième sert à la caméra.
    input: { activePointers: 2 },
    scale: {
      // RESIZE : le canvas prend toute la taille de son parent, 1 pixel du jeu = 1 pixel CSS
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      // Par défaut, Phaser force body et parent à height: 100%. Monté dans l'app, il ne doit
      // pas toucher à la page : c'est à l'app de donner une taille au parent.
      expandParent: false,
    },
    // Les scènes s'affichent dans l'ordre de la liste : le compteur passe par-dessus le reste.
    scene: [...scenesFor(options), ...(options.debug ? [new DebugOverlayScene()] : [])],
  });

  // Interface HTML par-dessus le canvas, dans le même conteneur (campus seulement)
  const cameraButtons = options.screen === 'creator' ? null : createCameraButtons(root, game.events);

  return {
    setLook(look) {
      game.events.emit(SET_LOOK, look);
    },
    destroy() {
      cameraButtons?.destroy();
      game.destroy(true); // true = retirer aussi le canvas de la page
      root.remove();
    },
  };
}

function scenesFor(options: CampusGameOptions): Phaser.Scene[] {
  const look = options.look ?? DEFAULT_LOOK;
  if (options.screen !== 'creator') return [new AvatarScene(look)];
  if (options.creatorUi !== 'phaser') return [new CreatorPreviewScene({ look })];
  return [
    new CreatorPreviewScene({ look, previewArea: (width, height) => creatorLayout(width, height).preview }),
    new CreatorPanelScene({
      look,
      onChange: (changed) => options.onLookChange?.(changed),
      onValidate: (validated) => options.onValidate?.(validated),
    }),
  ];
}
