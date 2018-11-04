process.env.HMR_PORT=54039;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
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
})({"client.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = require("electron");

class Client {
  constructor(settings, render) {
    this.settings = settings; //add plugins

    this.plugins = (settings.plugins || []).map(P => new P(this, settings)); //run setup scripts

    let actions = [];
    this.plugins.forEach(async s => {
      if (s.setup) {
        const action = await s.setup(this);

        if (Array.isArray(action)) {}
      }
    }); //send message to front-end

    this.sendMessage('editor-loaded', true); //render on finish loading

    if (settings.render) {
      document.addEventListener('DOMContentLoaded', () => {
        settings.render(this);
      });
    } // listen to refreshes


    this.addListener('setup', () => this.setup());
  }

  async setup() {
    let actions = [];
    await this.plugins.forEach(async s => {
      if (s.setup) {
        const action = await s.setup(this); //added to list of actions

        if (Array.isArray(action)) {
          actions = actions.concat(action);
        } else {
          actions.push(action);
        }
      }
    }); //send message to front-end

    this.sendMessage('setup-response', {
      batch: actions
    });
  }

  addListener(channel, fn) {
    _electron.ipcRenderer.on(channel, fn);
  }

  removeListener(fn) {
    _electron.ipcRenderer.removeListener(channel, fn);
  }

  sendMessage(channel, payload) {
    _electron.ipcRenderer.send('intercom', {
      channel,
      payload,
      to: 'frame'
    });
  }

  refresh() {
    _electron.ipcRenderer.send('refresh');
  }

}

var _default = Client;
exports.default = _default;
},{}],"components/header.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Bar = _styledComponents.default.div.withConfig({
  displayName: "header__Bar",
  componentId: "qtbq1f-0"
})(["position:absolute;top:0;left:0;width:100%;height:46px;background:linear-gradient(to top,#363638,#404143);background:#0a0a0a;border-bottom:1px solid #222;box-sizing:border-box;padding:10px;display:flex;align-items:center;text-align:right;justify-content:space-between;-webkit-app-region:drag;"]);

const Left = _styledComponents.default.div.withConfig({
  displayName: "header__Left",
  componentId: "qtbq1f-1"
})(["display:flex;justify-content:flex-start;"]);

const Center = _styledComponents.default.div.withConfig({
  displayName: "header__Center",
  componentId: "qtbq1f-2"
})(["display:flex;justify-content:center;"]);

const Right = _styledComponents.default.div.withConfig({
  displayName: "header__Right",
  componentId: "qtbq1f-3"
})(["display:flex;justify-content:flex-end;"]);

const Header = props => _react.default.createElement(Bar, null, _react.default.createElement(Left, null, props.left), _react.default.createElement(Center, null, props.center), _react.default.createElement(Right, null, props.right));

var _default = Header;
exports.default = _default;
},{}],"components/sidebar.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "sidebar__Container",
  componentId: "sc-1eq9wp3-0"
})(["position:absolute;top:46px;left:0;bottom:0;width:250px;background:#111111;border-right:1px solid #262626;box-sizing:border-box;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;align-content:stretch;"]);

const Icons = _styledComponents.default.ul.withConfig({
  displayName: "sidebar__Icons",
  componentId: "sc-1eq9wp3-1"
})(["width:54px;height:100%;border-right:1px solid #262626;"]);

const Icon = _styledComponents.default.li.withConfig({
  displayName: "sidebar__Icon",
  componentId: "sc-1eq9wp3-2"
})(["width:54px;height:54px;&:before{content:'';display:block;position:relative;width:10px;height:10px;left:22px;top:22px;background:rgb(136,74,255);}"]);

const IconBar = props => _react.default.createElement(Icons, null, props.icons.map(icon => _react.default.createElement(Icon, {
  key: icon.name,
  icon: icon
})));

class Sidebar extends _react.Component {
  constructor(props, context) {
    super(props, context); // determine initial state

    const children = _react.default.Children.toArray(this.props.children);

    const firstItem = children[0].type.navigation;
    this.state = {
      active: firstItem.name
    }; // event binding

    this.setActivePanel = this.setActivePanel.bind(this);
  }

  setActivePanel(active) {
    this.setState({
      active
    });
  }

  render() {
    const children = _react.default.Children.toArray(this.props.children);

    const icons = children.map(c => c.type.navigation);
    const active = children.find(c => c.type.navigation.name === this.state.active);
    return _react.default.createElement(Container, null, _react.default.createElement(IconBar, {
      icons: icons,
      setActivePanel: this.setActivePanel
    }), active);
  }

}

