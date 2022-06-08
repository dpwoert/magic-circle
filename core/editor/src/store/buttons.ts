import { atom } from 'recoil';

import type { ButtonCollections } from '@magic-circle/schema';

import app from '../app/app';

export const buttons = atom<ButtonCollections>({
  key: 'buttons_all',
  default: {},
  effects: [app.buttons.effect()],
});
