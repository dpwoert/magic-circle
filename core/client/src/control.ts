type Reference = Record<string, any>;

const nanoid = () => '';

export default class Control<T> {
  id: string;
  type: string;
  reference: Reference;
  key: string;
  initialValue: T;
  options: Record<string, unknown>;

  constructor(type: string, reference: Reference, key: string) {
    this.id = nanoid();
    this.type = type;
    this.reference = reference;
    this.key = key;

    this.options = {
      label: key,
    };

    this.setDefault();
  }

  get value(): T {
    return this.reference[this.key];
  }

  set value(value: T) {
    this.reference[this.key] = value;
  }

  label(label: string) {
    this.options.label = label;
    return this;
  }

  reset() {
    this.value = this.initialValue;
  }

  setDefault() {
    this.initialValue = this.value;
  }

  toJSON() {
    return {
      id: this.id,
      label: this.options.label || this.key,
      value: this.value,
      initialValue: this.initialValue,
    };
  }
}
