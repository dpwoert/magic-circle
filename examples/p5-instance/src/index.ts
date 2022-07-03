/* eslint-disable no-param-reassign */
import {
  MagicCircle,
  Layer,
  Folder,
  NumberControl,
  ColorControl,
} from '@magic-circle/client';
import p5 from 'p5';
import createSketch from '@magic-circle/p5';

import './style.css';

const magic = new MagicCircle();

const sketch = (p: p5) => {
  const options = {
    backgroundColor: [51, 51, 51],
    strokeColor: [200, 200, 200],
    fillColor: [127, 127, 127],
    lifespan: 255,
    acceleration: 0.05,
  };

  let system: ParticleSystem;

  class Particle {
    acceleration: p5.Vector;
    velocity: p5.Vector;
    position: p5.Vector;
    lifespan: number;

    constructor(position: p5.Vector) {
      this.acceleration = p.createVector(0, options.acceleration);
      this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 0));
      this.position = position.copy();
      this.lifespan = options.lifespan;
    }

    run() {
      this.update();
      this.display();
    }

    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.lifespan -= 2;
    }

    display() {
      p.stroke(
        options.strokeColor[0],
        options.strokeColor[1],
        options.strokeColor[2],
        this.lifespan
      );
      p.strokeWeight(2);
      p.fill(
        options.fillColor[0],
        options.fillColor[1],
        options.fillColor[2],
        this.lifespan
      );
      p.ellipse(this.position.x, this.position.y, 12, 12);
    }

    isDead() {
      return this.lifespan < 0;
    }
  }

  class ParticleSystem {
    origin: p5.Vector;
    particles: Particle[];
    constructor(position: p5.Vector) {
      this.origin = position.copy();
      this.particles = [];
    }

    addParticle() {
      this.particles.push(new Particle(this.origin));
    }

    run() {
      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.run();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  p.setup = () => {
    p.createCanvas(720, 400);
    system = new ParticleSystem(p.createVector(720 / 2, 50));

    const sceneLayer = new Layer('Scene').addTo(magic.layer);
    const particleFolder = new Folder('Particle system').addTo(sceneLayer);
    const colorFolder = new Folder('Colors').addTo(sceneLayer);

    particleFolder.add([
      new NumberControl(options, 'lifespan').range(0, 500),
      new NumberControl(options, 'acceleration')
        .range(0.05, 0.1)
        .stepSize(0.001),
    ]);

    colorFolder.add([
      new ColorControl(options, 'backgroundColor').label('Background'),
      new ColorControl(options, 'strokeColor').label('Stroke'),
      new ColorControl(options, 'fillColor').label('Fill'),
    ]);
  };

  p.draw = () => {
    p.background(
      options.backgroundColor[0],
      options.backgroundColor[1],
      options.backgroundColor[2]
    );
    system.addParticle();
    system.run();
  };
};

const element = document.querySelector('#p5') as HTMLElement;
createSketch(magic, p5).instance(sketch, element).start();
