import Control from '../control';

export default class ImageControl extends Control<string | ImageBitmap> {
  type = 'image';

  blockObjectMerge = true;

  constructor(
    reference: Control<string>['reference'] | HTMLImageElement,
    key?: string
  ) {
    // if key is not present, it must be an HTMLImageElement and we can use the 'src' key
    const isHTMLImageElement = !key && 'src' in reference;
    super(reference, isHTMLImageElement || !key ? 'src' : key);

    if (!key) {
      this.label('Image');
    }
  }

  // disable watching on images...
  watch() {
    return this;
  }
}
