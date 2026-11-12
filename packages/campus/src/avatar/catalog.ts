// Catalogue de l'avatar : ce que l'utilisateur peut choisir. Il est exporté par le module, pour
// que n'importe quelle interface (dessinée dans Phaser ou faite en HTML / React par l'app) se
// construise à partir des mêmes données.
import type { AvatarLook, LayerId } from './layers';

export interface PartOption {
  id: string;
  label: string;
}

export interface ColorOption {
  /** Identifiant stable, destiné au format sauvegardé (étape 4). */
  id: string;
  label: string;
  hex: number;
}

export interface Preset {
  id: string;
  label: string;
  look: AvatarLook;
}

/** Variantes de chaque calque. */
export const PART_OPTIONS: Record<LayerId, readonly PartOption[]> = {
  body: [{ id: 'base', label: 'Silhouette' }],
  outfit: [
    { id: 'hoodie', label: 'Sweat' },
    { id: 'tshirt', label: 'T-shirt' },
  ],
  hair: [
    { id: 'short', label: 'Courts' },
    { id: 'long', label: 'Longs' },
  ],
};

/** Couleurs proposées pour chaque calque (body = la peau). */
export const COLOR_OPTIONS: Record<LayerId, readonly ColorOption[]> = {
  body: [
    { id: 'skin-1', label: 'Peau claire', hex: 0xf1c27d },
    { id: 'skin-2', label: 'Peau dorée', hex: 0xe0ac69 },
    { id: 'skin-3', label: 'Peau mate', hex: 0xc68642 },
    { id: 'skin-4', label: 'Peau foncée', hex: 0x8d5524 },
  ],
  hair: [
    { id: 'hair-black', label: 'Noirs', hex: 0x2c1b10 },
    { id: 'hair-brown', label: 'Bruns', hex: 0x5a3825 },
    { id: 'hair-auburn', label: 'Roux', hex: 0xb5651d },
    { id: 'hair-blond', label: 'Blonds', hex: 0xe8c26b },
    { id: 'hair-grey', label: 'Gris', hex: 0xa0a0a0 },
  ],
  outfit: [
    { id: 'outfit-blue', label: 'Bleu', hex: 0x3a7bd5 },
    { id: 'outfit-red', label: 'Rouge', hex: 0xd53a3a },
    { id: 'outfit-green', label: 'Vert', hex: 0x3aa35b },
    { id: 'outfit-yellow', label: 'Jaune', hex: 0xe0b03a },
    { id: 'outfit-purple', label: 'Violet', hex: 0x8a3ad5 },
    { id: 'outfit-black', label: 'Noir', hex: 0x3a3f4a },
  ],
};

/** Modèles tout faits : le minimum demandé pour la V1.0 (« choisir son avatar »). */
export const PRESETS: readonly Preset[] = [
  {
    id: 'classic',
    label: 'Classique',
    look: {
      parts: { body: 'base', outfit: 'hoodie', hair: 'short' },
      colors: { body: 0xf1c27d, outfit: 0x3a7bd5, hair: 0x5a3825 },
    },
  },
  {
    id: 'sport',
    label: 'Sport',
    look: {
      parts: { body: 'base', outfit: 'tshirt', hair: 'long' },
      colors: { body: 0xc68642, outfit: 0xd53a3a, hair: 0x2c1b10 },
    },
  },
  {
    id: 'chill',
    label: 'Détente',
    look: {
      parts: { body: 'base', outfit: 'hoodie', hair: 'long' },
      colors: { body: 0xe0ac69, outfit: 0x3aa35b, hair: 0xe8c26b },
    },
  },
];

/** Copie indépendante d'une apparence (pour ne jamais modifier un modèle tout fait). */
export function copyLook(look: AvatarLook): AvatarLook {
  return { parts: { ...look.parts }, colors: { ...look.colors } };
}

export function sameLook(a: AvatarLook, b: AvatarLook): boolean {
  return (Object.keys(a.parts) as LayerId[]).every(
    (layer) => a.parts[layer] === b.parts[layer] && a.colors[layer] === b.colors[layer],
  );
}
