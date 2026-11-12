import Phaser from 'phaser';
import { DIRECTIONS, IDLE_COLUMNS, WALK_COLUMNS, frameIndex, type Direction } from './layout';
import { textureKey, type LayerId } from './layers';

export type AvatarState = 'idle' | 'walk';

export function animationKey(layer: LayerId, variant: string, state: AvatarState, direction: Direction): string {
  return `${textureKey(layer, variant)}-${state}-${direction}`;
}

/**
 * Crée les 8 animations d'une variante (repos et marche, 4 directions).
 * Les animations sont rangées dans le gestionnaire du jeu (this.anims), partagé par toutes les
 * scènes : on ne les crée qu'une fois, d'où le test exists().
 */
export function createAvatarAnimations(anims: Phaser.Animations.AnimationManager, layer: LayerId, variant: string): void {
  const texture = textureKey(layer, variant);
  for (const direction of DIRECTIONS) {
    const idleKey = animationKey(layer, variant, 'idle', direction);
    if (!anims.exists(idleKey)) {
      anims.create({
        key: idleKey,
        frames: anims.generateFrameNumbers(texture, { frames: IDLE_COLUMNS.map((c) => frameIndex(direction, c)) }),
        frameRate: 2, // images par seconde : une respiration lente
        repeat: -1, // -1 = en boucle
      });
    }
    const walkKey = animationKey(layer, variant, 'walk', direction);
    if (!anims.exists(walkKey)) {
      anims.create({
        key: walkKey,
        frames: anims.generateFrameNumbers(texture, { frames: WALK_COLUMNS.map((c) => frameIndex(direction, c)) }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}
