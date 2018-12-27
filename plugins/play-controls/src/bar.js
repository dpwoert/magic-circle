import React, { Component } from 'react';
import styled from 'styled-components';

const playIcon = 'assets/play.svg';
const pauseIcon = 'assets/pause.svg';
const refreshIcon = 'assets/reload.svg';
const resetIcon = 'assets/rewind.svg';

const Container = styled.div`
  margin-left: 80px;
  display: flex;
  flex-direction: row;
`

const Button = styled.div`
  padding: 3px 6px;
  border: 1px solid ${props => props.theme.accent};
  color: ${props => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  ${'' /* background: rgba(136, 74, 255, 0.19); */}
  background-size: auto 70%;
  background-position: center center;
  background-repeat: no-repeat;
  font-size: 14px;
  width: 25px;
  height: 25px;
  border-right: none;

  &:first-of-type{
    border-radius: 3px 0px 0px 3px;
  }

  &:last-of-type{
    border-right: 1px solid ${props => props.theme.accent};
    border-radius: 0px 3px 3px 0px;
  }
`;

const Play = styled(Button)`
  background-image: url(${props => props.play ? pauseIcon : playIcon});
`

const Reload = styled(Button)`
  background-image: url(${refreshIcon});
`

const Reset = styled(Button)`
  background-image: url(${resetIcon});
`

class Bar extends Component {

  render(){
    const {play, reset, refresh, changeState} = this.props;
    return(
      <Container>
        <Play play={play} onClick={() => changeState(!play)} />
        <Reload onClick={() => refresh()} />
        <Reset onClick={() => reset()} />
      </Container>
    )
  }

}

export default Bar;
