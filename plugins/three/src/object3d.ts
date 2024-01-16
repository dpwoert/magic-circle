import { Mesh, Object3D, Vector2, Vector3, Camera } from 'three';
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
import { TransformControl } from './TransformControl';

type MatrixSettings = {
  range: Vector3;
  scale: Vector2;
  precision: number;
  camera?: Camera;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
};

type Object3dSettings = Partial<MatrixSettings>;

export type MeshSettings = Object3dSettings & {
  customMaterial?: materialTransform;
};

export function matrixFolders(
  object: Object3D,
  settings: MatrixSettings
): Folder[] {
  const folders: Folder[] = [];

  const general = new Folder('General');
  general.add([
    new TextControl(object, 'name'),
    new TextControl(object, 'id'),
    new BooleanControl(object, 'visible'),
  ]);
  folders.push(general);

  if (settings.camera) {
    const transformSettings = { mode: 'translate' };
    const transformControl = new TransformControl(
      settings.camera,
      object
    ).onUpdate((newVal) => {
      if (newVal && settings.onTransformStart) {
        settings.onTransformStart();
      }
      if (!newVal && settings.onTransformEnd) {
        settings.onTransformEnd();
      }
    });
    const transformMode = new TextControl(transformSettings, 'mode')
      .selection(['translate', 'rotate', 'scale'])
      .onUpdate(() => {
        transformControl.mode(transformSettings.mode as any);
      });

    folders.push(
      new Folder('Transform').add([transformControl, transformMode])
    );
  }

  folders.push(
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
    ])
  );

  return folders;
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
      ...settings,
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
      ...settings,
      range: settings.range || new Vector3(1, 1, 1),
      scale: settings.scale || new Vector2(0, 2),
      precision: settings.precision || 3,
    })
  );

  return layer;
}
