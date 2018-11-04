// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"plugins/layers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LayersPlugin =
/*#__PURE__*/
function () {
  function LayersPlugin(client) {
    _classCallCheck(this, LayersPlugin);

    this.client = client;
    this.layers = [];
    this.mapping = new Map(); // Setup client

    this.client.addLayer = this.addLayer.bind(this);
    this.client.addLayers = this.addLayers.bind(this);
    this.client.regenerate = this.regenerate.bind(this);
  }

  _createClass(LayersPlugin, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      // Event listeners
      this.client.addListener('control-set-value', function (evt, payload) {
        _this.setValue(payload.path, payload.value);
      });
      console.log('connect');
      this.regenerate();
    }
  }, {
    key: "addLayers",
    value: function addLayers() {
      var _this2 = this;

      for (var _len = arguments.length, layers = new Array(_len), _key = 0; _key < _len; _key++) {
        layers[_key] = arguments[_key];
      }

      layers.forEach(function (l) {
        return _this2.addLayer(l, false);
      });
      this.regenerate();
    }
  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      var regenerate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.layers.push(layer); // Regenerate tree if needed

      if (regenerate) {
        this.regenerate();
      }
    }
  }, {
    key: "regenerate",
    value: function regenerate() {
      var _this3 = this;

      this.mapping.clear();
      var data = this.layers.map(function (l) {
        return l.toJSON(_this3.mapping);
      });
      this.client.sendMessage('layers', data);
    }
  }, {
    key: "setValue",
    value: function setValue(path, value) {
      var control = this.mapping.get(path);

      if (control) {
        control.setValue(value);
      } else {
        console.error('could not update control', path, value);
      }
    }
  }]);

  return LayersPlugin;
}();

var _default = LayersPlugin;
exports.default = _default;
},{}],"plugins/seed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SeedPlugin =
/*#__PURE__*/
function () {
  function SeedPlugin(client) {
    _classCallCheck(this, SeedPlugin);

    this.client = client;
    this.seed = 0;
    this.generateSeed(); // Setup client

    this.client.generateSeed = this.generateSeed.bind(this);
    this.client.getSeed = this.getSeed.bind(this);
  }

  _createClass(SeedPlugin, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      this.client.sendMessage('seed', this.seed); // Event listeners

      this.client.addListener('generate-seed', function () {
        _this.generateSeed();
      });
    }
  }, {
    key: "getSeed",
    value: function getSeed() {
      return this.seed;
    }
  }, {
    key: "generateSeed",
    value: function generateSeed() {
      this.seed = Math.random();
      this.client.sendMessage('seed', this.seed);
    }
  }]);

  return SeedPlugin;
}();

var _default = SeedPlugin;
exports.default = _default;
},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/is-electron/index.js":[function(require,module,exports) {
var process = require("process");
// https://github.com/electron/electron/issues/2288
function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

module.exports = isElectron;

},{"process":"../node_modules/process/browser.js"}],"client.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = void 0;

var _layers = _interopRequireDefault(require("./plugins/layers"));

var _seed = _interopRequireDefault(require("./plugins/seed"));