var _default = Sidebar;
exports.default = _default;
},{}],"components/layout.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _header = _interopRequireDefault(require("./header"));

var _sidebar = _interopRequireDefault(require("./sidebar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class Layout extends _react.Component {
  hook(name, position) {
    const {
      plugins
    } = this.props.client;
    return plugins.map(p => {
      if (p[name]) {
        return p[name](position);
      }
    });
  }

  render() {
    return _react.default.createElement("div", null, _react.default.createElement(_header.default, {
      left: this.hook('header', 'left'),
      center: this.hook('header', 'center'),
      right: this.hook('header', 'right')
    }), _react.default.createElement(_sidebar.default, null, this.hook('sidebar')), this.hook('layout'));
  }

}

var _default = Layout;
exports.default = _default;
},{"./header":"components/header.jsx","./sidebar":"components/sidebar.jsx"}],"plugins/layers/with-layers.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.removeListener = exports.addListener = exports.setActiveLayer = exports.updateLayers = exports.refresh = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let layers = [];
let activeLayer = {};
const listeners = [];

const refresh = () => {
  listeners.forEach(l => l(layers, activeLayer));
};

exports.refresh = refresh;

const updateLayers = newLayers => {
  layers = newLayers;
  refresh();
};

exports.updateLayers = updateLayers;

const setActiveLayer = (layer, path) => {
  activeLayer = layer;
  refresh();
};

exports.setActiveLayer = setActiveLayer;

const addListener = fn => {
  listeners.push(fn);
};

exports.addListener = addListener;

const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

exports.removeListener = removeListener;

const withLayers = WrappedComponent => {
  var _class, _temp;

  return _temp = _class = class LayerProvider extends _react.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        layers
      };
      this.updateLayers = this.updateLayers.bind(this);
    }

    componentDidMount() {
      addListener(this.updateLayers);
    }

    componentWillUnmount() {
      removeListener(this.updateLayers);
    }

    updateLayers(layers, activeLayer) {
      this.setState({
        layers,
        activeLayer
      });
    }

    render() {
      const {
        layers,
        activeLayer
      } = this.state;
      return _react.default.createElement(WrappedComponent, _extends({
        layers: layers,
        activeLayer: activeLayer
      }, this.props));
    }

  }, _defineProperty(_class, "navigation", WrappedComponent.navigation), _temp;
};

var _default = withLayers;
exports.default = _default;
},{}],"plugins/layers/panel.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _withLayers = _interopRequireWildcard(require("./with-layers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Panel = _styledComponents.default.ul.withConfig({
  displayName: "panel__Panel",
  componentId: "sc-4o80h-0"
})(["width:100%;height:100%;"]);

const getBackgroundColor = (selected, i) => {
  if (selected) {
    return 'rgb(136,74,255,1)';
  } else {
    return i % 2 === 0 ? '#191919' : '#111111';
  }
};

const Item = _styledComponents.default.li.withConfig({
  displayName: "panel__Item",
  componentId: "sc-4o80h-1"
})(["position:relative;font-size:12px;line-height:42px;padding-left:", "px;color:white;list-style:none;background:", ";box-sizing:border-box;border-radius:", "px;font-weight:", ";"], props => (props.depth + 1) * 12, props => getBackgroundColor(props.selected, props.i), props => props.selected ? 3 : 0, props => props.selected ? 'bold' : 'normal');

class LayersPanel extends _react.Component {
  renderLayer(layers, layer, depth) {
    layers.push(_react.default.createElement(Item, {
      key: layer.path,
      depth: depth,
      i: layers.length,
      selected: this.props.activeLayer === layer,
      onClick: () => (0, _withLayers.setActiveLayer)(layer)
    }, layer.label));

    if (layer.children) {
      layer.children.forEach(l => this.renderLayer(layers, l, depth + 1));
    }
  }

  render() {
    const layers = [];
    this.props.layers.forEach(l => this.renderLayer(layers, l, 0));
    return _react.default.createElement(Panel, null, layers.map(layer => layer));
  }

}

_defineProperty(LayersPanel, "navigation", {
  name: 'layers',
  icon: ''
});

var _default = (0, _withLayers.default)(LayersPanel);

exports.default = _default;
},{"./with-layers":"plugins/layers/with-layers.jsx"}],"plugins/layers/layers.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _panel = _interopRequireDefault(require("./panel.jsx"));

