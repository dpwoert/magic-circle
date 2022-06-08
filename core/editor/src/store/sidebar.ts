import { atom, selector } from 'recoil';

import type { SidebarOpts } from '@magic-circle/schema';

import app from '../app/app';

export const sidebar = atom<SidebarOpts[]>({
  key: 'sidebar_all',
  default: [],
  effects: [app.sidebar.effect()],
});

export const current = atom<number>({
  key: 'sidebar_current',
  default: 0,
});

export const selected = selector<SidebarOpts['render']>({
  key: 'sidebar_selected',
  get: ({ get }) => {
    const all = get(sidebar);
    const now = get(current);
    return all[now].render;
  },
});
