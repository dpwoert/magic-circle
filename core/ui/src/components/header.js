import React, { Component } from 'react';
import styled from 'styled-components';

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
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Header = props => (
  <Bar>
    <Left>{props.left}</Left>
    <Center>{props.center}</Center>
    <Right>{props.right}</Right>
  </Bar>
);

export default Header;