var _withLayers = require("../layers/with-layers.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layers {
  constructor(client) {
    this.client = client;
    this.client.addListener('layers', (evt, payload) => this.setLayers(payload));
  }

  setLayers(layers) {
    (0, _withLayers.updateLayers)(layers);
  }

  setActiveLayer(layer) {
    (0, _withLayers.setActiveLayer)(layer);
  }

  sidebar() {
    return _react.default.createElement(_panel.default, {
      key: "layers"
    });
  }

}

var _default = Layers;
exports.default = _default;
},{"./panel.jsx":"plugins/layers/panel.jsx","../layers/with-layers.jsx":"plugins/layers/with-layers.jsx"}],"plugins/play-controls/with-play-state.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.removeListener = exports.addListener = exports.updatePlayState = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let play = false;
let listeners = [];

const updatePlayState = playing => {
  play = playing;
  listeners.forEach(l => l(play));
};

exports.updatePlayState = updatePlayState;

const addListener = fn => {
  listeners.push(fn);
};

exports.addListener = addListener;

const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

exports.removeListener = removeListener;

const withPlayState = WrappedComponent => class PlayStateProvider extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      play
    };
    this.updatePlayState = this.updatePlayState.bind(this);
  }

  componentDidMount() {
    addListener(this.updatePlayState);
  }

  componentWillUnmount() {
    removeListener(this.updatePlayState);
  }

  updatePlayState(play) {
    this.setState({
      play
    });
  }

  render() {
    const {
      play
    } = this.state;
    return _react.default.createElement(WrappedComponent, _extends({
      play: play
    }, this.props));
  }

};

var _default = withPlayState;
exports.default = _default;
},{}],"plugins/play-controls/bar.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _withPlayState = _interopRequireDefault(require("./with-play-state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "bar__Container",
  componentId: "sc-8pe30s-0"
})(["margin-left:80px;display:flex;flex-direction:row;"]);

const Button = _styledComponents.default.div.withConfig({
  displayName: "bar__Button",
  componentId: "sc-8pe30s-1"
})(["padding:3px 6px;border:1px solid rgb(136,74,255);color:rgb(136,74,255);display:block;text-align:center;user-select:none;font-size:12px;background:rgba(136,74,255,0.19);font-size:14px;&:first-of-type{border-radius:3px 0px 0px 3px;border-right:none;}&:last-of-type{border-radius:0px 3px 3px 0px;}"]);

const Play = (0, _styledComponents.default)(Button).withConfig({
  displayName: "bar__Play",
  componentId: "sc-8pe30s-2"
})([""]);
const Reload = (0, _styledComponents.default)(Button).withConfig({
  displayName: "bar__Reload",
  componentId: "sc-8pe30s-3"
})([""]);

class Bar extends _react.Component {
  render() {
    const play = this.props.play;
    const label = !play ? '>' : '| |';
    return _react.default.createElement(Container, null, _react.default.createElement(Play, {
      onClick: () => this.props.changeState(!play)
    }, label), _react.default.createElement(Reload, {
      onClick: () => this.props.refresh()
    }, "\u21BB"));
  }

}

var _default = (0, _withPlayState.default)(Bar);

exports.default = _default;
},{"./with-play-state":"plugins/play-controls/with-play-state.jsx"}],"plugins/play-controls/play-controls.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _withPlayState = require("./with-play-state.jsx");

var _bar = _interopRequireDefault(require("./bar.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayControls {
  constructor(client) {
    this.client = client;
    this.client.addListener('play', (evt, payload) => this.play());
    this.client.addListener('stop', (evt, payload) => this.stop());
  }

  play() {
    (0, _withPlayState.updatePlayState)(true);
  }

  stop() {
    (0, _withPlayState.updatePlayState)(false);
  }

  changeState(play) {
    this.client.sendMessage('change-play-state', play);
  }

  header(position) {
    if (position === 'left') {
      return _react.default.createElement(_bar.default, {
        changeState: p => this.changeState(p),
        refresh: () => this.client.refresh(),
        key: "play-controls"
      });
    }
  }

}

var _default = PlayControls;
exports.default = _default;
},{"./with-play-state.jsx":"plugins/play-controls/with-play-state.jsx","./bar.jsx":"plugins/play-controls/bar.jsx"}],"plugins/controls/with-controls.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _withLayers = require("../layers/with-layers");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const withControls = WrappedComponent => class ControlsProvider extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      controls: []
    };
    this.updateControls = this.updateControls.bind(this);
  }

  componentDidMount() {
    (0, _withLayers.addListener)(this.updateControls);
  }

  componentWillUnmount() {
    (0, _withLayers.removeListener)(this.updateControls);
  }

  updateControls(layers, activeLayer) {
    const hasControls = activeLayer && activeLayer.controls;
    const controls = hasControls ? activeLayer.controls : [];
    const path = hasControls ? activeLayer.path : '';
    this.setState({
      controls,
      path
    });
  }

  render() {
    const {
      controls,
      path
    } = this.state;
    return _react.default.createElement(WrappedComponent, _extends({
      controls: controls,
      path: path
    }, this.props));
  }

};

