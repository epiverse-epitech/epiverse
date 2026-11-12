// Graphismes provisoires, dessinés par code. Ils produisent des feuilles de sprites au même format
// qu'un vrai pack (une image PNG), pour qu'on puisse les remplacer sans toucher au reste.
import { COLUMNS, DIRECTIONS, FRAME_HEIGHT, FRAME_WIDTH, type Direction } from './layout';
import type { LayerId } from './layers';

// Tout est en niveaux de gris : la teinte (tint) multiplie chaque pixel par la couleur choisie.
// Blanc → exactement la couleur choisie ; gris → la même couleur, plus sombre (ombres) ; noir → noir.
const LIGHT = '#eeeeee';
const SHADE = '#b4b4b4';
const DARK = '#8a8a8a';
const SHOE = '#3a3a3a';
const OUTLINE = '#2b2b2b';

/** Vue du personnage selon la direction. La gauche est la droite vue dans un miroir. */
type View = 'front' | 'back' | 'side';

/** Posture d'une image. bob : le buste monte ou descend ; stride : écart des jambes (-2 à 2). */
interface Pose {
  bob: number;
  stride: number;
}

/** Une posture par colonne de la feuille (voir layout.ts). */
const POSES: readonly Pose[] = [
  { bob: 0, stride: 0 }, // repos 1
  { bob: 1, stride: 0 }, // repos 2 : le buste descend d'un pixel, comme une respiration
  { bob: 0, stride: 2 }, // marche 1 : un pas
  { bob: -1, stride: 0 }, // marche 2 : jambes réunies, le corps remonte
  { bob: 0, stride: -2 }, // marche 3 : l'autre pas
  { bob: -1, stride: 0 }, // marche 4
];

/** Crayon qui dessine dans une case de la feuille, en miroir si besoin. */
interface Pen {
  rect(x: number, y: number, w: number, h: number, color: string): void;
  /** Bloc avec contour sombre et ombre en bas à droite : le style pixel art de base. */
  block(x: number, y: number, w: number, h: number, fill?: string): void;
}

function makePen(ctx: CanvasRenderingContext2D, originX: number, originY: number, mirror: boolean): Pen {
  const rect = (x: number, y: number, w: number, h: number, color: string): void => {
    const mx = mirror ? FRAME_WIDTH - x - w : x;
    ctx.fillStyle = color;
    ctx.fillRect(originX + mx, originY + y, w, h);
  };
  return {
    rect,
    block(x, y, w, h, fill = LIGHT) {
      rect(x - 1, y - 1, w + 2, h + 2, OUTLINE);
      rect(x, y, w, h, fill);
      rect(x + w - 1, y, 1, h, SHADE);
      rect(x, y + h - 1, w, 1, SHADE);
    },
  };
}

type Drawer = (pen: Pen, view: View, pose: Pose) => void;

// Repères communs aux trois calques (en pixels, dans une case de 32 × 48) :
// tête y 7-16, buste y 18-29, jambes à partir de y 30, pieds vers y 42.
// Vue de face : un pas lève un pied de 2 px et balance le bras opposé.
const lift = (pose: Pose, leg: 'left' | 'right'): number =>
  (leg === 'left' ? pose.stride > 0 : pose.stride < 0) ? 2 : 0;

const drawBody: Drawer = (pen, view, pose) => {
  const { bob, stride } = pose;
  const swing = Math.sign(stride);
  if (view === 'side') {
    pen.block(14 - stride, 30, 3, 13); // jambe arrière
    pen.block(15 + stride, 30, 3, 13); // jambe avant
    pen.block(12, 18 + bob, 8, 12); // buste
    pen.block(11, 7 + bob, 10, 10); // tête
    pen.rect(18, 12 + bob, 2, 2, OUTLINE); // œil, tourné vers l'avant
    pen.block(15 - swing, 19 + bob, 3, 10); // bras, devant le buste
    return;
  }
  pen.block(12, 30, 3, 13 - lift(pose, 'left'));
  pen.block(17, 30, 3, 13 - lift(pose, 'right'));
  pen.block(8, 19 + bob + swing, 3, 10);
  pen.block(21, 19 + bob - swing, 3, 10);
  pen.block(11, 18 + bob, 10, 12);
  pen.block(11, 7 + bob, 10, 10);
  if (view === 'front') {
    pen.rect(13, 12 + bob, 2, 2, OUTLINE);
    pen.rect(17, 12 + bob, 2, 2, OUTLINE);
  }
};

