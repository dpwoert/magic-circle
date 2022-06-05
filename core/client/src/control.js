'use strict';
exports.__esModule = true;
var nanoid = function() {
  return '';
};
var Control = /** @class */ (function() {
  function Control(type, reference, key) {
    this.id = nanoid();
    this.type = type;
    this.reference = reference;
    this.key = key;
    this.options = {
      label: key,
    };
    this.setDefault();
  }
  Object.defineProperty(Control.prototype, 'value', {
    get: function() {
      return this.reference[this.key];
    },
    set: function(value) {
      this.reference[this.key] = value;
    },
    enumerable: false,
    configurable: true,
  });
  Control.prototype.label = function(label) {
    this.options.label = label;
    return this;
  };
  Control.prototype.reset = function() {
    this.value = this.initialValue;
  };
  Control.prototype.setDefault = function() {
    this.initialValue = this.value;
  };
  Control.prototype.toJSON = function() {
    return {
      id: this.id,
      label: this.options.label || this.key,
      value: this.value,
      initialValue: this.initialValue,
    };
  };
  return Control;
})();
exports['default'] = Control;
