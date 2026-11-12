// Boutons de caméra en HTML, posés par-dessus le canvas. De vrais <button> : nets à toute
// densité d'écran, utilisables au clavier et annoncés par les lecteurs d'écran.
import type Phaser from 'phaser';
import { CAMERA_COMMAND, CAMERA_STATE, DRESSING_END, DRESSING_START, type CameraCommand, type CameraState } from '../events';

const BUTTON_STYLE: Partial<CSSStyleDeclaration> = {
  minWidth: '44px', // cible tactile minimale
  height: '44px',
  padding: '0 14px',
  border: 'none',
  borderRadius: '22px',
  background: 'rgba(15, 20, 30, 0.8)',
  color: '#ffffff',
  font: '600 16px system-ui, sans-serif',
  pointerEvents: 'auto',
  cursor: 'pointer',
};

export function createCameraButtons(root: HTMLElement, events: Phaser.Events.EventEmitter): { destroy(): void } {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'absolute',
    right: '12px',
    // Au-dessus de la barre d'accueil des iPhone quand la page occupe tout l'écran
    bottom: 'max(12px, env(safe-area-inset-bottom))',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    // La barre laisse passer les touchers vers le jeu ; seuls les boutons les captent.
    pointerEvents: 'none',
  });

  // Phaser écoute aussi les touchers sur toute la fenêtre : sans ça, toucher un bouton
  // ferait en plus marcher l'avatar. On arrête l'appui ici, avant qu'il remonte jusqu'à window.
  const stop = (event: Event): void => event.stopPropagation();
  bar.addEventListener('touchstart', stop);
  bar.addEventListener('mousedown', stop);

  const button = (label: string, ariaLabel: string, command: CameraCommand): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-label', ariaLabel);
    Object.assign(b.style, BUTTON_STYLE);
    b.addEventListener('click', () => events.emit(CAMERA_COMMAND, command));
    return b;
  };

  // Recentrer n'apparaît que hors de la vue de jeu (caméra libre ou vue d'ensemble) : il signale
  // aussi qu'on n'y est plus. Il ramène la caméra sur l'avatar et au zoom maximum.
  const recenter = button('◎ Recentrer', 'Revenir à la vue de jeu, centrée sur mon avatar', 'recenter');
  recenter.hidden = true;
  bar.append(recenter, button('−', 'Dézoomer', 'zoom-out'), button('+', 'Zoomer', 'zoom-in'));
  root.appendChild(bar);

  const onState = (state: CameraState): void => {
    recenter.hidden = state.mode === 'focus' && !state.overview;
  };
  events.on(CAMERA_STATE, onState);
  // Pas de boutons de caméra dans la cabine d'essayage. (L'attribut hidden ne suffirait pas ici :
  // le display: flex posé dans le style de la barre l'emporte sur lui.)
  const hide = (): void => {
    bar.style.display = 'none';
  };
  const show = (): void => {
    bar.style.display = 'flex';
  };
  events.on(DRESSING_START, hide);
  events.on(DRESSING_END, show);

  return {
    destroy() {
      events.off(CAMERA_STATE, onState);
      events.off(DRESSING_START, hide);
      events.off(DRESSING_END, show);
      bar.remove();
    },
  };
}
