import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAvatarAnimations } from '../avatar/animations';
import { FRAME_HEIGHT, FRAME_WIDTH, type Direction } from '../avatar/layout';
import { DEFAULT_LOOK, LAYERS, textureKey } from '../avatar/layers';
import { PLACEHOLDER_VARIANTS, placeholderSheet } from '../avatar/placeholderArt';
import { PointerGestures } from '../input/PointerGestures';
import { MAP_HEIGHT, MAP_WIDTH, SPAWN, TILE, drawPlaceholderMap } from '../world/placeholderMap';

/**
 * Grossissement de la caméra. Un entier : chaque pixel du dessin devient un carré net de 2 × 2.
 * Sur un téléphone, on voit ainsi environ 6 tuiles de large ; le réglage par taille d'écran viendra à l'étape 6.
 */
const ZOOM = 2;
/** Vitesse de marche, en pixels du monde par seconde (2,5 tuiles par seconde). */
const SPEED = 80;
/** Marge entre l'avatar et le bord de la carte. */
const MARGIN = TILE;
/** Hauteur du milieu du corps au-dessus des pieds : c'est ce point que la caméra vise. */
const BODY_CENTER = FRAME_HEIGHT / 2 - 4;

/**
 * Scène de test de l'avatar sur une carte provisoire. Avec un doigt (ou la souris) :
 * - toucher le sol : l'avatar y va ;
 * - maintenir le doigt : l'avatar marche vers lui et le suit, jusqu'à ce qu'on relâche ;
 * - toucher l'avatar : il s'arrête.
 * Un deuxième doigt annule le geste en cours (il servira à la caméra).
 */
export class AvatarScene extends Phaser.Scene {
  private avatar!: Avatar;
  private marker!: Phaser.GameObjects.Arc;
  private gestures!: PointerGestures;
  /** Destination d'un toucher, ou null. */
  private target: Phaser.Math.Vector2 | null = null;
  /** Le geste en cours a commencé sur l'avatar : on l'ignore jusqu'au relâchement. */
  private pressOnAvatar = false;

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
      .setFollowOffset(0, BODY_CENTER);

    this.gestures = new PointerGestures(this.input, {
      onPress: (pointer) => this.onPress(pointer),
      onTap: (pointer) => this.onTap(pointer),
      onHoldEnd: () => this.onRelease(),
      onCancel: () => this.onRelease(),
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.gestures.destroy());

    this.publishPosition();
  }

  /**
   * Appelée à chaque image. delta : millisecondes écoulées depuis l'image précédente.
   * On avance de « vitesse × temps écoulé » : la vitesse reste la même à 30, 60 ou 120 images/s.
   */
  override update(_time: number, delta: number): void {
    const step = (SPEED * delta) / 1000;
    const held = this.pressOnAvatar ? null : this.gestures.heldPointer;

    if (held) this.steerTowards(held, step);
    else if (this.target) this.moveToTarget(this.target, step);
    else return;

    // Profondeur = hauteur des pieds : plus bas à l'écran = dessiné devant (vue de dessus en 3/4)
    this.avatar.setDepth(this.avatar.y);
    this.publishPosition();
  }

  private onPress(pointer: Phaser.Input.Pointer): void {
    const point = this.worldPoint(pointer);
    this.pressOnAvatar = this.isOnAvatar(point.x, point.y);
    // Dans les deux cas, on oublie la destination précédente : le nouveau geste la remplace.
    this.target = null;
    this.marker.setVisible(false);
    if (this.pressOnAvatar) this.avatar.idle();
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    if (this.pressOnAvatar) return; // toucher l'avatar : il est déjà arrêté
    const point = this.worldPoint(pointer);
    const x = Phaser.Math.Clamp(point.x, MARGIN, MAP_WIDTH - MARGIN);
    const y = Phaser.Math.Clamp(point.y, MARGIN, MAP_HEIGHT - MARGIN);
    this.target = new Phaser.Math.Vector2(x, y);
    this.marker.setPosition(x, y).setVisible(true);
  }

  /** Fin d'un maintien, ou deuxième doigt : l'avatar s'arrête où il est. */
  private onRelease(): void {
    this.pressOnAvatar = false;
    this.stop();
  }

  /**
   * Maintien : l'avatar marche vers le doigt. On recalcule chaque image le point du monde sous
   * le doigt, car la caméra bouge avec l'avatar : un doigt immobile à droite de l'écran le fait
   * donc marcher vers la droite tant qu'on reste appuyé.
   */
  private steerTowards(pointer: Phaser.Input.Pointer, step: number): void {
    const point = this.worldPoint(pointer);
    if (this.isOnAvatar(point.x, point.y)) {
      this.avatar.idle(); // le doigt est sur l'avatar : il attend
      return;
    }
    const dx = point.x - this.avatar.x;
    const dy = point.y - (this.avatar.y - BODY_CENTER);
    const distance = Math.hypot(dx, dy);
    this.moveBy((dx / distance) * step, (dy / distance) * step);
    this.avatar.walk(directionOf(dx, dy));
  }

  /** Toucher : l'avatar va jusqu'à la destination, puis s'arrête. */
  private moveToTarget(target: Phaser.Math.Vector2, step: number): void {
    const dx = target.x - this.avatar.x;
    const dy = target.y - this.avatar.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= step) {
      this.avatar.setPosition(target.x, target.y);
      this.stop();
      return;
    }
    // Vecteur unitaire (dx / distance, dy / distance) × longueur du pas
    this.moveBy((dx / distance) * step, (dy / distance) * step);
    this.avatar.walk(directionOf(dx, dy));
  }

  /** Avance l'avatar, sans jamais sortir de la carte. */
  private moveBy(dx: number, dy: number): void {
    this.avatar.setPosition(
      Phaser.Math.Clamp(this.avatar.x + dx, MARGIN, MAP_WIDTH - MARGIN),
      Phaser.Math.Clamp(this.avatar.y + dy, MARGIN, MAP_HEIGHT - MARGIN),
    );
  }

  private stop(): void {
    this.target = null;
    this.marker.setVisible(false);
    this.avatar.idle();
  }

  /** Point du monde sous un pointeur, d'après la position actuelle de la caméra. */
  private worldPoint(pointer: Phaser.Input.Pointer): Phaser.Math.Vector2 {
    return this.cameras.main.getWorldPoint(pointer.x, pointer.y);
  }

  /** Le point (en coordonnées du monde) est-il sur l'avatar ? */
  private isOnAvatar(x: number, y: number): boolean {
    return (
      Math.abs(x - this.avatar.x) < FRAME_WIDTH / 2 &&
      Math.abs(y - (this.avatar.y - BODY_CENTER)) < FRAME_HEIGHT / 2
    );
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
