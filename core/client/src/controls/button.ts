import Control from '../control';

export default class ButtonControl extends Control<() => void> {
  type = 'button';
  blockHydrate = true;

  get value() {
    return null;
  }

  set value(newValue: any) {
    this.reference[this.key]();
  }
}
