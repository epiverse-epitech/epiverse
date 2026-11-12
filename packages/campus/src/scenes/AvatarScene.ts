import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAvatarAnimations } from '../avatar/animations';
import { FRAME_HEIGHT, FRAME_WIDTH, type Direction } from '../avatar/layout';
import { DEFAULT_LOOK, LAYERS, textureKey } from '../avatar/layers';
import { PLACEHOLDER_VARIANTS, placeholderSheet } from '../avatar/placeholderArt';

const TILE = 32;
/** Grossissement de la caméra. Un entier : chaque pixel du dessin devient un carré net de 3 × 3. */
const ZOOM = 3;

/**
 * Scène de test de l'avatar : toucher à côté de lui le fait marcher (sur place) dans cette
 * direction, le toucher lui-même l'arrête.
 */
export class AvatarScene extends Phaser.Scene {
  private avatar!: Avatar;

  constructor() {
    super('avatar');
  }

  // preload : on déclare ce qu'il faut charger ; Phaser charge tout, puis appelle create().
  preload(): void {
    for (const layer of LAYERS) {
      for (const variant of PLACEHOLDER_VARIANTS[layer]) {
        const key = textureKey(layer, variant);
        // Les textures sont rangées dans le gestionnaire du jeu : on ne recharge pas une clé existante.
        if (this.textures.exists(key)) continue;
        // Un vrai pack remplacera la data URL par un chemin de fichier, ex. 'assets/avatar/hair-short.png'.
        this.load.spritesheet(key, placeholderSheet(layer, variant), {
          frameWidth: FRAME_WIDTH,
          frameHeight: FRAME_HEIGHT,
        });
      }
    }
  }

  create(): void {
    for (const layer of LAYERS) {
      for (const variant of PLACEHOLDER_VARIANTS[layer]) createAvatarAnimations(this.anims, layer, variant);
    }

    this.drawFloor();
    // Les pieds vers le bas d'une tuile, comme un personnage debout sur une case
    this.avatar = new Avatar(this, TILE / 2, TILE - 4, DEFAULT_LOOK);

    // La caméra grossit le monde et suit l'avatar : il reste au centre, même après une rotation.
    // L'écart (offset) vise le milieu du corps plutôt que les pieds.
    this.cameras.main.setZoom(ZOOM).startFollow(this.avatar, true).setFollowOffset(0, FRAME_HEIGHT / 2 - 4);

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      // worldX / worldY : la position touchée dans le monde, zoom et défilement de la caméra déjà pris en compte
      const dx = pointer.worldX - this.avatar.x;
      const dy = pointer.worldY - (this.avatar.y - FRAME_HEIGHT / 2);
      if (Math.abs(dx) < FRAME_WIDTH / 2 && Math.abs(dy) < FRAME_HEIGHT / 2) {
        this.avatar.idle();
        return;
      }
      this.avatar.walk(directionOf(dx, dy));
    });
  }

  /** Damier de tuiles autour de l'avatar, pour juger de sa taille. */
  private drawFloor(): void {
    const g = this.add.graphics();
    for (let ty = -10; ty < 10; ty++) {
      for (let tx = -10; tx < 10; tx++) {
        g.fillStyle((tx + ty) % 2 === 0 ? 0x2a3b55 : 0x24334a);
        g.fillRect(tx * TILE, ty * TILE, TILE, TILE);
      }
    }
  }
}

/** Direction dominante d'un écart : horizontale ou verticale, selon la plus grande. */
function directionOf(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
