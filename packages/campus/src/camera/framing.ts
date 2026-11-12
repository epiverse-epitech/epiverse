// Calculs de cadrage partagés par la caméra du campus et l'aperçu de création.
import Phaser from 'phaser';
import { FRAME_HEIGHT, FRAME_WIDTH } from '../avatar/layout';

/** Rectangle en pixels de l'écran (ceux du canvas). */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Position de caméra (scrollX, scrollY) qui place le point du monde (worldX, worldY) sous le
 * point de l'écran (screenX, screenY), au zoom donné. Phaser zoome autour du centre de l'écran :
 * le centre montre le monde en (scroll + taille / 2), et on s'en écarte de (écart à l'écran / zoom).
 */
export function scrollToShow(
  camera: Phaser.Cameras.Scene2D.Camera,
  worldX: number,
  worldY: number,
  screenX: number,
  screenY: number,
  zoom: number,
): { x: number; y: number } {
  return {
    x: worldX - camera.width / 2 - (screenX - camera.width / 2) / zoom,
    y: worldY - camera.height / 2 - (screenY - camera.height / 2) / zoom,
  };
}

/** Plus grand zoom entier où un avatar tient dans la zone, avec de la marge. */
export function fitAvatarZoom(area: Rect, min: number, max: number): number {
  const zoom = Math.floor(Math.min(area.width / (FRAME_WIDTH * 2), area.height / (FRAME_HEIGHT * 1.4)));
  return Phaser.Math.Clamp(zoom, min, max);
}
