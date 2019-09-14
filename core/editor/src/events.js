const { ipcMain } = require('electron');

module.exports = app => {
  const editor = app.window('editor');
  const frame = app.window('frame');

  // send message to front end
  ipcMain.on('intercom', (evt, { channel, payload, to }) => {
    if (to === 'editor') {
      editor.webContents.send(channel, payload);
    } else {
      frame.webContents.send(channel, payload);
    }
  });

  // reload page
  ipcMain.on('refresh', () => {
    frame.reload();
  });
};