var _default = withControls;
exports.default = _default;
},{"../layers/with-layers":"plugins/layers/with-layers.jsx"}],"plugins/controls/components/styles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextBox = exports.Value = exports.Center = exports.Label = exports.Row = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Row = _styledComponents.default.div.withConfig({
  displayName: "styles__Row",
  componentId: "f686l0-0"
})(["position:relative;display:flex;padding:10px;flex-direction:row;align-items:stretch;border-bottom:1px solid #222;"]);

exports.Row = Row;

const Label = _styledComponents.default.div.withConfig({
  displayName: "styles__Label",
  componentId: "f686l0-1"
})(["display:flex;width:70px;font-size:11px;justify-content:flex-start;align-items:center;padding:0 3px;overflow:hidden;text-overflow:ellipsis;"]);

exports.Label = Label;

const Center = _styledComponents.default.div.withConfig({
  displayName: "styles__Center",
  componentId: "f686l0-2"
})(["display:flex;flex:1;align-items:center;justify-content:", ";font-size:12px;"], props => props.right ? 'flex-end' : 'flex-start');

exports.Center = Center;

const Value = _styledComponents.default.div.withConfig({
  displayName: "styles__Value",
  componentId: "f686l0-3"
})(["display:flex;width:30px;font-size:11px;justify-content:flex-start;align-items:center;padding-left:6px;"]);

exports.Value = Value;

const TextBox = _styledComponents.default.input.withConfig({
  displayName: "styles__TextBox",
  componentId: "f686l0-4"
})(["width:100%;background:#191919;color:#fff;border-radius:3px;border:none;padding:6px;"]);

exports.TextBox = TextBox;
},{}],"plugins/controls/components/text-control.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TextControl = props => {
  return _react.default.createElement(_styles.Row, null, _react.default.createElement(_styles.Label, null, props.label), _react.default.createElement(_styles.Center, null, _react.default.createElement(_styles.TextBox, {
    value: props.value,
    onChange: evt => {
      props.updateControl(evt.target.value);
    }
  })));
};

TextControl.type = 'text';
var _default = TextControl;
exports.default = _default;
},{"./styles":"plugins/controls/components/styles.js"}],"plugins/controls/components/float-control.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InputContainer = _styledComponents.default.div.withConfig({
  displayName: "float-control__InputContainer",
  componentId: "sc-6r93-0"
})(["position:relative;width:100%;height:20px;cursor:grab;background:rgba(100,100,100,0.1);"]);

const Slider = _styledComponents.default.input.withConfig({
  displayName: "float-control__Slider",
  componentId: "sc-6r93-1"
})(["position:absolute;top:0;left:0;width:100%;height:100%;-webkit-appearance:none;background:none;cursor:grab;&::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:2px;height:20px;background:rgb(136,74,255);cursor:grab;}&::-webkit-slider-runnable-track{height:20px;background:none;}&:focus{outline:none;}"]);

const Progress = _styledComponents.default.div.withConfig({
  displayName: "float-control__Progress",
  componentId: "sc-6r93-2"
})(["position:absolute;top:0;left:0;width:", "%;height:100%;background:rgba(136,74,255,0.2);cursor:grab;"], props => props.progress);

