import { useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

import { COLORS } from '@magic-circle/styles';

const Canvas = styled.canvas`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
`;

class ChartViz {
  PR: number;
  width: number;
  height: number;
  barWidth: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  max: number;
  values: number[];

  constructor(canvas: HTMLCanvasElement, max: number) {
    this.canvas = canvas;
    this.PR = Math.round(window.devicePixelRatio || 1);

    this.width = this.canvas.offsetWidth * this.PR;
    this.height = this.canvas.offsetHeight * this.PR;
    this.barWidth = 3 * this.PR;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = String(this.canvas.width / this.PR);
    this.canvas.style.height = String(this.canvas.height / this.PR);

    this.context = this.canvas.getContext('2d');

    this.max = max;
  }

  set(values: number[]) {
    this.values = values;
    this.render();
  }

  render() {
    const { values, max } = this;
    this.context = this.canvas.getContext('2d');

    // Clear all drawed elements
    this.context.clearRect(0, 0, this.width, this.height);

    // Add bars
    for (let i = values.length; i > 0; i -= 1) {
      const value = values[i];
      const height = (value / max) * this.height;
      const x = this.width - (values.length - i) * this.barWidth;

      if (value >= 0) {
        // top bar
        this.context.fillStyle = String(COLORS.accent.opacity(0.2));
        this.context.fillRect(x, this.height - height, this.barWidth, height);

        // performance bar
        this.context.fillStyle = COLORS.accent.css;
        this.context.fillRect(
          x,
          this.height - height,
          this.barWidth,
          2 * this.PR
        );
      }
      // else if (value === 'restart' && values.length > 1) {
      //   const rWidth = this.PR;
      //   this.context.fillStyle = '#555';
      //   this.context.fillRect(x + rWidth, 0, 1 * rWidth, this.height);
      // }
    }
  }
}

type ChartProps = {
  max: number;
  values: number[];
};

export const Chart = ({ max, values }: ChartProps) => {
  const ref = useRef<HTMLCanvasElement>();
  const viz = useRef<ChartViz>();

  useLayoutEffect(() => {
    viz.current = new ChartViz(ref.current, max);
  }, []);

  useEffect(() => {
    viz.current.set(values);
  }, [values]);

  return <Canvas ref={ref} />;
};

export default Chart;
