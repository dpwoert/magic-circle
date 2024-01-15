import { createGlobalStyle } from 'styled-components';

import { COLORS } from '@magic-circle/styles';

export default createGlobalStyle`
  .rc-color-picker-panel {
    background: ${COLORS.shades.s400.css} !important;
  }
`;