var _isElectron = _interopRequireDefault(require("is-electron"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// load ipc renderer
var ipcRenderer = null;

var getNodeEnv = function getNodeEnv() {
  try {
    return "development";
  } catch (e) {
    return 'development';
  }
};

var Client =
/*#__PURE__*/
function () {
  function Client() {
    var _this = this;

    _classCallCheck(this, Client);

    this.listeners = [];
    this.channels = [];
    this.fn = {
      setup: function setup() {},
      loop: function loop() {}
    }; //add plugins

    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }

    plugins.push(_layers.default);
    plugins.push(_seed.default);
    this.plugins = plugins.map(function (P) {
      return new P(_this);
    }); //event binding

    this.nextFrame = this.nextFrame.bind(this); // Not electron so don't wait for connection to backend

    if (!(0, _isElectron.default)()) {
      this.fn.setup(this);
      this.play();
    } else {
      // Add to window global to it can be reached by Electron
      window.__controls = this;
    }
  }

  _createClass(Client, [{
    key: "connect",
    value: function connect() {
      var _this2 = this;

      if (window.__IPC) {
        console.log('🔌 Creative Controls loaded');
        ipcRenderer = window.__IPC;
        this.plugins.forEach(function (p) {
          return p.connect ? p.connect() : null;
        }); // Send page information to front-end

        this.sendMessage('page-information', {
          title: document.title,
          nodeEnv: getNodeEnv()
        }); // trigger setup hook

        this.sendMessage('setup');
        ipcRenderer.once('setup-response', function (evt, payload) {
          //run setup script
          if (_this2.fn.setup) {
            _this2.fn.setup(_this2);
          } // run actions after setup is done


          _this2.batch(evt, payload); //start rendering


          _this2.play();
        });
      }
    }
  }, {
    key: "trigger",
    value: function trigger(channel, evt, payload) {
      this.listeners.forEach(function (l) {
        if (l.channel === channel) {
          l.fn(evt, payload);
        }
      });
    }
  }, {
    key: "batch",
    value: function batch(evt, payload) {
      var _this3 = this;

      payload.batch.forEach(function (message) {
        _this3.trigger(message.channel, evt, message.payload);
      });
    }
  }, {
    key: "addListener",
    value: function addListener(channel, fn) {
      this.listeners.push({
        channel: channel,
        fn: fn
      });
      this.resetListeners();
    }
  }, {
    key: "removeListener",
    value: function removeListener(fn) {
      for (var i = this.listeners.length - 1; i >= 0; i++) {
        if (this.listeners[i].fn === fn) {
          this.listeners.splice(i, 1);
        }
      }

      this.resetListeners();
    }
  }, {
    key: "resetListeners",
    value: function resetListeners() {
      var _this4 = this;

      if (ipcRenderer) {
        //delete all listeners
        this.channels.forEach(function (channel) {
          return ipcRenderer.removeAllListeners(channel);
        });
        this.channels = []; //get all channels

        this.listeners.forEach(function (l) {
          if (_this4.channels.indexOf(l.channel) === -1) {
            _this4.channels.push(l.channel);
          }
        }); //recreate listeners

        this.channels.forEach(function (channel) {
          ipcRenderer.on(channel, function (evt, payload) {
            _this4.trigger(channel, evt, payload);
          });
        }); //play/stop messages

        ipcRenderer.on('change-play-state', function (evt, payload) {
          console.log('receive play state', payload);

          if (payload === true) {
            _this4.play();
          } else {
            _this4.stop();
          }
        }); //batch messages

        ipcRenderer.on('batch', function (evt, payload) {
          _this4.batch(evt, payload);
        });
      }
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(channel, payload) {
      if (ipcRenderer) {
        ipcRenderer.send('intercom', {
          channel: channel,
          payload: payload,
          to: 'editor'
        });
        console.log('send', channel, payload);
      }
    }
  }, {
    key: "startFrame",
    value: function startFrame() {}
  }, {
    key: "endFrame",
    value: function endFrame() {}
  }, {
    key: "nextFrame",
    value: function nextFrame() {
      //measure FPS
      this.startFrame(); //do user action

      if (this.fn.loop) {
        this.fn.loop();
      } //end of FPS measurement


      this.endFrame(); //Schedule next frame

      this.frameRequest = requestAnimationFrame(this.nextFrame);
    }
  }, {
    key: "play",
    value: function play() {
      this.stop();
      this.frameRequest = requestAnimationFrame(this.nextFrame);
      this.sendMessage('play');
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.frameRequest) {
        cancelAnimationFrame(this.frameRequest);
      }

      this.sendMessage('stop');
    }
  }, {
    key: "setup",
    value: function setup(fn) {
      this.fn.setup = fn;
      return this;
    }
  }, {
    key: "loop",
    value: function loop(fn) {
      this.fn.loop = fn;
      return this;
    }
  }]);

  return Client;
}();

exports.Client = Client;
},{"./plugins/layers":"plugins/layers.js","./plugins/seed":"plugins/seed.js","is-electron":"../node_modules/is-electron/index.js"}],"utils/slug.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var slug = function slug(str) {
  return str.replace(/\s/g, '-').replace(/[%()=:.,!#$@"'/\\|?*+&]/g, '').replace(/^-+|-+$/g, '').replace(/-+/g, '-').toLowerCase();
};

var _default = slug;
exports.default = _default;
},{}],"folder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Folder = void 0;

