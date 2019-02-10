'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var styled = require('styled-components');
var styled__default = _interopDefault(styled);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const Container = styled__default.div.withConfig({
  displayName: "bar__Container",
  componentId: "chf4n0-0"
})(["margin-left:12px;display:flex;flex-direction:row;"]);
const Button = styled__default.div.withConfig({
  displayName: "bar__Button",
  componentId: "chf4n0-1"
})(["border:1px solid ", ";display:block;text-align:center;user-select:none;font-size:12px;", " font-size:14px;width:25px;height:25px;border-radius:3px;fill:", ";display:flex;justify-content:center;align-items:center;svg{width:70%;height:auto;}"], props => props.theme.accent, ''
/* background: rgba(136, 74, 255, 0.19); */
, props => props.theme.accent);

const Bar = props => {
  const Icon = props.theme.icons.Debug;
  return React.createElement(Container, null, React.createElement(Button, {
    onClick: () => props.toggleDebugger()
  }, React.createElement(Icon, null)));
};

var Bar$1 = styled.withTheme(Bar);

class Debug {
  constructor(client) {
    this.client = client;
  }

  electron() {
    return `${'/Users/dpwoert/projects/creative-controls/plugins/debug/src'}/electron.js`;
  }

  header(position) {
    if (position === 'left') {
      return React.createElement(Bar$1, {
        toggleDebugger: () => this.devTools(),
        key: "debugger-control"
      });
    }

    return false;
  }

  devTools() {
    const mode = this.client.getSetting('debug.devTools');
    this.client.sendAction('dev-tools', {
      mode
    });
  }

}

_defineProperty(Debug, "name", 'debug');

_defineProperty(Debug, "electronOnly", true);

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug],
};
