import Phaser from 'phaser';
import { DEFAULT_LOOK, type AvatarLook } from './avatar/layers';
import type { Rect } from './camera/framing';
import { DRESSING_END, DRESSING_START, ENTER_BUILDING, SET_LOOK } from './events';
import { AvatarScene } from './scenes/AvatarScene';
import { CreatorPreviewScene } from './scenes/CreatorPreviewScene';
import { DebugOverlayScene } from './scenes/DebugOverlayScene';
import { createCameraButtons } from './ui/cameraButtons';

export interface CampusGameOptions {
  /** Affiche les images par seconde, la taille du jeu et la densité de pixels. */
  debug?: boolean;
  /**
   * Écran affiché : le campus (par défaut) ou l'aperçu de création d'avatar. L'interface de
   * création (boutons, couleurs) est fournie par l'app, en HTML : voir dev/creatorHtml.ts.
   */
  screen?: 'campus' | 'creator';
  /** Apparence de départ de l'avatar. */
  look?: AvatarLook;
  /**
   * Campus : l'avatar est arrivé à la porte d'un bâtiment. Identifiants actuels : 'ecole', 'asso',
   * 'entreprise', 'bde' et 'dressing-room' (cabine d'essayage). C'est l'app qui décide quoi afficher.
   */
  onEnterBuilding?: (buildingId: string) => void;
}

/** Ce que l'app reçoit pour piloter le jeu. */
export interface CampusGame {
  /** Change l'apparence de l'avatar affiché (aperçu ou campus). */
  setLook(look: AvatarLook): void;
  /**
   * Campus : l'app ouvre sa cabine d'essayage. Le jeu fait un gros plan sur l'avatar, centré dans
   * previewElement : un élément de l'app (transparent) qui marque la partie de l'écran à utiliser.
   */
  startDressing(previewElement: HTMLElement): void;
  /** Campus : l'app ferme sa cabine d'essayage ; retour à la vue de jeu. */
  endDressing(): void;
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

  // Du jeu vers l'app : on traduit l'événement interne en callback, pour que l'app n'ait pas à
  // connaître le bus d'événements de Phaser.
  game.events.on(ENTER_BUILDING, (buildingId: string) => options.onEnterBuilding?.(buildingId));

  return {
    setLook(look) {
      game.events.emit(SET_LOOK, look);
    },
    startDressing(previewElement) {
      // Position de l'élément par rapport au canvas, recalculée à chaque appel (rotation, défilement…).
      // En mode RESIZE, 1 pixel CSS = 1 pixel du jeu : pas de conversion d'échelle à faire.
      const area = (): Rect => {
        const zone = previewElement.getBoundingClientRect();
        const canvas = game.canvas.getBoundingClientRect();
        return { x: zone.left - canvas.left, y: zone.top - canvas.top, width: zone.width, height: zone.height };
      };
      game.events.emit(DRESSING_START, area);
    },
    endDressing() {
      game.events.emit(DRESSING_END);
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
  return options.screen === 'creator' ? [new CreatorPreviewScene({ look })] : [new AvatarScene(look)];
}
