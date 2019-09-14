const { ipcMain } = require('electron');
const resolveFrom = require('resolve-from');

module.exports = app => {
  const loaded = [];

  ipcMain.on('electron-load', (evt, { files, settings, cwd }) => {
    app.settings = settings; // eslint-disable-line
    files.forEach(file => {
      if (loaded.indexOf(file) === -1) {
        try {
          const path =
            file.indexOf('@magic-circle') > -1 ? resolveFrom(cwd, file) : file;
          // eslint-disable-next-line
          require(path)(app, settings);
          loaded.push(file);
        } catch (e) {
          console.error('error while loading file', file);
          console.error(e);
        }
      }
    });
  });
};
