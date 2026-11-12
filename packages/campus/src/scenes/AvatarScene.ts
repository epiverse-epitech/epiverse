import Phaser from 'phaser';
import { Avatar } from '../avatar/Avatar';
import { createAllAvatarAnimations, preloadAvatarSheets } from '../avatar/assets';
import { FRAME_HEIGHT, FRAME_WIDTH, type Direction } from '../avatar/layout';
import { DEFAULT_LOOK, type AvatarLook } from '../avatar/layers';
import { CameraController, MAX_ZOOM } from '../camera/CameraController';
import { CAMERA_COMMAND, SET_LOOK, type CameraCommand } from '../events';
import { PointerGestures } from '../input/PointerGestures';
import { MAP_HEIGHT, MAP_WIDTH, SPAWN, TILE, drawPlaceholderMap } from '../world/placeholderMap';

/** Vitesse de marche, en pixels du monde par seconde (2,5 tuiles par seconde). */
const SPEED = 80;
/** Marge entre l'avatar et le bord de la carte. */
const MARGIN = TILE;
/** Hauteur du milieu du corps au-dessus des pieds : c'est ce point que la caméra vise. */
const BODY_CENTER = FRAME_HEIGHT / 2 - 4;
/** Taille minimale d'une cible tactile, en pixels d'écran. */
const TOUCH_TARGET = 44;

/** À qui revient le geste à un doigt en cours. Décidé quand le doigt se pose. */
type OneFingerTarget = 'none' | 'avatar' | 'camera' | 'recenter';

/**
 * Scène de test de l'avatar sur une carte provisoire.
 * Un doigt (ou la souris), au zoom maximum (vue de jeu) :
 * - toucher le sol : l'avatar y va ; maintenir : il marche vers le doigt et le suit.
 * Un doigt, en vue d'ensemble (zoom inférieur) :
 * - glisser : déplace la carte (mode libre) ; toucher : l'avatar y va.
 * Partout : toucher l'avatar le recentre ; deux doigts glissent et pincent ; boutons + / − et
 * Recentrer en HTML (voir ui/cameraButtons.ts) ; molette sur ordinateur.
 */
export class AvatarScene extends Phaser.Scene {
  private avatar!: Avatar;
  private marker!: Phaser.GameObjects.Arc;
  private gestures!: PointerGestures;
  private cameraController!: CameraController;
  /** Destination d'un toucher, ou null. */
  private target: Phaser.Math.Vector2 | null = null;
  private oneFinger: OneFingerTarget = 'none';
  private readonly initialLook: AvatarLook;

  constructor(look: AvatarLook = DEFAULT_LOOK) {
    super('avatar');
    this.initialLook = look;
  }

  // preload : on déclare ce qu'il faut charger ; Phaser charge tout, puis appelle create().
  preload(): void {
    preloadAvatarSheets(this);
  }

  create(): void {
    createAllAvatarAnimations(this.anims);

    // Résolution des textes = zoom maximal : ils restent nets au plus près
    drawPlaceholderMap(this, MAX_ZOOM);
    this.avatar = new Avatar(this, SPAWN.x, SPAWN.y, this.initialLook);
    this.avatar.setDepth(this.avatar.y);

    // Repère de destination : un cercle au sol, au-dessus du décor plat
    this.marker = this.add.circle(0, 0, 6).setStrokeStyle(2, 0xffffff).setDepth(1).setVisible(false);

    // La caméra suit l'avatar (mode focus) ; deux doigts la déplacent (mode libre).
    this.cameraController = new CameraController(this, this.avatar, BODY_CENTER, MAP_WIDTH, MAP_HEIGHT);

    this.gestures = new PointerGestures(this.input, {
      onPress: (pointer) => this.onPress(pointer),
      onTap: (pointer) => this.onTap(pointer),
      onHoldEnd: (pointer) => this.onHoldEnd(pointer),
      onDragStart: (pointer) => {
        if (this.oneFinger === 'camera') this.cameraController.dragStart(pointer);
      },
      onDragMove: (pointer) => {
        if (this.oneFinger === 'camera') this.cameraController.dragMove(pointer);
      },
      onDragEnd: (pointer) => this.onDragEnd(pointer),
      onCancel: () => this.onCancel(),
      onPinchStart: (a, b) => this.cameraController.pinchStart(a, b),
      onPinchMove: (a, b) => this.cameraController.pinchMove(a, b),
      onPinchEnd: () => this.cameraController.pinchEnd(),
    });

    // Les boutons HTML parlent au jeu par son bus d'événements (game.events), partagé par tout le jeu.
    this.game.events.on(CAMERA_COMMAND, this.onCameraCommand, this);
    this.game.events.on(SET_LOOK, this.onSetLook, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.gestures.destroy();
      this.cameraController.destroy();
      this.game.events.off(CAMERA_COMMAND, this.onCameraCommand, this);
      this.game.events.off(SET_LOOK, this.onSetLook, this);
    });

