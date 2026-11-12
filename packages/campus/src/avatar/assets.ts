// Chargement des graphismes de l'avatar, partagé par toutes les scènes qui en affichent un.
import Phaser from 'phaser';
import { createAvatarAnimations } from './animations';
import { FRAME_HEIGHT, FRAME_WIDTH } from './layout';
import { LAYERS, textureKey } from './layers';
import { PLACEHOLDER_VARIANTS, placeholderSheet } from './placeholderArt';

/** À appeler dans preload() : déclare les feuilles de sprites de toutes les variantes. */
export function preloadAvatarSheets(scene: Phaser.Scene): void {
  for (const layer of LAYERS) {
    for (const variant of PLACEHOLDER_VARIANTS[layer]) {
      const key = textureKey(layer, variant);
      // Les textures sont rangées dans le gestionnaire du jeu : on ne recharge pas une clé existante.
      if (scene.textures.exists(key)) continue;
      // Un vrai pack remplacera la data URL par un chemin de fichier, ex. 'assets/avatar/hair-short.png'.
      scene.load.spritesheet(key, placeholderSheet(layer, variant), {
        frameWidth: FRAME_WIDTH,
        frameHeight: FRAME_HEIGHT,
      });
    }
  }
}

/** À appeler dans create() : crée les animations de toutes les variantes (une fois pour tout le jeu). */
export function createAllAvatarAnimations(anims: Phaser.Animations.AnimationManager): void {
  for (const layer of LAYERS) {
    for (const variant of PLACEHOLDER_VARIANTS[layer]) createAvatarAnimations(anims, layer, variant);
  }
}
