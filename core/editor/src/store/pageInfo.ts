import { atom, selector } from 'recoil';

type pageInfo = {
  title: string;
  url?: Location;
};

export const pageInfo = atom<pageInfo>({
  key: 'page_info',
  default: {
    title: 'Unknown page',
  },
});

export const title = selector<string>({
  key: 'page_info_title',
  get: ({ get }) => {
    const info = get(pageInfo);
    return info.title;
  },
});
