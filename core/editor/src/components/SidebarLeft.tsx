import React from 'react';
import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, Icon } from '@magic-circle/styles';

import APP from '../app/app';
import sortHelper from '../utils/sort';

const Container = styled.div`
  display: flex;
  width: ${SPACING(22)}px;
  height: 100%;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  width: ${SPACING(5)}px;
  height: 100%;
  background: ${COLORS.shades.s500.css};
  border-right: 1px solid ${COLORS.shades.s300.css};
`;

type TabProps = {
  selected?: boolean;
};

const Tab = styled.div<TabProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SPACING(5)}px;
  height: ${SPACING(5)}px;
  border-bottom: 1px solid
    ${(props) => (props.selected ? COLORS.accent.css : COLORS.shades.s300.css)};
  color: ${COLORS.accent.css};
  background: ${(props) =>
    props.selected
      ? String(COLORS.accent.opacity(0.1))
      : String(COLORS.accent.opacity(0))};
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${String(COLORS.accent.opacity(0.1))};
  }
`;

const Inside = styled.div`
  width: ${SPACING(17)}px;
  height: 100%;
  overflow: auto;
  border-right: 1px solid ${COLORS.shades.s300.css};
`;

const SidebarLeft = () => {
  const { panels, current } = useStore(APP.sidebar);

  return (
    <Container>
      <Tabs>
        {panels
          .sort((a, b) => {
            return (
              sortHelper(b.name, a.after, a.before) ||
              sortHelper(a.name, b.after, b.before) * -1
            );
          })
          .map((s, key) => (
            <Tab
              selected={key === current}
              key={s.name}
              onClick={() => {
                APP.sidebar.set({
                  panels,
                  current: key,
                });
              }}
            >
              <Icon name={s.icon} width={SPACING(2)} height={SPACING(2)} />
            </Tab>
          ))}
      </Tabs>
      <Inside>{panels[current]?.render}</Inside>
    </Container>
  );
};

export default SidebarLeft;
