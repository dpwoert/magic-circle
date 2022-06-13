import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${SPACING(4)}px;
  color: ${COLORS.shades.s100.css};
  border-bottom: 1px solid ${COLORS.shades.s400.css};
`;

export const Label = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  width: ${SPACING(8)}px;
  height: 100%;
  colors: ${COLORS.shades.s100.css};
  padding-left: ${SPACING(1)}px;
`;

export const Inside = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  padding-right: ${SPACING(1)}px;
`;