const FloatControl = props => {
  const {
    value,
    options,
    updateControl
  } = props;
  const {
    range,
    stepSize
  } = options;
  const progress = (value - parseInt(range[0])) * 100 / (parseInt(range[1]) - parseInt(range[0]));
  const extent = Math.abs(parseInt(range[1]) - parseInt(range[0]));
  const step = stepSize === 0 ? extent / 100 : stepSize;
  return _react.default.createElement(_styles.Row, null, _react.default.createElement(_styles.Label, null, props.label), _react.default.createElement(_styles.Center, null, _react.default.createElement(InputContainer, null, _react.default.createElement(Progress, {
    progress: progress
  }), _react.default.createElement(Slider, {
    value: value,
    onChange: evt => {
      updateControl(+evt.target.value);
    },
    type: "range",
    min: parseInt(range[0]),
    max: parseInt(range[1]),
    step: step
  }))), _react.default.createElement(_styles.Value, null, props.value));
};

FloatControl.type = 'float';
var _default = FloatControl;
exports.default = _default;
},{"./styles":"plugins/controls/components/styles.js"}],"plugins/controls/components/color-control.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _rcColorPicker = _interopRequireDefault(require("rc-color-picker"));

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Color = _styledComponents.default.div.withConfig({
  displayName: "color-control__Color",
  componentId: "sc-18i079l-0"
})(["margin-right:6px;opacity:0.5;"]);

const componentToHex = c => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = color => {
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
};

const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgba = c => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;

const normaliseColor = color => {
  return {
    r: color.r * 255,
    g: color.g * 255,
    b: color.b * 255,
    a: color.a
  };
};

const ColorControl = props => {
  const {
    value,
    options,
    label,
    updateControl
  } = props;
  const {
    alpha
  } = options;
  const normalised = normaliseColor(value);
  const color = alpha ? rgba(normalised) : rgbToHex(normalised);
  return _react.default.createElement(_styles.Row, null, _react.default.createElement(_styles.Label, null, label), _react.default.createElement(_styles.Center, {
    right: true
  }, _react.default.createElement(Color, null, color), _react.default.createElement(_rcColorPicker.default, {
    color: rgbToHex(normalised),
    alpha: value.a,
    onChange: c => {
      const rgb = hexToRgb(c.color);

      if (alpha) {
        rgb.a = c.alpha / 100;
      }

      rgb.r = rgb.r / 255;
      rgb.g = rgb.g / 255;
      rgb.b = rgb.b / 255;
      updateControl(rgb);
    },
    placement: "bottomRight",
    enableAlpha: alpha
  })));
};

ColorControl.type = 'color';
var _default = ColorControl;
exports.default = _default;
},{"./styles":"plugins/controls/components/styles.js"}],"plugins/controls/components/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getControl = exports.addControl = void 0;

var _textControl = _interopRequireDefault(require("./text-control.jsx"));

var _floatControl = _interopRequireDefault(require("./float-control.jsx"));

var _colorControl = _interopRequireDefault(require("./color-control.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const controls = [_textControl.default, _floatControl.default, _colorControl.default];

const addControl = c => controls.push(c);

exports.addControl = addControl;

const getControl = name => controls.find(c => name === c.type);

exports.getControl = getControl;
},{"./text-control.jsx":"plugins/controls/components/text-control.jsx","./float-control.jsx":"plugins/controls/components/float-control.jsx","./color-control.jsx":"plugins/controls/components/color-control.jsx"}],"plugins/controls/control.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _components = require("./components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Wrapper = _styledComponents.default.div.withConfig({
  displayName: "control__Wrapper",
  componentId: "sc-1jr6jv2-0"
})(["position:relative;overflow:hidden;"]);

const Hitbox = _styledComponents.default.div.withConfig({
  displayName: "control__Hitbox",
  componentId: "sc-1jr6jv2-1"
})(["position:absolute;left:0;top:0;width:10px;height:100%;z-index:3;"]);

const Indicator = _styledComponents.default.div.withConfig({
  displayName: "control__Indicator",
  componentId: "sc-1jr6jv2-2"
})(["position:absolute;width:3px;height:100%;left:0;top:0;background:", ";"], props => props.changed ? 'rgb(136, 74, 255)' : 'none');

const Reset = _styledComponents.default.div.withConfig({
  displayName: "control__Reset",
  componentId: "sc-1jr6jv2-3"
})(["position:absolute;width:30px;height:100%;left:0;top:0;background:rgb(136,74,255);transform:translateX(-100%);display:", ";transition:transform 0.2s ease;justify-content:center;align-items:center;font-size:11px;cursor:pointer;", ":hover &{transform:translateX(0);}"], props => props.changed ? 'flex' : 'none', Hitbox);

