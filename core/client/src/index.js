'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
exports.__esModule = true;
exports.Plugin =
  exports.Control =
  exports.Folder =
  exports.Layer =
  exports.MagicCircle =
    void 0;
var client_1 = require('./client');
__createBinding(exports, client_1, 'default', 'MagicCircle');
var layer_1 = require('./layer');
__createBinding(exports, layer_1, 'default', 'Layer');
var folder_1 = require('./folder');
__createBinding(exports, folder_1, 'default', 'Folder');
var control_1 = require('./control');
__createBinding(exports, control_1, 'default', 'Control');
var plugin_1 = require('./plugin');
__createBinding(exports, plugin_1, 'default', 'Plugin');
