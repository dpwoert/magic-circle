import { Scene, Color } from 'three';
import {
  NumberControl,
  Layer,
  Folder,
  ColorControl,
  ImageControl,
} from '@magic-circle/client';

import { RecursiveSettings, recursive } from './recursive';

type SceneSettings = RecursiveSettings & {
  noRecursive?: boolean;
  sync?: boolean;
};

export function scene(scene: Scene, opts: SceneSettings = {}): Layer {
  const rootLayer = new Layer(opts.name || scene.name || 'Scene');

  if (!opts.noRecursive) {
    rootLayer.add(recursive(scene, opts).children);
  }

  const background: Folder['children'] = [];

  // Background
  if (scene.background instanceof Color) {
    background.push(new ColorControl(scene, 'background').range(1));
  } else if (scene.background) {
    background.push(
      new ImageControl(scene.background?.source, 'data'),
      new NumberControl(scene, 'backgroundIntensity').range(0, 1),
      new NumberControl(scene, 'backgroundBlurriness').range(0, 1)
    );
  }
  new Folder('Background', background).addTo(rootLayer);

  // fog
  if (scene.fog) {
    new Folder('Fog', [new ColorControl(scene.fog, 'color').range(1)]).addTo(
      rootLayer
    );
  }

  return rootLayer;
}
