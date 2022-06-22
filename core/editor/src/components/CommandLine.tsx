import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';

import type { CommandLineAction } from '@magic-circle/schema';
import { useStore } from '@magic-circle/state';
import { SPACING, COLORS, TYPO, Icon, Shortcut } from '@magic-circle/styles';

import APP from '../app/app';

const Screen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.black.opacity(0.5)};
`;

const Container = styled.div`
  width: ${SPACING(52)}px;
  background: ${COLORS.shades.s500.css};
  border-radius: 5px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: ${SPACING(5)}px;
  color: ${COLORS.white.css};
  padding-left: ${SPACING(2)}px;
  gap: ${SPACING(1)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
`;

const HeaderSearch = styled.input`
  ${TYPO.large}
  height: 100%;
  flex: 1;
  border: none;
  background: none;
  color: ${COLORS.white.css};
  outline: none;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  height: ${SPACING(25)}px;
  overflow: auto;
  min-height: 0;
`;

type ActionProps = {
  selected: boolean;
};

const Action = styled.div<ActionProps>`
  ${TYPO.regular}
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${SPACING(5)}px;
  padding-left: ${SPACING(2.25)}px;
  padding-right: ${SPACING(1)}px;
  color: ${(props) =>
    props.selected ? COLORS.white.css : COLORS.shades.s200.css};
  background: ${(props) => (props.selected ? COLORS.shades.s600.css : 'none')};
  transition: background-color 0.2s ease, color 0.2s ease;
  flex-shrink: 0;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${COLORS.accent.css};
    opacity: ${(props) => (props.selected ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

const ActionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const CommandLine = () => {
  const screen = useStore(APP.commandLine);
  const [selected, _setSelected] = useState(0);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLElement | null>();
  const actionsRef = useRef<HTMLElement | null>();

  const select = useCallback(async () => {
    if (screen) {
      const action = screen.actions[selected];
      const nextScreen = await action.onSelect(action);

      if (nextScreen) {
        APP.showCommandLine(nextScreen);
      } else {
        APP.commandLine.set(null);
      }
    }
  }, [screen, selected]);

  const setSelected = useCallback(
    (next: ((curr: number) => number) | number) => {
      _setSelected((curr) => {
        const nextNumber = typeof next === 'number' ? next : next(curr);

        // highlight in view
        if (actionsRef.current) {
          const element = actionsRef.current.children[nextNumber];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        return nextNumber;
      });
    },
    []
  );

  // Keyboard listeners
  useEffect(() => {
    const keydown = (evt: KeyboardEvent) => {
      if (evt.key === 'ArrowUp') {
        setSelected((curr) => Math.max(0, curr - 1));
      } else if (evt.key === 'ArrowDown' && screen) {
        setSelected((curr) => Math.min(curr + 1, screen.actions.length - 1));
      } else if (evt.key === 'Enter') {
        select();
      } else if (evt.key === 'Escape') {
        APP.commandLine.set(null);
      }
    };

    window.addEventListener('keydown', keydown);

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, [screen, select, setSelected]);

  // If screen changes reset selection and focus on the input field
  useEffect(() => {
    setSelected(0);
    if (searchRef.current) searchRef.current.focus();
  }, [screen, setSelected]);

  const actions = useMemo(() => {
    if (search && screen) {
      return screen.actions.filter((action) => {
        return action.label.toLowerCase().includes(search.toLowerCase());
      });
    }

    return screen?.actions;
  }, [screen, search]);

  if (!screen || !actions) {
    return null;
  }

  return (
    <>
      <Overlay />
      <Screen>
        <Container>
          <Header>
            <Icon name="Search" width={SPACING(2)} height={SPACING(2)} />
            <HeaderSearch
              // @ts-expect-error
              ref={searchRef}
              placeholder={screen.searchLabel}
              value={search}
              onChange={(evt) => {
                setSearch(evt.target.value);
                setSelected(0);
              }}
            />
          </Header>
          <Actions
            // @ts-expect-error
            ref={actionsRef}
          >
            {actions.map((action, key) => (
              <Action selected={selected === key}>
                <ActionLabel>
                  <Icon
                    name={action.icon}
                    width={SPACING(1.5)}
                    height={SPACING(1.5)}
                  />
                  {action.label}
                </ActionLabel>
                {action.shortcut && <Shortcut shortcut={action.shortcut} />}
              </Action>
            ))}
          </Actions>
        </Container>
        ;
      </Screen>
    </>
  );
};

export default CommandLine;
