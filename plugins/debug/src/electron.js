const { ipcMain } = require('electron');

module.exports = (window, frame) => {
  // devtools
  ipcMain.on('dev-tools', (evt, settings = {}) => {
    if (frame.webContents.isDevToolsOpened()) {
      frame.webContents.closeDevTools();
    } else {
      frame.webContents.openDevTools({
        mode: settings.mode || 'bottom',
      });
    }
  });
};
