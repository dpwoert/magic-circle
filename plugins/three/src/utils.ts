import { Object3D, Scene } from 'three';

export const getParentScene = (object: Object3D): Scene | null => {
  let scene: Scene | null = null;

  object.traverseAncestors((parent) => {
    if (parent instanceof Scene) {
      scene = parent;
    }
  });

  return scene;
};
