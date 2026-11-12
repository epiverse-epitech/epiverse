/** Calques de l'avatar, dans l'ordre d'affichage : le premier est dessiné tout en dessous. */
export const LAYERS = ['body', 'outfit', 'hair'] as const;
export type LayerId = (typeof LAYERS)[number];

/**
 * Apparence d'un avatar : une variante et une couleur par calque.
 * Version de travail ; le format JSON sauvegardé (identifiants, version) viendra à l'étape 4.
 */
export interface AvatarLook {
  parts: Record<LayerId, string>;
  colors: Record<LayerId, number>;
}

export const DEFAULT_LOOK: AvatarLook = {
  parts: { body: 'base', outfit: 'hoodie', hair: 'short' },
  colors: { body: 0xf1c27d, outfit: 0x3a7bd5, hair: 0x5a3825 },
};

/** Clé de texture d'une variante : c'est sous ce nom que Phaser la range dans son gestionnaire. */
export function textureKey(layer: LayerId, variant: string): string {
  return `avatar-${layer}-${variant}`;
}
