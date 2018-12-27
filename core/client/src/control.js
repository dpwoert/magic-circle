export class Control {

  constructor(reference, key){
    this.type = 'text';
    this.reference = reference;
    this.key = key;
    this.label = key;
    this.options = {};
    this.initialValue = this.reference[this.key];
    return this;
  }

  /** Receive an updated value from the client */
  setValue(value){
    if(typeof value === 'object' && !Array.isArray(value)){
      Object.keys(value).forEach(key => {
        this.reference[this.key][key] = value[key];
      });
    } else {
      this.reference[this.key] = value;
    }
  }

  /** returns current value of controls */
  getValue(){
    return this.reference[this.key];
  }

  /** Value has been updated outside of the controls */
  update(){
    // TODO read & send value
  }

  /** Reset to initial value */
  reset(){
    this.reference[this.key] = this.initialValue;
  }

  /** Sets the label for this control */
  label(label){
    this.label = label;
    return this;
  }

  /** Add to folder */
  addTo(parent){
    parent.addControl(this);
    return this;
  }

  toJSON(basePath){
    const path = `${basePath}.${this.key}`;
    return {
      path,
      isControl: true,
      type: this.type,
      key: this.key,
      label: this.label,
      options: this.options,
      value: this.getValue(),
      initialValue: this.initialValue,
    };
  }


};

export class TextControl extends Control{}

export class SelectionControl extends Control{

  constructor(reference, key){
    super(reference, key);
    this.type = 'selectionBox';
  }

  values(values){
    this.options.values = values;
    return this;
  }

  labels(){
    this.options.labels = labels;
    return this;
  }

}

export class IntControl extends Control{

  constructor(reference, key){
    super(reference, key);
    this.type = 'int';
  }

  stepSize(stepSize){
    this.options.stepSize = stepSize;
    return this;
  }

}

export class FloatControl extends Control{

  constructor(reference, key){
    super(reference, key);
    this.type = 'float';
    this.options = {
      range: [0, 100],
      stepSize: 0,
    }
  }

  range(start, end){
    this.options.range = [start, end];
    return this;
  }

  stepSize(size){
    this.options.stepSize = size;
    return this;
  }

}

export class ColorControl extends Control {

  constructor(reference, key){
    super(reference, key);
    this.type = 'color';
    this.options = {
      alpha: false,
      range: 255,
    }
  }

  alpha(alpha){
    this.options.alpha = !!alpha;
    return this;
  }

  range(range){
    this.options.range = range;
    return this;
  }

}

export class BooleanControl extends Control {

  constructor(reference, key){
    super(reference, key);
    this.type = 'boolean';
  }

}
