import React, { Component } from 'react';
import styled from 'styled-components';

const screenshotIcon = 'assets/screenshot.svg';

const Container = styled.div`
  margin-left: 12px;
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
  background-image: url(${screenshotIcon});
  font-size: 14px;
  width: 25px;
  height: 25px;
  border-radius: 3px;
`;

class Bar extends Component {

  render(){
    return(
      <Container>
        <Button onClick={() => this.props.takeScreenshot()}/>
      </Container>
    )
  }

}

export default Bar;
