import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import Icon from './Icon';

import SPACING from '../styles/spacing';
import COLORS from '../styles/colors';

import * as store from '../store/buttons';

const Container = styled.div`
  display: flex;
  height: ${SPACING(5)}px;
  background: ${COLORS.shades.s700.css};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SPACING(5)}px;
  height: 100%;

  &:after {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 14px;
    border: 2.21px ${COLORS.accent.css} solid;
    box-sizing: border-box;
  }
`;

const ButtonCollections = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  gap: ${SPACING(1)}px;
`;

const ButtonCollection = styled.div`
  display: flex;
  color: ${COLORS.accent.css};
  border: 1px solid ${COLORS.accent.css};
  border-radius: 5px;
  height: ${SPACING(3)}px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SPACING(3)}px;
  height: ${SPACING(3)}px;
  border-right: 1px solid ${COLORS.accent.css};
  cursor: pointer;

  &:last-child {
    border-right: none;
  }
`;

const Header = () => {
  // create buttons

  const buttons = useRecoilValue(store.buttons);

  console.log({ buttons });

  return (
    <Container>
      <Logo />
      <ButtonCollections>
        {Object.values(buttons).map(collection => (
          <ButtonCollection>
            {collection.map(button => (
              <Button>
                <Icon
                  name={button.icon}
                  width={SPACING(2)}
                  height={SPACING(2)}
                />
              </Button>
            ))}
          </ButtonCollection>
        ))}
      </ButtonCollections>
    </Container>
  );
};

export default Header;
