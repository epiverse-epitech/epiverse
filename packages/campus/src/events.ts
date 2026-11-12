// Noms des événements échangés entre l'interface HTML et le jeu, sur le bus d'événements du jeu
// (game.events). Les préfixer évite toute collision avec les événements internes de Phaser.

/** Interface → jeu : une commande de caméra (voir CameraCommand). */
export const CAMERA_COMMAND = 'campus:camera-command';
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
