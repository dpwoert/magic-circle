import Control from '../control';

export default class TextControl extends Control<string> {
  type = 'text';

  selection(keys: string[], labels?: string[]) {
    this.options.selection = {
      keys,
      labels,
    };

    return this;
  }
}