class Control extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      original: props.control.value,
      value: props.control.value
    };
    this.updateControl = this.updateControl.bind(this);
  }

  updateControl(value) {
    this.setState({
      value
    });
    const {
      control,
      path
    } = this.props;
    const cPath = `${path}.${control.key}`;
    this.props.updateControl(cPath, value);
  }

  reset() {
    this.updateControl(this.state.original);
  }

  render() {
    const {
      control
    } = this.props;
    const {
      value,
      original
    } = this.state;
    const CustomControl = (0, _components.getControl)(control.type);
    const changed = original !== value;

    if (!CustomControl) {
      return _react.default.createElement("div", null, "control not found: ", control.type);
    }

    return _react.default.createElement(Wrapper, null, _react.default.createElement(Hitbox, {
      onClick: () => this.reset()
    }, _react.default.createElement(Reset, {
      changed: changed
    }, "\u21BB"), _react.default.createElement(Indicator, {
      changed: changed
    })), _react.default.createElement(CustomControl, _extends({}, control, {
      value: value,
      updateControl: this.updateControl,
      changed: changed
    })));
  }

}

var _default = Control;
exports.default = _default;
},{"./components":"plugins/controls/components/index.js"}],"plugins/controls/panel.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _withControls = _interopRequireDefault(require("./with-controls"));

var _control = _interopRequireDefault(require("./control.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "panel__Container",
  componentId: "un80l3-0"
})(["position:absolute;top:46px;right:0;bottom:0;width:225px;background:#111111;border-left:1px solid #262626;box-sizing:border-box;color:white;overflow:auto;"]);

const Folder = _styledComponents.default.div.withConfig({
  displayName: "panel__Folder",
  componentId: "un80l3-1"
})(["margin-bottom:24px;"]);

const FolderLabel = _styledComponents.default.div.withConfig({
  displayName: "panel__FolderLabel",
  componentId: "un80l3-2"
})(["font-size:12px;font-weight:bold;padding:10px 16px;background:#191919;color:#d4d4d4;"]);

const ControlList = _styledComponents.default.div.withConfig({
  displayName: "panel__ControlList",
  componentId: "un80l3-3"
})([""]);

class ControlsPanel extends _react.Component {
  renderFolder(folder) {
    const path = `${this.props.path}.${folder.slug}`;
    return _react.default.createElement(Folder, {
      key: path
    }, _react.default.createElement(FolderLabel, null, folder.label), _react.default.createElement(ControlList, null, folder.controls.map(c => _react.default.createElement(_control.default, {
      control: c,
      path: path,
      updateControl: this.props.updateControl
    }))));
  }

  render() {
    const {
      controls
    } = this.props;
    return _react.default.createElement(Container, null, controls.map(f => this.renderFolder(f)));
  }

}

var _default = (0, _withControls.default)(ControlsPanel);

exports.default = _default;
},{"./with-controls":"plugins/controls/with-controls.js","./control.jsx":"plugins/controls/control.jsx"}],"plugins/controls/controls.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _panel = _interopRequireDefault(require("./panel.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Controls {
  constructor(client) {
    this.client = client;
    this.changelog = new Map();
    this.updateControl = this.updateControl.bind(this);
  }

  setup() {
    const updates = []; // batch updates to controls containing initial values

    this.changelog.forEach((value, path) => {
      updates.push({
        channel: 'control-set-value',
        payload: {
          value,
          path
        }
      });
    });
    return updates;
  }

  layout() {
    return _react.default.createElement(_panel.default, {
      updateControl: this.updateControl
    });
  }

  updateControl(path, value) {
    this.client.sendMessage('control-set-value', {
      path,
      value
    });
    this.changelog.set(path, value);
  }

}

var _default = Controls;
exports.default = _default;
},{"./panel.jsx":"plugins/controls/panel.jsx"}],"plugins/seed/with-seed.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.removeListener = exports.addListener = exports.updateSeed = exports.getSeed = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let seed = 0;
let listeners = [];

const getSeed = print => {
  return print ? String(seed).replace('0.') : seed;
};

exports.getSeed = getSeed;

const updateSeed = newSeed => {
  seed = newSeed;
  listeners.forEach(l => l(seed));
};

exports.updateSeed = updateSeed;

const addListener = fn => {
  listeners.push(fn);
};

exports.addListener = addListener;

const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

exports.removeListener = removeListener;

