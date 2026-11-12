import Phaser from 'phaser';
import { animationKey, type AvatarState } from './animations';
import { FEET_Y, FRAME_HEIGHT, type Direction } from './layout';
import { LAYERS, textureKey, type AvatarLook, type LayerId } from './layers';

/**
 * Avatar composé de calques : un conteneur qui regroupe une ombre et un sprite par calque.
 * On déplace, affiche ou trie le conteneur comme un seul objet ; ses enfants suivent.
 * Sa position (x, y) est celle des pieds : pratique pour le placer sur une tuile et, plus tard,
 * pour dessiner devant ce qui est plus haut à l'écran.
 */
export class Avatar extends Phaser.GameObjects.Container {
  private readonly sprites: Record<LayerId, Phaser.GameObjects.Sprite>;
  private look: AvatarLook;
  private direction: Direction = 'down';
  // Pas « state » : ce nom est déjà pris par une propriété de tous les objets Phaser.
  private motion: AvatarState = 'idle';

  constructor(scene: Phaser.Scene, x: number, y: number, look: AvatarLook) {
    super(scene, x, y);
    this.look = look;

    // new … plutôt que scene.add… : l'objet n'est pas posé dans la scène, seulement dans le conteneur.
    this.add(new Phaser.GameObjects.Ellipse(scene, 0, 0, 18, 6, 0x000000, 0.3)); // ombre au sol

    // Ordre d'ajout = ordre d'affichage dans le conteneur : corps, puis tenue, puis cheveux.
    const sprites: Partial<Record<LayerId, Phaser.GameObjects.Sprite>> = {};
    for (const layer of LAYERS) {
      const sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, textureKey(layer, look.parts[layer]));
      sprite.setOrigin(0.5, FEET_Y / FRAME_HEIGHT); // point d'ancrage : sous les pieds, au milieu
      this.add(sprite);
      sprites[layer] = sprite;
    }
    this.sprites = sprites as Record<LayerId, Phaser.GameObjects.Sprite>;

    scene.add.existing(this); // le conteneur, lui, est posé dans la scène
    this.setLook(look);
  }

  /** Change les variantes et les couleurs, puis relance les animations. */
  setLook(look: AvatarLook): this {
    this.look = look;
    for (const layer of LAYERS) {
      // Teinte : chaque pixel gris est multiplié par la couleur (fonctionne uniquement en WebGL).
      this.sprites[layer].setTint(look.colors[layer]);
    }
    return this.playAll();
  }

  walk(direction: Direction): this {
    if (this.motion === 'walk' && this.direction === direction) return this;
    this.motion = 'walk';
    this.direction = direction;
    return this.playAll();
  }

  idle(): this {
    if (this.motion === 'idle') return this;
    this.motion = 'idle';
    return this.playAll();
  }

  /**
   * Lance la même animation sur tous les calques, dans la même image du jeu : ils démarrent
   * ensemble, ont la même vitesse, et restent donc synchronisés (le bras et la manche bougent ensemble).
   */
  private playAll(): this {
    for (const layer of LAYERS) {
      this.sprites[layer].play(animationKey(layer, this.look.parts[layer], this.motion, this.direction));
    }
    return this;
  }
}
