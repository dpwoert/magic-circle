import {
  BooleanControl,
  Control,
  Folder,
  ImageControl,
  NumberControl,
} from '@magic-circle/client';
import { Texture } from 'three';

type TextureFolderSettings = {
  canChange?: boolean;
  onChange?: () => void;
};

export class TextureFolder extends Folder {
  constructor(
    label: string,
    reference: Control<any>['reference'],
    key: string,
    settings: TextureFolderSettings = {}
  ) {
    super(label);
    this.icon('texture');

    const controls: Control<any>[] = [];
    const value: Texture = reference[key];
    const obj = {
      on: !!value,
    };

    if (settings.canChange) {
      controls.push(
        new BooleanControl(obj, 'on')
          .label('Use texture')
          .on('update', (newVal) => {
            if (newVal) {
              // eslint-disable-next-line
              reference[key] = new Texture();
            } else {
              // eslint-disable-next-line
              reference[key] = undefined;
            }

            if (settings.onChange) settings.onChange();
          })
      );
    }

    if (obj.on) {
      controls.push(
        new NumberControl(value, 'wrapS'),
        new NumberControl(value, 'wrapT'),
        new ImageControl(value.source, 'data').label('Image')
      );
    }

    this.add(controls);
  }
}
