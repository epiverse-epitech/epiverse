// Disposition des feuilles de sprites de l'avatar. Un vrai pack de graphismes devra suivre la même
// disposition, ou on adaptera ces constantes : c'est le seul endroit à modifier.

/** Directions, dans le vocabulaire de position.direction du schéma MongoDB. Ordre = ordre des lignes. */
export const DIRECTIONS = ['down', 'left', 'right', 'up'] as const;
export type Direction = (typeof DIRECTIONS)[number];

/** Taille d'une image (frame) en pixels : un personnage tient sur une tuile de 32 px de large. */
export const FRAME_WIDTH = 32;
export const FRAME_HEIGHT = 48;
/** Hauteur des pieds dans l'image : le point qui touche le sol. */
export const FEET_Y = 44;

/** Colonnes d'une ligne : 2 images au repos, puis 4 images de marche. */
export const IDLE_COLUMNS = [0, 1];
export const WALK_COLUMNS = [2, 3, 4, 5];
export const COLUMNS = 6;

/** Numéro d'une image dans la feuille : Phaser les numérote de gauche à droite, ligne par ligne. */
export function frameIndex(direction: Direction, column: number): number {
  return DIRECTIONS.indexOf(direction) * COLUMNS + column;
}
