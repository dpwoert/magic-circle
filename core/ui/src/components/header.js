import React from 'react';
import styled, { withTheme } from 'styled-components';

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  background: linear-gradient(to top, #363638, #404143);
  background: #0a0a0a;
  border-bottom: 1px solid #222;
  box-sizing: border-box;
  padding: 10px;

  display: flex;
  align-items: center;
  text-align: right;
  justify-content: space-between;
  -webkit-app-region: drag;
`;

const Left = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Center = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 80px;
`;

const ButtonCollection = styled.ul`
  display: flex;
  flex-direction: row;
  margin-right: 12px;
`;

const Button = styled.li`
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
  cursor: pointer;

  fill: ${props => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 70%;
    height: auto;
  }

  &:first-of-type {
    border-radius: 3px 0px 0px 3px;
  }

  &:last-of-type {
    border-right: 1px solid ${props => props.theme.accent};
    border-radius: 0px 3px 3px 0px;
  }
`;

const Buttons = withTheme(props => (
  <ButtonCollection>
    {props.list.map(b => {
      const Icon = props.theme.icons[b.icon];
      return (
        <Button onClick={b.click}>
          <Icon />
        </Button>
      );
    })}
  </ButtonCollection>
));

const Header = props => (
  <Bar>
    <Left>
      <ButtonsContainer>
        {Object.values(props.store.collection()).map(list => (
          <Buttons list={list} />
        ))}
      </ButtonsContainer>
      {props.left}
    </Left>
    <Center>{props.center}</Center>
    <Right>{props.right}</Right>
  </Bar>
);

export default Header;
