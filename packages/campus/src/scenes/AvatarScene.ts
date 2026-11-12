import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAvatarAnimations } from '../avatar/animations';
import { FRAME_HEIGHT, FRAME_WIDTH, type Direction } from '../avatar/layout';
import { DEFAULT_LOOK, LAYERS, textureKey } from '../avatar/layers';
import { PLACEHOLDER_VARIANTS, placeholderSheet } from '../avatar/placeholderArt';
import { MAP_HEIGHT, MAP_WIDTH, SPAWN, TILE, drawPlaceholderMap } from '../world/placeholderMap';

/**
 * Grossissement de la caméra. Un entier : chaque pixel du dessin devient un carré net de 2 × 2.
 * Sur un téléphone, on voit ainsi environ 6 tuiles de large ; le réglage par taille d'écran viendra à l'étape 6.
 */
const ZOOM = 2;
/** Vitesse de marche, en pixels du monde par seconde (2,5 tuiles par seconde). */
const SPEED = 80;
/** Marge entre la destination et le bord de la carte. */
const MARGIN = TILE;

/**
 * Scène de test : l'avatar marche jusqu'au point touché, sur une carte provisoire.
 * Toucher l'avatar l'arrête.
 */
export class AvatarScene extends Phaser.Scene {
  private avatar!: Avatar;
  private marker!: Phaser.GameObjects.Arc;
  /** Destination en cours, ou null si l'avatar est arrêté. */
  private target: Phaser.Math.Vector2 | null = null;

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

    drawPlaceholderMap(this, ZOOM);
    this.avatar = new Avatar(this, SPAWN.x, SPAWN.y, DEFAULT_LOOK);
    this.avatar.setDepth(this.avatar.y);

    // Repère de destination : un cercle au sol, au-dessus du décor plat
    this.marker = this.add.circle(0, 0, 6).setStrokeStyle(2, 0xffffff).setDepth(1).setVisible(false);

    // La caméra grossit le monde et suit l'avatar. setBounds l'empêche de montrer au-delà de la carte.
    this.cameras.main
      .setZoom(ZOOM)
      .setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT)
      .startFollow(this.avatar, true)
      .setFollowOffset(0, FRAME_HEIGHT / 2 - 4);

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      // worldX / worldY : la position touchée dans le monde, zoom et défilement de la caméra déjà pris en compte
      const onAvatar =
        Math.abs(pointer.worldX - this.avatar.x) < FRAME_WIDTH / 2 &&
        Math.abs(pointer.worldY - (this.avatar.y - FRAME_HEIGHT / 2)) < FRAME_HEIGHT / 2;
      if (onAvatar) {
        this.stop();
        return;
      }
      const x = Phaser.Math.Clamp(pointer.worldX, MARGIN, MAP_WIDTH - MARGIN);
      const y = Phaser.Math.Clamp(pointer.worldY, MARGIN, MAP_HEIGHT - MARGIN);
      this.target = new Phaser.Math.Vector2(x, y);
      this.marker.setPosition(x, y).setVisible(true);
    });

    this.publishPosition();
  }

  /**
   * Appelée à chaque image. delta : millisecondes écoulées depuis l'image précédente.
   * On avance de « vitesse × temps écoulé » : la vitesse reste la même à 30, 60 ou 120 images/s.
   */
  override update(_time: number, delta: number): void {
    if (!this.target) return;

    const dx = this.target.x - this.avatar.x;
    const dy = this.target.y - this.avatar.y;
    const distance = Math.hypot(dx, dy);
    const step = (SPEED * delta) / 1000;

    if (distance <= step) {
      this.avatar.setPosition(this.target.x, this.target.y);
      this.stop();
    } else {
      // Vecteur unitaire (dx / distance, dy / distance) × longueur du pas
      this.avatar.x += (dx / distance) * step;
      this.avatar.y += (dy / distance) * step;
      this.avatar.walk(directionOf(dx, dy));
    }

    // Profondeur = hauteur des pieds : plus bas à l'écran = dessiné devant (vue de dessus en 3/4)
    this.avatar.setDepth(this.avatar.y);
    this.publishPosition();
  }

  private stop(): void {
    this.target = null;
    this.marker.setVisible(false);
    this.avatar.idle();
  }

  /**
   * Le registre (registry) est un espace de données partagé par toutes les scènes du jeu :
   * la scène de debug y lit la position de l'avatar.
   */
  private publishPosition(): void {
    this.registry.set('avatarTile', { x: Math.floor(this.avatar.x / TILE), y: Math.floor(this.avatar.y / TILE) });
  }
}

/** Direction dominante d'un écart : horizontale ou verticale, selon la plus grande. */
function directionOf(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
