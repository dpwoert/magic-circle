# Magic Circle

This is my attempt of creating a tool for my creative development needs. It's a multifunctional editor inspired by tools like dat.GUI, Unity and Framer. With this tool I want to enable and promote playfulness and collaboration in creative technology. You don't need to be a coder to improve a piece of creative tech. In fact collaborating with different disciplines might (will!) improve creative tech projects.

<sub><sup>I named this tool **Magic Circle**, which is the place where _play_ takes place. In this place the normal rules and reality that guard normal life are suspended. [Read more here](https://uxdesign.cc/why-play-can-improve-the-interdisciplinary-collaboration-in-your-team-8d7fd1ce32f8)</sub></sup>

![screenshot here](https://raw.github.com/dpwoert/magic-circle/develop/docs/assets/screenshot.png)

## Features

- **🎛 Custom controls** Enables you to play around with variables. All controls are configurable and adaptable to play nicely with most data sources.

- **👁‍🗨 Layers** Layers are used to organise all these controls and can mimic the 'scene graph'.

- **📦 Presets & Seeding** Enables you to create the exact same scene by saving the values of your controls and the _seeding_ value. When a page is reloaded, the last preset is being reapplied.

- **📸 Screenshots** Take screenshots easily and in high quality. Together with a screenshot, the current preset and seed is saved and can be loaded by loading that screenshot. Will also save the current git state, so you can always reproduce that screenshot, even if your code has changed.

- **🎥 Screen recordings** Render your content into a screen recording by exporting it frame by frame. Enabling you to export videos in high quality without loss of quality like for example a Quicktime recording would.

- **⏲ Performance measurement** Measures and displays performance metrics like Frames Per Second and memory usage.

- **👐 Touch Bar** Enables you to trigger quick actions and view a live Frames per Second meter.

- **🛠 Custom plugins** Since all projects are unique, some projects need custom plugins that might not exists yet. Make your own if needed.

- **🌈 Theming** It is possible and easy to change some colours around.

- **🧩 Stand-alone** So you won't need the CLI anymore and can share this app with others.

## Roadmap

- **⛓ THREEjs helpers** Automatically create controls based upon the THREE.js scene graph.

- **🎹 MIDI** Use a MIDI controller to play around with your variables.

- **🎛 More advanced custom controls** More controls types, like setting images for textures and easing controls.

- **⏰ Animation timeline** Create an animation timeline where variables can be key-framed.

## Requirements

- Mac OSX (Windows and Linux versions might come later)
- NodeJS
- Npm or Yarn

## Install

Install the packages needed locally by using npm or yarn.

```sh
$ npm install @magic-circle/client --save
$ npm install @magic-circle/editor --save-dev
```

If you're not using a package manager for your project it is also possible to install the shell to run the editor globally.

```sh
$ npm install @magic-circle/editor -g
```

## Load front-end

```js
// ES5
// <script type="text/javascript" src="controls.min.js"></script>
var controls = window.controls;

// CommonJS:
const { Controls, Layer, NumberControl } = require('@magic-circle/client');

// ES6:
import { Controls, Layer, NumberControl } from '@magic-circle/client';

// Create instance of Magic Circle client
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
      new NumberControl(obj3d, 'z').range(-100, 100)
    );

    // Add layer to UI
    gui.addLayer(layer);
  })
  .loop(delta => {
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
export default {
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
    dark: true, //(WIP)
    accent: 'rgb(136, 74, 255)',
  },

  // Stops maintaining state when refreshing
  noHydrate: false,

  screen: {
    // Size of screen on load, on default will load with saved size of window
    size: {
      width: 1400,
      height: 768,
    },

    // Save window size on resize
    saveSize: true

    // Enables resizing of window
    enableResize: true,

    // Enables resizing of window to be larger than the size of the screen
    enableLargerThanScreen: false,

    // When enabled prevents sleeping of display
    preventSleep: false,

    // Hide editor so only
    hideEditor: false,
  },

  // Look at plugin folders for settings of individual plugins
  ...
}
```

## Examples

To run examples:

```sh
# copy repo and open
git clone https://github.com/dpwoert/magic-circle.git && cd magic-circle

# install dependencies
npm run setup:dev

# run examples
npm run example [name]
npm run example simple
npm run example custom-plugin
```

## Core plugins

- **magic-circle/controls** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/controls))
- **magic-circle/debug** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/debug))
- **magic-circle/fullscreen** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/fullscreen))
- **magic-circle/layers** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/layers))
- **magic-circle/page-information** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/page-information))
- **magic-circle/performance** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/performance))
- **magic-circle/play-controls** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/play-controls))
- **magic-circle/screenshots** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/screenshots))
- **magic-circle/seed** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/seed))
- **magic-circle/touchbar** ([readme](https://github.com/dpwoert/magic-circle/tree/develop/plugins/touchbar))

## Creating custom plugins

See `docs/creating-plugin.md`
