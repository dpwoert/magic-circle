const { ipcMain } = require('electron');

module.exports = (window, frame) => {
  // send message to front end
  ipcMain.on('intercom', (evt, { channel, payload, to }) => {
    if (to === 'editor') {
      window.webContents.send(channel, payload);
    } else {
      frame.webContents.send(channel, payload);
    }
  });

  // reload page
  ipcMain.on('refresh', () => {
    frame.reload();
  });
};
