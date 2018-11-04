import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: row;
`

const Button = styled.div`
  padding: 3px 6px;
  border: 1px solid rgb(136, 74, 255);
  color: rgb(136, 74, 255);
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  background: rgba(136, 74, 255, 0.19);
  font-size: 14px;
  border-radius: 3px;
`;

class Bar extends Component {

  render(){
    const play = this.props.play;
    const label = !play ? '>' : '| |';
    return(
      <Container>
        <Button onClick={() => this.props.takeScreenshot()}>
          sc
        </Button>
      </Container>
    )
  }

}

export default Bar;
