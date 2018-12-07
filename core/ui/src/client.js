import defaultSettings from './default-settings';
const { ipcRenderer } = require('electron');

import Store from './store';

export class Client {

  constructor(settings, cwd){

    this.isElectron = true;
    this.settings = Object.assign(defaultSettings, settings);
    this.cwd = cwd;
    console.log('cwd',cwd);

    //add plugins
    this.plugins = this.settings.plugins.map(Plugin => {
      const initialData = Plugin.initStore ? Plugin.initStore(this.settings) : {}
      const store = new Store(initialData);
      const plugin = new Plugin(this, store, this.settings);
      plugin._name = Plugin.name;
      return plugin;
    });

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
    this.settings.render(this);

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

  getPlugin(name){
    return this.plugins.find(p => p._name === name);
  }

  takeScreenshot(){
    const data = {
      layers: this.getLayers ? this.getLayers() : {},
      seed: this.getSeed ? this.getSeed() : null,
    };
    ipcRenderer.send('screenshot', data);
  }

}
