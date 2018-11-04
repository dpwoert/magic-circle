import { ipcRenderer } from 'electron';

class Client {

  constructor(settings, render){

    this.settings = settings;

    //add plugins
    this.plugins = (settings.plugins || []).map(P => new P(this, settings));

    //run setup scripts
    let actions = [];
    this.plugins.forEach(async s => {
      if(s.setup){
        const action = await s.setup(this);
        if(Array.isArray(action)){

        }
      }
    });

    //send message to front-end
    this.sendMessage('editor-loaded', true);

    //render on finish loading
    if(settings.render){
      document.addEventListener('DOMContentLoaded', () => {
        settings.render(this);
      });
    }

    // listen to refreshes
    this.addListener('setup', () => this.setup());
  }

  async setup(){
    let actions = [];
    await this.plugins.forEach(async s => {
      if(s.setup){
        const action = await s.setup(this);

        //added to list of actions
        if(Array.isArray(action)){
          actions = actions.concat(action);
        } else {
          actions.push(action);
        }
      }
    });

    //send message to front-end
    this.sendMessage('setup-response', {
      batch: actions
    });
  }

  addListener(channel, fn){
    ipcRenderer.on(channel, fn);
  }

  removeListener(fn){
    ipcRenderer.removeListener(channel, fn);
  }

  sendMessage(channel, payload){
    ipcRenderer.send('intercom', { channel, payload, to: 'frame' });
  }

  refresh(){
    ipcRenderer.send('refresh');
  }

}

export default Client;
