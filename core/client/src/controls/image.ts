import Control from '../control';

export default class ImageControl extends Control<string> {
  type = 'image';

  constructor(
    reference: Control<string>['reference'] | HTMLImageElement | ImageBitmap,
    key?: string
  ) {
    let safeKey = key;
    let referenceSafe = reference;

    if (!key && 'src' in reference) {
      safeKey = 'src';
    } else if (
      !key &&
      'close' in reference &&
      reference.toString() === '[object ImageBitmap]'
    ) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = reference.width;
      canvas.height = reference.height;

      // @ts-expect-error
      context.drawImage(reference, 0, 0, reference.width, reference.height);
      const url = canvas.toDataURL('image/png');

      referenceSafe = { value: url };
      safeKey = 'value';
    }

    super(referenceSafe, safeKey);

    if (!key) {
      this.label('Image');
    }
  }
}