var _slug = _interopRequireDefault(require("./utils/slug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Folder =
/*#__PURE__*/
function () {
  function Folder(parent, label) {
    _classCallCheck(this, Folder);

    this.controls = [];
    this.slug = (0, _slug.default)(label);
    this.label = label; //Add to parent

    parent.GUI = parent.GUI || [];
    parent.GUI.push(this);

    for (var _len = arguments.length, controls = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      controls[_key - 2] = arguments[_key];
    }

    if (controls.length > 0) {
      this.addControls(controls);
    }
  }

  _createClass(Folder, [{
    key: "addControls",
    value: function addControls(controls) {
      var _this = this;

      controls.forEach(function (c) {
        return _this.addControl(c);
      });
    }
  }, {
    key: "addControl",
    value: function addControl(control) {
      this.controls.push(control);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        folder: true,
        slug: this.slug,
        label: this.label,
        controls: this.controls.map(function (c) {
          return c.toJSON();
        })
      };
    }
  }]);

  return Folder;
}();

exports.Folder = Folder;
},{"./utils/slug":"utils/slug.js"}],"layer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layer = void 0;

var _slug = _interopRequireDefault(require("./utils/slug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var slugs = [];

var ensureUnique = function ensureUnique(slug) {
  if (slugs.indexOf(slug) > -1) {
    var newName = slug;
    var i = 1;

    while (slugs.indexOf(newName) > -1) {
      newName = "".concat(slug, "-").concat(i);
      i = i + 1;
    }
  } else {
    return slug;
  }
};

var Layer =
/*#__PURE__*/
function () {
  function Layer(label) {
    _classCallCheck(this, Layer);

    this.label = label;
    this.slug = ensureUnique((0, _slug.default)(label));
    this.children = [];
    this.GUI = [];
  }

  _createClass(Layer, [{
    key: "add",
    value: function add(child) {
      this.children.push(child);
      return this;
    }
  }, {
    key: "addTo",
    value: function addTo(layer) {
      layer.add(this);
      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON(mapping) {
      var recursiveGenerate = function recursiveGenerate(layer, basePath) {
        var path = path ? "".concat(basePath, ".").concat(layer.slug) : layer.slug;

        if (mapping) {
          layer.GUI.map(function (f) {
            return f.controls.map(function (c) {
              return mapping.set("".concat(path, ".").concat(f.slug, ".").concat(c.key), c);
            });
          });
        }

        return {
          label: layer.label,
          slug: layer.slug,
          path: path,
          children: layer.children.map(function (c) {
            return recursiveGenerate(c, path);
          }),
          controls: layer.GUI.map(function (f) {
            return f.toJSON();
          })
        };
      }; // Get tree in json


      return recursiveGenerate(this);
    }
  }]);

  return Layer;
}();

exports.Layer = Layer;
},{"./utils/slug":"utils/slug.js"}],"control.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoolControl = exports.ColorControl = exports.FloatControl = exports.IntControl = exports.SelectionControl = exports.TextControl = exports.Control = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Control =
/*#__PURE__*/
function () {
  function Control(reference, key) {
    _classCallCheck(this, Control);

    this.type = 'text';
    this.reference = reference;
    this.key = key;
    this.label = key;
    this.options = {};
    this.initialValue = this.reference[this.key];
    return this;
  }
  /** Receive an updated value from the client */


  _createClass(Control, [{
    key: "setValue",
    value: function setValue(value) {
      this.reference[this.key] = value;
    }
    /** returns current value of controls */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.reference[this.key];
    }
    /** Value has been updated outside of the controls */

  }, {
    key: "update",
    value: function update() {} // TODO read & send value

    /** Reset to initial value */

  }, {
    key: "reset",
    value: function reset() {
      this.reference[this.key] = this.initialValue;
    }
    /** Sets the label for this control */

  }, {
    key: "label",
    value: function label(_label) {
      this.label = _label;
      return this;
    }
    /** Add to folder */

  }, {
    key: "addTo",
    value: function addTo(parent) {
      parent.addControl(this);
      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        type: this.type,
        key: this.key,
        label: this.label,
        options: this.options,
        value: this.getValue()
      };
    }
  }]);

  return Control;
}();

exports.Control = Control;
;

var TextControl =
/*#__PURE__*/
function (_Control) {
  _inherits(TextControl, _Control);

  function TextControl() {
    _classCallCheck(this, TextControl);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextControl).apply(this, arguments));
  }

  return TextControl;
}(Control);

exports.TextControl = TextControl;

