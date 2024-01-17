import {
  IconName,
  registerIcon,
  Rows,
  Minimize,
  Box,
  Paintbucket,
  Sun,
  VideoCamera,
  Target,
  Plug,
  File,
  Folder,
  Music,
  Code,
  Projector,
  // Cpu,
} from '@magic-circle/styles';

registerIcon(Rows);
registerIcon(Minimize);
registerIcon(Box);
registerIcon(Paintbucket);
registerIcon(Sun);
registerIcon(VideoCamera);
registerIcon(Target);
registerIcon(Plug);
registerIcon(File);
registerIcon(Folder);
registerIcon(Music);
registerIcon(Code);
// registerIcon(Cpu);
registerIcon(Projector);

export type LayerType =
  | 'layer'
  | 'group'
  | 'mesh'
  | 'material'
  | 'light'
  | 'camera'
  | 'scene'
  | 'bone'
  | 'plugin'
  | 'file'
  | 'folder'
  | 'sound'
  | 'code'
  | 'computation'
  | 'renderer';

export const iconMap: Record<string, IconName> = {
  layer: 'Rows',
  group: 'Minimize',
  mesh: 'Box',
  material: 'Paintbucket',
  light: 'Sun',
  camera: 'VideoCamera',
  scene: 'Minimize',
  bone: 'Target',
  plugin: 'Plug',
  file: 'File',
  folder: 'Folder',
  sound: 'Music',
  code: 'Code',
  computation: 'Code',
  // computation: 'Cpu',
  renderer: 'Projector',
};
