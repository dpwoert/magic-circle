# Creative Controls

## Requirements
- Mac OSX (Windows and Linux versions will come later)
- NodeJS
- Npm or Yarn

## Install
Install the packages needed locally by using npm or yarn.
```sh
$ npm install @creative-controls/client --save
$ npm install @creative-controls/editor --save-dev
```

If you're not using a package manager for your project it is also possible to install the shell to run the editor globally.
```sh
$ npm install @creative-controls/editor -g
```

## Load front-end
```js
// ES5
// <script type="text/javascript" src="controls.min.js"></script>
var controls = window.controls;

// CommonJS:
const { Controls, Layer, NumberControl } = require('@creative-controls/client');

// ES6:
import { Controls, Layer, NumberControl } from '@creative-controls/client';

// Create instance of Creative Controls
const controls = new Controls();

controls
  .setup(gui => {

    // Create layer
    const layer = new Layer('Main');

    // Add folder with controls
    layer3.folder(
      'Position',
      new NumberControl(obj3d, 'x').range(-100, 100),
      new NumberControl(obj3d, 'y').range(-100, 100),
      new NumberControl(obj3d, 'z').range(-100, 100),
    );

    // Add layer to UI
    gui.addLayer(layer);

  })
  .loop(() => {
    // this code will run every frame
  });
```

## Run
```sh
# run with default config, loading index.html as page
$ controls

# run with default config, loading a custom local file path
$ controls --url dist/index.html

# run with custom config, and loading a custom local file path
$ controls --config controls.config.js --url dist/index.html

# run with custom config, and loading a custom url path
$ controls --config controls.config.js --url http://localhost:3000
```

## Settings file
```js
module.exports = {
  // Load list of plugins, first argument is the default list of plugins
  // This list can be filtered and extended with custom plugins.
  plugins: defaultPlugins => [...defaultPlugins],

  // Load custom controls
  controls: defaultControls => [...defaultControls],

  // In case you need to overwrite the standard render function.
  // On default this will render the editor in React
  render: client => { ... },

  // Theming settings
  theme: {
    dark: true,
    accent: 'rgb(136, 74, 255)',
  },

  screen: {
    // Size of screen on load, on default will load with saved size of window
    size: {
      width: 1400,
      height: 768,
    },

    // Enables resizing of window
    enableResize: true,

    // Enables resizing of window to be larger than the size of the screen
    enableLargerThanScreen: false,

    // When enabled prevents sleeping of display
    preventSleep: false,
  },

  // Look at plugin folders for settings of individual plugins
  ...
}
```

## Creating custom plugins
See `docs/creating-plugin.md`
