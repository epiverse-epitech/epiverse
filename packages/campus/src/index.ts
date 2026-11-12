// API publique du module : c'est tout ce que l'app a le droit d'importer.
export { createCampusGame } from './createCampusGame';
export type { CampusGame, CampusGameOptions } from './createCampusGame';
export { DEFAULT_LOOK, LAYERS } from './avatar/layers';
export type { AvatarLook, LayerId } from './avatar/layers';
// Le catalogue permet à l'app de construire sa propre interface de création
export { COLOR_OPTIONS, PART_OPTIONS, PRESETS, copyLook, sameLook } from './avatar/catalog';
export type { ColorOption, PartOption, Preset } from './avatar/catalog';
