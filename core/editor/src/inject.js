let initialLoad = true;

module.exports = function inject(window, frame) {
  frame.webContents.on('dom-ready', () => {
    // Add ipcRenderer to front-end
    frame.webContents.executeJavaScript(`
      window.__IPC = require('electron').ipcRenderer;
      window.__controls.connect();
    `);
    console.info('🔌  injected IPC');
    initialLoad = false;
  });

  window.webContents.on('dom-ready', () => {
    // Add ipcRenderer to front-end
    window.webContents.executeJavaScript(`
      try{
        const settings = require('${global.settings}');
        const {Client} = require('@creative-controls/ui');
        window.__client = new Client(settings, '${global.cwd}');
      } catch(e){
        console.log('⚠️  error during injecting of settings');
        console.error(e);
      }
    `);
    console.info('⚙️  injected settings');

    if (!initialLoad) {
      frame.reload();
      console.info('🔄  reloaded page [debug]');
    }
  });
};
