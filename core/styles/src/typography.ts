import { css } from 'styled-components';

export const base = 14;

export const rem = (px: number): string => `${px / base}rem`;

export const FONT_STRING =
  '"Inter", -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

// regular: 400;
// medium: 500;
// semi bold: 600;
// bold: 700;

const typo = {
  title: css`
    font-family: ${FONT_STRING};
    font-weight: 600;
    font-size: ${rem(14)};
    line-height: ${rem(24)};
    letter-spacing: 0em;
  `,
  regular: css`
    font-family: ${FONT_STRING};
    font-weight: 400;
    font-size: ${rem(12)};
    line-height: ${rem(18)};
    letter-spacing: 0em;
  `,
  input: css`
    font-family: ${FONT_STRING};
    font-weight: 400;
    font-size: ${rem(11)};
    line-height: ${rem(14)};
    letter-spacing: 0em;
  `,
  small: css`
    font-family: ${FONT_STRING};
    font-weight: 400;
    font-size: ${rem(10)};
    line-height: ${rem(14)};
    letter-spacing: 0em;
  `,
};

export default typo;
