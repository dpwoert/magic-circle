import React, { useCallback } from 'react';
import styled from 'styled-components';

import type { App } from '@magic-circle/schema';
import {
  Metric,
  SPACING,
  TYPO,
  Icon,
  Forms,
  COLORS,
} from '@magic-circle/styles';

import { list } from './list.json';
import { playgrounds } from './playgrounds.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-bottom: ${SPACING(2)}px;
`;

const Top = styled.div``;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Header = styled.div`
  ${TYPO.title}
  display: flex;
  align-items: center;
  padding: 0 ${SPACING(1)}px;
  height: ${SPACING(5)}px;
  border-bottom: 1px solid ${String(COLORS.shades.s300.css)};
  color: ${COLORS.white.css};
`;

const Example = styled(Metric.Container)`
  cursor: pointer;
  background: ${COLORS.shades.s500.css};
  color: ${COLORS.shades.s100.css};

  &:hover {
    color: ${COLORS.accent.css};
  }
`;

const Link = styled.a`
  color: ${COLORS.white.css};

  &:hover {
    color: ${COLORS.accent.css};
  }
`;

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type SidebarProps = {
  app: App;
};

const Sidebar = ({ app }: SidebarProps) => {
  const loadExample = useCallback(
    async (url: string) => {
      await app.reset();
      const frame: HTMLIFrameElement = document.querySelector('#frame iframe');
      frame.src = url;
    },
    [app]
  );

  return (
    <Container>
      <Top>
        <Header>Code examples</Header>
        {list.map((example) => (
          <Example
            onClick={() => loadExample(`examples/${example.path}`)}
            key={example.name}
          >
            {capitalizeFirstLetter(example.name)}
            <Metric.Value>
              <Link href={example.repo} target="_blank">
                <Icon name="Github" width={SPACING(2)} height={SPACING(2)} />
              </Link>
            </Metric.Value>
          </Example>
        ))}
        <Header>Playgrounds</Header>
        {playgrounds.map((example) => (
          <Example onClick={() => loadExample(example.url)} key={example.name}>
            {capitalizeFirstLetter(example.name)}
          </Example>
        ))}
      </Top>
      <Bottom>
        <Forms.Button
          onClick={() => {
            // eslint-disable-next-line
            const url = prompt(
              'What is the URL you are trying to load',
              'https://'
            );

            if (url && url !== 'https://') {
              loadExample(url);
            }
          }}
        >
          <Icon name="Download" width={SPACING(1.5)} height={SPACING(1.5)} />
          Load your own URL
        </Forms.Button>
      </Bottom>
    </Container>
  );
};

export default Sidebar;
