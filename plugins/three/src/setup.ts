import { Scene, Camera, WebGLRenderer, Box3, Vector3 } from 'three';
import { Layer } from '@magic-circle/client';

import { SceneSettings, scene as createScene } from './scene';
import { camera as createCamera } from './camera';
import { webglRenderer as createRenderer } from './renderer';

export function setup(
  renderer: WebGLRenderer,
  camera: Camera,
  scene: Scene,
  settings: SceneSettings = {}
): Layer[] {
  const bbox = new Box3().setFromObject(scene);
  const range = bbox.getSize(new Vector3()).multiplyScalar(3);

  return [
    createRenderer(renderer),
    createCamera(camera, { scene, range }),
    createScene(scene, settings),
  ];
}