const withSeed = WrappedComponent => class SeedProvider extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      seed
    };
    this.updateSeed = this.updateSeed.bind(this);
  }

  componentDidMount() {
    addListener(this.updateSeed);
  }

  componentWillUnmount() {
    removeListener(this.updateSeed);
  }

  updateSeed(seed) {
    this.setState({
      seed
    });
  }

  render() {
    const {
      seed
    } = this.state;
    return _react.default.createElement(WrappedComponent, _extends({
      seed: seed
    }, this.props));
  }

};

var _default = withSeed;
exports.default = _default;
},{}],"plugins/seed/bar.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _withSeed = _interopRequireDefault(require("./with-seed"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "bar__Container",
  componentId: "zwjrc9-0"
})(["padding:3px;border:1px solid rgb(136,74,255);border-radius:3px;color:rgb(136,74,255);display:inline-block;min-width:50px;text-align:center;user-select:none;font-size:12px;"]);

const truncate = (string, max) => {
  return string.length > max ? string.substring(0, max) + '...' : string;
};

class Bar extends _react.Component {
  render() {
    const seed = String(this.props.seed).replace('0.', '');
    return _react.default.createElement(Container, {
      onClick: () => this.props.refresh()
    }, "seed: ", truncate(seed, 5));
  }

}

var _default = (0, _withSeed.default)(Bar);

exports.default = _default;
},{"./with-seed":"plugins/seed/with-seed.jsx"}],"plugins/seed/seed.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _withSeed = require("./with-seed.jsx");

var _bar = _interopRequireDefault(require("./bar.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Seed {
  constructor(client) {
    this.client = client;
    this.client.addListener('seed', (evt, payload) => this.setSeed(payload));
  }

  setSeed(seed) {
    (0, _withSeed.updateSeed)(seed);
  }

  refresh() {
    this.client.sendMessage('generate-seed');
    console.log('refresh');
  }

  header(position) {
    if (position === 'right') {
      return _react.default.createElement(_bar.default, {
        key: "seed",
        refresh: () => this.refresh()
      });
    }
  }

}

var _default = Seed;
exports.default = _default;
},{"./with-seed.jsx":"plugins/seed/with-seed.jsx","./bar.jsx":"plugins/seed/bar.jsx"}],"plugins/page-information/with-page-info.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.removeListener = exports.addListener = exports.updateInfo = exports.getInfo = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let info = {};
let listeners = [];

const getInfo = () => {
  return info;
};

exports.getInfo = getInfo;

const updateInfo = newInfo => {
  info = newInfo;
  listeners.forEach(l => l(info));
};

exports.updateInfo = updateInfo;

const addListener = fn => {
  listeners.push(fn);
};

exports.addListener = addListener;

const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

exports.removeListener = removeListener;

const withPageInfo = WrappedComponent => class PageInfoProvider extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      info
    };
    this.updateInfo = this.updateInfo.bind(this);
  }

  componentDidMount() {
    addListener(this.updateInfo);
  }

  componentWillUnmount() {
    removeListener(this.updateInfo);
  }

  updateInfo(info) {
    this.setState({
      info
    });
  }

  render() {
    const {
      info
    } = this.state;
    return _react.default.createElement(WrappedComponent, _extends({
      info: info
    }, this.props));
  }

};

var _default = withPageInfo;
exports.default = _default;
},{}],"plugins/page-information/title.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _withPageInfo = _interopRequireDefault(require("./with-page-info"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "title__Container",
  componentId: "sc-1w1dpgx-0"
})(["font-size:12px;font-weight:bold;color:#eee;min-width:50px;"]);

const truncate = (string, max) => {
  return string.length > max ? string.substring(0, max) + '...' : string;
};

class Title extends _react.Component {
  render() {
    const {
      title,
      nodeEnv
    } = this.props.info;
    const display = title && title.length > 0 ? `${truncate(title || '', 25)} (${nodeEnv})` : 'no page loaded';
    console.log('title', title);
    return _react.default.createElement(Container, null, display);
  }

}

var _default = (0, _withPageInfo.default)(Title);

exports.default = _default;
},{"./with-page-info":"plugins/page-information/with-page-info.jsx"}],"plugins/page-information/page-information.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _withPageInfo = require("./with-page-info.jsx");

