/* eslint-disable no-restricted-properties */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import VirtualScroll from 'virtual-scroll';

import { SPACING, COLORS } from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';

import type Timeline from './index';
import type { Scene } from './index';
import { lerp, formatTime, mapLinear, clamp } from './utils';

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
  radius?: number;
  width?: number;
  height?: number;
  onClick?: () => void;
  dblClick?: () => void;
  drag?: (deltaX: number, deltaY: number, x: number, y: number) => void;
  cursor?: string;
};

type Handle = {
  path: string;
  key: number;
  direction: 'left' | 'right';
  position: number[];
  origin: number[];
  axisX: number[];
  axisY: number[];
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
    x: {
      dest: number;
      curr: number;
    };
    y: {
      dest: number;
      curr: number;
    };
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
      x: {
        dest: 0,
        curr: 0,
      },
      y: {
        dest: 0,
        curr: 0,
      },
    };
    this.zoom = 0;
    this.pixelRatio = window.devicePixelRatio || 1;

    this.setZoom(timeline.zoom.value);
    this.resize();
    this.render();

    this.scrollUpdate = this.scrollUpdate.bind(this);
    this.resize = this.resize.bind(this);

    this.scroller.on((event) => {
      this.setScroll(
        this.scroll.x.dest + event.deltaX,
        this.scroll.y.dest - event.deltaY * 0.2
      );
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
      const box = this.element.getBoundingClientRect();
      const x = evt.x - box.x;
      const y = evt.y - box.y;
      this.mouseMove(x, y);
      this.drag(evt.movementX, evt.movementY, x, y);
    });
    this.element.addEventListener('mouseup', () => {
      this.dragEnd();
    });
    this.element.addEventListener('mouseleave', () => {
      this.dragEnd();
    });

    // resize
    window.addEventListener('resize', this.resize);
  }

  resize(evt?: any) {
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    this.element.width = this.width * this.pixelRatio;
    this.element.height = this.height * this.pixelRatio;

    if (evt) {
      this.render();
    }
  }

  px(px: number) {
    return px * this.pixelRatio;
  }

  pxInvert(px: number) {
    return px / this.pixelRatio;
  }

  position(time: number) {
    const offset = SPACING(1) + this.scroll.x.curr;
    return this.stepSize() * time + offset;
  }

  invert(px: number) {
    const offset = SPACING(1) + this.scroll.x.curr;
    return (px - offset) / this.stepSize();
  }

  setScroll(x: number, y: number) {
    const ySize =
      this.height -
      Object.keys(this.scene.values).length * SPACING(6) +
      SPACING(6.5);

    this.scroll = {
      x: {
        dest: Math.min(0, x),
        curr: this.scroll.x.curr,
      },
      y: {
        dest: clamp(y, 0, ySize),
        curr: this.scroll.y.curr,
      },
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
    return lerp(this.zoom, 6 / 100, 72 / 100);
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
      if (spot.radius) {
        const dist = Math.sqrt(
          Math.pow(x - spot.x, 2) + Math.pow(y - spot.y, 2)
        );
        return dist < spot.radius;
      }

      if (spot.width || spot.height) {
        return (
          x >= spot.x &&
          x < spot.x + spot.width &&
          y >= spot.y &&
          y < spot.y + spot.height
        );
      }

      return false;
    });
  }

  mouseMove(x: number, y: number) {
    const hotspot = this.hotspot(x, y);

    if (hotspot && hotspot.cursor) {
      this.element.style.cursor = hotspot.cursor;
    } else {
      this.element.style.cursor = 'default';
    }
  }

  click(x: number, y: number) {
    if (y < SPACING(3)) {
      const time = this.invert(x);
      this.timeline.setPlayhead(Math.max(0, time));
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

  drag(deltaX: number, deltaY: number, x: number, y: number) {
    if (this.dragging) {
      this.dragging.drag(deltaX, deltaY, x, y);
    }
  }

  scrollUpdate() {
    this.scroll = {
      x: {
        dest: this.scroll.x.dest,
        curr:
          this.scroll.x.curr + (this.scroll.x.dest - this.scroll.x.curr) * 0.5,
      },
      y: {
        dest: this.scroll.y.dest,
        curr:
          this.scroll.y.curr + (this.scroll.y.dest - this.scroll.y.curr) * 0.5,
      },
    };

    // hack
    document.querySelector('#timeline-rows').scrollTop = Math.abs(
      this.scroll.y.curr
    );

    // ensure we're not easing too longer
    if (Math.abs(this.scroll.x.dest - this.scroll.x.curr) < 0.05) {
      this.scroll.x.curr = this.scroll.x.dest;
    }
    if (Math.abs(this.scroll.y.dest - this.scroll.y.curr) < 0.05) {
      this.scroll.y.curr = this.scroll.y.dest;
    }

    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    if (
      this.scroll.x.curr !== this.scroll.x.dest ||
      this.scroll.y.curr !== this.scroll.y.dest
    ) {
      this.raf = requestAnimationFrame(this.scrollUpdate);
    }

    this.render();
  }

  renderTimeline() {
    // Ensure we can't get into an infinite loop
    if (!this.width) {
      return;
    }

    // Background
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

  renderEnd() {
    // No scene means no need to render
    if (!this.scene) return;

    // Get position of ending
    const position = this.position(this.scene.duration);

    // Only render when visible
    if (position > 0 && position < this.width) {
      // line
      this.context.beginPath();
      this.context.moveTo(this.px(position), this.px(0));
      this.context.lineTo(this.px(position), this.px(this.height));
      this.context.strokeStyle = COLORS.black.css;
      this.context.lineWidth = this.px(1);
      this.context.stroke();

      // area
      this.context.fillStyle = COLORS.shades.s600.css;
      this.context.fillRect(
        this.px(position + 1),
        0,
        this.px(this.width - position),
        this.px(this.height)
      );

      this.hotspots.push({
        x: position,
        y: 0,
        width: 3,
        height: this.height,
        cursor: 'col-resize',
        drag: (dx) => {
          const curr = this.position(this.scene.duration);
          const newPos = curr + dx;
          const newTime = this.invert(newPos);
          this.timeline.changeDuration(newTime);
        },
      });
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

    // Drag
    this.hotspots.push({
      x: 0,
      y: 0,
      width: this.width,
      height: SPACING(3),
      drag: (dx, dy, x) => {
        const time = this.invert(x);
        this.timeline.setPlayhead(Math.max(0, time));
      },
    });
  }

  renderHandles(handles: Handle[]) {
    handles.forEach((handle) => {
      // show lines
      this.context.beginPath();
      this.context.setLineDash([this.px(1), this.px(1)]);
      this.context.moveTo(handle.origin[0], handle.origin[1]);
      this.context.lineTo(handle.position[0], handle.position[1]);
      this.context.strokeStyle = COLORS.shades.s100.css;
      this.context.lineWidth = this.px(1);
      this.context.stroke();
      this.context.setLineDash([]);

      // show handles
      this.context.fillStyle = COLORS.shades.s100.css;
      this.context.beginPath();
      this.context.arc(
        handle.position[0],
        handle.position[1],
        this.px(1.5),
        0,
        2 * Math.PI,
        false
      );
      this.context.fill();

      this.hotspots.push({
        x: this.pxInvert(handle.position[0]),
        y: this.pxInvert(handle.position[1]),
        radius: 3,
        cursor: 'move',
        drag: (dx, dy) => {
          const newX = handle.position[0] + this.px(dx);
          const newY = handle.position[1] + this.px(dy);
          const relX = mapLinear(newX, handle.axisX[0], handle.axisX[1], 0, 1);
          const relY = mapLinear(newY, handle.axisY[0], handle.axisY[1], 0, 1);

          // ensure we're updating the same keyframe and not the reference to the old one...
          handle.position = [newX, newY]; // eslint-disable-line

          this.timeline.changeHandleForKeyframe(
            handle.path,
            handle.key,
            handle.direction,
            relX,
            relY
          );

          this.render();
        },
      });
    });
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
        ...points[this.scene.seamlessLoop ? 0 : points.length - 1],
        time: this.scene.duration,
      });
    }

    const range: number[] =
      'options' in control ? control.options.range : [0, 0];

    // does this need rendering?

    const top = SPACING(3) + i * SPACING(6) - this.scroll.y.curr;
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

    const handles: Handle[] = [];

    // Render path
    this.context.beginPath();
    allPoints.forEach((point, i) => {
      const x = this.px(this.position(point.time));
      const y = this.px(axis(+point.value));
      const previous = i > 0 ? allPoints[i - 1] : null;

      if (i === 0) {
        this.context.moveTo(x, y);
      } else if (point.controlPoints?.left || previous?.controlPoints?.right) {
        const prevX = this.px(this.position(previous.time || 0));
        const prevY = previous ? this.px(axis(+previous.value)) : y;

        const p1 = [
          lerp(previous?.controlPoints?.right[0] || 0, prevX, x),
          lerp(previous?.controlPoints?.right[1] || 0, prevY, y),
        ];
        const p2 = [
          lerp(point?.controlPoints?.left[0] || 1, prevX, x),
          lerp(point?.controlPoints?.left[1] || 1, prevY, y),
        ];

        const axisX = [prevX, x];
        const axisY = [prevY, y];
        const key = points.findIndex((t) => t.time === point.time);

        if (previous?.controlPoints) {
          handles.push({
            path,
            key: key - 1,
            direction: 'right',
            position: p1,
            origin: [prevX, prevY],
            axisX,
            axisY,
          });
        }
        if (point.controlPoints) {
          handles.push({
            path,
            key,
            direction: 'left',
            position: p2,
            origin: [x, y],
            axisX,
            axisY,
          });
        }

        this.context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], x, y);
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
        selected && selected.path === path && selected.key === key;
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
        cursor: 'pointer',
        onClick: () => {
          this.timeline.selected.set({
            path,
            key,
          });
          this.render();
        },
        dblClick: () => {
          this.timeline.selected.set({
            path,
            key,
          });
          this.timeline.setPlayhead(point.time);
          this.render();
        },
        drag: (dx, dy) => {
          // ensure we're updating the same keyframe and not the reference to the old one...
          const curr = this.timeline.getKeyframeByKey(path, key);

          const newX = this.position(curr.time) + dx;
          const newY = axis(+curr.value) + dy;
          const newTime = this.invert(newX);
          const newValue = clamp(axisInverse(newY), range[0], range[1]);

          this.timeline.changeKeyframe(path, key, newTime, newValue);
          this.render();
        },
      });
    });

    this.renderHandles(handles);
  }

  renderTracks() {
    if (!this.scene || !this.scene.values) {
      return;
    }

    Object.keys(this.scene.values).forEach((path, i) => {
      this.renderTrack(path, i);
    });
  }

  render() {
    this.hotspots = [];

    // background
    this.context.fillStyle = COLORS.shades.s500.css;
    this.context.fillRect(0, 0, this.px(this.width), this.px(this.height));

    this.renderEnd();
    this.renderTracks();
    this.renderTimeline();
    this.renderPlayhead();
  }

  destroy() {
    this.scroller.destroy();
    window.removeEventListener('resize', this.resize);
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
  const zoom = useStore(timeline.zoom);

  useEffect(() => {
    if (ref.current) {
      display.current = new CanvasDisplay(ref.current, timeline);
    }
  }, [timeline]);

  useEffect(() => {
    display.current.setPlayhead(playhead);
  }, [playhead]);

  useEffect(() => {
    display.current.setScene(scene);
  }, [scene]);

  useEffect(() => {
    display.current.setZoom(zoom);
  }, [zoom]);

  return <Container ref={ref} />;
};

export default Canvas;
