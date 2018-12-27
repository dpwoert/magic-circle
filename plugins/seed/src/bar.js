import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 3px;
  border: 1px solid ${props => props.theme.accent};
  border-radius: 3px;
  color: ${props => props.theme.accent};
  display: inline-block;
  min-width: 50px;
  text-align: center;
  user-select: none;
  font-size: 12px;
`;

const truncate = (string, max) => {
  return string.length > max ? string.substring(0,max)+'...' : string;
};

class Bar extends Component {

  render(){
    const seed = String(this.props.seed).replace('0.','');
    return(
      <Container onClick={() => this.props.refresh()}>
        seed: {truncate(seed, 5)}
      </Container>
    )
  }

}

export default Bar;
