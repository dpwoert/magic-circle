import {
  Light,
  SpotLightHelper,
  PointLightHelper,
  SpotLight,
  PointLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  RectAreaLight,
  RectAreaLightHelper,
} from 'three';
import { BooleanControl } from '@magic-circle/client';
import { getParentScene } from './utils';

export class LightHelperControl extends BooleanControl {
  private light: Light;
  private helper?:
    | SpotLightHelper
    | PointLightHelper
    | DirectionalLightHelper
    | HemisphereLightHelper
    | RectAreaLightHelper;

  constructor(light: Light) {
    const value = {
      on: false,
    };

    super(value, 'on');
    this.light = light;
    this.label('Light helper');

    // listen to updates
    this.updateThree = this.updateThree.bind(this);
    this.onUpdate(this.updateThree);
  }

  private updateThree() {
    const value = this.reference[this.key];

    if (value && !this.helper) {
      const scene = getParentScene(this.light);

      if (scene) {
        if (this.light instanceof SpotLight) {
          this.helper = new SpotLightHelper(this.light);
          scene.add(this.helper);
        }
        if (this.light instanceof PointLight) {
          this.helper = new PointLightHelper(this.light);
          scene.add(this.helper);
        }
        if (this.light instanceof DirectionalLight) {
          this.helper = new DirectionalLightHelper(this.light);
          scene.add(this.helper);
        }
        if (this.light instanceof HemisphereLight) {
          this.helper = new HemisphereLightHelper(this.light, 1);
          scene.add(this.helper);
        }
        if (this.light instanceof RectAreaLight) {
          this.helper = new RectAreaLightHelper(this.light);
          scene.add(this.helper);
        }
      }
    } else if (!this.value && this.helper) {
      this.helper.removeFromParent();
      this.helper.dispose();
    }
  }
}
