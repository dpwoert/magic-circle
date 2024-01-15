import { PerspectiveCamera, Vector3, Camera } from 'three';
import {
  VectorControl,
  NumberControl,
  RotationControl,
  Layer,
  Folder,
} from '@magic-circle/client';

type CameraSettings = {
  range: Vector3;
  precision?: number;
};

function cameraMatrix(camera: Camera, settings: CameraSettings): Folder[] {
  return [
    new Folder('Position').add([
      new VectorControl(camera, 'position')
        .range(
          camera.position.x - settings.range.x,
          camera.position.x + settings.range.x
        )
        .precision(settings.precision || 3),
    ]),
    new Folder('Rotation').add([
      new RotationControl(camera.rotation, 'x'),
      new RotationControl(camera.rotation, 'y'),
      new RotationControl(camera.rotation, 'z'),
    ]),
  ];
}

export function perspectiveCamera(
  camera: PerspectiveCamera,
  settings: CameraSettings
): Layer {
  const layer = new Layer(camera.name || 'Camera');

  // Add matrix controls
  layer.add(cameraMatrix(camera, settings));

  // Add camera specific options
  const folder = new Folder('Camera').add([
    new NumberControl(camera, 'fov').range(0, 100),
    new NumberControl(camera, 'zoom').range(0, 2),
    new NumberControl(camera, 'filmOffset').range(0, 100),
    new NumberControl(camera, 'filmGauge').range(0, 100),
  ]);
  folder.forEach((c) => {
    if ('onUpdate' in c) {
      c.onUpdate(() => camera.updateProjectionMatrix());
    }
  });
  layer.add(folder);

  return layer;
}

export function camera(object: Camera, settings: CameraSettings): Layer {
  if (object instanceof PerspectiveCamera) {
    return perspectiveCamera(object, settings);
  }

  // Create standard fallback
  const layer = new Layer(camera.name || 'Camera');
  layer.add(cameraMatrix(object, settings));
  return layer;
}
