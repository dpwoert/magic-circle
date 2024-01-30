import { Mesh, Object3D, Vector2, Vector3, Light, Camera, Scene } from 'three';
import { Layer } from '@magic-circle/client';

import { MeshSettings, mesh, object3d } from './object3d';
import { camera } from './camera';
import { light } from './light';
import { getParentScene } from './utils';

export type RecursiveSettings = Omit<MeshSettings, 'range' | 'range'> & {
  name?: string;
  range?: (mesh: Mesh | Object3D) => Vector3;
  scale?: (mesh: Mesh | Object3D) => Vector2;
  watch?: (name: string) => boolean;
  onSelectLayer?: (object: Object3D) => void;
};

export function recursive(
  group: Object3D,
  settings: RecursiveSettings = {}
): Layer {
  const mapping: Record<string, Layer> = {};

  const rootLayer = new Layer(settings.name || group.name);

  let scene: Scene | undefined;
  if (group instanceof Scene) {
    scene = group;
  } else {
    scene = getParentScene(group) || undefined;
  }

  group.traverse((object) => {
    // Find parent layer
    const parentId = object.parent?.id || '';
    const parentLayer = mapping[parentId] || rootLayer;

    // Create layer
    let gui: Layer;

    if (object instanceof Mesh) {
      console.log({ settings });
      gui = mesh(object, {
        ...settings,
        range: settings.range ? settings.range(object) : undefined,
        scale: settings.scale ? settings.scale(object) : undefined,
        camera: settings.camera,
      }).addTo(parentLayer);
    } else if (object instanceof Camera) {
      gui = camera(object, {
        range: settings.range
          ? settings.range(object)
          : new Vector3(10, 10, 10),
        scene,
      }).addTo(parentLayer);
    } else if (object instanceof Light) {
      gui = light(object, {
        ...settings,
        range: settings.range
          ? settings.range(object)
          : new Vector3(10, 10, 10),
      }).addTo(parentLayer);
    } else {
      gui = object3d(object, {
        ...settings,
        range: settings.range ? settings.range(object) : undefined,
        scale: settings.scale ? settings.scale(object) : undefined,
      }).addTo(parentLayer);
    }

    if (settings.onSelectLayer) {
      gui.on('visible', (isVisible) => {
        if (isVisible && settings.onSelectLayer) {
          settings.onSelectLayer(object);
        }
      });
    }

    // Save this layer
    mapping[object.id] = gui;
  });

  // sets up watching
  const { watch } = settings;
  if (watch) {
    rootLayer.traverse((child, path) => {
      if ('reference' in child) {
        child.watch(watch(path));
      }
    });
  }

  return rootLayer;
}
