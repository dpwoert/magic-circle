import type Layer from './layer';
import type Paths from './paths';
import Events from './events';

type Reference = Record<string, any>;

type UpdateHook<T> = (newValue: T) => void;

type options = Record<string, unknown>;

export default class Control<T, U extends options = options> extends Events<{
  visible: { hook: (visible: boolean) => void };
  destroy: { hook: () => void };
  update: { hook: (newVal: T) => void };
  reset: { hook: () => void };
}> {
  type: string = 'unknown';
  reference: Reference;
  key: string;
  initialValue: T;
  options: { label: string } & Partial<U>;
  blockHydrate?: boolean;
  blockObjectMerge?: boolean;
  watchChanges?: boolean;
  parent?: Layer;

  /**
   * Creates control instance
   *
   * @param reference Object to reference
   * @param key Key in object to read for value
   */
  constructor(reference: Reference, key: string) {
    super();

    if (!reference) {
      throw new Error('Reference object does not exist');
    }
    if (reference[key] === undefined) {
      throw new Error(`Key (${key}) does not exist on referenced object`);
    }

    this.reference = reference;
    this.key = key;

    this.options = {
      label: key,
    } as Control<T, U>['options'];

    this.initialValue = this.reference[key];
    this.setDefault();
  }

  get value(): T {
    return this.reference[this.key];
  }

  set value(value: T) {
    if (value === null || value === undefined) {
      console.warn('Trying to set null or undefined value to a control');
    } else if (typeof value === 'object' && !this.blockObjectMerge) {
      // set objects per key, so to not destroy references
      Object.keys(value).forEach((k) => {
        this.reference[this.key][k] = value[k as keyof typeof value];
      });
    } else {
      this.reference[this.key] = value;
    }

    // Run update hooks
    this.trigger('update', value);
  }

  /**
   * Sets label in UI
   *
   * @param label
   */
  label(label: string) {
    this.options.label = label;
    return this;
  }

  /**
   * Resets to the initial value
   */
  reset() {
    this.value = this.initialValue;
    this.trigger('reset');
  }

  /**
   * Sets current value as default
   */
  setDefault() {
    let newValue:
      | T
      | Array<unknown>
      | Record<string, unknown>
      | undefined
      | null;

    if (this.value === undefined) {
      newValue = undefined;
    } else if (this.value === null) {
      newValue = null;
    } else if (Array.isArray(this.value)) {
      newValue = [...this.value];
    } else if (typeof this.value === 'object') {
      newValue = {};
      Object.keys(this.value).forEach((k) => {
        // @ts-ignore
        newValue[k] = this.value[k];
      });
    } else {
      newValue = this.value;
    }

    // @ts-ignore
    this.initialValue = newValue;
  }

  /**
   * Get path in tree
   *
   * @param basePath Base path to prepend
   * @param paths Reference to all paths to prevent duplicates
   */
  getPath(basePath: string, paths: Paths) {
    return paths.get(basePath, this.key);
  }

  /**
   * Watch value changes,
   * needed if external changes happen to this variable.
   *
   * @param watch Enable/disable watching
   */
  watch(watch = true) {
    this.watchChanges = watch;
    return this;
  }

  /**
   * (if possible) interpolates values
   *
   * @param from
   * @param to
   * @param alpha Value between 0-1
   */
  // eslint-disable-next-line
  interpolate(from: T, to: T, alpha: number) {
    return from;
  }

  /**
   * Function to run on update of values, triggered by the editor.
   *
   * @param hook Function to run
   * @deprecated use on/once instead
   */
  onUpdate(fn: UpdateHook<T>) {
    // this.updateHooks.add(fn);
    this.on('update', fn);
    return this;
  }

  /**
   * Add this control to a layer or folder
   *
   * @param layer Layer/folder to add to
   */
  addTo(layer: Layer) {
    if (this.parent) {
      this.removeFromParent();
    }

    this.parent = undefined;
    layer.add(this);

    return this;
  }

  /**
   * Trigger a sync of the root Magic Circle instance (if possible)
   */
  sync() {
    if (this.parent) {
      this.parent.getMagicInstance()?.sync();
    }
  }

  /**
   * Exports settings to JSON
   *
   * @param basePath Base path to prepend
   * @param paths Reference to all paths to prevent duplicates
   */
  toJSON(basePath: string, paths: Paths) {
    const path = this.getPath(basePath, paths);
    return {
      path,
      label: this.options.label || this.key,
      options: this.options,
      type: this.type,
      value: this.value,
      initialValue: this.initialValue,
      blockHydrate: !!this.blockHydrate,
      watching: !!this.watchChanges,
    };
  }

  /**
   * Removes this control from parent
   */
  removeFromParent() {
    if (this.parent) {
      this.parent.remove(this);
      this.parent = undefined;
    }
  }

  /**
   * Destroys this instance and all memory associated with it
   */
  destroy() {
    this.trigger('destroy');

    if (this.parent) {
      this.removeFromParent();
    }

    // @ts-ignore
    this.reference = undefined;
    this.resetEvents();
  }
}
