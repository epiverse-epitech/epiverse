import Phaser from 'phaser';

/**
 * Compteur affiché par-dessus le jeu. C'est une scène à part, qui tourne en même temps que la scène
 * de l'avatar : elle a sa propre caméra, sans zoom, donc le texte garde sa taille.
 */
export class DebugOverlayScene extends Phaser.Scene {
  private info!: Phaser.GameObjects.Text;
  private lastUpdate = 0;

  constructor() {
    // active: true : la scène démarre seule. Sans ça, seule la première scène de la liste démarre.
    super({ key: 'debug', active: true });
  }

  create(): void {
    this.info = this.add.text(8, 8, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 4 },
    });
  }

  override update(time: number): void {
    if (time - this.lastUpdate < 250) return;
    this.lastUpdate = time;
    const canvas = this.game.canvas;
    // Écrite par la scène de l'avatar dans le registre partagé du jeu
    const tile = this.registry.get('avatarTile') as { x: number; y: number } | undefined;
    const camera = this.registry.get('camera') as { mode: string; zoom: number } | undefined;
    this.info.setText([
      tile ? `avatar : tuile ${tile.x}, ${tile.y}` : 'avatar : —',
      camera ? `caméra : ${camera.mode === 'free' ? 'libre' : 'focus'} ×${camera.zoom.toFixed(2)}` : 'caméra : —',
      `${Math.round(this.game.loop.actualFps)} images/s`,
      `jeu : ${this.scale.width} × ${this.scale.height}`,
      `canvas : ${canvas.width} × ${canvas.height} px réels`,
      `devicePixelRatio : ${window.devicePixelRatio}`,
    ]);
  }
}
