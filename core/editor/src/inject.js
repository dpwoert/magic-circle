let initialLoad = true;

module.exports = app => {
  const editor = app.window('editor');
  const frame = app.window('frame');

  frame.webContents.on('dom-ready', () => {
    // Add ipcRenderer to front-end
    frame.webContents.executeJavaScript(`
      window.__IPC = require('electron').ipcRenderer;

      if(window.__controls){
        window.__controls.connect(window.__IPC);
      }
    `);
    console.info('🔌  injected IPC');
    initialLoad = false;
  });

  editor.webContents.on('dom-ready', () => {
    // Add ipcRenderer to front-end
    editor.webContents.executeJavaScript(`
      try{
        window.__REQUIRE = require;
        const settings = require('${app.settingsFile}');
        const {ipcRenderer} = require('electron');
        const {Client} = require('@magic-circle/ui');
        window.__client = new Client(ipcRenderer, settings, '${app.cwd}');
      } catch(e){
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('log', 'error', 'error during injecting of settings');

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
