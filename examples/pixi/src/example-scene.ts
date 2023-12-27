import * as PIXI from 'pixi.js';

import {
  MagicCircle,
  Layer,
  NumberControl,
  ColorControl,
} from '@magic-circle/client';

import asset from './asset.png';

let app: PIXI.Application;
let container: PIXI.Container;

const settings = {
  speed: 0.01,
};

// Mostly copied from example here: https://pixijs.io/examples/#/gsap3-interaction/gsap3-tick.js

export function setup(gui: MagicCircle) {
  // Create application
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0a0a0a,
  });

  // Add element to DOM
  const canvas = app.view as unknown as HTMLCanvasElement;
  const root = document.querySelector('#root');
  root.appendChild(canvas);

  // Ensure the ticker is controlled by Magic Circle
  app.ticker.stop();

  container = new PIXI.Container();
  app.stage.addChild(container);

  // Create a new texture
  const texture = PIXI.Texture.from(asset);

  // Create a 5x5 grid of bunnies
  for (let i = 0; i < 25; i += 1) {
    const logo = new PIXI.Sprite(texture);
    logo.anchor.set(0.5);
    logo.x = (i % 5) * 40;
    logo.y = Math.floor(i / 5) * 40;
    container.addChild(logo);
  }

  // Move container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Center logo sprite in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Listen for animate update
  app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= settings.speed * delta;
  });

  // Add controls
  const scene = new Layer('scene').addTo(gui.layer);

  scene.add([
    new NumberControl(settings, 'speed').range(0.001, 0.1).stepSize(0.001),
    new ColorControl(app.renderer, 'backgroundColor'),
  ]);

  return app.view;
}

export function loop() {
  app.ticker.update();
}
