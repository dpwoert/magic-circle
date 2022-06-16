import Control from '../control';

export default class ButtonControl extends Control<() => void> {
  type = 'button';

  get value() {
    return null;
  }

  set value(newValue: any) {
    this.reference[this.key]();
  }
}
