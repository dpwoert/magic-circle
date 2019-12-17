import {
  Layer,
  NumberControl,
  BooleanControl,
  TextControl,
  ColorControl,
  ButtonControl,
} from '@magic-circle/client';
import * as THREE from 'three';

import * as Geometries from 'three/src/geometries/Geometries.js';

export class SceneControls extends Layer {
  constructor(name, scene, needsName = true) {
    super(name);
    this.scene = scene;

    scene.children.forEach(child => {
      const name = child.name || child.label;
      if (child.type === 'Scene' && (name || !needsName)) {
        this.add(new SceneControls(name || 'Scene', child));
      } else if (child.type === 'Mesh' && (name || !needsName)) {
        this.add(new MeshControls(name || 'Mesh', child));
      }
    });
  }
}

export class MeshControls extends Layer {
  constructor(name, mesh) {
    super(name);

    this.mesh = mesh;

    if (mesh.geometry) {
      this.add(new GeometryControls(mesh.geometry));
    }
    if (mesh.material) {
      this.add(new MaterialControls(mesh.material));
    }

    this.folder('Position', [
      new NumberControl(this.mesh.position, 'x'),
      new NumberControl(this.mesh.position, 'y'),
      new NumberControl(this.mesh.position, 'z'),
      new ButtonControl(this, 'showHelper').label('Show helper'),
    ]);

    this.folder('Rotation', [
      new NumberControl(this.mesh.rotation, 'x').range(
        -Math.PI * 2,
        Math.PI * 2
      ),
      new NumberControl(this.mesh.rotation, 'y').range(
        -Math.PI * 2,
        Math.PI * 2
      ),
      new NumberControl(this.mesh.rotation, 'z').range(
        -Math.PI * 2,
        Math.PI * 2
      ),
    ]);

    this.folder('Scale', [
      new NumberControl(this.mesh.scale, 'x').range(0, 10),
      new NumberControl(this.mesh.scale, 'y').range(0, 10),
      new NumberControl(this.mesh.scale, 'z').range(0, 10),
    ]);
  }

  toggleDebug() {
    //todo
  }
}

export class MaterialControls extends Layer {
  constructor(material) {
    super(material.type || 'Camera');
    this.material = material;

    this.folder('Colors', [new ColorControl(material, 'color').range(1)]);
  }
}

export class GeometryControls extends Layer {
  constructor(material) {
    super('Geometry');
    this.material = material;

    this.type = material.type;
    const geometries = Object.keys(Geometries);

    this.folder('Geometry', [
      new TextControl(this, 'type').values(geometries),
    ]).forEach(c => c.on('change', this.changeGeometry.bind(this)));
  }

  changeGeometry() {
    // todo
  }
}

export class CameraControls extends Layer {
  constructor(camera) {
    super(camera.type || 'Camera');
    this.camera = camera;

    this.folder('Position', [
      new NumberControl(camera.position, 'x'),
      new NumberControl(camera.position, 'y'),
      new NumberControl(camera.position, 'z'),
      new ButtonControl(this, 'showHelper').label('Show helper'),
    ]);

    this.folder('Properties', [
      new NumberControl(camera, 'zoom').range(0, 5),
      new NumberControl(camera, 'fov').range(0, 180),
    ]);
  }
}
