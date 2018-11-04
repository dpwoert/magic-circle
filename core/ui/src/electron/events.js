const { ipcMain } = require('electron');

module.exports = (window, frame) => {

  ipcMain.on('intercom', (evt, { channel, payload, to }) => {
    if(to === 'editor'){
      window.webContents.send(channel, payload);
    } else {
      frame.webContents.send(channel, payload);
    }
  });

  ipcMain.on('refresh', () => {
    frame.reload();
  });

};
