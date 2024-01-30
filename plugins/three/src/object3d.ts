import { Mesh, Object3D, Vector2, Vector3, Camera } from 'three';
import {
  BooleanControl,
  VectorControl,
  NumberControl,
  RotationControl,
  Layer,
  Folder,
  TextControl,
  ButtonControl,
} from '@magic-circle/client';

import { material, MaterialSettings } from './material';
import { TransformControl } from './TransformControl';

type MatrixSettings = {
  range: Vector3;
  scale: Vector2;
  precision: number;
  camera?: Camera;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
  onRename?: (object: Object3D) => void;
};

type Object3dSettings = Partial<MatrixSettings>;

export type MeshSettings = Object3dSettings & MaterialSettings;

let renameDebounce: ReturnType<typeof setTimeout> | undefined;

export function matrixFolders(
  object: Object3D,
  settings: MatrixSettings
): Folder[] {
  const folders: Folder[] = [];

  const general = new Folder('General');
  general.add([
    new TextControl(object, 'name').on('update', () => {
      if (renameDebounce) {
        clearTimeout(renameDebounce);
      }

      renameDebounce = setTimeout(() => {
        if (settings.onRename) settings.onRename(object);
      }, 500);
    }),
    // new TextControl(object, 'id'),
    new BooleanControl(object, 'visible'),
  ]);

  if (settings.canDelete) {
    const wrapper = {
      deleteObject: () => {
        object.removeFromParent();
        if (settings.onDelete) settings.onDelete();
      },
    };

    general.add(
      new ButtonControl(wrapper, 'deleteObject').label('Delete from scene')
    );
  }

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
        .precision(settings.precision)
        .watch(!!settings.camera),
    ]),
    new Folder('Scale').add([
      new NumberControl(object.scale, 'x')
        .range(settings.scale.x, settings.scale.y)
        .watch(!!settings.camera),
      new NumberControl(object.scale, 'y')
        .range(settings.scale.x, settings.scale.y)
        .watch(!!settings.camera),
      new NumberControl(object.scale, 'z')
        .range(settings.scale.x, settings.scale.y)
        .watch(!!settings.camera),
    ]),

    new Folder('Rotation').add([
      new RotationControl(object.rotation, 'x').watch(!!settings.camera),
      new RotationControl(object.rotation, 'y').watch(!!settings.camera),
      new RotationControl(object.rotation, 'z').watch(!!settings.camera),
    ])
  );

  return folders;
}

export function mesh(mesh: Mesh, settings: MeshSettings): Layer {
  const layer = new Layer(mesh.name || 'Mesh').icon('mesh');

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
      layer.add(material(mat, settings));
    });
  } else if (mesh.material) {
    layer.add(material(mesh.material, settings));
  }

  return layer;
}

export function object3d(
  object3d: Object3D,
  settings: Object3dSettings
): Layer {
  const layer = new Layer(object3d.name || 'Matrix').icon('group');

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
