import React, { ReactFragment } from 'react';

import { Component, IconDefinition, list } from './assets/icons/index';

export type IconName = list;

interface IconProps extends React.HTMLAttributes<SVGElement> {
  name: list;
  width: number;
  height: number;
}

const registry = new Map<string, Component>();

// Needed for tree shaking
export const register = (icon: IconDefinition) => {
  if (!registry.has(icon.name)) {
    registry.set(icon.name, icon.component);
  }
};

export default function Icon({ name, ...props }: IconProps) {
  let Comp: Component | string = 'div';

  if (registry.has(name)) {
    Comp = registry.get(name);
  } else {
    console.error(`Icon '${name}' is not registered yet`);
  }

  return <Comp {...props} />;
}
