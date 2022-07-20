import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import VirtualScroll from 'virtual-scroll';

import { SPACING, COLORS } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Timeline from './index';
import type { Scene, ScenePoint } from './index';
import { lerp, formatTime, mapLinear, clamp } from './utils';

const MIN_TICK_SIZE = 6;

const Container = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

type Hotspot = {
  x: number;
  y: number;
  radius: number;
  onClick?: () => void;
  dblClick?: () => void;
  drag?: (deltaX: number, deltaY: number) => void;
};

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
  dragging?: Hotspot;
  hotspots: Hotspot[];
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
    this.element.addEventListener('dblclick', (evt) => {
      const box = this.element.getBoundingClientRect();
      this.dblClick(evt.x - box.x, evt.y - box.y);
    });

    // drag
    this.element.addEventListener('mousedown', (evt) => {
      const box = this.element.getBoundingClientRect();
      this.dragStart(evt.x - box.x, evt.y - box.y);
    });
    this.element.addEventListener('mousemove', (evt) => {
      this.drag(evt.movementX, evt.movementY);
    });
    this.element.addEventListener('mouseup', () => {
      this.dragEnd();
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

  pxInvert(px: number) {
    return px / this.pixelRatio;
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

  hotspot(x: number, y: number): Hotspot {
    return this.hotspots.find((spot) => {
      const dist = Math.sqrt(Math.pow(x - spot.x, 2) + Math.pow(y - spot.y, 2));
      return dist < spot.radius;
    });
  }

  click(x: number, y: number) {
    if (y < SPACING(3)) {
      const time = this.invert(x);
      this.timeline.playhead.set(time);
    } else {
      const hotspot = this.hotspot(x, y);

      if (hotspot && hotspot.onClick) {
        hotspot.onClick();
      } else {
        this.timeline.selected.set(null);
        this.render();
      }
    }
  }

  dblClick(x: number, y: number) {
    const hotspot = this.hotspot(x, y);

    console.log({ hotspot });

    if (hotspot && hotspot.dblClick) {
      hotspot.dblClick();
    }
  }

  dragStart(x: number, y: number) {
    const hotspot = this.hotspot(x, y);

    if (hotspot && hotspot.drag) {
      this.dragging = hotspot;
    }
  }

  dragEnd() {
    this.dragging = null;
  }

  drag(deltaX: number, deltaY: number) {
    if (this.dragging) {
      this.dragging.drag(deltaX, deltaY);
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
    const control = this.timeline.layers.lookup.get(path).value;
    const allPoints = [...points];

    if (points.length > 0) {
      allPoints.unshift({
        ...points[0],
        time: 0,
      });
      allPoints.push({
        ...points[points.length - 1],
        time: this.scene.duration,
      });
    }

    const range: number[] =
      'options' in control ? control.options.range : [0, 0];

    // does this need rendering?

    const top = SPACING(3) + i * SPACING(6);
    const bottom = top + SPACING(6);

    // Create scale
    const axis = (val: number) =>
      mapLinear(val, range[1], range[0], top + SPACING(1), bottom - SPACING(1));
    const axisInverse = (val: number) =>
      mapLinear(val, top + SPACING(1), bottom - SPACING(1), range[1], range[0]);

    // line
    this.context.beginPath();
    this.context.moveTo(0, this.px(bottom));
    this.context.lineTo(this.px(this.width), this.px(bottom));
    this.context.strokeStyle = COLORS.shades.s300.css;
    this.context.lineWidth = this.px(1);
    this.context.stroke();

    // Render path
    this.context.beginPath();
    allPoints.forEach((point, i) => {
      const x = this.px(this.position(point.time));
      const y = this.px(axis(+point.value));

      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    });

    this.context.strokeStyle = COLORS.shades.s300.css;
    this.context.lineWidth = this.px(1);
    this.context.stroke();

    // Render start and end-point
    if (allPoints.length > 2) {
      this.context.fillStyle = COLORS.shades.s400.css;
      this.context.strokeStyle = COLORS.shades.s300.css;
      const first = allPoints[0];
      const last = allPoints[allPoints.length - 1];
      this.context.fillRect(
        this.px(this.position(first.time) - 2),
        this.px(axis(+first.value) - 2),
        this.px(4),
        this.px(4)
      );
      this.context.strokeRect(
        this.px(this.position(first.time) - 2),
        this.px(axis(+first.value) - 2),
        this.px(4),
        this.px(4)
      );
      this.context.fillRect(
        this.px(this.position(last.time) - 2),
        this.px(axis(+last.value) - 2),
        this.px(4),
        this.px(4)
      );
      this.context.strokeRect(
        this.px(this.position(last.time) - 2),
        this.px(axis(+last.value) - 2),
        this.px(4),
        this.px(4)
      );
    }

    // Render points
    points.forEach((point, key) => {
      const selected = this.timeline.selected.value;
      const isSelected =
        selected && selected.path === path && selected.time === point.time;
      this.context.fillStyle = isSelected
        ? COLORS.shades.s100.css
        : COLORS.shades.s400.css;
      this.context.strokeStyle = COLORS.shades.s100.css;

      const x = this.px(this.position(point.time));
      const y = this.px(axis(+point.value));
      const s = this.px(SPACING(0.5));

      this.context.translate(x, y);
      this.context.rotate((45 * Math.PI) / 180);
      this.context.translate(-x, -y);
      this.context.fillRect(x - s / 2, y - s / 2, s, s);
      this.context.strokeRect(x - s / 2, y - s / 2, s, s);
      this.context.resetTransform();

      // Make clickable
      this.hotspots.push({
        x: this.pxInvert(x),
        y: this.pxInvert(y),
        radius: s / 2,
        onClick: () => {
          this.timeline.selected.set({
            path,
            time: point.time,
          });
          this.render();
        },
        dblClick: () => {
          this.timeline.selected.set({
            path,
            time: point.time,
          });
          this.timeline.playhead.set(point.time);
          this.render();
        },
        drag: (dx, dy) => {
          // ensure we're updating the same keyframe and not the reference to the old one...
          const curr = this.timeline.getKeyframeByKey(path, key);

          const newX = this.position(curr.time) + dx;
          const newY = axis(+curr.value) + dy;
          const newTime = this.invert(newX);
          const newValue = clamp(axisInverse(newY), range[0], range[1]);

          console.log({ curr, newTime, newValue, range });

          this.timeline.changeKeyframe(path, key, newTime, newValue);
          this.render();
        },
      });
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
    this.hotspots = [];

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
