import type { ButtonCollections, Plugin, App, Button } from '@magic-circle/schema';

export default class PlayControls implements Plugin {
  playing: boolean;
  ipc: App['ipc'];
  client: App;

  name = 'PlayControls';

  async setup(client:App) {
    this.ipc = client.ipc;
    this.client = client;
    this.playing = false;

    this.ipc.on('play', (playing: boolean) => {
      console.log('play', playing)
      this.setPlayButton(playing)
    });
  }

  setPlayButton(play: boolean){
    this.playing = play;

    const buttons = this.client.buttons.value;
    const playBtns = buttons['play'].map((b):Button => {
      if(b.label !== 'play') return b;

      return {
        label: 'play',
        icon: play ? 'Pause' : 'Play',
        onClick: () => {
          if(play) this.pause() 
          else this.play()
        }
      }
    });

    this.client.buttons.set({
      ...buttons,
      play: playBtns,
    })
  }

  ready(){
    // play when ready
    this.play();
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
    console.log('play clicked')
    this.ipc.send('play', true);
  }

  pause() {
        console.log('pause clicked')
    this.ipc.send('play', false);
  }
}
