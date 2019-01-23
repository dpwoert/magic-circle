const { ipcMain } = require('electron');

module.exports = (window, frame) => {
  const loaded = [];

  ipcMain.on('electron-load', (evt, { files, settings }) => {
    files.forEach(file => {
      if (loaded.indexOf(file) === -1) {
        // eslint-disable-next-line
        require(file)(window, frame, settings);
        loaded.push(file);
      }
    });
  });
};
