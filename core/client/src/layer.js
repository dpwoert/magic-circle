'use strict';
exports.__esModule = true;
var nanoid = function() {
  return '';
};
var Layer = /** @class */ (function() {
  function Layer(name) {
    this.id = nanoid();
    this.name = name;
    this.children = [];
    this.folder = false;
  }
  Layer.prototype.forEach = function(fn) {
    this.children.forEach(function(child) {
      fn(child);
    });
  };
  Layer.prototype.forEachRecursive = function(fn) {
    // todo
  };
  Layer.prototype.add = function(child) {
    var _a;
    if (Array.isArray(child)) {
      (_a = this.children).push.apply(_a, child);
    } else {
      this.children.push(child);
    }
  };
  Layer.prototype.addTo = function(layer) {
    layer.add(this);
  };
  Layer.prototype.find = function(id) {
    var found;
    // recursively try to find this element
    var recursive = function(children) {
      children.forEach(function(child) {
        if (child.id === id) {
          found = child;
        }
        if ('children' in child && !found) {
          recursive(child.children);
        }
      });
    };
    // start
    recursive(this.children);
    return found;
  };
  Layer.prototype.toJSON = function() {
    return {
      name: this.name,
      folder: this.folder,
      children: this.children.map(function(child) {
        return child.toJSON();
      }),
    };
  };
  return Layer;
})();
exports['default'] = Layer;
