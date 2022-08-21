import Control from '../control';

export default class ImageControl extends Control<string> {
  type = 'image';

  constructor(
    reference: Control<string>['reference'] | HTMLImageElement,
    key?: string
  ) {
    const safeKey = !key && 'src' in reference ? 'src' : key;
    super(reference, safeKey);

    if (!key) {
      this.label('Image');
    }
  }
}
