import type { Rect } from '../scenes/CreatorPreviewScene';

/**
 * Découpage de l'écran de création dans la version Phaser : aperçu en haut et réglages en bas en
 * portrait ; aperçu à gauche et réglages à droite en paysage. En HTML, c'est le rôle du CSS
 * (flexbox) ; ici, il faut le calculer nous-mêmes.
 */
export function creatorLayout(width: number, height: number): { preview: Rect; panel: Rect } {
  if (width > height) {
    const panelWidth = Math.round(width * 0.55);
    return {
      preview: { x: 0, y: 0, width: width - panelWidth, height },
      panel: { x: width - panelWidth, y: 0, width: panelWidth, height },
    };
  }
  const previewHeight = Math.round(height * 0.36);
  return {
    preview: { x: 0, y: 0, width, height: previewHeight },
    panel: { x: 0, y: previewHeight, width, height: height - previewHeight },
  };
}
