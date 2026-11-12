import Phaser from 'phaser';

/** Durée (ms) au-delà de laquelle un appui n'est plus un toucher mais un maintien. */
export const HOLD_MS = 250;

export interface PointerGestureHandlers {
  /** Un doigt (ou le bouton de la souris) se pose. L'action commence tout de suite, sans attendre. */
  onPress(pointer: Phaser.Input.Pointer): void;
  /** Relâché avant HOLD_MS : c'était un toucher. */
  onTap(pointer: Phaser.Input.Pointer): void;
  /** Relâché après HOLD_MS : c'était un maintien. */
  onHoldEnd(pointer: Phaser.Input.Pointer): void;
  /** Un deuxième doigt s'est posé : le geste à un doigt est abandonné (la caméra prendra le relais). */
  onCancel(): void;
}

/**
 * Traduit les événements bruts des pointeurs (doigts et souris) en gestes : toucher, maintien,
 * abandon. Phaser donne un objet Pointer par doigt (et un pour la souris) ; ce module décide
 * ce que leur combinaison veut dire, sans rien savoir de l'avatar ni de la caméra.
 */
export class PointerGestures {
  private readonly input: Phaser.Input.InputPlugin;
  private readonly handlers: PointerGestureHandlers;
  /** Le doigt qui a commencé le geste en cours, ou null. */
  private primary: Phaser.Input.Pointer | null = null;

  constructor(input: Phaser.Input.InputPlugin, handlers: PointerGestureHandlers) {
    this.input = input;
    this.handlers = handlers;
    input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
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
    this.input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this);
    this.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onUp, this);
  }

  private onDown(pointer: Phaser.Input.Pointer): void {
    // On compte les pointeurs appuyés auprès de Phaser plutôt que de tenir notre propre liste :
    // elle ne peut pas se désynchroniser si un événement se perd.
    const downCount = this.input.manager.pointers.filter((p) => p.isDown).length;
    if (downCount === 1) {
      this.primary = pointer;
      this.handlers.onPress(pointer);
    } else if (this.primary) {
      this.primary = null;
      this.handlers.onCancel();
    }
  }

  private onUp(pointer: Phaser.Input.Pointer): void {
    if (pointer !== this.primary) return;
    this.primary = null;
    const duration = pointer.upTime - pointer.downTime;
    if (duration < HOLD_MS) this.handlers.onTap(pointer);
    else this.handlers.onHoldEnd(pointer);
  }
}
