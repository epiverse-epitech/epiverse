// Noms des événements échangés entre l'interface HTML et le jeu, sur le bus d'événements du jeu
// (game.events). Les préfixer évite toute collision avec les événements internes de Phaser.

/** Interface → jeu : une commande de caméra (voir CameraCommand). */
export const CAMERA_COMMAND = 'campus:camera-command';
/** App → jeu : nouvelle apparence de l'avatar (AvatarLook). */
export const SET_LOOK = 'campus:set-look';
/** Jeu → app : l'avatar est arrivé à la porte d'un bâtiment (identifiant du bâtiment). */
export const ENTER_BUILDING = 'campus:enter-building';
/** App → jeu : la cabine d'essayage s'ouvre ; la caméra cadre l'avatar dans la zone donnée. */
export const DRESSING_START = 'campus:dressing-start';
/** App → jeu : la cabine d'essayage se ferme. */
export const DRESSING_END = 'campus:dressing-end';
/** Jeu → interface : l'état de la caméra a changé (voir CameraState). */
export const CAMERA_STATE = 'campus:camera-state';

export type CameraCommand = 'zoom-in' | 'zoom-out' | 'recenter';
/** focus : la caméra suit l'avatar. free : elle reste où l'utilisateur l'a amenée. */
export type CameraMode = 'focus' | 'free';

export interface CameraState {
  mode: CameraMode;
  /** Vue d'ensemble : zoom inférieur au maximum. Un doigt y déplace la carte au lieu de l'avatar. */
  overview: boolean;
}
