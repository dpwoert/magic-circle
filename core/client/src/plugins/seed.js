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
var PluginSeed = /** @class */ (function (_super) {
  __extends(PluginSeed, _super);
  function PluginSeed() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PluginSeed.prototype.connect = function () {
    var ipc = this.client.ipc;
    // listen to events
    ipc.on('seed:set', this.set.bind(this));
  };
  PluginSeed.prototype.set = function (seed) {
    this.seed = seed;
    this.client.ipc.send('seed', this.seed);
  };
  PluginSeed.prototype.generate = function () {
    this.set(Math.random());
  };
  return PluginSeed;
})(plugin_1['default']);
exports['default'] = PluginSeed;
