import Phaser from 'phaser';

/** Côté d'une tuile du campus en pixels (tile_size des cartes dans MongoDB). */
const TILE = 32;
/** Taille minimale d'une cible tactile, en pixels CSS. */
const TOUCH_TARGET = 44;

interface EmptySceneOptions {
  debug: boolean;
}

/**
 * Scène presque vide : une grille de tuiles et un cadre qui suivent la taille de l'écran,
 * et un rond de 44 px à chaque toucher. Sert à vérifier l'adaptation à l'écran.
 */
export class EmptyScene extends Phaser.Scene {
  private readonly debug: boolean;
  // « ! » : ces champs sont remplis dans create(), pas dans le constructeur.
  // Phaser appelle create() après avoir préparé la scène ; avant, this.add n'existe pas encore.
  private grid!: Phaser.GameObjects.Graphics;
  private info: Phaser.GameObjects.Text | undefined;
  private lastInfoUpdate = 0;

  constructor(options: EmptySceneOptions) {
    super('empty'); // clé unique de la scène, pour la démarrer ou l'arrêter par son nom
    this.debug = options.debug;
  }

  // Pas de preload() : rien à charger pour l'instant (pas d'image, pas de son).

  create(): void {
    this.grid = this.add.graphics();
    this.drawGrid(this.scale.width, this.scale.height);

    // Le Scale Manager appartient au jeu, pas à la scène : on retire notre écouteur quand
    // la scène s'arrête, sinon il continuerait d'appeler une scène disparue.
    this.scale.on(Phaser.Scale.Events.RESIZE, this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.onResize, this);
    });

    // Un rond à chaque toucher : vérifie que le navigateur ne zoome ni ne défile,
    // et montre à quoi ressemble une cible tactile de 44 px.
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const dot = this.add.circle(pointer.x, pointer.y, TOUCH_TARGET / 2, 0xffcc00, 0.8);
      // Tween : Phaser fait varier une propriété (ici l'opacité) au fil des images
      this.tweens.add({ targets: dot, alpha: 0, duration: 600, onComplete: () => dot.destroy() });
    });

    if (this.debug) {
      this.info = this.add
        .text(8, 8, '', {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#000000aa',
          padding: { x: 6, y: 4 },
        })
        .setDepth(10); // profondeur : dessiné au-dessus de la grille et des ronds
    }
  }

  // Appelée à chaque image (60 fois par seconde environ). time : millisecondes depuis le lancement.
  override update(time: number): void {
    // Mettre à jour le texte 4 fois par seconde suffit : redessiner un texte coûte cher
    if (!this.info || time - this.lastInfoUpdate < 250) return;
    this.lastInfoUpdate = time;

    const { width, height } = this.scale;
    const canvas = this.game.canvas;
    this.info.setText([
      `${Math.round(this.game.loop.actualFps)} images/s`,
      `jeu : ${width} × ${height}`,
      `canvas : ${canvas.width} × ${canvas.height} px réels`,
      `devicePixelRatio : ${window.devicePixelRatio}`,
      `rendu : ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`,
    ]);
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    this.drawGrid(gameSize.width, gameSize.height);
  }

  private drawGrid(width: number, height: number): void {
    const g = this.grid.clear();
    g.lineStyle(1, 0x2a3b55);
    for (let x = 0; x <= width; x += TILE) g.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += TILE) g.lineBetween(0, y, width, y);
    // Cadre rouge sur les bords : il doit rester entièrement visible quel que soit l'écran
    g.lineStyle(4, 0xff4d4d);
    g.strokeRect(2, 2, width - 4, height - 4);
  }
}
