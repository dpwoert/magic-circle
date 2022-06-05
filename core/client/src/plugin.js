'use strict';
exports.__esModule = true;
var Plugin = /** @class */ (function() {
  function Plugin(client) {
    this.client = client;
  }
  Plugin.prototype.compatible = function() {
    return true;
  };
  Plugin.prototype.connect = function() {
    // todo
  };
  Plugin.prototype.playState = function(playing) {};
  Plugin.prototype.destroy = function() {
    this.client = null;
  };
  return Plugin;
})();
exports['default'] = Plugin;
