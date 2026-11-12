// VERSION DE COMPARAISON : l'écran de création dessiné dans Phaser.
// Tout ce que le navigateur fournit d'office en HTML est fait ici à la main : boutons, pastilles,
// état sélectionné, survol, retour à la ligne, mise en page portrait / paysage.
// Limites assumées pour le test : pas de champ texte (Phaser n'en a pas), pas de défilement si le
// contenu dépasse, rien au clavier ni pour les lecteurs d'écran.
import Phaser from 'phaser';
import { COLOR_OPTIONS, PART_OPTIONS, PRESETS, copyLook, sameLook } from '../avatar/catalog';
import type { AvatarLook, LayerId } from '../avatar/layers';
import { creatorLayout } from './creatorLayout';

const TARGET = 44; // taille minimale d'une cible tactile
const GAP = 8;
const PAD = 16;
const FONT = 'system-ui, sans-serif';
const SECTIONS: ReadonlyArray<readonly [LayerId, string]> = [
  ['hair', 'Cheveux'],
  ['outfit', 'Tenue'],
  ['body', 'Peau'],
];

export interface CreatorPanelOptions {
  look: AvatarLook;
  onChange(look: AvatarLook): void;
  onValidate(look: AvatarLook): void;
}

/** Un élément posé par la mise en page : un conteneur dont on connaît la taille. */
interface Item {
  node: Phaser.GameObjects.Container;
  width: number;
  height: number;
}

export class CreatorPanelScene extends Phaser.Scene {
  private readonly options: CreatorPanelOptions;
  private look: AvatarLook;
  private root: Phaser.GameObjects.Container | null = null;
  /** Reconstruire l'interface à la prochaine image (voir update). */
  private dirty = true;

  constructor(options: CreatorPanelOptions) {
    super({ key: 'creator-panel', active: true });
    this.options = options;
    this.look = copyLook(options.look);
  }

  create(): void {
    const markDirty = (): void => {
      this.dirty = true;
    };
    // Pas de mise en page automatique : à chaque changement de taille, on reconstruit tout.
    this.scale.on(Phaser.Scale.Events.RESIZE, markDirty);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off(Phaser.Scale.Events.RESIZE, markDirty));
  }

  /**
   * On reconstruit ici, au début de l'image suivante, plutôt que dans le gestionnaire du clic :
   * détruire le bouton qu'on est en train de cliquer, pendant que Phaser traite ce clic, est risqué.
   */
  override update(): void {
    if (!this.dirty) return;
    this.dirty = false;
    this.build();
  }

  private change(look: AvatarLook): void {
    this.look = look;
    this.options.onChange(copyLook(look));
    this.dirty = true;
  }

  private build(): void {
    this.root?.destroy();
    const { panel } = creatorLayout(this.scale.width, this.scale.height);
    const root = this.add.container(panel.x, panel.y);
    this.root = root;
    root.add(this.add.rectangle(0, 0, panel.width, panel.height, 0x0f141e).setOrigin(0));

    const width = panel.width - 2 * PAD;
    let y = PAD;

    y = this.heading(root, 'Modèles', y);
    y = this.flow(
      root,
      y,
      width,
      PRESETS.map((preset) =>
        this.button(preset.label, sameLook(preset.look, this.look), () => this.change(copyLook(preset.look))),
      ),
    );

    for (const [layer, title] of SECTIONS) {
      y = this.heading(root, title, y);
      if (PART_OPTIONS[layer].length > 1) {
        y = this.flow(
          root,
          y,
          width,
          PART_OPTIONS[layer].map((part) =>
            this.button(part.label, this.look.parts[layer] === part.id, () =>
              this.change({ ...this.look, parts: { ...this.look.parts, [layer]: part.id } }),
            ),
          ),
        );
      }
      y = this.flow(
        root,
        y,
        width,
        COLOR_OPTIONS[layer].map((color) =>
          this.swatch(color.hex, this.look.colors[layer] === color.hex, () =>
            this.change({ ...this.look, colors: { ...this.look.colors, [layer]: color.hex } }),
          ),
        ),
      );
    }

    this.flow(root, y + GAP, width, [this.button('Valider', false, () => this.options.onValidate(copyLook(this.look)), 0x3a7bd5)]);
    // Si y dépasse panel.height, la fin est coupée : il faudrait coder un défilement.
  }

  /** Titre de section. Retourne la position verticale suivante. */
  private heading(root: Phaser.GameObjects.Container, text: string, y: number): number {
    root.add(this.add.text(PAD, y, text, { fontFamily: FONT, fontSize: '13px', color: '#9fb0c8' }));
    return y + 22;
  }

  /** Pose les éléments de gauche à droite, avec retour à la ligne : l'équivalent de flex-wrap en CSS. */
  private flow(root: Phaser.GameObjects.Container, y: number, width: number, items: Item[]): number {
    let x = 0;
    let rowHeight = 0;
    for (const item of items) {
      if (x > 0 && x + item.width > width) {
        x = 0;
        y += rowHeight + GAP;
        rowHeight = 0;
      }
      item.node.setPosition(PAD + x, y);
      root.add(item.node);
      x += item.width + GAP;
      rowHeight = Math.max(rowHeight, item.height);
    }
    return y + rowHeight + 2 * GAP;
  }

  /** Bouton : un rectangle cliquable, un texte, un contour s'il est sélectionné, un survol. */
  private button(label: string, selected: boolean, onClick: () => void, fill = 0x1f2a3a): Item {
    const text = this.add.text(0, 0, label, { fontFamily: FONT, fontSize: '15px', color: '#ffffff' }).setOrigin(0.5);
    const width = Math.max(TARGET * 2, Math.ceil(text.width) + 32);
    const background = this.add.rectangle(0, 0, width, TARGET, fill).setOrigin(0);
    if (selected) background.setStrokeStyle(2, 0xffffff);
    text.setPosition(width / 2, TARGET / 2);

    background.setInteractive({ useHandCursor: true });
    background.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => background.setFillStyle(0x2c3b52));
    background.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => background.setFillStyle(fill));
    background.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, onClick);

    return { node: this.add.container(0, 0, [background, text]), width, height: TARGET };
  }

  /** Pastille de couleur : un disque de 36 px dans une zone cliquable de 44 px. */
  private swatch(color: number, selected: boolean, onClick: () => void): Item {
    const zone = this.add.rectangle(0, 0, TARGET, TARGET, 0x000000, 0).setOrigin(0);
    const disc = this.add.circle(TARGET / 2, TARGET / 2, 18, color);
    if (selected) disc.setStrokeStyle(3, 0xffffff);
    zone.setInteractive({ useHandCursor: true });
    zone.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, onClick);
    return { node: this.add.container(0, 0, [zone, disc]), width: TARGET, height: TARGET };
  }
}
