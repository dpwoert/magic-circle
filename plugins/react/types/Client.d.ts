import React from 'react';
import { MagicCircle } from '@magic-circle/client';
declare type ClientProps = {
  setup: Parameters<MagicCircle['setup']>[0];
  loop: Parameters<MagicCircle['loop']>[0];
  children: React.ReactNode;
};
export declare const Client: ({
  setup,
  loop,
  children,
}: ClientProps) => JSX.Element;
export {};
