const { ipcMain } = require('electron');

module.exports = (window, frame) => {
  const loaded = [];

  ipcMain.on('electron-load', (evt, { files, settings }) => {
    files.forEach(file => {
      if (loaded.indexOf(file) === -1) {
        try {
          // eslint-disable-next-line
          require(file)(window, frame, settings);
          loaded.push(file);
        } catch (e) {
          console.error('error while loading file', file);
          console.error(e);
        }
      }
    });
  });
};
