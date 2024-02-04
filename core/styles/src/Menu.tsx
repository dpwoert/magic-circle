import React, { memo, ReactNode } from 'react';
import styled from 'styled-components';

// import Shortcut from './Shortcut';
import Icon, { IconName } from './Icon';

import SPACING from './spacing';
import TYPO from './typography';
import COLORS from './colors';

// import { leftEllipsis } from '../styles/text';

const DURATION = 200;

export enum MenuItemType {
  DEFAULT = 'label',
  SPACER = 'spacer',
  CHECKBOX = 'checkbox',
}

export enum MenuBadge {
  NONE = 'none',
  BETA = 'beta',
}

export interface MenuItem {
  label?: string;
  html?: () => ReactNode;
  key?: string;
  icon?: IconName;
  active?: boolean;
  shortcut?: string;
  onSelect: (item: MenuItem) => void;
  checked?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  items?: MenuItem[];
  type?: MenuItemType;
  badge?: MenuBadge;
}

export interface Menu {
  items: MenuItem[];
}

const Container = styled.div`
  position: absolute;
  z-index: 1;
  min-width: ${SPACING(18)}px;
  background: ${COLORS.shades.s500.css};
  box-shadow: 0px 4px 10px 5px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  color: ${COLORS.shades.s100.css};
  pointer-events: none;
  padding: ${SPACING(0.25)}px;
  opacity: 0;
  transition: opacity ${DURATION}ms ease;
  top: -${SPACING(0.5)}px;
  left: 100%;
`;

const Outer = styled.div`
  position: relative;
  & > ${Container} {
    opacity: 1;
    pointer-events: all;
    left: 0;
    top: 0;
    position: relative;
  }
`;

type ItemProps = {
  disabled?: boolean;
  checked?: boolean;
  active?: boolean;
};

const Ellipsis = styled.div`
  max-width: ${SPACING(12)}px;
  & span:last-of-type {
    color: initial;
  }
`;

// const Ellipsis = styled.div`
//   max-width: ${SPACING(12)}px;
//   ${leftEllipsis}
//   & span:last-of-type {
//     color: initial;
//   }
// `;

const Label = styled.div`
  flex: 1;
`;

const Item = styled.a.withConfig({
  shouldForwardProp: (prop) => !['active', 'checked'].includes(prop),
})<ItemProps>`
  ${TYPO.regular}
  position: relative;
  height: ${SPACING(3.5)}px;
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  border-radius: 0px;
  background: ${(props) =>
    props.checked ? COLORS.shades.s500.css : COLORS.shades.s600.css};
  color: ${(props) =>
    props.checked || props.active ? COLORS.white.css : COLORS.shades.s100.css};
  text-decoration: none;
  padding-bottom: 1px;
  cursor: pointer;

  &:after {
    content: '';
    position: absolute;
    bottom: 0px;
    height: 1px;
    width: calc(100% - ${SPACING(2)}px);
    background: ${COLORS.shades.s400.css};
    opacity: 0;
  }

  &:hover {
    background: ${COLORS.accent.opacity(0.1)};
    color: ${COLORS.accent.css};
  }

  &:hover > ${Container} {
    opacity: 1;
    pointer-events: all;
  }

  &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  &:last-of-type:after {
    display: none;
  }

  & > ${Label} > ${Ellipsis} {
    color: ${(props) =>
      props.checked || props.active
        ? COLORS.accent.css
        : COLORS.shades.s500.css};
  }

  &:hover > ${Label} > ${Ellipsis} {
    color: ${COLORS.shades.s300.css};
    & span:last-of-type {
      color: ${COLORS.white.css};
    }
  }
`;

const IconPart = styled.div`
  margin-right: ${SPACING(1)}px;
  width: ${SPACING(1.5)}px;
  height: ${SPACING(1.5)}px;
`;

const EndPart = styled.div``;

const Triangle = styled(Icon)`
  position: relative;
  width: 12px;
  height: 12px;
  left: 3px;

  ${Item}:hover &:after {
    color: transparent transparent transparent ${COLORS.accent.css};
  }
`;

const Spacer = styled.div`
  width: 100%;
  height: 3px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
`;

const Badge = styled.div`
  ${TYPO.small}
  color: ${COLORS.shades.s100.css};
  background: ${COLORS.shades.s700.css};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  padding-right: 6px;
  border-radius: 3px;

  svg {
    margin-right: 2px;
  }

  ${Item}:hover > ${EndPart} & {
    background: ${COLORS.accent.css};
    color: ${COLORS.white.css};
  }
`;

type MenuProps = {
  menu: Menu;
  close: () => void;
};

type MenuContainerProps = {
  items: MenuItem[];
  close: () => void;
};

const MenuContainer = ({ items, close }: MenuContainerProps) => {
  // no items so dont display even a wrapper
  if (items.length === 0) return null;

  return (
    <Container>
      {items.map((item, key) => {
        if (item.hidden) {
          return null;
        }

        if (item.type === MenuItemType.SPACER) {
          return <Spacer key={`${item.type}_${key}`} />;
        }

        return (
          <Item
            onClick={(evt: React.MouseEvent) => {
              // trigger on click
              item.onSelect(item);

              // close menu
              close();

              // ensure other click handlers are not triggered
              evt.stopPropagation();

              if (evt.target instanceof HTMLElement) {
                evt.target.blur();
              }
            }}
            disabled={item.disabled}
            key={
              item.key ||
              (typeof item.label === 'string' ? item.label : key) ||
              key
            }
            checked={item.type === MenuItemType.CHECKBOX && item.checked}
            active={item.active}
          >
            <IconPart>
              {item.icon && (
                <Icon
                  name={item.icon}
                  width={SPACING(1.5)}
                  height={SPACING(1.5)}
                />
              )}
            </IconPart>
            <Label>
              {typeof item.html === 'function' ? item.html() : item.label}
            </Label>
            <EndPart>
              {/* {(item.action || item.shortcut) && (
                <KeyboardShortcutStyled
                  shortcut={item.shortcut || item.action}
                  convertActions={!item.shortcut}
                />
              )} */}
              {item.items && item.items.length > 0 && (
                <Triangle
                  name="ChevronRight"
                  width={SPACING(1.5)}
                  height={SPACING(1.5)}
                />
              )}
              {item.badge && item.badge === MenuBadge.BETA && (
                <Badge>
                  <Icon name="Pill" width={SPACING(1)} height={SPACING(1)} />
                  beta
                </Badge>
              )}
            </EndPart>
            {item.items && <MenuContainer items={item.items} close={close} />}
          </Item>
        );
      })}
    </Container>
  );
};

function MenuList({ menu, close }: MenuProps) {
  return (
    <Outer>
      <MenuContainer items={menu.items} close={close} />
    </Outer>
  );
}

export default memo(MenuList);
