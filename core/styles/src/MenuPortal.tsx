import React, { memo } from 'react';

import type { Menu } from './Menu';

import MenuList from './Menu';
import Popover, { Alignment, Placement, PopoverProps } from './Popover';

import COLORS from './colors';

export interface MenuPortalProps extends Omit<PopoverProps, 'content'> {
  menu: Menu;
}

const MenuPortal = ({ menu, ...props }: MenuPortalProps) => {
  return (
    <Popover
      showOnClick
      placement={Placement.BOTTOM}
      alignment={Alignment.CENTER}
      background={COLORS.shades.s500.css}
      content={(toggle) => <MenuList menu={menu} close={() => toggle()} />}
      {...props}
    />
  );
};

export default memo(MenuPortal);
