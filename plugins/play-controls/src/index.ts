import type { ButtonCollections, Plugin } from '@magic-circle/schema';

export default class PlayControls implements Plugin {
  playing: boolean;

  name = 'PlayControls';

  async setup() {
    this.playing = false;
  }

  buttons(buttons: ButtonCollections): ButtonCollections {
    return {
      play: [
        {
          label: 'play',
          icon: 'Play',
          onClick: () => {
            this.play();
          },
        },
        {
          label: 'reload',
          icon: 'Refresh',
          onClick: () => {
            // todo
          },
        },
        {
          label: 'reset',
          icon: 'Rewind',
          onClick: () => {
            // todo
          },
        },
        ...(buttons.play || []),
      ],
    };
  }

  play() {
    // todo
  }

  pause() {}
}
