import Phaser from 'phaser';
import { CAMERA_STATE, type CameraMode, type CameraState } from '../events';

/** Niveaux de zoom autorisés au repos. 2 est le maximum : on ne zoome jamais plus près. */
export const ZOOM_LEVELS: readonly number[] = [0.5, 1, 2];
export const MAX_ZOOM = 2;
const MIN_ZOOM = 0.5;
/** Fraction du chemin parcourue à chaque image quand la caméra rejoint l'avatar (1 = d'un coup). */
const FOLLOW_LERP = 0.15;
/** Déplacement des deux doigts (px d'écran) au-delà duquel on déplace la caméra, pas seulement le zoom. */
const PAN_THRESHOLD = 12;
/** Cumul de molette nécessaire pour changer d'un niveau de zoom. */
const WHEEL_STEP = 100;
/** Élan après un glissement : part de la vitesse gardée toutes les 16 ms (environ une image). */
const INERTIA_DECAY = 0.92;
/** En dessous de cette vitesse (px d'écran par ms), l'élan s'arrête. */
const INERTIA_MIN_SPEED = 0.02;

/** Un point du monde « attrapé » sous un doigt : il doit y rester pendant tout le geste. */
interface Grab {
  anchor: Phaser.Math.Vector2;
}

interface Pinch extends Grab {
  startDistance: number;
  startZoom: number;
  startMid: Phaser.Math.Vector2;
}

interface Drag extends Grab {
  lastX: number;
  lastY: number;
  lastTime: number;
}

/**
 * Pilote la caméra principale d'une scène.
 * - Deux modes : focus (elle suit l'avatar) et libre (elle reste où l'utilisateur l'a amenée).
 *   Zoomer ne change jamais de mode ; seul le fait de déplacer la caméra passe en mode libre.
 * - Zoom par niveaux (×0,5, ×1, ×2), au pincement, à la molette ou aux boutons.
 * - Glisser un doigt déplace la caméra, avec de l'élan au relâchement.
 */
export class CameraController {
  private readonly scene: Phaser.Scene;
  private readonly camera: Phaser.Cameras.Scene2D.Camera;
  private readonly target: Phaser.GameObjects.Container;
  private readonly offsetY: number;
  private readonly mapWidth: number;
  private readonly mapHeight: number;
  private mode: CameraMode = 'focus';
  private pinch: Pinch | null = null;
  private drag: Drag | null = null;
  /** Vitesse de l'élan, en px d'écran par ms. */
  private velocity = new Phaser.Math.Vector2();
  private wheel = 0;
  private lastState = '';

  constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Container, offsetY: number, mapWidth: number, mapHeight: number) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.target = target;
    this.offsetY = offsetY;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    this.camera.setZoom(MAX_ZOOM);
    // Placer la caméra sur l'avatar avant de le suivre, sinon elle glisserait depuis le coin de la carte
    this.camera.centerOn(target.x, target.y - offsetY);
    this.follow();
    scene.input.on(Phaser.Input.Events.POINTER_WHEEL, this.onWheel, this);
  }

  /**
   * Vue d'ensemble : on est en dessous du zoom maximum (ou on s'y dirige). Un doigt y déplace la
   * carte ; au zoom maximum, il pilote l'avatar.
   */
  get isOverview(): boolean {
    return nearestLevel(this.camera.zoom) < MAX_ZOOM;
  }

  /** À appeler à chaque image, depuis update() de la scène. */
  update(delta: number): void {
    this.applyInertia(delta);
    this.updateBounds();
    this.publishState();
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_WHEEL, this.onWheel, this);
  }

  /** Revenir à la vue de jeu : la caméra rejoint l'avatar en glissant et revient au zoom maximum. */
  recenter(): void {
    this.velocity.reset();
    if (this.mode === 'free') {
      this.mode = 'focus';
      this.follow();
    }
    if (this.camera.zoom !== MAX_ZOOM) this.zoomToLevel(MAX_ZOOM);
  }

  zoomIn(): void {
    this.zoomToLevel(this.nextLevel(1));
  }

  zoomOut(): void {
    this.zoomToLevel(this.nextLevel(-1));
  }

  /** Un doigt se pose : il arrête l'élan en cours, comme on arrête une carte qui glisse. */
  stopInertia(): void {
    this.velocity.reset();
  }

  // --- Glisser un doigt ---

  dragStart(pointer: Phaser.Input.Pointer): void {
    this.goFree();
    // On attrape le point du monde sous l'endroit où le doigt s'est posé, pas sous sa position
    // actuelle : sinon la carte « sauterait » des 10 px du seuil de glissement.
    this.drag = {
      anchor: this.worldAt(pointer.downX, pointer.downY),
      lastX: pointer.x,
      lastY: pointer.y,
      lastTime: pointer.moveTime,
    };
    this.velocity.reset();
  }

  dragMove(pointer: Phaser.Input.Pointer): void {
    if (!this.drag) return;
    this.keepUnder(this.drag.anchor, pointer.x, pointer.y, this.camera.zoom);
    // Vitesse du doigt, lissée : elle servira d'élan au relâchement
    const dt = Math.max(1, pointer.moveTime - this.drag.lastTime);
    this.velocity.set(
      0.8 * this.velocity.x + 0.2 * ((pointer.x - this.drag.lastX) / dt),
      0.8 * this.velocity.y + 0.2 * ((pointer.y - this.drag.lastY) / dt),
    );
    this.drag.lastX = pointer.x;
    this.drag.lastY = pointer.y;
    this.drag.lastTime = pointer.moveTime;
  }

  /** Glissement interrompu (deuxième doigt) : pas d'élan. */
  cancelDrag(): void {
    this.drag = null;
    this.velocity.reset();
  }

  dragEnd(pointer: Phaser.Input.Pointer): void {
    // Doigt immobile un moment avant d'être levé : pas d'élan
    if (this.drag && pointer.upTime - this.drag.lastTime > 100) this.velocity.reset();
    this.drag = null;
  }

  // --- Deux doigts ---

  pinchStart(a: Phaser.Input.Pointer, b: Phaser.Input.Pointer): void {
    const mid = midpoint(a, b);
    this.velocity.reset();
    this.pinch = {
      startDistance: Math.max(1, Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y)),
      startZoom: this.camera.zoom,
      startMid: mid,
      anchor: this.worldAt(mid.x, mid.y),
    };
  }

  pinchMove(a: Phaser.Input.Pointer, b: Phaser.Input.Pointer): void {
    if (!this.pinch) return;
    const mid = midpoint(a, b);
    const distance = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
    const zoom = Phaser.Math.Clamp((this.pinch.startZoom * distance) / this.pinch.startDistance, MIN_ZOOM, MAX_ZOOM);

    // Les doigts ont glissé ensemble : l'utilisateur déplace la caméra, on passe en mode libre.
    if (this.mode === 'focus' && mid.distance(this.pinch.startMid) > PAN_THRESHOLD) this.goFree();

    this.camera.setZoom(zoom);
    // En mode focus, la caméra suit l'avatar : le zoom se fait autour de lui.
    if (this.mode === 'free') this.keepUnder(this.pinch.anchor, mid.x, mid.y, zoom);
  }

  /** Fin du pincement : on rejoint le niveau de zoom le plus proche, pour garder des pixels nets. */
  pinchEnd(): void {
    this.pinch = null;
    this.zoomToLevel(nearestLevel(this.camera.zoom));
  }

  // --- Interne ---

  private goFree(): void {
    if (this.mode === 'free') return;
    this.mode = 'free';
    this.camera.stopFollow();
  }

  private follow(): void {
    this.camera.startFollow(this.target, true, FOLLOW_LERP, FOLLOW_LERP).setFollowOffset(0, this.offsetY);
  }

  private onWheel(_pointer: Phaser.Input.Pointer, _over: unknown, _dx: number, dy: number): void {
    // Une molette donne de grands pas, un pavé tactile une multitude de petits : on cumule.
    this.wheel += dy;
    if (Math.abs(this.wheel) < WHEEL_STEP) return;
    if (this.wheel > 0) this.zoomOut();
    else this.zoomIn();
    this.wheel = 0;
  }

  private zoomToLevel(level: number): void {
    // zoomTo est un effet de caméra : il anime le zoom en 200 ms autour du centre de l'écran.
    this.camera.zoomTo(level, 200, 'Sine.easeOut', true);
  }

  private nextLevel(step: 1 | -1): number {
    const index = ZOOM_LEVELS.indexOf(nearestLevel(this.camera.zoom));
    return ZOOM_LEVELS[Phaser.Math.Clamp(index + step, 0, ZOOM_LEVELS.length - 1)] ?? MAX_ZOOM;
  }

  /** Élan : la caméra continue sur sa lancée et ralentit, comme une carte qu'on fait glisser. */
  private applyInertia(delta: number): void {
    if (this.drag || this.velocity.length() < INERTIA_MIN_SPEED) {
      if (!this.drag) this.velocity.reset();
      return;
    }
    // Le doigt allait vers la droite : le monde suit le doigt, donc la caméra recule vers la gauche
    this.camera.scrollX -= (this.velocity.x * delta) / this.camera.zoom;
    this.camera.scrollY -= (this.velocity.y * delta) / this.camera.zoom;
    this.velocity.scale(Math.pow(INERTIA_DECAY, delta / 16));
  }

  /**
   * Point du monde sous un point de l'écran. La caméra zoome autour du centre de l'écran : le
   * centre montre le monde en (scrollX + largeur / 2), et on s'en écarte de (écart à l'écran / zoom).
   */
  private worldAt(screenX: number, screenY: number): Phaser.Math.Vector2 {
    const cam = this.camera;
    return new Phaser.Math.Vector2(
      cam.scrollX + cam.width / 2 + (screenX - cam.width / 2) / cam.zoom,
      cam.scrollY + cam.height / 2 + (screenY - cam.height / 2) / cam.zoom,
    );
  }

  /** Place la caméra pour que le point du monde « anchor » soit sous le point de l'écran donné. */
  private keepUnder(anchor: Phaser.Math.Vector2, screenX: number, screenY: number, zoom: number): void {
    this.camera.scrollX = anchor.x - this.camera.width / 2 - (screenX - this.camera.width / 2) / zoom;
    this.camera.scrollY = anchor.y - this.camera.height / 2 - (screenY - this.camera.height / 2) / zoom;
  }

  /**
   * Limites de la caméra : la carte, agrandie si besoin. Quand on dézoome au point de voir plus
   * large que la carte, on ajoute une marge égale des deux côtés, pour que la carte reste centrée.
   */
  private updateBounds(): void {
    const viewWidth = this.camera.width / this.camera.zoom;
    const viewHeight = this.camera.height / this.camera.zoom;
    const padX = Math.max(0, (viewWidth - this.mapWidth) / 2);
    const padY = Math.max(0, (viewHeight - this.mapHeight) / 2);
    const bounds = this.camera.getBounds();
    if (bounds.x !== -padX || bounds.y !== -padY) {
      this.camera.setBounds(-padX, -padY, this.mapWidth + 2 * padX, this.mapHeight + 2 * padY);
    }
  }

  /** Prévient l'interface (bouton Recentrer) et le compteur quand l'état change. */
  private publishState(): void {
    const state: CameraState = { mode: this.mode, overview: this.isOverview };
    const key = `${state.mode}/${state.overview}`;
    if (key !== this.lastState) {
      this.lastState = key;
      this.scene.game.events.emit(CAMERA_STATE, state);
    }
    this.scene.registry.set('camera', { mode: this.mode, zoom: this.camera.zoom });
  }
}

function midpoint(a: Phaser.Input.Pointer, b: Phaser.Input.Pointer): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
}

/** Niveau le plus proche, en comparant les rapports (×0,5 → ×1 est un pas aussi grand que ×1 → ×2). */
function nearestLevel(zoom: number): number {
  let best = MAX_ZOOM;
  for (const level of ZOOM_LEVELS) {
    if (Math.abs(Math.log2(level / zoom)) < Math.abs(Math.log2(best / zoom))) best = level;
  }
  return best;
}
