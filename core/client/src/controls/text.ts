import Control from '../control';

type options = {
  selection?: {
    keys: string[];
    labels?: string[];
  };
};

export default class TextControl extends Control<string, options> {
  type = 'text';

  /**
   * Limits values of text to a list displayed in a selection box
   *
   * @param keys List of values
   * @param keys List of labels for values (optional)
   */
  selection(keys: string[], labels?: string[]) {
    this.options.selection = {
      keys,
      labels,
    };

    return this;
  }
}
