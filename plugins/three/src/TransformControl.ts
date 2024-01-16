import { Camera, Object3D } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { BooleanControl } from '@magic-circle/client';
import { getParentScene } from './utils';

export class TransformControl extends BooleanControl {
  private camera: Camera;
  private object: Object3D;
  private transformControls?: TransformControls;
  private transformMode: 'translate' | 'rotate' | 'scale' = 'translate';

  constructor(camera: Camera, object: Object3D) {
    const value = {
      on: false,
    };

    super(value, 'on');
    this.camera = camera;
    this.object = object;
    this.label('Transform controls');

    // listen to updates
    this.updateThree = this.updateThree.bind(this);
    this.onUpdate(this.updateThree);
  }

  mode(mode: 'translate' | 'rotate' | 'scale') {
    this.transformMode = mode;

    if (this.transformControls) {
      this.transformControls.mode = this.transformMode;
    }
  }

  private updateThree() {
    const value = this.reference[this.key];

    if (value && !this.transformControls) {
      const element = this.parent?.getMagicInstance()?.element;
      const scene = getParentScene(this.object);

      if (element && scene) {
        this.transformControls = new TransformControls(this.camera, element);
        this.transformControls.attach(this.object);
        this.transformControls.mode = this.transformMode;
        scene.add(this.transformControls);
      }
    } else if (!this.value && this.transformControls) {
      this.transformControls.dispose();
      this.transformControls = undefined;
    }
  }
}
