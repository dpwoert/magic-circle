import {
  Vector3,
  Light,
  DirectionalLight,
  SpotLight,
  PointLight,
  AmbientLight,
} from 'three';
import {
  VectorControl,
  NumberControl,
  RotationControl,
  Layer,
  Folder,
  BooleanControl,
  ColorControl,
} from '@magic-circle/client';

type LightSettings = {
  range: Vector3;
  precision?: number;
};

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
  const layer = new Layer(light.name || 'Point Liight');

  // Add matrix controls
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
  const layer = new Layer(light.name || 'Point Liight');

  // Add matrix controls
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
  const layer = new Layer(light.name || 'Ambient light');

  // Add light specific options
  const folder = new Folder('Ambient settings').add([
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
  const layer = new Layer(light.name || 'Directional light');

  // Add matrix controls
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

  // Create standard fallback
  const layer = new Layer(object.name || 'Light');
  layer.add(lightMatrix(object, settings));
  return layer;
}
