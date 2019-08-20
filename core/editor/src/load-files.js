const { ipcMain } = require('electron');
const resolveFrom = require('resolve-from');

module.exports = (window, frame) => {
  const loaded = [];

  ipcMain.on('electron-load', (evt, { files, settings, cwd }) => {
    files.forEach(file => {
      if (loaded.indexOf(file) === -1) {
        try {
          const path =
            file.indexOf('@magic-circle') > -1 ? resolveFrom(cwd, file) : file;
          // eslint-disable-next-line
          require(path)(window, frame, settings);
          loaded.push(file);
        } catch (e) {
          console.error('error while loading file', file);
          console.error(e);
        }
      }
    });
  });
};