const drawHoodie: Drawer = (pen, view, pose) => {
  const { bob, stride } = pose;
  const swing = Math.sign(stride);
  if (view === 'side') {
    pen.block(14 - stride, 30, 3, 10, DARK); // pantalon
    pen.block(15 + stride, 30, 3, 10, DARK);
    pen.rect(14 - stride, 40, 4, 3, SHOE); // chaussures, pointées vers l'avant
    pen.rect(15 + stride, 40, 4, 3, SHOE);
    pen.block(11, 18 + bob, 10, 12); // sweat
    pen.block(15 - swing, 19 + bob, 3, 6); // manche
    return;
  }
  for (const [x, leg] of [[12, 'left'], [17, 'right']] as const) {
    const bottom = 43 - lift(pose, leg);
    pen.block(x, 30, 3, bottom - 33, DARK);
    pen.rect(x - 1, bottom - 3, 5, 3, SHOE);
  }
  pen.block(10, 18 + bob, 12, 12);
  pen.block(8, 19 + bob + swing, 3, 6);
  pen.block(21, 19 + bob - swing, 3, 6);
  if (view === 'front') pen.rect(13, 18 + bob, 6, 2, SHADE); // col
  else pen.block(12, 16 + bob, 8, 4); // capuche dans le dos
};

const drawShortHair: Drawer = (pen, view, { bob }) => {
  pen.block(10, 5 + bob, 12, 5); // dessus de la tête
  if (view === 'front') {
    pen.rect(10, 10 + bob, 2, 3, LIGHT);
    pen.rect(20, 10 + bob, 2, 3, LIGHT);
  } else if (view === 'back') {
    pen.block(10, 9 + bob, 12, 7); // arrière de la tête
  } else {
    pen.block(10, 9 + bob, 5, 6); // arrière de la tête, côté nuque
  }
};

/** Variantes provisoires disponibles pour chaque calque. */
export const PLACEHOLDER_VARIANTS: Record<LayerId, readonly string[]> = {
  body: ['base'],
  outfit: ['hoodie'],
  hair: ['short'],
};

const DRAWERS: Record<string, Drawer> = {
  'body/base': drawBody,
  'outfit/hoodie': drawHoodie,
  'hair/short': drawShortHair,
};

function viewOf(direction: Direction): View {
  if (direction === 'down') return 'front';
  if (direction === 'up') return 'back';
  return 'side';
}

/**
 * Dessine la feuille de sprites d'une variante et la renvoie en image PNG encodée dans une URL
 * (data URL). Phaser la charge ensuite comme n'importe quel fichier PNG.
 */
export function placeholderSheet(layer: LayerId, variant: string): string {
  const draw = DRAWERS[`${layer}/${variant}`];
  if (!draw) throw new Error(`Pas de graphisme provisoire pour ${layer}/${variant}`);

  const canvas = document.createElement('canvas');
  canvas.width = COLUMNS * FRAME_WIDTH;
  canvas.height = DIRECTIONS.length * FRAME_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponible');

  DIRECTIONS.forEach((direction, row) => {
    POSES.forEach((pose, column) => {
      const pen = makePen(ctx, column * FRAME_WIDTH, row * FRAME_HEIGHT, direction === 'left');
      draw(pen, viewOf(direction), pose);
    });
  });
  return canvas.toDataURL('image/png');
}