var _title = _interopRequireDefault(require("./title.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Seed {
  constructor(client) {
    this.client = client;
    this.client.addListener('page-information', (evt, payload) => this.setPageInfo(payload));
  }

  setPageInfo(seed) {
    (0, _withPageInfo.updateInfo)(seed);
  }

  refresh() {
    this.client.sendMessage('generate-seed');
    console.log('refresh');
  }

  header(position) {
    if (position === 'center') {
      return _react.default.createElement(_title.default, {
        key: "title"
      });
    }
  }

}

var _default = Seed;
exports.default = _default;
},{"./with-page-info.jsx":"plugins/page-information/with-page-info.jsx","./title.jsx":"plugins/page-information/title.jsx"}],"plugins/screenshots/bar.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div.withConfig({
  displayName: "bar__Container",
  componentId: "p1ucog-0"
})(["margin-left:12px;display:flex;flex-direction:row;"]);

const Button = _styledComponents.default.div.withConfig({
  displayName: "bar__Button",
  componentId: "p1ucog-1"
})(["padding:3px 6px;border:1px solid rgb(136,74,255);color:rgb(136,74,255);display:block;text-align:center;user-select:none;font-size:12px;background:rgba(136,74,255,0.19);font-size:14px;border-radius:3px;"]);

class Bar extends _react.Component {
  render() {
    const play = this.props.play;
    const label = !play ? '>' : '| |';
    return _react.default.createElement(Container, null, _react.default.createElement(Button, {
      onClick: () => this.props.takeScreenshot()
    }, "sc"));
  }

}

var _default = Bar;
exports.default = _default;
},{}],"plugins/screenshots/panel.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import withLayers, { setActiveLayer } from './with-layers';
const Panel = _styledComponents.default.ul.withConfig({
  displayName: "panel__Panel",
  componentId: "lgjr1i-0"
})(["width:100%;height:100%;"]);

class ScreenshotsPanel extends _react.Component {
  render() {
    return _react.default.createElement(Panel, null, "screenshots here");
  }

}

_defineProperty(ScreenshotsPanel, "navigation", {
  name: 'screenshots',
  icon: ''
});

var _default = ScreenshotsPanel;
exports.default = _default;
},{}],"plugins/screenshots/screenshots.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _bar = _interopRequireDefault(require("./bar.jsx"));

var _panel = _interopRequireDefault(require("./panel.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Screenshots {
  constructor(client) {
    this.client = client;
  }

  takeScreenshot() {//tos
  }

  header(position) {
    if (position === 'left') {
      return _react.default.createElement(_bar.default, {
        takeScreenshot: p => this.takeScreenshot(p),
        key: "screenshot-control"
      });
    }
  }

  sidebar() {
    return _react.default.createElement(_panel.default, {
      key: "layers"
    });
  }

}

var _default = Screenshots;
exports.default = _default;
},{"./bar.jsx":"plugins/screenshots/bar.jsx","./panel.jsx":"plugins/screenshots/panel.jsx"}],"electron.jsx":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _client = _interopRequireDefault(require("./client"));

var _layout = _interopRequireDefault(require("./components/layout"));

var _layers = _interopRequireDefault(require("./plugins/layers/layers"));

var _playControls = _interopRequireDefault(require("./plugins/play-controls/play-controls"));

var _controls = _interopRequireDefault(require("./plugins/controls/controls"));

var _seed = _interopRequireDefault(require("./plugins/seed/seed"));

var _pageInformation = _interopRequireDefault(require("./plugins/page-information/page-information"));

var _screenshots = _interopRequireDefault(require("./plugins/screenshots/screenshots"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const settings = {
  plugins: [_pageInformation.default, _seed.default, _layers.default, _playControls.default, _controls.default, _screenshots.default],
  render: client => {
    _reactDom.default.render(_react.default.createElement(_layout.default, {
      client: client
    }), document.getElementById('root'));
  }
}; // Create client

const client = new _client.default(settings);
},{"./client":"client.js","./components/layout":"components/layout.jsx","./plugins/layers/layers":"plugins/layers/layers.jsx","./plugins/play-controls/play-controls":"plugins/play-controls/play-controls.jsx","./plugins/controls/controls":"plugins/controls/controls.jsx","./plugins/seed/seed":"plugins/seed/seed.jsx","./plugins/page-information/page-information":"plugins/page-information/page-information.jsx","./plugins/screenshots/screenshots":"plugins/screenshots/screenshots.jsx"}],"../node_modules/parcel/lib/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
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
      }
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

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
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
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
    return hmrAccept(global.parcelRequire, id)
  });
}

},{}]},{},["../node_modules/parcel/lib/builtins/hmr-runtime.js","electron.jsx"], null)
//# sourceMappingURL=electron.74c80707.map