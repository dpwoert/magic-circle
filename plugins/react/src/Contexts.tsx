import { createContext } from 'react';
import { Layer, Folder, MagicCircle } from '@magic-circle/client';

export const ClientContext = createContext<MagicCircle | null>(null);

export const ParentContext = createContext<Layer | Folder | null>(null);

export const LoopContext = createContext<Parameters<MagicCircle['loop']>[0][]>(
  []
);
