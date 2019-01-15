import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import Color from '@creative-controls/colors';

class PerformanceChart extends Component {
  componentDidMount() {
    if (this.canvas) {
      this.PR = Math.round(window.devicePixelRatio || 1);

      this.width = this.canvas.offsetWidth * this.PR;
      this.height = this.canvas.offsetHeight * this.PR;
      this.barWidth = 3 * this.PR;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.width = this.canvas.width / this.PR;
      this.canvas.style.height = this.canvas.height / this.PR;

      this.context = this.canvas.getContext('2d');
    }
  }

  componentDidUpdate() {
    const { values, max } = this.props;

    if (this.context) {
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
          this.context.fillStyle = new Color(this.props.theme.accent)
            .alpha(0.2)
            .toCSS();
          this.context.fillRect(x, this.height - height, this.barWidth, height);

          // performance bar
          this.context.fillStyle = this.props.theme.accent;
          this.context.fillRect(
            x,
            this.height - height,
            this.barWidth,
            2 * this.PR
          );
        } else if (value === 'restart' && values.length > 1) {
          const rWidth = this.PR;
          this.context.fillStyle = '#555';
          this.context.fillRect(x + rWidth, 0, 1 * rWidth, this.height);
        }
      }
    }
  }

  render() {
    return (
      <canvas
        style={{ width: '100%', height: '50px' }}
        ref={r => {
          this.canvas = r;
        }}
      />
    );
  }
}

export default withTheme(PerformanceChart);
