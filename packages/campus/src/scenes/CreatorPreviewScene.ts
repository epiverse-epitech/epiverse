import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAllAvatarAnimations, preloadAvatarSheets } from '../avatar/assets';
import { FRAME_HEIGHT, FRAME_WIDTH, type Direction } from '../avatar/layout';
import type { AvatarLook } from '../avatar/layers';
import { SET_LOOK } from '../events';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CreatorPreviewOptions {
  look: AvatarLook;
  /** Partie de l'écran réservée à l'aperçu. Par défaut : tout le canvas. */
  previewArea?: (width: number, height: number) => Rect;
}

/** Hauteur du milieu du corps au-dessus des pieds. */
const BODY_CENTER = FRAME_HEIGHT / 2 - 4;
/** L'aperçu tourne dans ce sens : face, gauche, dos, droite. */
const TURN: readonly Direction[] = ['down', 'left', 'up', 'right'];

/**
 * Aperçu de l'écran de création : l'avatar en grand, qui marche sur place en changeant de
 * direction toutes les 1,5 s. Il change d'apparence quand l'app (ou l'interface Phaser) envoie
 * une nouvelle apparence sur le bus d'événements du jeu.
 */
export class CreatorPreviewScene extends Phaser.Scene {
  private readonly options: CreatorPreviewOptions;
  private avatar!: Avatar;
  private turn = 0;

  constructor(options: CreatorPreviewOptions) {
    super('creator-preview');
    this.options = options;
  }

  preload(): void {
    preloadAvatarSheets(this);
  }

  create(): void {
    createAllAvatarAnimations(this.anims);

    this.add.ellipse(0, 0, 44, 14, 0x2a3b55); // socle sous l'avatar
    this.avatar = new Avatar(this, 0, 0, this.options.look).walk('down');
    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        this.turn = (this.turn + 1) % TURN.length;
        this.avatar.walk(TURN[this.turn] ?? 'down');
      },
    });

    this.layout();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this);
    this.game.events.on(SET_LOOK, this.onSetLook, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.layout, this);
      this.game.events.off(SET_LOOK, this.onSetLook, this);
    });
  }

  private onSetLook(look: AvatarLook): void {
    this.avatar.setLook(look);
  }

  /** Grossit l'avatar autant que possible (zoom entier) et le centre dans la zone d'aperçu. */
  private layout(): void {
    const { width, height } = this.scale;
    const area = this.options.previewArea?.(width, height) ?? { x: 0, y: 0, width, height };
    const zoom = Phaser.Math.Clamp(
      Math.floor(Math.min(area.width / (FRAME_WIDTH * 2), area.height / (FRAME_HEIGHT * 1.4))),
      2,
      8,
    );
    const cam = this.cameras.main.setZoom(zoom);
    // Le milieu du corps (0, -BODY_CENTER) doit tomber au centre de la zone d'aperçu.
    // Même formule que dans CameraController : point du monde = scroll + w/2 + (écran - w/2) / zoom.
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    cam.scrollX = 0 - width / 2 - (cx - width / 2) / zoom;
    cam.scrollY = -BODY_CENTER - height / 2 - (cy - height / 2) / zoom;
  }
}