var SelectionControl =
/*#__PURE__*/
function (_Control2) {
  _inherits(SelectionControl, _Control2);

  function SelectionControl(reference, key) {
    var _this;

    _classCallCheck(this, SelectionControl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectionControl).call(this, reference, key));
    _this.type = 'selectionBox';
    return _this;
  }

  _createClass(SelectionControl, [{
    key: "values",
    value: function values(_values) {
      this.options.values = _values;
      return this;
    }
  }, {
    key: "labels",
    value: function (_labels) {
      function labels() {
        return _labels.apply(this, arguments);
      }

      labels.toString = function () {
        return _labels.toString();
      };

      return labels;
    }(function () {
      this.options.labels = labels;
      return this;
    })
  }]);

  return SelectionControl;
}(Control);

exports.SelectionControl = SelectionControl;

var IntControl =
/*#__PURE__*/
function (_Control3) {
  _inherits(IntControl, _Control3);

  function IntControl(reference, key) {
    var _this2;

    _classCallCheck(this, IntControl);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(IntControl).call(this, reference, key));
    _this2.type = 'int';
    return _this2;
  }

  _createClass(IntControl, [{
    key: "stepSize",
    value: function stepSize(_stepSize) {
      this.options.stepSize = _stepSize;
      return this;
    }
  }]);

  return IntControl;
}(Control);

exports.IntControl = IntControl;

var FloatControl =
/*#__PURE__*/
function (_Control4) {
  _inherits(FloatControl, _Control4);

  function FloatControl(reference, key) {
    var _this3;

    _classCallCheck(this, FloatControl);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FloatControl).call(this, reference, key));
    _this3.type = 'float';
    _this3.options = {
      range: [0, 100],
      stepSize: 0
    };
    return _this3;
  }

  _createClass(FloatControl, [{
    key: "range",
    value: function range(start, end) {
      this.options.range = [start, end];
      return this;
    }
  }, {
    key: "stepSize",
    value: function stepSize(size) {
      this.options.stepSize = size;
      return this;
    }
  }]);

  return FloatControl;
}(Control);

exports.FloatControl = FloatControl;

var ColorControl =
/*#__PURE__*/
function (_Control5) {
  _inherits(ColorControl, _Control5);

  function ColorControl(reference, key) {
    var _this4;

    _classCallCheck(this, ColorControl);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ColorControl).call(this, reference, key));
    _this4.type = 'color';
    _this4.options = {
      alpha: false
    };
    return _this4;
  }

  _createClass(ColorControl, [{
    key: "alpha",
    value: function alpha(_alpha) {
      this.options.alpha = !!_alpha;
      return this;
    }
  }]);

  return ColorControl;
}(Control);

exports.ColorControl = ColorControl;

var BoolControl =
/*#__PURE__*/
function (_Control6) {
  _inherits(BoolControl, _Control6);

  function BoolControl(reference, key) {
    var _this5;

    _classCallCheck(this, BoolControl);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(BoolControl).call(this, reference, key));
    _this5.type = 'boolean';
    return _this5;
  }

  return BoolControl;
}(Control);

exports.BoolControl = BoolControl;
},{}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Controls", {
  enumerable: true,
  get: function () {
    return _client.Client;
  }
});
Object.defineProperty(exports, "Folder", {
  enumerable: true,
  get: function () {
    return _folder.Folder;
  }
});
Object.defineProperty(exports, "Layer", {
  enumerable: true,
  get: function () {
    return _layer.Layer;
  }
});
Object.defineProperty(exports, "Control", {
  enumerable: true,
  get: function () {
    return _control.Control;
  }
});
Object.defineProperty(exports, "TextControl", {
  enumerable: true,
  get: function () {
    return _control.TextControl;
  }
});
Object.defineProperty(exports, "SelectionControl", {
  enumerable: true,
  get: function () {
    return _control.SelectionControl;
  }
});
Object.defineProperty(exports, "IntControl", {
  enumerable: true,
  get: function () {
    return _control.IntControl;
  }
});
Object.defineProperty(exports, "FloatControl", {
  enumerable: true,
  get: function () {
    return _control.FloatControl;
  }
});
Object.defineProperty(exports, "ColorControl", {
  enumerable: true,
  get: function () {
    return _control.ColorControl;
  }
});
Object.defineProperty(exports, "BoolControl", {
  enumerable: true,
  get: function () {
    return _control.BoolControl;
  }
});

var _client = require("./client");

var _folder = require("./folder");

var _layer = require("./layer");

var _control = require("./control");
},{"./client":"client.js","./folder":"folder.js","./layer":"layer.js","./control":"control.js"}],"../node_modules/parcel/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53982" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel/lib/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.map