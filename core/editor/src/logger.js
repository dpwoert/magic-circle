const { ipcMain } = require('electron');

module.exports = function logger(window, frame) {
  ipcMain.on('log', (evt, ...args) => {
    let type = 'log';
    let msg = args[0];

    if (args.length === 2) {
      type = args[0];
      msg = args[1];
    }

    console[type](msg);
  });
};
