import React, { Component } from 'react';
import styled, {withTheme} from 'styled-components';
import Color from '@creative-controls/colors';

const Canvas = styled.canvas`
  width: 100%;
  height: 50px;
`;

class PerformanceChart extends Component {

  componentDidMount(){

    if(this.canvas){

      this.PR = Math.round( window.devicePixelRatio || 1 );

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

  componentDidUpdate(){
    const {value, max} = this.props;

    if(this.context){
      this.context = this.canvas.getContext('2d');

      //move bars
      this.context.drawImage(
        this.canvas,
        0, 0,
        this.width, this.height,
        -this.barWidth, 0,
        this.width , this.height
      );

      const height = (value / max) * this.height;

      this.context.fillStyle = '#111111';
      this.context.fillRect(this.width - this.barWidth, 0, this.barWidth, this.height);

      this.context.fillStyle = new Color(this.props.theme.accent).alpha(0.2).toCSS();
      this.context.fillRect( this.width - this.barWidth, this.height - height, this.barWidth, height );

      this.context.fillStyle = this.props.theme.accent;
      this.context.fillRect( this.width - this.barWidth, this.height - height, this.barWidth, 2 * this.PR );
    }

  }

  render(){
    return (
      <canvas style={{ width: '100%', height: '50px' }} ref={r => this.canvas = r } />
    )
  }

}

export default withTheme(PerformanceChart);
