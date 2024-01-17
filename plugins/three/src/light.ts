import {
  Vector3,
  Light,
  DirectionalLight,
  SpotLight,
  PointLight,
  AmbientLight,
  HemisphereLight,
  RectAreaLight,
  Camera,
} from 'three';
import {
  VectorControl,
  NumberControl,
  RotationControl,
  TextControl,
  Layer,
  Folder,
  BooleanControl,
  ColorControl,
} from '@magic-circle/client';

import { TransformControl } from './TransformControl';
import { LightHelperControl } from './LightHelperControl';
import { CameraHelperControl } from './CameraHelperControl';
import { getParentScene } from './utils';

type LightHelperSettings = {
  camera?: Camera;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
};

type LightSettings = LightHelperSettings & {
  range: Vector3;
  precision?: number;
};

function lightHelpers(
  light: Light,
  settings: LightHelperSettings = {}
): Folder[] {
  const scene = getParentScene(light);

  if (scene) {
    // Add camera specific options
    const folder = new Folder('Helper').add(new LightHelperControl(light));

    // Add transform
    if (settings.camera) {
      const transformSettings = { mode: 'translate' };
      const transformControl = new TransformControl(
        settings.camera,
        light
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
      folder.add([transformControl, transformMode]);
    }

    if (light.shadow) {
      folder.add(
        new CameraHelperControl(light.shadow?.camera, scene).label(
          'Shadow helper'
        )
      );
    }

    return [folder];
  }

  return [];
}

function lightMatrix(light: Light, settings: LightSettings): Folder[] {
  const folders: Folder[] = [];

  folders.push(
    new Folder('Position').add([
      new VectorControl(light, 'position')
        .range(
          light.position.x - settings.range.x,
          light.position.x + settings.range.x
        )
        .precision(settings.precision || 3),
    ])
  );

  if ('target' in light) {
    const target = light.target as DirectionalLight['target'];

    folders.push(
      new Folder('Target').add([
        new VectorControl(target, 'position')
          .range(
            target.position.x - settings.range.x,
            target.position.x + settings.range.x
          )
          .precision(settings.precision || 3),
      ])
    );
  }

  folders.push(
    new Folder('Rotation').add([
      new RotationControl(light.rotation, 'x'),
      new RotationControl(light.rotation, 'y'),
      new RotationControl(light.rotation, 'z'),
    ])
  );

  return folders;
}

function lightShadow(light: Light): Folder {
  const folder = new Folder('Shadow').add(
    new BooleanControl(light, 'castShadow')
  );

  if (light.shadow) {
    folder.add([
      new NumberControl(light.shadow, 'blurSamples').range(0, 32),
      new NumberControl(light.shadow, 'bias').range(-0.1, 0.1).stepSize(0.001),
      new NumberControl(light.shadow, 'radius').range(0, 1),
    ]);
  }

  return folder;
}

export function pointLight(light: PointLight, settings: LightSettings): Layer {
  const layer = new Layer(light.name || 'Point Light').icon('light');

  // Add matrix controls
  layer.add(lightHelpers(light, settings));
  layer.add(lightMatrix(light, settings));
  layer.add(lightShadow(light));

  // Add light specific options
  const folder = new Folder('Point light settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
    new NumberControl(light, 'decay').range(0, 5),
    new NumberControl(light, 'distance').range(0, settings.range.x),
    new NumberControl(light, 'power').range(0, 3).watch(true),
    new NumberControl(light, 'intensity').range(0, 3).watch(true),
  ]);

  layer.add(folder);

  return layer;
}

export function spotLight(light: SpotLight, settings: LightSettings): Layer {
  const layer = new Layer(light.name || 'Point Liight').icon('light');

  // Add matrix controls
  layer.add(lightHelpers(light, settings));
  layer.add(lightMatrix(light, settings));
  layer.add(lightShadow(light));

  // Add light specific options
  const folder = new Folder('Spot light settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
    new RotationControl(light, 'angle'),
    new NumberControl(light, 'penumbra').range(0, 1),
    new NumberControl(light, 'decay').range(0, 5),
    new NumberControl(light, 'distance').range(0, settings.range.x),
    new NumberControl(light, 'power').range(0, 3).watch(true),
    new NumberControl(light, 'intensity').range(0, 3).watch(true),
  ]);

  layer.add(folder);

  return layer;
}

export function ambientLight(light: AmbientLight): Layer {
  const layer = new Layer(light.name || 'Ambient light').icon('light');

  // layer.add(lightHelpers(light));

  // Add light specific options
  const folder = new Folder('Ambient settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
  ]);

  layer.add(folder);

  return layer;
}

export function hemisphereLight(light: HemisphereLight): Layer {
  const layer = new Layer(light.name || 'Hemisphere light').icon('light');

  layer.add(lightHelpers(light));

  // Add light specific options
  const folder = new Folder('Hemisphere settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
  ]);

  layer.add(folder);

  return layer;
}

export function directionalLight(
  light: DirectionalLight,
  settings: LightSettings
): Layer {
  const layer = new Layer(light.name || 'Directional light').icon('light');

  // Add matrix controls
  layer.add(lightHelpers(light, settings));
  layer.add(lightMatrix(light, settings));
  layer.add(lightShadow(light));

  // Add light specific options
  const folder = new Folder('Directional settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
  ]);

  layer.add(folder);

  return layer;
}

export function rectAreaLight(
  light: RectAreaLight,
  settings: LightSettings
): Layer {
  const layer = new Layer(light.name || 'Rect. Area light').icon('light');

  // Add matrix controls
  // layer.add(lightHelpers(light));
  layer.add(lightMatrix(light, settings));
  layer.add(lightShadow(light));

  // Add light specific options
  const folder = new Folder('Rect. Area settings').add([
    new ColorControl(light, 'color').range(1),
    new NumberControl(light, 'intensity').range(0, 2),
    new NumberControl(light, 'width').range(0, settings.range.x),
    new NumberControl(light, 'height').range(0, settings.range.y),
  ]);

  layer.add(folder);

  return layer;
}

export function light(object: Light, settings: LightSettings): Layer {
  if (object instanceof DirectionalLight) {
    return directionalLight(object, settings);
  }
  if (object instanceof PointLight) {
    return pointLight(object, settings);
  }
  if (object instanceof AmbientLight) {
    return ambientLight(object);
  }
  if (object instanceof HemisphereLight) {
    return hemisphereLight(object);
  }
  if (object instanceof SpotLight) {
    return spotLight(object, settings);
  }
  if (object instanceof RectAreaLight) {
    return rectAreaLight(object, settings);
  }

  // Create standard fallback
  const layer = new Layer(object.name || 'Light').icon('light');
  layer.add(lightMatrix(object, settings));
  return layer;
}
