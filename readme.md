# ![Logo of Magic Circle](https://raw.github.com/dpwoert/magic-circle/develop/docs/assets/logo.png)

We all need extra tooling while developing creative coding projects. It's always hard and time consuming to make our own UI for every project. Magic Circle allows you to quickly add an interface with an extensive tool set to your project quickly.

This is my attempt at creating a tool for my creative development needs. It's a multi-functional user interface inspired by tools like dat.GUI, Unity and Framer. Think Storybook.js, but then for creative coding. It is a very small bit of code (~5kb, no external dependencies) to add to a project but it allows you to create a fully extensible user interface with tools to play with your project.

The aim of this tool is not only to allow for easier and quicker development but also to promote collaboration and playfulness inside teams. Everyone should be able to play with the tech you make and add a meaningful contribution. You don't need to be a coder to improve a piece of creative tech. With this tool people can play with your project and share their results.

I named this tool **Magic Circle**, which according to Huizinga (Homo Ludens, 1938) is the place where _play_ takes place. A place whereby the rules and reality that guard normal life have been suspended ([read more here](https://uxdesign.cc/why-play-can-improve-the-interdisciplinary-collaboration-in-your-team-8d7fd1ce32f8)).

![screenshot of magic circle](https://raw.github.com/dpwoert/magic-circle/develop/docs/assets/screenshot.png)

## Online demo

An online demo environment can be found [here](https://playground.magic-circle.dev/).

## Works with

Magic Circle is framework and library agnostic and can thus work together with for example:

- Three.js
- p5.js
- Regl
- Pixi.js
- React

## Why use Magic Circle?

**🎛 Control your variables** Enables you to play around with variables. All controls are configurable and adaptable to play nicely with most data sources. Out of the box it comes with a good set of versatile controls for numbers, strings, booleans, functions and colours.

**📦 Completely reproducable presets** Nothing worse then losing old variants of your project since you know longer know how to get it back in the same way. Magic circle enables you to create the exact same scene by saving the values of your variables, _seeding_ value and your git state. You can save a preset and always go back in time and exactly recreate it.

**🐥 Small client** The UI embeds your project into a frame. This means the client code
(the code you add to your project) is very very small (~5kb) since all the heavy lifting is done inside the UI which isn't part of your project files. You don't have to fear that Magic Circle will get bundled into your project. If you load your project outside of Magic Circle, it will just work as-asual.

**📸 Screenshots** Take screenshots easily and in high-quality. The current state of your variables is saved with a screenshot as a preset. This means you can recreate that screenshot again. Especially since the current git state is also being stored, you can go back in time to re-create old presets.

**🎥 Recordings** Render your content into a screen recording by exporting it frame by frame without lag. Enabling you to export videos in high quality without loss of quality or jankiness like for example a manual screen recording would.

**🎬 Timelines** Create a timeline with keyframed values based on your variables. Use it to experiment with values or create production-ready animations.

**⏲ Performance measurements** Measures and displays performance metrics like Frames Per Second and memory usage so you always know if you're project runs smoothly.

**🛠 Custom plugins** Since all projects are unique, some projects need custom plugins that might not exists yet. Make your own if needed, or use community plugins.

**🚀 Deploy** Build and deploy your setup so you can share it with others in your team or the outside world.

## Roadmap

**🐞 Bug fixes and refactoring etc** This is just a first beta version to test if things are wokring. There are obviously many bugs and things that can be improved.

**🎪 Better examples** The current examples are very simple and just a proof of concept.

**⛓ Helpers** Helper functions for framework/libraries that make life easier. For example for React, P5 and ThreeJS.

**🎹 MIDI** Use a MIDI controller to play around with your variables.

**🎛 More advanced custom controls** More control types, like setting images for textures and easing controls.

**⏰ Animation timeline** Create an animation timeline where variables can be key-framed.

## Documentation

- [Quick start (install and launch)](https://github.com/dpwoert/magic-circle/blob/main/docs/01-quick-start.md)
- [Controls](https://github.com/dpwoert/magic-circle/blob/main/docs/02-controls.md)
- [Creating custom plugins](https://github.com/dpwoert/magic-circle/blob/main/docs/03-create-plugins.md)

## Plugins

The plugins that are currently bundled by default:

- **magic-circle/controls** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/controls))
- **magic-circle/layers** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/layers))
- **magic-circle/performance** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/performance))
- **magic-circle/play-controls** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/play-controls))
- **magic-circle/screenshots** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/screenshots))
- **magic-circle/seed** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/seed))
- **magic-circle/timeline** ([readme](https://github.com/dpwoert/magic-circle/tree/master/plugins/timeline))
