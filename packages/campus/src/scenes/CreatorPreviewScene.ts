import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAllAvatarAnimations, preloadAvatarSheets } from '../avatar/assets';
import { FRAME_HEIGHT, TURN_AROUND } from '../avatar/layout';
import type { AvatarLook } from '../avatar/layers';
import { fitAvatarZoom, scrollToShow } from '../camera/framing';
import { SET_LOOK } from '../events';

export interface CreatorPreviewOptions {
  look: AvatarLook;
}

/** Hauteur du milieu du corps au-dessus des pieds. */
const BODY_CENTER = FRAME_HEIGHT / 2 - 4;

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
        this.turn = (this.turn + 1) % TURN_AROUND.length;
        this.avatar.walk(TURN_AROUND[this.turn] ?? 'down');
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

  /** Grossit l'avatar autant que possible (zoom entier) et le centre dans le canvas. */
  private layout(): void {
    const { width, height } = this.scale;
    const zoom = fitAvatarZoom({ x: 0, y: 0, width, height }, 2, 8);
    const cam = this.cameras.main.setZoom(zoom);
    // Le milieu du corps (0, -BODY_CENTER) au centre du canvas
    const scroll = scrollToShow(cam, 0, -BODY_CENTER, width / 2, height / 2, zoom);
    cam.scrollX = scroll.x;
    cam.scrollY = scroll.y;
  }
}
