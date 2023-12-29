import { css } from 'styled-components';

export enum Breakpoint {
  EXTRA_SMALL = 'extraSmall',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extraLarge',
  IPAD = 'ipad',
  IPAD_PRO = 'ipadPro',
}

export const breakpointSize = {
  [Breakpoint.EXTRA_SMALL]: 640,
  [Breakpoint.SMALL]: 768,
  [Breakpoint.MEDIUM]: 960,
  [Breakpoint.LARGE]: 1400,
  [Breakpoint.EXTRA_LARGE]: 1600,
  // [Breakpoint.IPAD]: 1024,
  // [Breakpoint.IPAD_PRO]: 1366,
};

const query =
  (size: number, direction = 'max') =>
  (content: any, ...args: any[]) => css`
    @media screen and (${direction}-width: ${size}px) {
      ${css(content, ...args)}
    }
  `;

type breakpointGroup = Record<Breakpoint, ReturnType<typeof query>>;

const emptyGroup = (): breakpointGroup => {
  return {
    [Breakpoint.EXTRA_SMALL]: null,
    [Breakpoint.SMALL]: null,
    [Breakpoint.MEDIUM]: null,
    [Breakpoint.LARGE]: null,
    [Breakpoint.EXTRA_LARGE]: null,
    [Breakpoint.IPAD]: null,
    [Breakpoint.IPAD_PRO]: null,
  };
};

const breakpoints: {
  min: breakpointGroup;
  max: breakpointGroup;
  custom: typeof query;
} = { min: emptyGroup(), max: emptyGroup(), custom: null };

Object.values(Breakpoint).forEach((key) => {
  // default (max)
  breakpoints[key] = query(breakpointSize[key]);
  breakpoints.min[key] = query(breakpointSize[key], 'min');
  breakpoints.max[key] = query(breakpointSize[key], 'max');
});

breakpoints.custom = query;

// USAGE EXAMPLE
// breakpoints.small`-css here-`
// breakpoints.min.small`-css here-`
// breakpoints.max.large`-css here-`
// breakpoints.custom(1000, 'max')`-css here-`
// ts-unused-exports:disable-next-line
export default breakpoints;
