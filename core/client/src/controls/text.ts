import Control from '../control';

type options = {
  selection?: {
    keys: string[];
    labels: string[];
  };
};

export default class TextControl extends Control<string, options> {
  type = 'text';

  selection(keys: string[], labels?: string[]) {
    this.options.selection = {
      keys,
      labels,
    };

    return this;
  }
}
