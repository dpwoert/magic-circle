import {
  Material,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
} from 'three';
import {
  BooleanControl,
  NumberControl,
  Folder,
  ColorControl,
  ImageControl,
} from '@magic-circle/client';

export type materialTransform = (material: Material) => Folder[];

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

export function material(
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
