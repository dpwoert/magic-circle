import styled from 'styled-components';

import COLORS from './colors';
import TYPO from './typography';
import SPACING from './spacing';

export const Container = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${SPACING(4)}px;
  padding: 0 ${SPACING(1)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  color: ${COLORS.white.css};
  background: ${COLORS.shades.s600.css};
`;

export const Value = styled.div`
  ${TYPO.metric}
`;
