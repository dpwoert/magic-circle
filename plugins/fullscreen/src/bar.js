import React from 'react';
import styled, { withTheme } from 'styled-components';

const Container = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: row;
`;

const Button = styled.div`
  border: 1px solid ${props => props.theme.accent};
  display: block;
  text-align: center;
  user-select: none;
  font-size: 12px;
  ${'' /* background: rgba(136, 74, 255, 0.19); */}
  font-size: 14px;
  width: 25px;
  height: 25px;
  border-radius: 3px;

  fill: ${props => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 70%;
    height: auto;
  }
`;

const Bar = props => {
  const Icon = props.theme.icons.Fullscreen;
  return (
    <Container>
      <Button onClick={() => props.toggleFullscreen()}>
        <Icon />
      </Button>
    </Container>
  );
};

export default withTheme(Bar);
