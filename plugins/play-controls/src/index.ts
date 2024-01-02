import {
  ButtonCollections,
  Plugin,
  Button,
  CommandLineReference,
  CommandLineAction,
} from '@magic-circle/schema';
import {
  registerIcon,
  Play,
  Pause,
  Refresh,
  Rewind,
  Maximize,
} from '@magic-circle/styles';

registerIcon(Play);
registerIcon(Pause);
registerIcon(Refresh);
registerIcon(Rewind);
registerIcon(Maximize);

export default class PlayControls extends Plugin {
  name = 'PlayControls';

  playing = false;

  async setup() {
    this.ipc.on('play', (_, playing: boolean) => {
      this.setPlayButton(playing);
    });
    this.ipc.on('loop-set', () => {
      this.setPlayButton(this.playing);
    });
  }

  setPlayButton(play: boolean) {
    this.playing = play;

    const buttons = this.app.buttons.value;
    const playBtns = buttons.play.list.map((b): Button => {
      if (b.label !== 'play') return b;

      return {
        label: 'play',
        icon: play ? 'Pause' : 'Play',
        disabled: !this.app.hasLoop.value,
        onClick: () => {
          if (play) this.pause();
          else this.play();
        },
      };
    });

    this.app.buttons.set({
      ...buttons,
      play: {
        ...buttons.play,
        list: playBtns,
      },
    });
  }

  ready() {
    // play when ready
    // this.play();
  }

  buttons(buttons: ButtonCollections): ButtonCollections {
    return {
      play: {
        list: [
          {
            label: 'play',
            icon: 'Play',
            disabled: !this.app.hasLoop.value,
            onClick: () => {
              this.play();
            },
          },
          {
            label: 'reload',
            icon: 'Refresh',
            tooltip: 'Reload page',
            onClick: () => {
              this.refresh();
            },
          },
          {
            label: 'reset',
            icon: 'Rewind',
            tooltip: 'Reset all state to defaults',
            onClick: () => {
              this.app.reset();
            },
          },
          {
            label: 'fullscreen',
            icon: 'Maximize',
            tooltip: 'Toggle fullscreen',
            onClick: () => {
              const element = document.querySelector('#frame iframe');

              if (element) {
                element.requestFullscreen();
              }
            },
            hide: !this.app.getSetting('playControls.fullscreen', false),
          },
          ...(buttons.play?.list || []),
        ],
      },
      ...buttons,
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
            this.app.reset();
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

  async reset(sync: boolean) {
    this.ipc.send('controls:reset', sync);
  }
}
