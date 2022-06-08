'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null'
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
var plugin_1 = require('../plugin');
var PluginLayers = /** @class */ (function (_super) {
  __extends(PluginLayers, _super);
  function PluginLayers() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PluginLayers.prototype.connect = function () {
    var ipc = this.client.ipc;
    // listen to events
    ipc.on('control:set', this.set.bind(this));
    ipc.on('control:reset', this.reset.bind(this));
    ipc.on('controls:set', this.resetAll.bind(this));
    ipc.on('controls:reset', this.resetAll.bind(this));
    this.sync();
  };
  PluginLayers.prototype.sync = function () {
    var layers = this.client.layer.toJSON().children;
    this.client.ipc.send('layers', layers);
  };
  PluginLayers.prototype.set = function (id, value) {
    var layer = this.client.layer;
    var control = layer.find(id);
    if (control && 'value' in control) {
      control.value(value);
    }
  };
  PluginLayers.prototype.reset = function (id) {
    var layer = this.client.layer;
    var control = layer.find(id);
    if (control && 'value' in control) {
      control.reset();
    }
  };
  PluginLayers.prototype.setAll = function (values) {
    var _this = this;
    Object.keys(values).forEach(function (key) {
      _this.set(key, values[key]);
    });
  };
  PluginLayers.prototype.resetAll = function () {
    var layer = this.client.layer;
    layer.forEachRecursive(function (control) {
      if (control && 'value' in control) {
        control.reset();
      }
    });
  };
  return PluginLayers;
})(plugin_1['default']);
exports['default'] = PluginLayers;
