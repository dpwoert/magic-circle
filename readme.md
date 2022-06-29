# ![Logo of Magic Circle](https://raw.github.com/dpwoert/magic-circle/develop/docs/assets/logo.png)

This is my attempt of creating a tool for my creative development needs. It's a multifunctional editor inspired by tools like dat.GUI, Unity and Framer. It basically works as StorybookJS but then for creative coding. It is a very small bit of code (~5kb, no external dependencies) to add to a project but it allows you to use a fully extensible editor.

The aim of this editor is not only to allow for easier and quicker development but also to promote collaboration and playfulness inside teams. Everyone should be able to play with the tech you make and add a meaningful contribution. You don't need to be a coder to improve a piece of creative tech. With this tool, people can play and share their results.

I named this tool **Magic Circle**, which according to Huizinga (Homo Ludens, 1938) is the place where _play_ takes place. A place whereby the rules and reality that guard normal life have been suspended ([read more here](https://uxdesign.cc/why-play-can-improve-the-interdisciplinary-collaboration-in-your-team-8d7fd1ce32f8)).

![screenshot of magic circle](https://raw.github.com/dpwoert/magic-circle/develop/docs/assets/screenshot.png)

## Online demo

An online demo environment can be found [here](https://magic-circle.dev/).

## Features

**🎛 Custom controls** Enables you to play around with variables. All controls are configurable and adaptable to play nicely with most data sources.

**👁‍🗨 Layers** Layers are used to organise all these controls. This can, for example, mimic the 'scene graph'.

**📦 Presets & Seeding** Enables you to create the exact same scene by saving the values of your controls and the _seeding_ value. When a page is reloaded, the last preset is being reapplied.

**🐥 Small client** The editor and your project run in two different frames. This means the client code is very very small since all the heavy lifting is done inside the editor frame. The editor code won't even be bundled with your project. If you load your project outside of magic circle, it will just work as-asual.

**📸 Screenshots** Take screenshots easily and in high-quality. Together with a screenshot, the current preset is saved. This means you can recreate that screenshot again. Especially since the current git state is also being stored, you can go back in time to re-create old presets.

**🎥 Screen recordings** Render your content into a screen recording by exporting it frame by frame. Enabling you to export videos in high quality without loss of quality like for example a manual screen recording would.

**⏲ Performance measurement** Measures and displays performance metrics like Frames Per Second and memory usage.

**🛠 Custom plugins** Since all projects are unique, some projects need custom plugins that might not exists yet. Make your own if needed.

**🚀 Deploy** Build and deploy your setup so you can share it with others in your team.

## Roadmap

**🐞 Bug fixes and refactoring etc** This is just a first beta version to test if things are wokring. There are obviously many bugs and things that can be improved.

**⛓ Helpers** Helper functions for framework/liberies that make life easier. For example for React, P5 and ThreeJS.

**🎹 MIDI** Use a MIDI controller to play around with your variables.

**🎛 More advanced custom controls** More controls types, like setting images for textures and easing controls.

**⏰ Animation timeline** Create an animation timeline where variables can be key-framed.

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
// <script type="text/javascript" src="https://unpkg.com/@magic-circle/client/dist/magic-circle.min.js"></script>
const { MagicCircle, Layer, NumberControl }  = window.magicCircle.MagicCircle;

// CommonJS:
const { MagicCircle, Layer, NumberControl } = require('@magic-circle/client');

// ES6:
import {
  MagicCircle,
  Layer,
  Folder
  NumberControl,
  ColorControl,
} from '@magic-circle/client';

// Create instance of Magic Circle client
const controls = new MagicCircle();

controls
  .setup((gui) => {
    // Create layer
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

To create your version of magic circle, a settings file is needed. To do see create a new file called `magic.config.js` in the root of your folder.

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

## Run locally

To run a server locally the following commands can be used:

```sh
# run with default config (magic.config.js)
$ magic

# run with custom config
$ magic --config custom.config.js

# if not running via a package.json make sure to use npx:
$ npx magic
```

## Build & Deploy

It is possible to create a distribution that can be deployed to wherever (for example via CI/CD) by running the following command:

```sh
$ magic build
```

After building is completed the bundle will be available in the `magic-circle` folder,

## Plugins

The plugins that are currently bundled by default:

- **magic-circle/controls** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/controls))
- **magic-circle/layers** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/layers))
- **magic-circle/performance** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/performance))
- **magic-circle/play-controls** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/play-controls))
- **magic-circle/screenshots** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/screenshots))
- **magic-circle/seed** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/seed))

## Creating custom plugins

See `docs/creating-plugin.md`
