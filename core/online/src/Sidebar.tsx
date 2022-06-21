import React, { useCallback } from 'react';

import { Metric, SPACING, Icon } from '@magic-circle/styles';

import { list } from './list.json';

const Sidebar = () => {
  const loadExample = useCallback((name: string) => {
    const frame: HTMLIFrameElement = document.querySelector('#frame iframe');
    frame.src = `examples/${name}`;

    // Set sidebar to layers
    // todo
  }, []);

  return (
    <div>
      {list.map((name) => (
        <Metric.Container onClick={() => loadExample(name)} key={name}>
          {name}
          <Metric.Value>
            <Icon name="Code" width={SPACING(2)} height={SPACING(2)} />
          </Metric.Value>
        </Metric.Container>
      ))}
    </div>
  );
};

export default Sidebar;
