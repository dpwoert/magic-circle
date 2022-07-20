import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import VirtualScroll from 'virtual-scroll';

import { SPACING, COLORS } from '@magic-circle/styles';

import type Timeline from './index';
import type { Scene, ScenePoint } from './index';
import { useStore } from '@magic-circle/state';

const MIN_TICK_SIZE = 6;

const Container = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function lerp(t: number, start: number, end: number): number {
  return start * (1 - t) + end * t;
}

function addDigit(number: number): string {
  return number < 10 ? `0${number}` : String(number);
}

function formatTime(t: number) {
  const ms = t % 1000;
  let s = (t - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;

  return `${addDigit(mins)}:${addDigit(secs)}:${addDigit(ms)}`;
}

class CanvasDisplay {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  timeline: Timeline;
  scroller: VirtualScroll;
  raf: ReturnType<typeof requestAnimationFrame>;
  width: number;
  height: number;
  scroll: {
    dest: number;
    curr: number;
  };
  scene: Scene;
  zoom: number;
  playhead: number;
  pixelRatio: number;

  constructor(element: HTMLCanvasElement, timeline: Timeline) {
    this.element = element;
    this.context = this.element.getContext('2d');
    this.timeline = timeline;
    this.scroller = new VirtualScroll({ el: element });
    this.scroll = {
      dest: 0,
      curr: 0,
    };
    this.zoom = 0;
    this.pixelRatio = window.devicePixelRatio || 1;

    this.setZoom(0);
    this.resize();
    this.render();

    this.scrollUpdate = this.scrollUpdate.bind(this);

    this.scroller.on((event) => {
      this.setScroll(this.scroll.dest + event.deltaX);
    });
    this.element.addEventListener('click', (evt) => {
      const box = this.element.getBoundingClientRect();
      this.click(evt.x - box.x, evt.y - box.y);
    });
  }

  resize() {
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    this.element.width = this.width * this.pixelRatio;
    this.element.height = this.height * this.pixelRatio;

    console.log('resize', this.width, this.height);
  }

  px(px: number) {
    return px * this.pixelRatio;
  }

  position(time: number) {
    const offset = SPACING(1) + this.scroll.curr;
    return this.stepSize() * time + offset;
  }

  invert(px: number) {
    const offset = SPACING(1) + this.scroll.curr;
    return (px - offset) / this.stepSize();
  }

  setScroll(scroll: number) {
    this.scroll = {
      dest: Math.min(0, scroll),
      curr: this.scroll.curr,
    };

    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    this.scrollUpdate();
  }

  setPlayhead(playhead: number) {
    this.playhead = playhead;
    this.render();
  }

  stepSize() {
    return lerp(this.zoom, 12 / 100, 72 / 100);
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
    this.scrollUpdate();
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.render();
  }

  click(x: number, y: number) {
    console.log('click', { x, y });
    if (y < SPACING(3)) {
      const time = this.invert(x);
      this.timeline.playhead.set(time);
    }
  }

  scrollUpdate() {
    this.scroll = {
      dest: this.scroll.dest,
      curr: this.scroll.curr + (this.scroll.dest - this.scroll.curr) * 0.5,
    };

    if (Math.abs(this.scroll.dest - this.scroll.curr) < 0.05) {
      this.scroll.curr = this.scroll.dest;
    }

    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    if (this.scroll.curr !== this.scroll.dest) {
      this.raf = requestAnimationFrame(this.scrollUpdate);
    }

    this.render();
  }

  renderTimeline() {
    // ensure we can't get into an infinite loop
    if (!this.width) {
      return;
    }

    //background
    this.context.fillStyle = COLORS.shades.s600.css;
    this.context.fillRect(0, 0, this.px(this.width), this.px(SPACING(3)));

    // border
    this.context.beginPath();
    this.context.moveTo(0, this.px(SPACING(3)));
    this.context.lineTo(this.px(this.width), this.px(SPACING(3)));
    this.context.strokeStyle = COLORS.shades.s300.css;
    this.context.lineWidth = this.px(1);
    this.context.stroke();

    const stepSize = 100;
    const startTime = this.invert(0);
    const startTimeNice = startTime + stepSize - (startTime % stepSize);
    let time = startTimeNice;

    // ticks
    while (this.position(time) < this.width) {
      const isBigTick = time % 1000 === 0;
      const pointer = this.position(time);

      this.context.beginPath();
      this.context.moveTo(this.px(pointer), this.px(SPACING(3)));
      this.context.lineTo(
        this.px(pointer),
        this.px(isBigTick ? SPACING(3 - 1.5) : SPACING(3 - 0.5))
      );
      this.context.strokeStyle = COLORS.shades.s200.css;
      this.context.lineWidth = this.px(1);
      this.context.stroke();

      if (isBigTick) {
        // add label
        this.context.font = `${this.px(8)}px inter`;
        this.context.fillStyle = COLORS.shades.s200.css;
        this.context.fillText(
          formatTime(time),
          this.px(pointer + 3),
          this.px(SPACING(3 - 1.5) + 8)
        );
      }

      time += 100;
    }
  }

  renderPlayhead() {
    const position = this.position(this.playhead);

    // line
    this.context.beginPath();
    this.context.moveTo(this.px(position), this.px(0));
    this.context.lineTo(this.px(position), this.px(this.height));
    this.context.strokeStyle = COLORS.accent.css;
    this.context.lineWidth = this.px(1);
    this.context.stroke();

    // Rect
    this.context.fillStyle = COLORS.accent.css;
    this.context.fillRect(this.px(position - 4), 0, this.px(9), this.px(18));
  }

  renderTrack(path: string, i: number) {
    const points = this.scene.values[path];

    // does this need rendering?

    const bottom = SPACING(3) + (i + 1) * SPACING(6);
    console.log('track', path, i, bottom);

    // line
    this.context.beginPath();
    this.context.moveTo(0, this.px(bottom));
    this.context.lineTo(this.px(this.width), this.px(bottom));
    this.context.strokeStyle = COLORS.shades.s300.css;
    this.context.lineWidth = this.px(1);
    this.context.stroke();

    // Render path

    // Render points
    points.forEach((point) => {
      this.context.fillStyle = COLORS.shades.s400.css;
      this.context.strokeStyle = COLORS.shades.s100.css;

      const x = this.px(this.position(point.time));
      const y = this.px(bottom - SPACING(3));
      const s = this.px(SPACING(0.5));

      this.context.translate(x, y);
      this.context.rotate((45 * Math.PI) / 180);
      this.context.translate(-x, -y);
      this.context.fillRect(x - s / 2, y - s / 2, s, s);
      this.context.strokeRect(x - s / 2, y - s / 2, s, s);
      this.context.resetTransform();
      // this.context.restore();
      // this.context.translate(-x, -y);
      // this.context.rotate(0);
      // this.context.setTransform(1, 0, 0, 1, 0, 0);
    });
  }

  renderTracks() {
    if (!this.scene || !this.scene.values) {
      return;
    }

    console.log('render tracks');

    Object.keys(this.scene.values).forEach((path, i) => {
      this.renderTrack(path, i);
    });
  }

  render() {
    // this.context.clearRect(0, 0, this.px(this.width), this.px(this.height));

    // background
    this.context.fillStyle = COLORS.shades.s500.css;
    this.context.fillRect(0, 0, this.px(this.width), this.px(this.height));

    this.renderTracks();
    this.renderTimeline();
    this.renderPlayhead();
  }
}

type CanvasProps = {
  timeline: Timeline;
};

const Canvas = ({ timeline }: CanvasProps) => {
  const ref = useRef();
  const display = useRef<CanvasDisplay>();

  const playhead = useStore(timeline.playhead);
  const scene = useStore(timeline.scene);

  useEffect(() => {
    if (ref.current) {
      display.current = new CanvasDisplay(ref.current, timeline);
    }
  }, []);

  useEffect(() => {
    display.current.setPlayhead(playhead);
  }, [playhead]);

  useEffect(() => {
    display.current.setScene(scene);
  }, [scene]);

  return <Container ref={ref} />;
};

export default Canvas;
