/* eslint-disable no-param-reassign */
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
    reference: { needsUpdate: boolean } & Control<any>['reference'],
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
              reference[key] = new Texture();
            } else {
              reference[key] = undefined;
              reference.needsUpdate = true;
            }

            if (settings.onChange) settings.onChange();
          })
      );
    }

    if (obj.on) {
      controls.push(
        new NumberControl(value.repeat, 'x').label('repeat x'),
        new NumberControl(value.repeat, 'y').label('repeat y'),
        new NumberControl(value.offset, 'x').range(-1, 1).label('offset x'),
        new NumberControl(value.offset, 'y').range(-1, 1).label('offset y'),
        new ImageControl(value.source, 'data')
          .label('Image')
          .on('update', (newVal) => {
            value.source.data = newVal;
            value.needsUpdate = true;
            reference.needsUpdate = true;
          })
      );
    }

    this.add(controls);
  }
}
