// Carte provisoire, dessinée par code : assez de repères (chemins, fontaine, arbres, maisons) pour
// voir l'avatar se déplacer. La vraie carte viendra d'un éditeur de tuiles (Tiled) et d'un vrai pack.
import Phaser from 'phaser';

export const TILE = 32;
export const MAP_COLUMNS = 30;
export const MAP_ROWS = 20;
export const MAP_WIDTH = MAP_COLUMNS * TILE;
export const MAP_HEIGHT = MAP_ROWS * TILE;
/** Point d'apparition de l'avatar : sur la place, sous la fontaine. */
export const SPAWN = { x: 15 * TILE, y: 12 * TILE };

/** Maisons, en tuiles. L'identifiant est ce que le module transmet à l'app quand on y entre. */
const HOUSES = [
  { id: 'ecole', label: 'École', x: 3, y: 3, w: 6, h: 4, roof: 0xb5523b },
  { id: 'asso', label: 'Asso', x: 21, y: 3, w: 5, h: 4, roof: 0x3b6fb5 },
  { id: 'entreprise', label: 'Entreprise', x: 3, y: 13, w: 7, h: 4, roof: 0x555b66 },
  { id: 'bde', label: 'BDE', x: 21, y: 13, w: 5, h: 4, roof: 0x7a3bb5 },
  { id: 'dressing-room', label: "Cabine\nd'essayage", x: 16, y: 13, w: 3, h: 3, roof: 0xd5689a },
];

/** Un bâtiment dans lequel on peut entrer, en pixels du monde. */
export interface Building {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Où l'avatar se place pour entrer : au sol, juste devant la porte. */
  door: { x: number; y: number };
}

export const BUILDINGS: readonly Building[] = HOUSES.map((house) => ({
  id: house.id,
  x: house.x * TILE,
  y: house.y * TILE,
  width: house.w * TILE,
  height: house.h * TILE,
  door: { x: (house.x + house.w / 2) * TILE, y: (house.y + house.h) * TILE + 6 },
}));

/** Le bâtiment qui se trouve à ce point du monde, s'il y en a un (toute la façade compte). */
export function buildingAt(x: number, y: number): Building | undefined {
  return BUILDINGS.find((b) => x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height);
}

/** Arbres, en tuiles. Positions fixes : la carte est la même à chaque lancement. */
const TREES: ReadonlyArray<readonly [number, number]> = [
  [1, 1], [11, 2], [12, 5], [18, 2], [27, 1], [28, 7], [1, 8], [6, 8],
  [23, 8], [10, 15], [12, 17], [20, 17], [27, 18], [1, 18], [24, 11],
];

/**
 * Dessine la carte dans la scène. Le sol est plat (profondeur 0) ; les maisons et les arbres ont
 * une profondeur égale à la hauteur de leur base : l'avatar, dont la profondeur suit ses pieds,
 * passe devant eux quand il est plus bas à l'écran, et derrière quand il est plus haut.
 */
export function drawPlaceholderMap(scene: Phaser.Scene, textResolution: number): void {
  drawGround(scene.add.graphics().setDepth(0));
  for (const house of HOUSES) drawHouse(scene, house, textResolution);
  for (const [tx, ty] of TREES) drawTree(scene, tx * TILE + TILE / 2, ty * TILE + TILE - 4);
}

function drawGround(g: Phaser.GameObjects.Graphics): void {
  // Herbe en damier très léger : on voit le sol défiler quand la caméra suit l'avatar
  for (let ty = 0; ty < MAP_ROWS; ty++) {
    for (let tx = 0; tx < MAP_COLUMNS; tx++) {
      g.fillStyle((tx + ty) % 2 === 0 ? 0x5b8c3a : 0x55843a);
      g.fillRect(tx * TILE, ty * TILE, TILE, TILE);
    }
  }
  // Chemins en croix et place centrale
  g.fillStyle(0xd9c48f);
  g.fillRect(0, 9 * TILE, MAP_WIDTH, 2 * TILE);
  g.fillRect(14 * TILE, 0, 2 * TILE, MAP_HEIGHT);
  g.fillRect(12 * TILE, 7 * TILE, 6 * TILE, 6 * TILE);
  // Fontaine au centre de la place
  g.fillStyle(0x8a8f99);
  g.fillCircle(15 * TILE, 10 * TILE, 44);
  g.fillStyle(0x4aa3df);
  g.fillCircle(15 * TILE, 10 * TILE, 36);
  g.fillStyle(0xa9dcf5);
  g.fillCircle(15 * TILE, 10 * TILE, 8);
  // Clôture au bord de la carte
  g.lineStyle(4, 0x6b4a2b);
  g.strokeRect(2, 2, MAP_WIDTH - 4, MAP_HEIGHT - 4);
}

function drawHouse(scene: Phaser.Scene, house: (typeof HOUSES)[number], textResolution: number): void {
  const x = house.x * TILE;
  const y = house.y * TILE;
  const w = house.w * TILE;
  const h = house.h * TILE;
  const roofHeight = Math.round(h * 0.45);
  const g = scene.add.graphics().setDepth(y + h);

  g.fillStyle(0x2b2b2b); // contour
  g.fillRect(x - 2, y - 2, w + 4, h + 4);
  g.fillStyle(0xe8d9b5); // murs
  g.fillRect(x, y + roofHeight, w, h - roofHeight);
  g.fillStyle(house.roof); // toit
  g.fillRect(x, y, w, roofHeight);
  g.fillStyle(0x000000, 0.2); // bas du toit, plus sombre
  g.fillRect(x, y + roofHeight - 6, w, 6);
  g.fillStyle(0x6b4a2b); // porte
  g.fillRect(x + w / 2 - 10, y + h - 30, 20, 30);
  g.fillStyle(0x9fd3f0); // fenêtres
  g.fillRect(x + 12, y + roofHeight + 14, 18, 14);
  g.fillRect(x + w - 30, y + roofHeight + 14, 18, 14);

  // Texte : avec une résolution égale au zoom de la caméra, il reste net une fois grossi
  const fontSize = house.w <= 3 ? '9px' : '12px'; // petite maison, petit texte
  scene.add
    .text(x + w / 2, y + roofHeight / 2, house.label, { fontFamily: 'sans-serif', fontSize, color: '#ffffff', align: 'center' })
    .setOrigin(0.5)
    .setResolution(textResolution)
    .setDepth(y + h + 0.1);
}

function drawTree(scene: Phaser.Scene, x: number, baseY: number): void {
  // Coordonnées relatives à la base du tronc : l'objet est placé à (x, baseY)
  const g = scene.add.graphics({ x, y: baseY }).setDepth(baseY);
  g.fillStyle(0x000000, 0.25); // ombre
  g.fillEllipse(0, 0, 26, 8);
  g.fillStyle(0x6b4a2b); // tronc
  g.fillRect(-4, -16, 8, 16);
  g.fillStyle(0x2e5e1e); // feuillage
  g.fillCircle(0, -30, 16);
  g.fillStyle(0x3f7a2a);
  g.fillCircle(-4, -34, 10);
}
