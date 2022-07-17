# Quick start

## Setup your own development setup

To work with Magic Circle you will first need to setup your own development environment. This can be just a folder with some html/js files but also a fully fledged setup with for example webpack. Magic Circle tries to be agnostic and flexible to how you run your projects. Magic Circle is seperate from your project and embeds your page via a frame.

## Install

Install the packages needed locally by using npm or yarn. There are two main packages; the client and the editor. The client is the package you add to your project. The editor allows you to build the UI.

```sh
$ npm install @magic-circle/client --save
$ npm install @magic-circle/editor --save-dev
```

If you're not using a package manager for your project it is also possible to install the shell to run the editor globally and use a CDN like unpkg to load the client.

```sh
$ npm install @magic-circle/editor -g
```

If using all the default settings for the editor, it is not needed to install the editor you can just use the online playground.

[Playground](https://playground.magic-circle.dev/)

## Add UI to your project files

To interact with the UI you need to create a `Magic Circle` instance inside your project.

```js
// ES5
// <script type="text/javascript" src="https://unpkg.com/@magic-circle/client/dist/magic-circle.min.js"></script>
const { MagicCircle, Layer, NumberControl }  = window.magicCircle;

// CommonJS:
const { MagicCircle, Layer, NumberControl } = require('@magic-circle/client');

// ES6:
import {
  MagicCircle,
  Layer,
  Folder,
  NumberControl,
  ColorControl,
} from '@magic-circle/client';

// Create instance of Magic Circle client
const magic = new MagicCircle();

magic
  .setup((gui) => {
    // Create layer and add this to the main layer (gui.layer)
    const layer = new Layer('Main').addTo(gui.layer);

    // Create sublayer
    const sublayer = new Layer('child').addTo(layer);

    // Add folder with controls
    const folder = new Folder('Position').addTo(subLayer);
    folder.add([
      new NumberControl(obj3d, 'x').range(-100, 100),
      new NumberControl(obj3d, 'y').range(-100, 100),
      new NumberControl(obj3d, 'z').range(-100, 100),
    ]);

    // Add control without folder
    sublayer.add(new ColorControl(obj3d, 'color'));
  })
  .loop((delta) => {
    // this code will run every frame
  })
  // auto start
  .start();
```

## Settings file

To create your version of magic circle, a settings file is needed. To do see create a new file called `magic.config.js` in the root of your folder. It is also possible to run `npx magic init`.

```js
export default {
  // The url to load
  url: 'http://localhost:4000',

  // Url dependendent on building locally (dev = true) or build for deployment
  url: (dev) =>
    dev ? 'http://localhost:4000' : 'https://website.com/visualistion',

  // Load list of plugins, first argument is the default list of plugins
  // This list can be filtered and extended with custom plugins.
  plugins: (defaultPlugins) => [...defaultPlugins],

  // Load custom controls
  controls: (defaultControls) => [...defaultControls],

  // Read plugin pages for specific settings
  settings: {},
};
```

## Run UI locally

To run a server with Magic Server locally the following commands can be used:

```sh
# run with default config (magic.config.js)
$ magic

# run with custom config
$ magic --config custom.config.js

# if not running via a package.json make sure to use npx:
$ npx magic
```

## Build & Deploy

It is possible to create a static distribution of the UI that can be deployed to wherever (for example via CI/CD) by running the following command:

```sh
$ magic build
```

After building is completed the bundle will be available in the `magic-circle` folder,
