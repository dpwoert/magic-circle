import type {
  ButtonCollections,
  Plugin,
  App,
  Button,
  CommandLineReference,
  CommandLineAction,
} from '@magic-circle/schema';

export default class PlayControls implements Plugin {
  playing: boolean;
  ipc: App['ipc'];
  client: App;

  name = 'PlayControls';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;
    this.playing = false;

    this.ipc.on('play', (_, playing: boolean) => {
      this.setPlayButton(playing);
    });
  }

  setPlayButton(play: boolean) {
    this.playing = play;

    const buttons = this.client.buttons.value;
    const playBtns = buttons.play.map((b): Button => {
      if (b.label !== 'play') return b;

      return {
        label: 'play',
        icon: play ? 'Pause' : 'Play',
        onClick: () => {
          if (play) this.pause();
          else this.play();
        },
      };
    });

    this.client.buttons.set({
      ...buttons,
      play: playBtns,
    });
  }

  ready() {
    // play when ready
    // this.play();
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
            this.refresh();
          },
        },
        {
          label: 'reset',
          icon: 'Rewind',
          onClick: () => {
            this.client.reset();
          },
        },
        ...(buttons.play || []),
      ],
    };
  }

  commands(reference?: CommandLineReference): CommandLineAction[] {
    if (!reference) {
      return [
        {
          label: this.playing ? 'Pause' : 'Play',
          icon: this.playing ? 'Pause' : 'Play',
          onSelect: async () => {
            if (this.playing) this.pause();
            else this.play();
          },
        },
        {
          label: 'Reload page',
          icon: 'Refresh',
          onSelect: async () => {
            this.refresh();
          },
        },
        {
          label: 'Reset',
          icon: 'Rewind',
          onSelect: async () => {
            this.reset();
          },
        },
      ];
    }

    return [];
  }

  play() {
    this.ipc.send('play', true);
  }

  pause() {
    this.ipc.send('play', false);
  }

  refresh() {
    this.ipc.send('refresh', false);
  }

  async reset() {
    this.ipc.send('controls:reset');
  }
}