    this.publishPosition();
  }

  /**
   * Appelée à chaque image. delta : millisecondes écoulées depuis l'image précédente.
   * On avance de « vitesse × temps écoulé » : la vitesse reste la même à 30, 60 ou 120 images/s.
   */
  override update(_time: number, delta: number): void {
    this.cameraController.update(delta);
    const step = (SPEED * delta) / 1000;
    const held = this.oneFinger === 'avatar' ? this.gestures.heldPointer : null;

    if (held) this.steerTowards(held, step);
    else if (this.target) this.moveToTarget(this.target, step);
    else return;

    // Profondeur = hauteur des pieds : plus bas à l'écran = dessiné devant (vue de dessus en 3/4)
    this.avatar.setDepth(this.avatar.y);
    this.publishPosition();
  }

  /**
   * Un doigt se pose : on décide tout de suite à qui revient le geste. Au zoom maximum, le doigt
   * pilote l'avatar ; en vue d'ensemble, il déplace la carte. Ainsi aucun geste n'est ambigu, et
   * l'avatar part sans attendre.
   */
  private onPress(pointer: Phaser.Input.Pointer): void {
    this.cameraController.stopInertia();
    const point = this.worldPoint(pointer);
    if (this.isOnAvatar(point.x, point.y)) {
      this.oneFinger = 'recenter';
      this.stop();
      this.cameraController.recenter(); // toucher son avatar revient à la vue de jeu
    } else if (this.cameraController.isOverview) {
      // L'avatar continue vers sa destination pendant qu'on fait glisser la carte
      this.oneFinger = 'camera';
    } else {
      this.oneFinger = 'avatar';
      // Le nouveau geste remplace la destination précédente
      this.target = null;
      this.marker.setVisible(false);
    }
  }

  private onSetLook(look: AvatarLook): void {
    this.avatar.setLook(look);
  }

  private onCameraCommand(command: CameraCommand): void {
    if (command === 'zoom-in') this.cameraController.zoomIn();
    else if (command === 'zoom-out') this.cameraController.zoomOut();
    else this.cameraController.recenter();
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    if (this.oneFinger !== 'recenter') this.goTo(pointer);
    this.oneFinger = 'none';
  }

  private onHoldEnd(pointer: Phaser.Input.Pointer): void {
    if (this.oneFinger === 'avatar') this.stop(); // fin du maintien : l'avatar s'arrête où il est
    else if (this.oneFinger === 'camera') this.goTo(pointer); // appui long sans glisser : on y va
    this.oneFinger = 'none';
  }

  private onDragEnd(pointer: Phaser.Input.Pointer): void {
    if (this.oneFinger === 'avatar') this.stop();
    else if (this.oneFinger === 'camera') this.cameraController.dragEnd(pointer);
    this.oneFinger = 'none';
  }

  /** Un deuxième doigt s'est posé : le geste à un doigt s'arrête, la caméra prend le relais. */
  private onCancel(): void {
    if (this.oneFinger === 'avatar') this.stop();
    else if (this.oneFinger === 'camera') this.cameraController.cancelDrag();
    this.oneFinger = 'none';
  }

  /** L'avatar part vers le point du monde sous le pointeur. */
  private goTo(pointer: Phaser.Input.Pointer): void {
    const point = this.worldPoint(pointer);
    const x = Phaser.Math.Clamp(point.x, MARGIN, MAP_WIDTH - MARGIN);
    const y = Phaser.Math.Clamp(point.y, MARGIN, MAP_HEIGHT - MARGIN);
    this.target = new Phaser.Math.Vector2(x, y);
    this.marker.setPosition(x, y).setVisible(true);
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

  /**
   * Le point (en coordonnées du monde) est-il sur l'avatar ? La zone de toucher fait au moins
   * 44 px d'écran de côté : quand on dézoome, l'avatar rapetisse à l'écran, pas sa zone de toucher.
   */
  private isOnAvatar(x: number, y: number): boolean {
    const minHalf = TOUCH_TARGET / 2 / this.cameras.main.zoom;
    return (
      Math.abs(x - this.avatar.x) < Math.max(FRAME_WIDTH / 2, minHalf) &&
      Math.abs(y - (this.avatar.y - BODY_CENTER)) < Math.max(FRAME_HEIGHT / 2, minHalf)
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
