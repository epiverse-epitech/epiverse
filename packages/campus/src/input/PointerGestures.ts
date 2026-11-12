import Phaser from 'phaser';

/** Durée (ms) au-delà de laquelle un appui n'est plus un toucher mais un maintien. */
export const HOLD_MS = 250;
/** Distance (px d'écran) au-delà de laquelle un doigt qui bouge devient un glissement. */
export const DRAG_THRESHOLD = 10;

export interface PointerGestureHandlers {
  /** Un doigt (ou le bouton de la souris) se pose. L'action commence tout de suite, sans attendre. */
  onPress(pointer: Phaser.Input.Pointer): void;
  /** Relâché avant HOLD_MS, sans avoir glissé : c'était un toucher. */
  onTap(pointer: Phaser.Input.Pointer): void;
  /** Relâché après HOLD_MS, sans avoir glissé : c'était un maintien. */
  onHoldEnd(pointer: Phaser.Input.Pointer): void;
  /** Le doigt a bougé de plus de DRAG_THRESHOLD : c'est un glissement. */
  onDragStart(pointer: Phaser.Input.Pointer): void;
  onDragMove(pointer: Phaser.Input.Pointer): void;
  /** Relâché après un glissement (ni toucher ni maintien dans ce cas). */
  onDragEnd(pointer: Phaser.Input.Pointer): void;
  /** Un deuxième doigt s'est posé : le geste à un doigt est abandonné. */
  onCancel(): void;
  /** Deux doigts posés : début d'un geste de caméra (glisser, pincer). */
  onPinchStart(a: Phaser.Input.Pointer, b: Phaser.Input.Pointer): void;
  /** Un des deux doigts a bougé. */
  onPinchMove(a: Phaser.Input.Pointer, b: Phaser.Input.Pointer): void;
  /** Un des deux doigts s'est levé : fin du geste de caméra. */
  onPinchEnd(): void;
}

/**
 * Traduit les événements bruts des pointeurs (doigts et souris) en gestes : avec un doigt,
 * toucher, maintien ou glissement ; avec deux doigts, geste de caméra. Phaser donne un objet Pointer par
 * doigt (et un pour la souris) ; ce module décide ce que leur combinaison veut dire, sans rien
 * savoir de l'avatar ni de la caméra.
 */
export class PointerGestures {
  private readonly input: Phaser.Input.InputPlugin;
  private readonly handlers: PointerGestureHandlers;
  /** Le doigt qui a commencé le geste à un doigt en cours, ou null. */
  private primary: Phaser.Input.Pointer | null = null;
  /** Le geste à un doigt en cours est devenu un glissement. */
  private dragging = false;
  /** Les deux doigts du geste de caméra en cours, ou null. */
  private pair: [Phaser.Input.Pointer, Phaser.Input.Pointer] | null = null;

  constructor(input: Phaser.Input.InputPlugin, handlers: PointerGestureHandlers) {
    this.input = input;
    this.handlers = handlers;
    input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    // Relâché hors du canvas : on doit quand même terminer le geste
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);
  }

  /** Le doigt maintenu en ce moment, ou null. */
  get heldPointer(): Phaser.Input.Pointer | null {
    // Garde-fou : si le système a annulé le toucher (appel entrant, notification…), le pointeur
    // n'est plus appuyé même si on n'a pas reçu d'événement « relâché ».
    if (this.primary && !this.primary.isDown) this.primary = null;
    return this.primary;
  }

  destroy(): void {
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
    this.input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this);
    this.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    this.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    // On compte les pointeurs appuyés auprès de Phaser plutôt que de tenir notre propre liste :
    // elle ne peut pas se désynchroniser si un événement se perd.
    const down = this.input.manager.pointers.filter((p) => p.isDown);
    if (down.length === 1) {
      this.primary = pointer;
      this.dragging = false;
      this.handlers.onPress(pointer);
    } else if (down.length === 2 && !this.pair) {
      if (this.primary) {
        this.primary = null;
        this.handlers.onCancel();
      }
      const [a, b] = down as [Phaser.Input.Pointer, Phaser.Input.Pointer];
      this.pair = [a, b];
      this.handlers.onPinchStart(a, b);
    }
    // Un troisième doigt est ignoré.
  }

  private onMove(pointer: Phaser.Input.Pointer): void {
    if (this.pair && this.pair.includes(pointer)) {
      this.handlers.onPinchMove(...this.pair);
      return;
    }
    if (pointer !== this.primary || !pointer.isDown) return;
    if (!this.dragging) {
      // downX / downY : où le doigt s'est posé. Un petit tremblement ne compte pas comme un glissement.
      if (Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.x, pointer.y) < DRAG_THRESHOLD) return;
      this.dragging = true;
      this.handlers.onDragStart(pointer);
    }
    this.handlers.onDragMove(pointer);
  }

  private onUp(pointer: Phaser.Input.Pointer): void {
    if (this.pair && this.pair.includes(pointer)) {
      // Le doigt restant ne redevient pas un geste à un doigt : il faut le lever et le reposer.
      this.pair = null;
      this.handlers.onPinchEnd();
      return;
    }
    if (pointer !== this.primary) return;
    this.primary = null;
    if (this.dragging) {
      this.dragging = false;
      this.handlers.onDragEnd(pointer);
      return;
    }
    const duration = pointer.upTime - pointer.downTime;
    if (duration < HOLD_MS) this.handlers.onTap(pointer);
    else this.handlers.onHoldEnd(pointer);
  }
}
