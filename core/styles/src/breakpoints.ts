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
  [Breakpoint.IPAD]: 1024,
  [Breakpoint.IPAD_PRO]: 1366,
};

const query =
  (size: number, direction = 'max') =>
  (content: any, ...args: any[]) => css`
    @media screen and (${direction}-width: ${size}px) {
      ${css(content, ...args)}
    }
  `;

type breakpointGroup = Record<Breakpoint, ReturnType<typeof query>>;

const createGroup = (set?: 'min' | 'max'): breakpointGroup => {
  return {
    [Breakpoint.EXTRA_SMALL]: query(
      breakpointSize[Breakpoint.EXTRA_SMALL],
      set
    ),
    [Breakpoint.SMALL]: query(breakpointSize[Breakpoint.SMALL], set),
    [Breakpoint.MEDIUM]: query(breakpointSize[Breakpoint.MEDIUM], set),
    [Breakpoint.LARGE]: query(breakpointSize[Breakpoint.LARGE], set),
    [Breakpoint.EXTRA_LARGE]: query(
      breakpointSize[Breakpoint.EXTRA_LARGE],
      set
    ),
    [Breakpoint.IPAD]: query(breakpointSize[Breakpoint.IPAD], set),
    [Breakpoint.IPAD_PRO]: query(breakpointSize[Breakpoint.IPAD_PRO], set),
  };
};

const breakpoints: breakpointGroup & {
  min: breakpointGroup;
  max: breakpointGroup;
  custom: typeof query;
} = {
  ...createGroup(),
  min: createGroup('min'),
  max: createGroup('max'),
  custom: query,
};

Object.values(Breakpoint).forEach((key) => {
  // default (max)
  breakpoints[key] = query(breakpointSize[key]);
  breakpoints.min[key] = query(breakpointSize[key], 'min');
  breakpoints.max[key] = query(breakpointSize[key], 'max');
});

// USAGE EXAMPLE
// breakpoints.small`-css here-`
// breakpoints.min.small`-css here-`
// breakpoints.max.large`-css here-`
// breakpoints.custom(1000, 'max')`-css here-`
// ts-unused-exports:disable-next-line
export default breakpoints;
