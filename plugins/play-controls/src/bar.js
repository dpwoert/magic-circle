import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const Container = styled.div`
  margin-left: 80px;
  display: flex;
  flex-direction: row;
`

const Button = styled.div`
  border: 1px solid ${props => props.theme.accent};
  color: ${props => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  ${'' /* background: rgba(136, 74, 255, 0.19); */}
  font-size: 14px;
  width: 25px;
  height: 25px;
  border-right: none;

  fill: ${props => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;

  svg{
    width: 70%;
    height: auto;
  }

  &:first-of-type{
    border-radius: 3px 0px 0px 3px;
  }

  &:last-of-type{
    border-right: 1px solid ${props => props.theme.accent};
    border-radius: 0px 3px 3px 0px;
  }
`;

class Bar extends Component {

  render(){
    const {play, reset, refresh, changeState, theme} = this.props;
    const {Play, Pause, Reload, Rewind} = theme.icons;
    const PlayState = play ? Pause : Play;
    return(
      <Container>
        <Button play={play} onClick={() => changeState(!play)}>
          <PlayState />
        </Button>
        <Button onClick={() => refresh()}>
          <Reload />
        </Button>
        <Button onClick={() => reset()}>
          <Rewind />
        </Button>
      </Container>
    )
  }

}

export default withTheme(Bar);
