import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Metric, SPACING, Icon, COLORS } from '@magic-circle/styles';

import { list } from './list.json';

const Example = styled(Metric.Container)`
  cursor: pointer;

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

const Sidebar = () => {
  const loadExample = useCallback((name: string) => {
    const frame: HTMLIFrameElement = document.querySelector('#frame iframe');
    frame.src = `examples/${name}`;

    // Set sidebar to layers
    // todo
  }, []);

  return (
    <div>
      {list.map((example) => (
        <Example onClick={() => loadExample(example.name)} key={example.name}>
          {capitalizeFirstLetter(example.name)}
          <Metric.Value>
            <Link href={example.repo} target="_blank">
              <Icon name="Code" width={SPACING(2)} height={SPACING(2)} />
            </Link>
          </Metric.Value>
        </Example>
      ))}
    </div>
  );
};

export default Sidebar;
