import React from 'react';

import * as Icons from './assets/icons/index';

export type IconName = Icons.list;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: Icons.list;
  width: number;
  height: number;
}

export default function Icon({ name, ...props }: IconProps) {
  const Comp = Icons[name] || 'div';
  return <Comp {...props} />;
}
