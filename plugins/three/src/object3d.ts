import { Mesh, Object3D, Vector2, Vector3 } from 'three';
import {
  BooleanControl,
  VectorControl,
  NumberControl,
  RotationControl,
  Layer,
  Folder,
  TextControl,
} from '@magic-circle/client';

import { material, materialTransform } from './material';

type MatrixSettings = {
  range: Vector3;
  scale: Vector2;
  precision: number;
};

type Object3dSettings = {
  range?: Vector3;
  scale?: Vector2;
  precision?: number;
};

export type MeshSettings = {
  range?: Vector3;
  scale?: Vector2;
  precision?: number;
  customMaterial?: materialTransform;
};

export function matrixFolders(
  object: Object3D,
  settings: MatrixSettings
): Folder[] {
  return [
    new Folder('General').add([
      new TextControl(object, 'id'),
      new BooleanControl(object, 'visible'),
    ]),

    new Folder('Position').add([
      new VectorControl(object, 'position')
        .range(
          object.position.x - settings.range.x,
          object.position.x + settings.range.x
        )
        .precision(settings.precision),
    ]),

    new Folder('Scale').add([
      new NumberControl(object.scale, 'x').range(
        settings.scale.x,
        settings.scale.y
      ),
      new NumberControl(object.scale, 'y').range(
        settings.scale.x,
        settings.scale.y
      ),
      new NumberControl(object.scale, 'z').range(
        settings.scale.x,
        settings.scale.y
      ),
    ]),

    new Folder('Rotation').add([
      new RotationControl(object.rotation, 'x'),
      new RotationControl(object.rotation, 'y'),
      new RotationControl(object.rotation, 'z'),
    ]),
  ];
}

export function mesh(mesh: Mesh, settings: MeshSettings): Layer {
  const layer = new Layer(mesh.name || 'Mesh');

  const defaultRange = () => {
    mesh.geometry.computeBoundingBox();
    const { boundingBox } = mesh.geometry;

    if (boundingBox) {
      return boundingBox.getSize(new Vector3()).multiplyScalar(3);
    }

    return new Vector3(1, 1, 1);
  };

  // create folders for matrix
  layer.add(
    matrixFolders(mesh, {
      range: settings.range || defaultRange(),
      scale: settings.scale || new Vector2(0, 2),
      precision: settings.precision || 3,
    })
  );

  // create folder for material
  if (mesh.material && Array.isArray(mesh.material)) {
    mesh.material.forEach((mat) => {
      layer.add(material(mat));
    });
  } else if (mesh.material) {
    layer.add(material(mesh.material));
  }

  return layer;
}

export function object3d(
  object3d: Object3D,
  settings: Object3dSettings
): Layer {
  const layer = new Layer(object3d.name || 'Matrix');

  // create folders for matrix
  layer.add(
    matrixFolders(object3d, {
      range: settings.range || new Vector3(1, 1, 1),
      scale: settings.scale || new Vector2(0, 2),
      precision: settings.precision || 3,
    })
  );

  return layer;
}
