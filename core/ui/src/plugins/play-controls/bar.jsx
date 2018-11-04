import React, { Component } from 'react';
import styled from 'styled-components';

import withPlayState from './with-play-state';

const Container = styled.div`
  margin-left: 80px;
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

  &:first-of-type{
    border-radius: 3px 0px 0px 3px;
    border-right: none;
  }

  &:last-of-type{
    border-radius: 0px 3px 3px 0px;
  }
`;

const Play = styled(Button)`

`

const Reload = styled(Button)`

`

class Bar extends Component {

  render(){
    const play = this.props.play;
    const label = !play ? '>' : '| |';
    return(
      <Container>
        <Play onClick={() => this.props.changeState(!play)}>
          {label}
        </Play>
        <Reload onClick={() => this.props.refresh()}>
          ↻
        </Reload>
      </Container>
    )
  }

}

export default withPlayState(Bar);
