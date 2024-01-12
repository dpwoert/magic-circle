import {
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  Vector2,
  Vector3,
  // WebGLRenderer,
  Scene,
  Camera,
  Color,
  PerspectiveCamera,
} from 'three';
import {
  BooleanControl,
  VectorControl,
  NumberControl,
  RotationControl,
  Layer,
  Folder,
  TextControl,
  ColorControl,
  ImageControl,
} from '@magic-circle/client';

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

type materialTransform = (material: Material) => Folder[];

type MeshSettings = {
  range?: Vector3;
  scale?: Vector2;
  precision?: number;
  customMaterial?: materialTransform;
};

type CameraSettings = {
  range: Vector3;
  precision?: number;
};

type GroupSettings = Omit<MeshSettings, 'range' | 'range'> & {
  name?: string;
  range?: (mesh: Mesh | Object3D) => Vector3;
  scale?: (mesh: Mesh | Object3D) => Vector2;
  watch?: (name: string) => boolean;
};

type SceneSettings = GroupSettings & {
  noRecursive?: boolean;
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

function defaultMaterialFolders(
  material:
    | MeshStandardMaterial
    | MeshPhysicalMaterial
    | MeshBasicMaterial
    | MeshPhongMaterial
    | MeshLambertMaterial
    | MeshToonMaterial
): Folder[] {
  const folders: Folder[] = [];
  const main: Folder['children'] = [];
  const pbr: Folder['children'] = [];
  const textures: ImageControl[] = [];

  // add main material options
  if ('transparant' in material) {
    main.push(new BooleanControl(material, 'transparant'));
  }
  if ('opacity' in material) {
    main.push(new NumberControl(material, 'opacity').range(0, 1));
  }
  if ('fog' in material) {
    main.push(new BooleanControl(material, 'fog'));
  }
  if ('wireframe' in material) {
    main.push(new BooleanControl(material, 'wireframe'));
  }
  if ('flatShading' in material) {
    main.push(new BooleanControl(material, 'flatShading'));
  }
  if ('color' in material) {
    main.push(new ColorControl(material, 'color').range(1));
  }
  if ('emissive' in material) {
    main.push(new ColorControl(material, 'emissive').range(1));
  }
  if ('emissiveIntensity' in material) {
    main.push(new NumberControl(material, 'emissiveIntensity').range(0, 1));
  }
  if ('bumpScale' in material) {
    main.push(new ColorControl(material, 'bumpScale').range(0, 2));
  }
  if ('displacementScale' in material) {
    main.push(new ColorControl(material, 'displacementScale').range(0, 2));
  }

  folders.push(new Folder('Material').add(main));

  // Add PBR properties
  if ('metalness' in material) {
    pbr.push(new NumberControl(material, 'metalness').range(0, 1));
  }
  if ('roughness' in material) {
    pbr.push(new NumberControl(material, 'roughness').range(0, 1));
  }
  if ('attenuationColor' in material) {
    pbr.push(new ColorControl(material, 'attenuationColor').range(1));
  }
  if ('attenuationDistance' in material) {
    pbr.push(new NumberControl(material, 'roughness').range(0, 1));
  }
  if ('clearcoat' in material) {
    pbr.push(new NumberControl(material, 'clearcoat').range(0, 1));
  }
  if ('clearcoatRoughness' in material) {
    pbr.push(new NumberControl(material, 'clearcoatRoughness').range(0, 1));
  }
  if ('ior' in material) {
    pbr.push(new NumberControl(material, 'ior').range(1, 2.333));
  }
  if ('reflectivity' in material) {
    pbr.push(new NumberControl(material, 'ior').range(0, 1));
  }
  if ('iridescence' in material) {
    pbr.push(new NumberControl(material, 'iridescence').range(0, 1));
  }
  if ('iridescenceIOR' in material) {
    pbr.push(new NumberControl(material, 'iridescenceIOR').range(1, 2.333));
  }
  if ('sheen' in material) {
    pbr.push(new NumberControl(material, 'sheen').range(0, 1));
  }
  if ('sheenRoughness' in material) {
    pbr.push(new NumberControl(material, 'sheenRoughness').range(0, 1));
  }
  if ('sheenColor' in material) {
    pbr.push(new ColorControl(material, 'sheenColor').range(1));
  }
  if ('specularIntensity ' in material) {
    pbr.push(new NumberControl(material, 'specularIntensity ').range(0, 1));
  }
  if ('specularColor' in material) {
    pbr.push(new ColorControl(material, 'specularColor').range(1));
  }
  if ('transmission' in material) {
    pbr.push(new NumberControl(material, 'transmission').range(0, 1));
  }

  if (pbr.length > 1) {
    folders.push(new Folder('Physically based properties').add(pbr));
  }

  // add texture options
  if (material.map) {
    textures.push(new ImageControl(material.map?.source, 'data').label('Map'));
  }
  if ('roughnessMap' in material && material.roughnessMap) {
    textures.push(
      new ImageControl(material.roughnessMap.source, 'data').label('Roughness')
    );
  }
  if ('metalnessMap' in material && material.metalnessMap) {
    textures.push(
      new ImageControl(material.metalnessMap.source, 'data').label('Metalness')
    );
  }
  if ('emissiveMap' in material && material.emissiveMap) {
    textures.push(
      new ImageControl(material.emissiveMap.source, 'data').label('Emissive')
    );
  }
  if ('bumpMap' in material && material.bumpMap) {
    textures.push(
      new ImageControl(material.bumpMap.source, 'data').label('Bump')
    );
  }
  if ('displacementMap' in material && material.displacementMap) {
    textures.push(
      new ImageControl(material.displacementMap.source, 'data').label(
        'Displacement'
      )
    );
  }

  if (textures.length > 0) {
    folders.push(new Folder('Textures').add(textures));
  }

  return folders;
}

function customMaterialFolders(
  material: Material,
  transform: materialTransform
): Folder[] {
  return transform(material);
}

export function materialFolders(
  material: Material,
  customTransform?: materialTransform
): Folder[] {
  if (
    material instanceof MeshToonMaterial ||
    material instanceof MeshBasicMaterial ||
    material instanceof MeshPhysicalMaterial ||
    material instanceof MeshStandardMaterial ||
    material instanceof MeshLambertMaterial ||
    material instanceof MeshPhongMaterial
  ) {
    return defaultMaterialFolders(material);
  }

  if (customTransform) {
    return customMaterialFolders(material, customTransform);
  }

  return [];
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
      layer.add(materialFolders(mat));
    });
  } else if (mesh.material) {
    layer.add(materialFolders(mesh.material));
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

export function camera(
  camera: Camera,
  settings: CameraSettings = { range: new Vector3(10, 10, 10) }
): Layer {
  const layer = new Layer(camera.name || 'Camera');

  // create folders for matrix
  layer.add(
    new Folder('Position').add([
      new VectorControl(camera, 'position')
        .range(
          camera.position.x - settings.range.x,
          camera.position.x + settings.range.x
        )
        .precision(settings.precision || 3),
    ])
  );

  if (camera instanceof PerspectiveCamera) {
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
  }

  return layer;
}

// export function light(light: Light): Layer {
//   // todo
// }

export function recursive(
  group: Object3D,
  settings: GroupSettings = {}
): Layer {
  const mapping: Record<string, Layer> = {};

  const rootLayer = new Layer(settings.name || group.name);

  group.traverse((object) => {
    // Find parent layer
    const parentId = object.parent?.id || '';
    const parentLayer = mapping[parentId] || rootLayer;

    // Create layer
    let gui: Layer;

    if (object instanceof Mesh) {
      gui = mesh(object, {
        range: settings.range ? settings.range(object) : undefined,
        scale: settings.scale ? settings.scale(object) : undefined,
      }).addTo(parentLayer);
    } else if (object instanceof Camera) {
      gui = camera(object, {
        range: settings.range
          ? settings.range(object)
          : new Vector3(10, 10, 10),
      }).addTo(parentLayer);
    } else {
      gui = object3d(object, {
        range: settings.range ? settings.range(object) : undefined,
        scale: settings.scale ? settings.scale(object) : undefined,
      }).addTo(parentLayer);
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

// export function renderer(renderer: WebGLRenderer) {
//   // todo
// }

export function scene(scene: Scene, opts: SceneSettings = {}): Layer {
  const rootLayer = new Layer(opts.name || scene.name || 'Scene');

  if (!opts.noRecursive) {
    rootLayer.add(recursive(scene as unknown as Group).children);
  }

  const background: Folder['children'] = [];

  // Background
  if (scene.background instanceof Color) {
    background.push(new ColorControl(scene, 'background').range(1));
  } else if (scene.background) {
    background.push(
      new ImageControl(scene, 'background'),
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
