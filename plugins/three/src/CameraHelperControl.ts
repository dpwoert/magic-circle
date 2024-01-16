import { Camera, CameraHelper, Scene } from 'three';
import { BooleanControl } from '@magic-circle/client';

export class CameraHelperControl extends BooleanControl {
  private camera: Camera;
  private scene: Scene;
  private helper?: CameraHelper;

  constructor(camera: Camera, scene: Scene) {
    const value = {
      on: false,
    };

    super(value, 'on');
    this.camera = camera;
    this.scene = scene;
    this.label('Camera helper');

    // listen to updates
    this.updateThree = this.updateThree.bind(this);
    this.onUpdate(this.updateThree);
  }

  private updateThree() {
    const value = this.reference[this.key];

    if (value && !this.helper) {
      this.helper = new CameraHelper(this.camera);
      this.scene.add(this.helper);
    } else if (!this.value && this.helper) {
      this.helper.removeFromParent();
      this.helper.dispose();
    }
  }
}
